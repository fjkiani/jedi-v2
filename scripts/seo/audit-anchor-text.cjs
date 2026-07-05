#!/usr/bin/env node
/**
 * audit:anchor-text — flags anchor/button text that is generic ("Learn more", "Read more",
 * "Click here", "Get started", etc.) WITHOUT an aria-label to provide context.
 *
 * Passes when a generic anchor has aria-label attribute (accessibility-preserving fallback).
 */
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(process.cwd(), 'dist');
const IGNORE_FILES = new Set([
  'google[verification-code].html',
  'googled4cdbca54979656a.html',
]);

const GENERIC_PATTERNS = [
  /^learn more$/i,
  /^read more$/i,
  /^click here$/i,
  /^get started$/i,
  /^view more$/i,
  /^see more$/i,
  /^continue$/i,
  /^find out more$/i,
  /^discover$/i,
];

const warnings = [];
let checked = 0;
let genericTotal = 0;

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

function isGeneric(text) {
  return GENERIC_PATTERNS.some(p => p.test(text));
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const rel = path.relative(DIST_DIR, filePath);
  checked++;

  // Match all <a ...>...</a> and <button ...>...</button>
  const linkMatches = [...content.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  const buttonMatches = [...content.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];

  for (const m of [...linkMatches, ...buttonMatches]) {
    const attrs = m[1];
    const innerText = stripTags(m[2]);
    if (!isGeneric(innerText)) continue;
    genericTotal++;
    const hasAria = /\baria-label\s*=/.test(attrs);
    if (!hasAria) {
      warnings.push(`${rel}: generic "${innerText}" without aria-label`);
    }
  }
}

walk(DIST_DIR);

console.log(`Checked ${checked} HTML files for anchor text quality.`);
console.log(`Found ${genericTotal} generic anchors/buttons.`);
if (warnings.length > 0) {
  console.log(`\n${warnings.length} generic anchor(s) WITHOUT aria-label (recommend adding context):`);
  warnings.slice(0, 50).forEach(w => console.log(`  ${w}`));
  if (warnings.length > 50) console.log(`  ... and ${warnings.length - 50} more`);
  console.log(`\nNote: this is a warn-only audit. Fix by adding aria-label={\`Read: \${title}\`} or making link text specific.`);
  process.exit(0);
}
console.log(`\nANCHOR TEXT AUDIT PASSED.`);
