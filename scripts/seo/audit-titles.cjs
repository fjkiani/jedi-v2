#!/usr/bin/env node
/**
 * audit:titles — walks all prerendered HTML in dist/, asserts:
 *   1. Every page has a <title>
 *   2. No page uses the generic template title
 *   3. Titles are unique across routes
 *
 * Vite/SPA equivalent of the Next.js src/app metadata walker.
 * Exits non-zero on any failure so CI can gate on it.
 */
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(process.cwd(), 'dist');
const GENERIC_TITLE = 'Jedi Labs — We solve what AI fails';
const errors = [];
const titles = new Map();

// Google verification files are static HTML with no <head>. Skip them.
const IGNORE_FILES = new Set([
  'google[verification-code].html',
  'googled4cdbca54979656a.html',
]);

function walk(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`DIST_DIR does not exist: ${dir}. Run 'npm run build' with PRERENDER=1 first.`);
    process.exit(2);
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip vendor / asset dirs
      if (['assets', 'node_modules', 'ai-training-results', 'og', 'models', 'videos', 'desktop_pc', 'api'].includes(entry.name)) continue;
      walk(fullPath);
    } else if (entry.name.endsWith('.html')) {
      if (IGNORE_FILES.has(entry.name)) continue;
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const rel = path.relative(DIST_DIR, filePath);

  // Extract title
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/);
  if (!titleMatch) {
    errors.push(`MISSING TITLE: ${rel}`);
    return;
  }

  const title = titleMatch[1].trim();

  if (!title) {
    errors.push(`EMPTY TITLE: ${rel}`);
    return;
  }

  if (title === GENERIC_TITLE) {
    errors.push(`GENERIC TITLE: ${rel} → "${title}"`);
    return;
  }

  if (titles.has(title)) {
    errors.push(`DUPLICATE TITLE "${title}": ${rel} vs ${titles.get(title)}`);
  } else {
    titles.set(title, rel);
  }
}

walk(DIST_DIR);

if (errors.length > 0) {
  console.error('TITLE AUDIT FAILED:');
  errors.forEach(e => console.error(`  ${e}`));
  console.error(`\n${errors.length} error(s). ${titles.size} unique titles found.`);
  process.exit(1);
} else {
  console.log(`TITLE AUDIT PASSED: ${titles.size} unique route-specific titles across all HTML files.`);
}
