#!/usr/bin/env node
/**
 * w3 — content injector.
 *
 * Reads edit-proposals.jsonl. For each edit whose target file lives in
 * src/pages/, src/components/, src/blog/ (excluding blog/post/*), or the
 * route falls under industries/solutions/technologies/topics, apply the
 * proposed title/description/h1 by patching the file.
 *
 * Blog posts (route matches /blog/post/*) are CMS-owned (Hygraph) — copy
 * mutations can't be committed to code. For those we log the proposal but
 * don't write.
 *
 * Two write strategies:
 *   A. If the file uses a <SEO title=".." description=".."> component, patch
 *      those attributes. This covers most of jedi-v2.
 *   B. Otherwise, if the file has hard-coded <title>/<h1>/<meta> tags, patch
 *      them directly. This is a fallback for older pages.
 *
 * Every write is guarded by a sentinel comment so a re-run doesn't stack
 * multiple patches.
 */

import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2)
  .map(a => a.startsWith('--') ? a.slice(2).split('=') : [a, true])
  .map(([k, v]) => [k, v === undefined ? true : v]));

const REPO = args.repo || process.env.JEDI_V2_REPO || '/workspace/jedi-v2';
const RUN_DIR = args['run-dir'];
if (!RUN_DIR) { console.error('--run-dir required'); process.exit(2); }

const proposalsPath = path.join(RUN_DIR, 'edit-proposals.jsonl');
if (!fs.existsSync(proposalsPath)) { console.error(`missing ${proposalsPath}`); process.exit(2); }
// S3 FUSE quirk: reading a truly-empty file can EPERM. Stat first.
const proposalsStat = fs.statSync(proposalsPath);

