/**
 * Compute a small structured diff of the SEO audit output between two runs.
 *
 * Because the audit scripts print human-readable summaries rather than emit
 * JSON, this module runs the audits programmatically by scanning the dist
 * itself. We look at:
 *   - total routes
 *   - unique title count
 *   - title length min/avg/max
 *   - description length min/avg/max
 *   - counts of canonical / og:image / json-ld / h1
 *   - multi-h1 offenders
 *
 * Two invocations of `summarize(distRoot)` — one before edits, one after —
 * are enough to produce a defensible before/after table.
 */

import fs from 'node:fs';
import path from 'node:path';
import { load as loadHtml } from 'cheerio';

function walk(root, out = []) {
  for (const e of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.isFile() && e.name === 'index.html') out.push(full);
  }
  return out;
}

const stats = (arr) => {
  if (!arr.length) return { count: 0, min: 0, avg: 0, max: 0 };
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const avg = Math.round(arr.reduce((s, x) => s + x, 0) / arr.length);
  return { count: arr.length, min, avg, max };
};

export function summarize(distRoot) {
  const files = walk(distRoot);
  const titles = [];
  const titleLens = [];
  const descLens = [];
  const multiH1 = [];
  let hasCanonical = 0;
  let hasOgImage = 0;
  let hasJsonLd = 0;
  let totalJsonLdBlocks = 0;
  let hasH1 = 0;

  for (const f of files) {
    const html = fs.readFileSync(f, 'utf8');
    const $ = loadHtml(html);
    const t = $('head > title').first().text().trim();
    if (t) { titles.push(t); titleLens.push(t.length); }
    const d = $('head meta[name="description"]').attr('content') || '';
    if (d) descLens.push(d.length);
    if ($('head link[rel="canonical"]').length) hasCanonical++;
    if ($('head meta[property="og:image"]').length) hasOgImage++;
    const ldCount = $('script[type="application/ld+json"]').length;
    if (ldCount > 0) hasJsonLd++;
    totalJsonLdBlocks += ldCount;
    const h1s = $('body h1').length;
    if (h1s > 0) hasH1++;
    if (h1s > 1) {
      const route = '/' + path.relative(distRoot, f).replace(/\/?index\.html$/, '');
      multiH1.push({ route, count: h1s });
    }
  }

  return {
    total_routes: files.length,
    unique_titles: new Set(titles).size,
    title_length: stats(titleLens),
    description_length: stats(descLens),
    has_canonical: hasCanonical,
    has_og_image: hasOgImage,
    has_h1: hasH1,
    has_json_ld_routes: hasJsonLd,
    total_json_ld_blocks: totalJsonLdBlocks,
    multi_h1_offenders: multiH1,
  };
}

export function diffSummaries(before, after) {
  const delta = (a, b) => (a == null || b == null) ? null : b - a;
  return {
    total_routes: { before: before.total_routes, after: after.total_routes, delta: delta(before.total_routes, after.total_routes) },
    unique_titles: { before: before.unique_titles, after: after.unique_titles, delta: delta(before.unique_titles, after.unique_titles) },
    title_length_avg: { before: before.title_length.avg, after: after.title_length.avg, delta: delta(before.title_length.avg, after.title_length.avg) },
    description_length_avg: { before: before.description_length.avg, after: after.description_length.avg, delta: delta(before.description_length.avg, after.description_length.avg) },
    has_canonical: { before: before.has_canonical, after: after.has_canonical, delta: delta(before.has_canonical, after.has_canonical) },
    has_og_image: { before: before.has_og_image, after: after.has_og_image, delta: delta(before.has_og_image, after.has_og_image) },
    has_json_ld_routes: { before: before.has_json_ld_routes, after: after.has_json_ld_routes, delta: delta(before.has_json_ld_routes, after.has_json_ld_routes) },
    multi_h1_offenders: {
      before_count: before.multi_h1_offenders.length,
      after_count: after.multi_h1_offenders.length,
      before_routes: before.multi_h1_offenders.map(o => o.route),
      after_routes: after.multi_h1_offenders.map(o => o.route),
    },
  };
}
