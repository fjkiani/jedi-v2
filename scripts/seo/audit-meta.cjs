#!/usr/bin/env node
/**
 * audit:meta — asserts every HTML has a meta description, canonical, og:title, og:description, og:image.
 * Fails hard on any missing element.
 */
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(process.cwd(), 'dist');
const IGNORE_FILES = new Set([
  'google[verification-code].html',
  'googled4cdbca54979656a.html',
]);

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
  checked++;

  const hasDesc = /<meta[^>]*name=["']description["'][^>]*content=["'][^"']+["']/.test(content);
  const hasCanonical = /<link[^>]*rel=["']canonical["'][^>]*href=["'][^"']+["']/.test(content);
  const hasOgTitle = /<meta[^>]*property=["']og:title["'][^>]*content=["'][^"']+["']/.test(content);
  const hasOgDesc = /<meta[^>]*property=["']og:description["'][^>]*content=["'][^"']+["']/.test(content);
  const hasOgImage = /<meta[^>]*property=["']og:image["'][^>]*content=["'][^"']+["']/.test(content);

  const missing = [];
  if (!hasDesc) missing.push('meta description');
  if (!hasCanonical) missing.push('canonical link');
  if (!hasOgTitle) missing.push('og:title');
  if (!hasOgDesc) missing.push('og:description');
  if (!hasOgImage) missing.push('og:image');

  if (missing.length > 0) {
    errors.push(`${rel}: missing ${missing.join(', ')}`);
  }
}

walk(DIST_DIR);

console.log(`Checked ${checked} HTML files for meta description, canonical, og:title, og:description, og:image.`);

if (errors.length > 0) {
  console.error(`\n${errors.length} file(s) FAIL:`);
  errors.forEach(e => console.error(`  ${e}`));
  process.exit(1);
}
console.log(`\nMETA AUDIT PASSED.`);
