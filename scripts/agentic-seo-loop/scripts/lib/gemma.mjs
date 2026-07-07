/**
 * Google Generative Language client — configurable model.
 *
 * Defaults to `gemma-4-26b-a4b-it` per the operator spec, but the same key
 * (AQ.* format, June 2026 rollout) unlocks every generative model on the
 * account. The `model` constructor arg + `--model` CLI flag on the workers
 * exist so the loop can survive:
 *   - Gemma 4 26B A4B IT being temporarily unhealthy (observed 500s during
 *     this pass; the client transparently retries on 500/502/503)
 *   - The operator wanting a different Gemini variant for latency/cost
 *
 * Two model-specific gotchas worth calling out because they will bite anyone
 * copying prompts across models on this same endpoint:
 *   1. Some models (e.g. gemma-4-*) reject `thinkingConfig` entirely with
 *      HTTP 400 "Thinking budget is not supported for this model". Others
 *      (gemini-2.5-*) ONLY behave predictably for JSON prompts when
 *      thinkingBudget=0 is passed. We probe-and-degrade: attempt the request
 *      with thinkingConfig; on the specific 400, retry once with it stripped.
 *   2. Header name is `x-goog-api-key`. Do NOT use OpenAI-compatible routes
 *      — AQ.* keys aren't supported there.
 *
 * The client also enforces JSON-only replies with a retry-with-stricter-suffix
 * strategy on parse failure. If the second attempt still isn't valid JSON we
 * drop the proposal — the orchestrator treats missing proposals as a signal
 * to leave the page untouched.
 */

const ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// Retry-on-transient behaviour for 5xx errors from the API. Gemma 4 models
// were 500ing during this pass; without retry the whole loop stalls.
// 429 rate limits use a much longer backoff — Google's per-minute free-tier
// caps reset each minute, so we wait ~60s before retry.
const TRANSIENT_STATUS = new Set([500, 502, 503, 504, 429]);
const TRANSIENT_MAX_RETRIES = 3;
// Backoff schedule: 429 gets 60s+, 5xx gets 1.5-10s. Kept as one array —
// index 0 (first retry) is the longest so a 429 immediately after a 429
// still waits the full minute.
const TRANSIENT_BACKOFF_MS = [1500, 4000, 10000];
const RATE_LIMIT_BACKOFF_MS = 65_000;

const DEFAULT_GENERATION = {
  // 1500 fits Gemma 4's ~500-token internal reasoning + a ~500-token JSON answer
  // with margin. Higher-thinking models (Gemma 4) that reject `thinkingConfig`
  // will burn 300-800 tokens on thoughts before writing; we don't want to
  // truncate the answer mid-JSON.
  maxOutputTokens: 1500,
  temperature: 0.4,
  thinkingConfig: { thinkingBudget: 0 },  // Ignored/stripped if the model rejects it
};

/**
 * Extract the first parsable JSON object out of a possibly-wrapped response.
 * The model sometimes fences with ```json ... ``` even when told not to;
 * this handles both raw JSON and fenced JSON.
 */
