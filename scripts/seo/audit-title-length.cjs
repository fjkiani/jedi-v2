#!/usr/bin/env node
/**
 * audit:title-length — flags titles outside Google's 50–60 char sweet spot.
 * Warns (does not fail) on titles > 60 chars (may truncate) or < 30 chars (may look thin).
 * Fails hard on > 70 chars (definitely truncates) or < 15 chars (too short).
 */
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(process.cwd(), 'dist');
const WARN_MIN = 30;
const WARN_MAX = 60;
const FAIL_MIN = 15;
const FAIL_MAX = 70;

const IGNORE_FILES = new Set([
  'google[verification-code].html',
  'googled4cdbca54979656a.html',
]);

const warnings = [];
const errors = [];
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

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const rel = path.relative(DIST_DIR, filePath);
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/);
  if (!titleMatch) return;
  const title = titleMatch[1].trim();
  if (!title) return;
  checked++;
  const len = title.length;

  if (len < FAIL_MIN) {
    errors.push(`TOO SHORT (${len}): ${rel} → "${title}"`);
  } else if (len > FAIL_MAX) {
    errors.push(`TOO LONG (${len}): ${rel} → "${title}"`);
  } else if (len < WARN_MIN) {
    warnings.push(`short (${len}): ${rel} → "${title}"`);
  } else if (len > WARN_MAX) {
    warnings.push(`long (${len}): ${rel} → "${title}"`);
  }
}

walk(DIST_DIR);

console.log(`Checked ${checked} titles.`);
if (warnings.length > 0) {
  console.log(`\n${warnings.length} title(s) outside ideal 30–60 char range (warn only):`);
  warnings.forEach(w => console.log(`  ${w}`));
}
if (errors.length > 0) {
  console.error(`\n${errors.length} title(s) FAIL (< 15 or > 70 chars):`);
  errors.forEach(e => console.error(`  ${e}`));
  process.exit(1);
}
console.log(`\nTITLE LENGTH AUDIT PASSED.`);
