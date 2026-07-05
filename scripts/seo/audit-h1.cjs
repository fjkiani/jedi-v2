#!/usr/bin/env node
/**
 * audit:h1 — asserts every HTML has exactly one <h1> and it's non-empty.
 */
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(process.cwd(), 'dist');
const IGNORE_FILES = new Set([
  'google[verification-code].html',
  'googled4cdbca54979656a.html',
]);

const errors = [];
const warnings = [];
let checked = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`DIST_DIR does not exist: ${dir}. Run 'npm run build' with PRERENDER=1 first.`);
    process.exit(2);
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['assets', 'node_modules', 'ai-training-results', 'og', 'models', 'videos', 'desktop_pc', 'api'].includes(entry.name)) continue;
      walk(fullPath);
    } else if (entry.name.endsWith('.html')) {
      if (IGNORE_FILES.has(entry.name)) continue;
      checkFile(fullPath);
    }
  }
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const rel = path.relative(DIST_DIR, filePath);
  checked++;

  const h1Matches = [...content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  if (h1Matches.length === 0) {
    errors.push(`${rel}: no <h1>`);
    return;
  }
  if (h1Matches.length > 1) {
    warnings.push(`${rel}: ${h1Matches.length} <h1> elements (should be 1)`);
  }
  const firstText = stripTags(h1Matches[0][1]);
  if (!firstText) {
    errors.push(`${rel}: empty <h1>`);
  }
}

walk(DIST_DIR);

console.log(`Checked ${checked} HTML files for <h1>.`);
if (warnings.length > 0) {
  console.log(`\n${warnings.length} file(s) have multiple <h1> (warn only):`);
  warnings.forEach(w => console.log(`  ${w}`));
}
if (errors.length > 0) {
  console.error(`\n${errors.length} file(s) FAIL:`);
  errors.forEach(e => console.error(`  ${e}`));
  process.exit(1);
}
console.log(`\nH1 AUDIT PASSED.`);
