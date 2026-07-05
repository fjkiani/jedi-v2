#!/usr/bin/env node
/**
 * baseline-report — generates a machine-readable JSON + markdown baseline snapshot
 * of the current SEO state for jedilabs.org across all prerendered routes.
 *
 * Output: /workspace/jedi-v2/docs/SEO_BASELINE.md and .json
 */
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(process.cwd(), 'dist');
const DOCS_DIR = path.join(process.cwd(), 'docs');
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

const IGNORE_FILES = new Set([
  'google[verification-code].html',
  'googled4cdbca54979656a.html',
]);

const GENERIC_TITLE = 'Jedi Labs — We solve what AI fails';

const routes = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['assets', 'node_modules', 'ai-training-results', 'og', 'models', 'videos', 'desktop_pc', 'api'].includes(entry.name)) continue;
      walk(fullPath);
    } else if (entry.name.endsWith('.html')) {
      if (IGNORE_FILES.has(entry.name)) continue;
      analyze(fullPath);
    }
  }
}

function extract(re, content) {
  const m = content.match(re);
  return m ? m[1].trim() : null;
}

function analyze(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const rel = path.relative(DIST_DIR, filePath);
  const routePath = '/' + rel.replace(/\/?index\.html$/, '').replace(/\.html$/, '');
  const cleanRoute = routePath === '/' ? '/' : routePath.replace(/\/$/, '');

  const title = extract(/<title[^>]*>([^<]+)<\/title>/, content);
  const desc = extract(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/, content);
  const canonical = extract(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/, content);
  const ogTitle = extract(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/, content);
  const ogImage = extract(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/, content);
  const h1Matches = [...content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  const h1Count = h1Matches.length;
  const firstH1 = h1Count ? h1Matches[0][1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : null;
  const jsonLdCount = (content.match(/application\/ld\+json/g) || []).length;

  routes.push({
    route: cleanRoute,
    file: rel,
    title,
    titleLen: title ? title.length : 0,
    generic: title === GENERIC_TITLE,
    desc,
    descLen: desc ? desc.length : 0,
    canonical,
    ogTitle,
    ogImage,
    h1Count,
    firstH1,
    jsonLdCount,
  });
}

if (!fs.existsSync(DIST_DIR)) {
  console.error(`DIST_DIR does not exist: ${DIST_DIR}. Run PRERENDER=1 npm run build first.`);
  process.exit(2);
}

walk(DIST_DIR);
routes.sort((a, b) => a.route.localeCompare(b.route));

// ---- Aggregates ----
const total = routes.length;
const withTitle = routes.filter(r => r.title).length;
const genericTitle = routes.filter(r => r.generic).length;
const uniqueTitles = new Set(routes.filter(r => r.title).map(r => r.title)).size;
const withDesc = routes.filter(r => r.desc).length;
const withCanonical = routes.filter(r => r.canonical).length;
const withOgTitle = routes.filter(r => r.ogTitle).length;
const withOgImage = routes.filter(r => r.ogImage).length;
const withH1 = routes.filter(r => r.h1Count > 0).length;
const withJsonLd = routes.filter(r => r.jsonLdCount > 0).length;
const totalJsonLd = routes.reduce((sum, r) => sum + r.jsonLdCount, 0);

const summary = {
  generatedAt: new Date().toISOString(),
  totalRoutes: total,
  titles: {
    withTitle,
    unique: uniqueTitles,
    generic: genericTitle,
    routeSpecific: withTitle - genericTitle,
    avgLen: Math.round(routes.reduce((s, r) => s + r.titleLen, 0) / (total || 1)),
    minLen: routes.reduce((min, r) => r.titleLen && r.titleLen < min ? r.titleLen : min, Infinity),
    maxLen: routes.reduce((max, r) => r.titleLen > max ? r.titleLen : max, 0),
  },
  descriptions: {
    withDesc,
    avgLen: Math.round(routes.reduce((s, r) => s + r.descLen, 0) / (total || 1)),
  },
  canonical: { withCanonical },
  openGraph: { withOgTitle, withOgImage },
  h1: { withH1, multipleH1: routes.filter(r => r.h1Count > 1).length },
  structuredData: { withJsonLd, totalJsonLdBlocks: totalJsonLd },
};

// ---- Write JSON ----
const jsonPath = path.join(DOCS_DIR, 'SEO_BASELINE.json');
fs.writeFileSync(jsonPath, JSON.stringify({ summary, routes }, null, 2));
console.log(`Wrote ${jsonPath}`);

// ---- Write Markdown ----
const md = `# Jedi Labs SEO Baseline

_Generated: ${summary.generatedAt}_

## Summary

| Metric | Value |
|---|---|
| Total routes | ${total} |
| Routes with title | ${withTitle} |
| Unique titles | ${uniqueTitles} |
| Generic titles | ${genericTitle} |
| Route-specific titles | ${withTitle - genericTitle} |
| Title length (min / avg / max) | ${summary.titles.minLen} / ${summary.titles.avgLen} / ${summary.titles.maxLen} |
| Routes with meta description | ${withDesc} |
| Description avg length | ${summary.descriptions.avgLen} chars |
| Routes with canonical link | ${withCanonical} |
| Routes with og:title | ${withOgTitle} |
| Routes with og:image | ${withOgImage} |
| Routes with \`<h1>\` | ${withH1} |
| Routes with multiple \`<h1>\` | ${summary.h1.multipleH1} |
| Routes with JSON-LD | ${withJsonLd} |
| Total JSON-LD blocks | ${totalJsonLd} |

## Per-route detail

| Route | Title (len) | Desc | Canonical | og:image | JSON-LD |
|---|---|---|---|---|---|
${routes.map(r =>
  `| \`${r.route}\` | ${r.title ? r.title.substring(0, 60).replace(/\|/g, '\\|') + (r.title.length > 60 ? '…' : '') : '—'} (${r.titleLen})${r.generic ? ' **GENERIC**' : ''} | ${r.desc ? '✓' : '—'} | ${r.canonical ? '✓' : '—'} | ${r.ogImage ? '✓' : '—'} | ${r.jsonLdCount} |`
).join('\n')}
`;

const mdPath = path.join(DOCS_DIR, 'SEO_BASELINE.md');
fs.writeFileSync(mdPath, md);
console.log(`Wrote ${mdPath}`);
console.log(`\n${withTitle - genericTitle}/${total} route-specific titles; ${uniqueTitles} unique; ${genericTitle} generic.`);