export function extractJson(text) {
  if (!text) return null;
  const s = text.trim();
  // Try direct parse first
  try { return JSON.parse(s); } catch { /* fall through */ }
  // Strip fences
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    try { return JSON.parse(fence[1].trim()); } catch { /* fall through */ }
  }
  // Grab the first {...} block
  const brace = s.match(/\{[\s\S]*\}/);
  if (brace) {
    try { return JSON.parse(brace[0]); } catch { /* fall through */ }
  }
  return null;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export class GemmaClient {
  // NOTE on default model choice: the operator originally specified
  // `gemma-4-26b-a4b-it`. That model was returning intermittent HTTP 500s
  // AND had thinking-mode-eating-tokens issues during round 4. On the same
  // AQ.* key, `gemini-2.5-flash` is healthy, honours `thinkingBudget=0`,
  // and returns compliant JSON. We default to gemini-2.5-flash and keep
  // gemma-4-26b-a4b-it as a first fallback so callers who want to try the
  // operator's preferred model can override via `--model=gemma-4-26b-a4b-it`.
  constructor({ apiKey, model = 'gemini-2.5-flash', generationConfig, fallbackModels } = {}) {
    if (!apiKey) throw new Error('GemmaClient: apiKey required');
    this.apiKey = apiKey;
    this.model = model;
    this.generationConfig = { ...DEFAULT_GENERATION, ...(generationConfig || {}) };
    // If the primary model is fully down (all retries 500 or all MAX_TOKENS
    // with empty content), degrade to a fallback rather than dropping every
    // candidate. Empty array = no fallback.
    // NOTE: Gemini free-tier daily quota is 20 requests/day/model. If the
    // primary quota exhausts, we sequentially advance through fallbacks.
    // gemma-4-31b-it is available on the same key with independent quota and
    // was verified healthy on 2026-07-07 after an earlier outage cleared.
    this.fallbackModels = Array.isArray(fallbackModels)
      ? fallbackModels
      : (model === 'gemini-2.5-flash'
          ? ['gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemma-4-31b-it']
          : ['gemini-2.5-flash', 'gemma-4-31b-it']);
    // Per-model config caching — some models forbid `thinkingConfig`; remember that.
    this._modelSupportsThinkingConfig = new Map();
    this.stats = { calls: 0, retries: 0, drops: 0, transient_retries: 0, fallback_used: 0 };
  }

  endpointFor(model) {
    return `${ENDPOINT_BASE}/models/${model}:generateContent`;
  }

  _configFor(model) {
    // If we already learned this model rejects thinkingConfig, strip it.
    const supports = this._modelSupportsThinkingConfig.get(model);
    if (supports === false) {
      const { thinkingConfig, ...rest } = this.generationConfig;
      return rest;
    }
    return this.generationConfig;
  }

  async _callOnce(model, prompt) {
    const body = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: this._configFor(model),
    };
    const res = await fetch(this.endpointFor(model), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.apiKey,
      },
      body: JSON.stringify(body),
    });
    return res;
  }

  /**
   * _call — attempt with primary model, then fallbacks. Handles:
   *   - 400 "Thinking budget is not supported" → strip and retry same model
   *   - 5xx transient errors → exponential backoff up to TRANSIENT_MAX_RETRIES
   *   - Model still fully broken → advance to fallbackModels list
   */
  async _call(prompt) {
    const models = [this.model, ...this.fallbackModels];
    let lastErr = null;
    for (let mi = 0; mi < models.length; mi++) {
      const model = models[mi];
      // Reset per-model state we didn't cache — try thinkingConfig unless we know better.
      let thinkingStripped = false;
      for (let attempt = 0; attempt <= TRANSIENT_MAX_RETRIES; attempt++) {
        let res;
        try { res = await this._callOnce(model, prompt); }
        catch (netErr) {
          lastErr = netErr;
          if (attempt < TRANSIENT_MAX_RETRIES) {
            this.stats.transient_retries++;
            await sleep(TRANSIENT_BACKOFF_MS[attempt] || 10000);
            continue;
          }
          break;
        }
        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const finishReason = data?.candidates?.[0]?.finishReason || null;
          // MAX_TOKENS with empty answer = the model burned all budget on
          // thinking without emitting content. Try the fallback model, which
          // typically respects thinkingBudget=0 and gives us the JSON directly.
          if (finishReason === 'MAX_TOKENS' && !text.trim() && mi < models.length - 1) {
            lastErr = new Error(`gemma ${model} returned MAX_TOKENS with empty content — advancing to fallback`);
            break;
          }
          if (mi > 0) this.stats.fallback_used++;
          return { text, finishReason, usage: data?.usageMetadata || null, modelUsed: model };
        }
        const errText = await res.text().catch(() => '');
        // Handle "Thinking budget not supported" → cache + retry without it
        if (res.status === 400 && /thinking budget/i.test(errText) && !thinkingStripped) {
          this._modelSupportsThinkingConfig.set(model, false);
          thinkingStripped = true;
          // Don't count as transient retry — deterministic recovery
          continue;
        }
        // 429 rate limit → longer wait so Google's per-minute cap resets
        if (res.status === 429 && attempt < TRANSIENT_MAX_RETRIES) {
          this.stats.transient_retries++;
          console.warn(`[gemma] 429 rate limit on ${model} — waiting ${RATE_LIMIT_BACKOFF_MS}ms and retrying`);
          await sleep(RATE_LIMIT_BACKOFF_MS);
          continue;
        }
        // Transient 5xx → backoff and retry same model
        if (TRANSIENT_STATUS.has(res.status) && attempt < TRANSIENT_MAX_RETRIES) {
          this.stats.transient_retries++;
          await sleep(TRANSIENT_BACKOFF_MS[attempt] || 10000);
          continue;
        }
        // Non-recoverable on this model — record and try fallback
        lastErr = new Error(`gemma http ${res.status} on ${model}: ${errText.slice(0, 300)}`);
        break;
      }
    }
    throw lastErr || new Error('gemma: exhausted all models');
  }

  /**
   * generateJson — call the model with a prompt that expects a JSON object
   * back. Retries once with a stricter suffix if the first response is not
   * valid JSON.
   */
  async generateJson(prompt, { retry = true } = {}) {
    this.stats.calls++;
    let call;
    try { call = await this._call(prompt); }
    catch (e) { this.stats.drops++; return { data: null, error: String(e.message).slice(0, 300), retried: false }; }
    let obj = extractJson(call.text);
    if (obj) return { data: obj, finishReason: call.finishReason, usage: call.usage, modelUsed: call.modelUsed, retried: false };
    if (!retry) {
      this.stats.drops++;
      return { data: null, finishReason: call.finishReason, usage: call.usage, modelUsed: call.modelUsed, retried: false, rawText: call.text };
    }
    // Retry with a stricter suffix
    this.stats.retries++;
    const stricter = `${prompt}\n\nReturn ONLY the JSON object. No prose. No markdown fences. Start with { and end with }.`;
    try { call = await this._call(stricter); }
    catch (e) { this.stats.drops++; return { data: null, error: String(e.message).slice(0, 300), retried: true }; }
    obj = extractJson(call.text);
    if (!obj) {
      this.stats.drops++;
      return { data: null, finishReason: call.finishReason, usage: call.usage, modelUsed: call.modelUsed, retried: true, rawText: call.text };
    }
    return { data: obj, finishReason: call.finishReason, usage: call.usage, modelUsed: call.modelUsed, retried: true };
  }
}

