/**
 * Semrush RapidAPI client — Keyword Magic Tool `/global-volume` endpoint.
 *
 * The upstream response shape has a couple of quirks worth calling out because
 * they will bite anyone reading the parsed payload without the raw response:
 *   - The country-scoped arrays live under `Keyword Overview.<CC>` — uppercase
 *     two-letter code (US / UK / CA / AU / IN) plus `global` (lowercase, weird)
 *     and `other` (a fallback string, not an array).
 *   - Field names have typos preserved verbatim from the vendor: the numeric
 *     volume field is spelled `"searche volume"` (with a trailing 'e'). This
 *     module normalizes to `volume` before returning to callers so downstream
 *     code stays readable.
 *   - `volume` values come back as human-readable strings ("1.9k", "50", "0")
 *     rather than numbers. We parse to integers on the way out; "0" and empty
 *     both round to 0.
 *   - `Keyword Difficulty %` comes as a percent string like "76%" — parsed to
 *     integer 76.
 *
 * The client caches every (keyword, country) pair to disk. Re-runs skip the
 * network entirely on cache hits so the same seed set can be reused across
 * loop iterations without spending quota.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const RAPIDAPI_HOST = 'semrush-keyword-magic-tool.p.rapidapi.com';
const ENDPOINT = `https://${RAPIDAPI_HOST}/global-volume`;

const RATE_LIMIT_MS = 1_000;    // Conservative default — free tier ceiling is unpublished
const BACKOFF_429_MS = 30_000;  // Single retry after this delay on rate-limit

const parseVolume = (raw) => {
  if (raw == null) return 0;
  const s = String(raw).trim().toLowerCase();
  if (!s || s === '0') return 0;
  const m = s.match(/^([\d.]+)\s*([kmb]?)$/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const mult = { '': 1, k: 1_000, m: 1_000_000, b: 1_000_000_000 }[m[2]] || 1;
  return Math.round(n * mult);
};

const parsePercent = (raw) => {
  if (raw == null) return null;
  const m = String(raw).match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
};

const cacheKey = (kw, country) =>
  crypto.createHash('sha1').update(`${kw}::${country}`).digest('hex').slice(0, 16);

export class SemrushClient {
  constructor({ apiKey, cacheDir, sleepMs = RATE_LIMIT_MS }) {
    if (!apiKey) throw new Error('SemrushClient: apiKey required');
    if (!cacheDir) throw new Error('SemrushClient: cacheDir required');
    this.apiKey = apiKey;
    this.cacheDir = cacheDir;
    this.sleepMs = sleepMs;
    fs.mkdirSync(cacheDir, { recursive: true });
    this.stats = { hits: 0, misses: 0, throttled: 0, errors: 0 };
    this._lastCall = 0;
  }

  cachePath(kw, country) {
    return path.join(this.cacheDir, `${cacheKey(kw, country)}.json`);
  }

  readCache(kw, country) {
    const p = this.cachePath(kw, country);
    if (!fs.existsSync(p)) return null;
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
  }

  writeCache(kw, country, payload) {
    fs.writeFileSync(this.cachePath(kw, country), JSON.stringify(payload, null, 2));
  }

  /**
   * Normalize the vendor payload into a stable shape callers can rely on.
   * Returns `null` if the vendor returned no keyword data at all.
   */
  normalize(raw, kw, country) {
    const overview = raw?.['Keyword Overview'];
    if (!overview) return null;
    const cc = country.toUpperCase();
    const ccBlock = Array.isArray(overview[cc]) ? overview[cc][0] : null;
    const globalBlock = Array.isArray(overview.global) ? overview.global[0] : null;
    // Prefer the country block for authoritative volume/KD; fall back to global.
    const primary = ccBlock || globalBlock;
    if (!primary) return null;

    const volume = parseVolume(primary['searche volume']);
    const kdPct = parsePercent(primary['Keyword Difficulty %']);
    const kdLabel = primary['Keyword Difficulty Label'] || null;
    const cpc = primary['CPC'] || null;
    const competitiveDensity = primary['Competitive Density'] || null;
    const competitiveDensityScore = primary['Competitive Density Score'] ?? null;
    const intent = primary['Keyword Intent'] || null;
    const intentScores = primary['intent_raw_scores'] || null;
    const trend = Array.isArray(primary.Trend) ? primary.Trend.map(t => ({
      month: t.month,
      year: t.year,
      searches: parseVolume(t.searches),
    })) : [];
    const serpFeatures = primary.serp_features || null;
    const monetization = primary.monetization_score_0_to_10 ?? null;

    return {
      keyword: kw,
      country: cc,
      volume,           // integer
      kdPct,            // number, 0-100
      kdLabel,          // string: Easy | Medium | Hard | Very Hard | Impossible
      cpc,              // string like "$5.00"
      competitiveDensity,
      competitiveDensityScore,
      intent,
      intentScores,
      trend,
      serpFeatures,
      monetization,
      lastUpdate: raw?.['Last update'] || null,
      _sourcedAt: new Date().toISOString(),
    };
  }

  async _rateLimit() {
    const elapsed = Date.now() - this._lastCall;
    if (elapsed < this.sleepMs) {
      await new Promise(r => setTimeout(r, this.sleepMs - elapsed));
    }
    this._lastCall = Date.now();
  }

  async fetchOne(keyword, country = 'us') {
    // Cache-first — reuse anything within the last ~30 days by mtime
    const cached = this.readCache(keyword, country);
    if (cached) {
      this.stats.hits++;
      return cached;
    }
    this.stats.misses++;

    await this._rateLimit();

    const url = `${ENDPOINT}?keyword=${encodeURIComponent(keyword)}&country=${country}`;
    const doFetch = async () => fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    let res = await doFetch();
    if (res.status === 429) {
      this.stats.throttled++;
      console.warn(`[semrush] 429 on "${keyword}" — backing off ${BACKOFF_429_MS}ms and retrying once`);
      await new Promise(r => setTimeout(r, BACKOFF_429_MS));
      res = await doFetch();
    }
    if (!res.ok) {
      this.stats.errors++;
      console.warn(`[semrush] HTTP ${res.status} on "${keyword}" — skipping`);
      return null;
    }
    const raw = await res.json();
    const normalized = this.normalize(raw, keyword, country);
    if (normalized) {
      // Persist normalized + raw side by side so future callers can access either.
      this.writeCache(keyword, country, { ...normalized, _raw: raw });
    }
    return normalized;
  }

  async harvest(keywords, { country = 'us', onProgress } = {}) {
    const results = [];
    for (let i = 0; i < keywords.length; i++) {
      const kw = keywords[i];
      const r = await this.fetchOne(kw, country);
      results.push({ input: kw, data: r });
      if (onProgress) onProgress(i + 1, keywords.length, kw, r);
    }
    return results;
  }
}