const escapeAttr = (s) => (s || '')
  .replace(/\\/g, '\\\\')
  .replace(/"/g, '\\"')
  .replace(/\n/g, ' ')
  .trim();

// CMS-owned prefixes: dynamic routes rendered by a shared component reading
// from Hygraph or a slug-driven data file. There is no per-route .jsx to
// patch, so proposals here are handed off to the CMS-proposals artifact.
// (The jedi-v2 codebase renders /blog/post/:slug, /technology/:slug,
// /solutions/:slug, /use-cases/:slug, /methodology/:slug, /industries/:slug,
// /team/:slug, /careers/:slug, /case-studies/:slug all through a single
// dynamic component. Only top-level index routes have real .jsx.)
const CMS_DRIVEN_ROUTES = [
  '/blog/post/',
  '/blog/',            // /blog/:slug also dynamic
  '/technology/',
  '/solutions/',
  '/use-cases/',
  '/methodology/',
  '/industries/',      // /industries/* uses nested dynamic routing
  '/team/',
  '/careers/',
  '/case-studies/',
  '/ai-training/',     // /ai-training/:domainId
];
const isCmsOwned = (route) => CMS_DRIVEN_ROUTES.some(p => route.startsWith(p));

// Routes with real .jsx files we're willing to patch. Top-level static pages
// only — matches src/pages/*.jsx that are NOT wrapped by :slug dynamic routing.
const EDITABLE_ROUTES = new Set([
  '/',
  '/about',
  '/ai-training',
  '/benchmarks',
  '/blog',
  '/careers',
  '/case-studies',
  '/contact',
  '/deployments',
  '/explore',
  '/glossary',
  '/industries',
  '/infrastructure',
  '/jedi',
  '/methodology',
  '/pricing',
  '/solutions',
  '/team',
  '/technology',   // /technology is the index (TechnologyStack.jsx); slugs are CMS
  '/use-cases',
]);
const isEditable = (route) => EDITABLE_ROUTES.has(route);

const proposals = proposalsStat.size === 0
  ? []
  : fs.readFileSync(proposalsPath, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
console.log(`[injector] ${proposals.length} edit proposals to consider`);

const applied = [];
const cmsSkipped = [];
const otherSkipped = [];

/**
 * Try to find the source .jsx/.tsx that defines this route. We start with
 * the hint in the proposal (source_file — from seed extraction) and fall
 * back to a couple of common patterns.
 */
function candidatePaths(route, hint) {
  const paths = [];
  if (hint) paths.push(hint);
  const slug = route === '/' ? 'home' : route.replace(/^\//, '');
  paths.push(
    `src/pages${route}/index.jsx`,
    `src/pages${route}/index.tsx`,
    `src/pages${route}.jsx`,
    `src/pages${route}.tsx`,
    `src/pages/${slug}/index.jsx`,
    `src/pages/${slug}/index.tsx`,
  );
  return paths.map(p => (path.isAbsolute(p) ? p : path.join(REPO, p)));
}

function findSourceFile(route, hint) {
  for (const p of candidatePaths(route, hint)) {
    if (fs.existsSync(p) && !p.endsWith('.html')) return p;
  }
  return null;
}

/**
 * Patch a <SEO title="..." description="..."> block if present.
 * Returns { patched: boolean, content: string }.
 */
function patchSEOComponent(source, proposal) {
  const seoRx = /<SEO\b([\s\S]*?)\/?>/;
  const m = source.match(seoRx);
  if (!m) return { patched: false, content: source };
  const attrs = m[1];
  let newAttrs = attrs;
  const titleAttrRx = /(\btitle\s*=\s*)(["'`{])/;
  const descAttrRx = /(\bdescription\s*=\s*)(["'`{])/;

  // Only rewrite string-literal attributes (skip {…} expression values which
  // may be dynamic — patching a JSX expression here would break things).
  const titleMatch = attrs.match(/\btitle\s*=\s*(["'])((?:\\.|(?!\1)[\s\S])*?)\1/);
  const descMatch = attrs.match(/\bdescription\s*=\s*(["'])((?:\\.|(?!\1)[\s\S])*?)\1/);

  if (titleMatch && proposal.proposed_title) {
    newAttrs = newAttrs.replace(titleMatch[0], `title="${escapeAttr(proposal.proposed_title)}"`);
  }
  if (descMatch && proposal.proposed_desc) {
    newAttrs = newAttrs.replace(descMatch[0], `description="${escapeAttr(proposal.proposed_desc)}"`);
  }

  if (newAttrs === attrs) return { patched: false, content: source };
  const patched = source.replace(seoRx, `<SEO${newAttrs}${m[0].endsWith('/>') ? '/' : ''}>`);
  return { patched: true, content: patched };
}

/**
 * Patch <h1>...</h1> text with the proposal. Only if the current h1 is a
 * plain literal (not a JSX expression) and matches a normalized version of
 * the current h1 in the proposal — belt-and-braces so we don't clobber a
 * dynamic h1 by accident.
 */
function patchH1(source, proposal) {
  if (!proposal.proposed_h1) return { patched: false, content: source };
  const cur = (proposal.current_h1 || '').trim();
  if (!cur) return { patched: false, content: source };
  const rx = new RegExp(`<h1(\\s[^>]*)?>\\s*${cur.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\s*</h1>`);
  const m = source.match(rx);
  if (!m) return { patched: false, content: source };
  const patched = source.replace(rx, `<h1${m[1] || ''}>${proposal.proposed_h1}</h1>`);
  return { patched: true, content: patched };
}

for (const proposal of proposals) {
  const route = proposal.route;
  // Order matters: check CMS-ownership first so slug-driven routes get
  // handed off to the CMS artifact instead of being classified as
  // "not editable" (which is technically wrong — they ARE editable, just
  // via Hygraph, not via code).
  if (isCmsOwned(route)) {
    cmsSkipped.push({
      route,
      reason: 'cms-owned',
      proposed_title: proposal.proposed_title,
      proposed_desc: proposal.proposed_desc,
      proposed_h1: proposal.proposed_h1,
      target_keyword: proposal.target_keyword,
      confidence: proposal.confidence,
    });
    continue;
  }
  if (!isEditable(route)) { otherSkipped.push({ route, reason: 'route-not-in-editable-list' }); continue; }

  const src = findSourceFile(route, proposal.source_file);
  if (!src) { otherSkipped.push({ route, reason: 'source-not-found' }); continue; }
  const original = fs.readFileSync(src, 'utf8');

  const SENTINEL = `/* seo:round4:content-injected:${route} */`;
  if (original.includes(SENTINEL)) { otherSkipped.push({ route, reason: 'already-patched' }); continue; }

  // Step 1 — try <SEO ...> component
  let { patched, content } = patchSEOComponent(original, proposal);
  const seoPatched = patched;

  // Step 2 — try patching h1 too
  const h1Result = patchH1(content, proposal);
  if (h1Result.patched) content = h1Result.content;

  if (seoPatched || h1Result.patched) {
    // Stamp the sentinel to lock in idempotency
    const stamped = `${SENTINEL}\n${content}`;
    fs.writeFileSync(src, stamped);
    applied.push({
      route,
      file: path.relative(REPO, src),
      target_keyword: proposal.target_keyword,
      seo_patched: seoPatched,
      h1_patched: h1Result.patched,
      proposed_title: proposal.proposed_title,
      confidence: proposal.confidence,
    });
    console.log(`[injector] ✓ ${route}  (seo=${seoPatched}, h1=${h1Result.patched})`);
  } else {
    otherSkipped.push({ route, reason: 'no-matching-block', file: path.relative(REPO, src) });
    console.log(`[injector] · ${route} — no <SEO> string-literal attrs or matching h1 to patch`);
  }
}

const out = path.join(RUN_DIR, 'edits-applied.jsonl');
fs.writeFileSync(out, applied.map(a => JSON.stringify(a)).join('\n') + (applied.length ? '\n' : ''));

// Log CMS-owned proposals so the operator can hand them off to whoever manages Hygraph
const cmsOut = path.join(RUN_DIR, 'cms-proposals-not-applied.jsonl');
fs.writeFileSync(cmsOut, cmsSkipped.map(a => JSON.stringify(a)).join('\n') + (cmsSkipped.length ? '\n' : ''));

// Everything else that got dropped — no source found, no matching block, already patched, etc.
const otherOut = path.join(RUN_DIR, 'edits-skipped.jsonl');
fs.writeFileSync(otherOut, otherSkipped.map(a => JSON.stringify(a)).join('\n') + (otherSkipped.length ? '\n' : ''));

console.log(`[injector] applied=${applied.length} cms-skipped=${cmsSkipped.length} other-skipped=${otherSkipped.length}`);
console.log(`[injector] applied → ${out}`);
console.log(`[injector] cms-only → ${cmsOut}`);
console.log(`[injector] other-skipped → ${otherOut}`);
