# LLM prompt templates

The two prompts below are the ones the analyst ships to Gemini per candidate.
They live in `scripts/lib/gemma.mjs` as `buildEditPrompt` and `buildNewPagePrompt`
— edit those functions if you want to tune wording or add constraints.

## Existing-page edit prompt

```
You are an SEO copy editor for Jedi Labs (jedilabs.org), a production-AI evaluation company.
Target keyword: "<kw>" — <country> volume <v>, KD <kd>%, intent <intent>.
Existing page (route: <route>):
  title: "<current_title>"
  description: "<current_desc>"
  h1: "<current_h1>"
Constraints:
  - title 40-60 chars, must include the target keyword or its closest natural variant, must fit under 65 chars
  - description 130-160 chars, must include target keyword once, no clickbait, no unsubstantiated multipliers
  - h1 40-70 chars, matches title intent, differs from title
  - do not add claims Jedi Labs hasn't already made
Return ONE valid JSON object with keys:
  proposed_title, proposed_desc, proposed_h1, rationale (plain English, 2-3 sentences), confidence (0-1)
Return nothing else.
```

## New-page-scaffold prompt

```
You are an SEO strategist for Jedi Labs (jedilabs.org), a production-AI evaluation company.
No existing page targets keyword: "<kw>" — <country> volume <v>, KD <kd>%, intent <intent>.
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
Return nothing else.
```

## Generation config

```
{
  "maxOutputTokens": 1500,
  "temperature": 0.4,
  "thinkingConfig": { "thinkingBudget": 0 }
}
```

`maxOutputTokens: 1500` is a compromise. Gemini 2.5 Flash returns 100-200 tokens
of JSON; Gemma 4 (when it works) burns 300-800 tokens on internal thinking
before writing. 1500 covers both without truncating.

`thinkingConfig.thinkingBudget: 0` is only supported on some models — the client
detects the 400 "Thinking budget is not supported for this model" response and
retries without it automatically.

## Retry policy

- If the response is HTTP 5xx: exponential backoff (1.5s → 4s → 10s), up to 3 retries on the same model.
- If retries exhausted or `finishReason === "MAX_TOKENS"` with empty content: advance to fallback model in order.
- If the model returns non-JSON text: retry once with a stricter suffix appended (`Return ONLY the JSON object. No prose. No markdown fences. Start with { and end with }.`).
- If still non-JSON after retry: drop the proposal. The page is left untouched.

## Prompt-editing gotchas

- Keep the constraint block short. Longer prompts push the model toward
  narrative responses rather than JSON.
- Never include example JSON in the prompt — Gemini will sometimes echo the
  example verbatim rather than generate a real answer.
- If you need to add a constraint (e.g. "target country: en-GB"), append it as
  a bullet inside the existing constraint list rather than adding a new
  section.
