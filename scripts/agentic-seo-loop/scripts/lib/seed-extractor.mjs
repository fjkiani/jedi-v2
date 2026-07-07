/**
 * Auto-seed keyword extraction from a prerendered dist directory.
 *
 * Strategy — plain and boring, deliberately:
 *   1. Enumerate every dist/**\/index.html
 *   2. Pull the <title>, first <h1>, and (if present) JSON-LD @type + name
 *   3. Strip the site suffix (" | Jedi Labs Research", " | Jedi Labs") to
 *      leave just the meaningful head
 *   4. Split on connectors ("—", "|", ":", "•") and dedupe
 *   5. Normalize to lowercase, trim punctuation
 *
 * The output is intentionally the site's *existing* vocabulary — the plan
 * is to lift what's already there, not to invent new topic spaces without
 * the operator explicitly opting in.
 */

import fs from 'node:fs';
import path from 'node:path';
import { load as loadHtml } from 'cheerio';

const SITE_SUFFIXES = [
  /\s*[|—\-–]\s*Jedi Labs Research\s*$/i,
  /\s*[|—\-–]\s*Jedi Labs\s*$/i,
  /\s*[|—\-–]\s*jedilabs\.org\s*$/i,
];

const CONNECTOR_SPLIT = /[—|:•·]+/g;

const stripSuffix = (title) => {
  let t = title || '';
  for (const rx of SITE_SUFFIXES) t = t.replace(rx, '');
  return t.trim();
};

const cleanPhrase = (p) => p
  .replace(/[""'']/g, '')
  .replace(/[^\w\s\-\/]+/g, ' ')  // keep hyphens and slashes; drop other punct
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

const isNoiseSeed = (p) => {
  if (!p || p.length < 4) return true;
  if (p.length > 80) return true;
  // Drop pure page-scaffolding titles
  const noise = ['home', 'contact', 'about', 'terms', 'privacy', 'blog', 'sitemap', 'services'];
  if (noise.includes(p)) return true;
  // Drop pure brand queries — high volume, KD ~100, zero opportunity
  if (p === 'jedi labs' || p === 'jedilabs' || p === 'jedi') return true;
  // Drop team-member name patterns: two lowercase tokens both under 12 chars
  // with no non-alphabetic content (heuristic — will occasionally false-positive
  // but the volume filter downstream drops those anyway)
  const tokens = p.split(/\s+/);
  if (tokens.length === 2 && tokens.every(t => /^[a-z]+$/.test(t) && t.length <= 12)) {
    // Person-name heuristic — safer to skip; if they're real keywords the
    // operator can add them via a manual seed override
    return true;
  }
  return false;
};

/**
 * Walk a directory looking for index.html files, without loading a full
 * recursive-globber dependency.
 */
function findIndexHtml(root, out = []) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(root, e.name);
    if (e.isDirectory()) {
      findIndexHtml(full, out);
    } else if (e.isFile() && e.name === 'index.html') {
      out.push(full);
    }
  }
  return out;
}

/**
 * Extract SEO metadata for a single dist file.
 * Returns { route, title, h1, ldName } — any missing field is null.
 */
export function readPageMeta(distRoot, filepath) {
  const html = fs.readFileSync(filepath, 'utf8');
  const $ = loadHtml(html);
  const title = $('head > title').first().text().trim() || null;
  const h1 = $('body h1').first().text().trim() || null;
  const description = $('head meta[name="description"]').attr('content') || null;
  let ldName = null;
  let ldType = null;
  $('script[type="application/ld+json"]').each((_i, el) => {
    if (ldName && ldType) return;
    try {
      const raw = $(el).contents().text();
      const data = JSON.parse(raw);
      const first = Array.isArray(data) ? data[0] : data;
      if (!ldName) ldName = first?.name || first?.headline || null;
      if (!ldType) ldType = first?.['@type'] || null;
    } catch { /* ignore */ }
  });
  const relative = path.relative(distRoot, filepath);
  // 'index.html' → '/'; 'blog/post/foo/index.html' → '/blog/post/foo'
  let route = '/' + relative.replace(/\/?index\.html$/, '');
  if (route === '/') route = '/';
  else route = route.replace(/\/$/, '');
  return { route, filepath, title, h1, description, ldName, ldType };
}

/**
 * seedsFromDist — return two things:
 *   - pages: full metadata for every route (used for page matching later)
 *   - seeds: deduped, cleaned keyword phrases to feed Semrush
 */
export function seedsFromDist(distRoot, { maxSeeds = 30 } = {}) {
  const files = findIndexHtml(distRoot);
  const allPages = files.map(f => readPageMeta(distRoot, f));

  // Skip 404 prerenders — some routes leak into dist as static 404 pages
  // (e.g. old use-case sub-routes that no longer resolve). Their titles start
  // with "404" and they'd otherwise pull junk keywords + junk edit proposals.
  const pages = allPages.filter(p => !(p.title && /^\s*404\b/i.test(p.title)));
  const excluded404 = allPages.length - pages.length;
  if (excluded404 > 0) {
    console.error(`[seed-extractor] skipped ${excluded404} 404 prerenders`);
  }

  const phraseCounts = new Map();
  const bump = (raw) => {
    const s = cleanPhrase(stripSuffix(raw));
    if (isNoiseSeed(s)) return;
    phraseCounts.set(s, (phraseCounts.get(s) || 0) + 1);
  };

  for (const p of pages) {
    if (p.title) {
      const head = stripSuffix(p.title);
      // whole head + split by connectors
      bump(head);
      for (const part of head.split(CONNECTOR_SPLIT)) bump(part);
    }
    if (p.h1) bump(p.h1);
    if (p.ldName) bump(p.ldName);
  }

  // Rank by frequency, then alphabetically for determinism
  const ranked = [...phraseCounts.entries()]
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
    .map(([kw, count]) => ({ keyword: kw, count }))
    .slice(0, maxSeeds);

  return { pages, seeds: ranked };
}
