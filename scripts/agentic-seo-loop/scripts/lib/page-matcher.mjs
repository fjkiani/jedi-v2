/**
 * Fuzzy match a keyword to an existing page in the site.
 *
 * Scoring policy:
 *   - Exact substring match against the cleaned title/h1: score 1.0
 *   - Token-overlap ratio (Jaccard) on the meaningful nouns: 0.0-0.95
 *   - Bonus for matching the route slug: +0.15 (capped at 1.0)
 *
 * Buckets:
 *   - score >= 0.6 → edit an existing page
 *   - score <= 0.4 → propose a new page
 *   - 0.4 < score < 0.6 → drop (ambiguous, avoid noisy overlap)
 *
 * This is intentionally coarse. We don't need great linguistic matching —
 * we need "obvious match" vs "obviously new topic" vs "unclear, skip".
 */

const STOP = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'for', 'to', 'in', 'on', 'with', 'at',
  'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'has', 'have', 'had',
  'as', 'that', 'this', 'these', 'those', 'your', 'you', 'we', 'our', 'i',
]);

const tokens = (s) => (s || '')
  .toLowerCase()
  .replace(/[^\w\s-]/g, ' ')
  .split(/\s+/)
  .filter(t => t && t.length > 1 && !STOP.has(t));

const jaccard = (a, b) => {
  if (!a.length || !b.length) return 0;
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
};

const cleanText = (s) => (s || '')
  .replace(/\s*[|—\-–]\s*Jedi Labs.*$/i, '')
  .toLowerCase()
  .trim();

/**
 * scorePage — how well does `keyword` match `page`?
 * Returns { score, reasons } for debuggability.
 */
export function scorePage(keyword, page) {
  const kw = keyword.toLowerCase().trim();
  const title = cleanText(page.title);
  const h1 = cleanText(page.h1);
  const slug = (page.route || '').toLowerCase();
  const kwTokens = tokens(kw);
  const reasons = [];
  let score = 0;

  // Substring hits — strongest signal
  if (title.includes(kw)) { score = Math.max(score, 1.0); reasons.push('title-substr'); }
  if (h1 && h1.includes(kw)) { score = Math.max(score, 0.95); reasons.push('h1-substr'); }

  // Token overlap fallback
  const titleJ = jaccard(kwTokens, tokens(title));
  const h1J = jaccard(kwTokens, tokens(h1));
  const bestJ = Math.max(titleJ, h1J);
  if (bestJ > score) { score = bestJ * 0.95; reasons.push(`token-overlap-${bestJ.toFixed(2)}`); }

  // Slug bonus
  const slugTokens = slug.split(/[\/\-_]+/).filter(Boolean);
  const slugJ = jaccard(kwTokens, slugTokens);
  if (slugJ > 0.3) { score = Math.min(1.0, score + 0.15); reasons.push(`slug-bonus-${slugJ.toFixed(2)}`); }

  return { score, reasons };
}

/**
 * matchKeyword — decide whether `keyword` belongs to an existing page or is
 * a new-page candidate. Returns:
 *   { verdict: 'edit', page, score }  — edit existing page (highest scorer)
 *   { verdict: 'new', score: bestScore } — propose new page
 *   { verdict: 'skip', reason }        — ambiguous, don't touch
 */
export function matchKeyword(keyword, pages, { editMin = 0.6, newMax = 0.4 } = {}) {
  let best = null;
  for (const p of pages) {
    const { score, reasons } = scorePage(keyword, p);
    if (!best || score > best.score) best = { page: p, score, reasons };
  }
  if (!best) return { verdict: 'skip', reason: 'no-pages' };

  if (best.score >= editMin) {
    return { verdict: 'edit', page: best.page, score: best.score, reasons: best.reasons };
  }
  if (best.score <= newMax) {
    return { verdict: 'new', score: best.score };
  }
  return { verdict: 'skip', reason: 'ambiguous', score: best.score };
}

/**
 * Rank proposals by opportunity score:
 *   volume * (1 - kd/100) * confidence
 * Low KD + high volume + high confidence rise to the top.
 */
export function opportunityScore({ volume, kdPct, confidence }) {
  const v = Math.max(0, volume || 0);
  const k = Math.min(100, Math.max(0, kdPct == null ? 100 : kdPct));
  const c = Math.max(0, Math.min(1, confidence == null ? 0.5 : confidence));
  return v * (1 - k / 100) * c;
}