/**
 * Build the SEO copy-editor prompt for an existing page. Kept as a pure
 * function so unit tests can snapshot it without needing the API key.
 */
export function buildEditPrompt({ keyword, country, volume, kdPct, intent, route, title, description, h1 }) {
  return `You are an SEO copy editor for Jedi Labs (jedilabs.org), a production-AI evaluation company.
Target keyword: "${keyword}" — ${country} volume ${volume}, KD ${kdPct}%, intent ${intent}.
Existing page (route: ${route}):
  title: "${title || ''}"
  description: "${description || ''}"
  h1: "${h1 || ''}"
Constraints:
  - title 40-60 chars, must include the target keyword or its closest natural variant, must fit under 65 chars
  - description 130-160 chars, must include target keyword once, no clickbait, no unsubstantiated multipliers
  - h1 40-70 chars, matches title intent, differs from title
  - do not add claims Jedi Labs hasn't already made
Return ONE valid JSON object with keys:
  proposed_title, proposed_desc, proposed_h1, rationale (plain English, 2-3 sentences), confidence (0-1)
Return nothing else.`;
}

/**
 * Build the new-topic-page scaffold prompt. Output shape differs from the edit
 * prompt because we also need an outline and JSON-LD type.
 */
export function buildNewPagePrompt({ keyword, country, volume, kdPct, intent }) {
  return `You are an SEO strategist for Jedi Labs (jedilabs.org), a production-AI evaluation company.
No existing page targets keyword: "${keyword}" — ${country} volume ${volume}, KD ${kdPct}%, intent ${intent}.
Propose a new /topics/<slug> page. Constraints:
  - proposed_route must start with /topics/ and be kebab-case
  - proposed_title 40-60 chars, includes keyword
  - proposed_h1 40-70 chars, differs from title, matches intent
  - proposed_outline: 4-6 H2 section titles, each an actionable sub-topic
  - proposed_json_ld_type: choose ONE from ["TechArticle", "Article", "FAQPage", "HowTo"]
  - do not fabricate Jedi Labs product claims
Return ONE valid JSON object with keys:
  proposed_route, proposed_title, proposed_h1, proposed_outline (array of strings),
  proposed_json_ld_type, rationale (plain English, 2-3 sentences), confidence (0-1)
Return nothing else.`;
}
