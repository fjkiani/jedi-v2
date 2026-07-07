#!/usr/bin/env node
/**
 * w2 — perf / audit-carryover fixes.
 *
 * Deterministic. No LLM. Only fixes that map to actual files in the current
 * codebase; everything speculative was removed after round 4's dry-run showed
 * xray-classifier and ArticleCard files don't exist in jedi-v2.
 *
 * Fixes:
 *   1. postdetail-h1-demote — Demote the first <h1> in PostDetail.jsx to <h2>.
 *      The blog post detail template renders both an outer title <h1> and a
 *      Hygraph `heading-one` block as another <h1>, which trips the
 *      multi-h1-per-page audit. This edit is idempotent via a sentinel comment.
 *
 * Add new fixes by copying the pattern below. Each fix should:
 *   - Check that its target file exists (skip cleanly if not)
 *   - Check for its sentinel to be idempotent
 *   - Do exactly one edit
 *   - Log its outcome to `applied` or `skipped`
 */

import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2)
  .map(a => a.startsWith('--') ? a.slice(2).split('=') : [a, true])
  .map(([k, v]) => [k, v === undefined ? true : v]));

const REPO = args.repo || process.env.JEDI_V2_REPO || '/workspace/jedi-v2';
const RUN_DIR = args['run-dir'];
if (!RUN_DIR) { console.error('--run-dir required'); process.exit(2); }

const applied = [];
const skipped = [];

function readIfExists(rel) {
  const p = path.join(REPO, rel);
  if (!fs.existsSync(p)) return null;
  return { path: p, content: fs.readFileSync(p, 'utf8') };
}

function write(p, content) { fs.writeFileSync(p, content); }

// Fix 1 — demote first h1 in PostDetail.jsx (multi-h1 audit fix)
{
  const rel = 'src/components/hyGraph/PostDetail.jsx';
  const file = readIfExists(rel);
  if (!file) {
    skipped.push({ fix: 'postdetail-h1-demote', reason: 'file-missing', file: rel });
  } else {
    const key = '/* seo:round4:postdetail-h1-demote */';
    if (file.content.includes(key)) {
      skipped.push({ fix: 'postdetail-h1-demote', reason: 'already-applied', file: rel });
    } else {
      const h1Matches = [...file.content.matchAll(/<h1(\s[^>]*)?>/g)];
      if (h1Matches.length >= 1) {
        const openIdx = h1Matches[0].index;
        const attrStr = h1Matches[0][1] || '';
        const closeIdx = file.content.indexOf('</h1>', openIdx);
        if (closeIdx >= 0) {
          const before = file.content.slice(0, openIdx);
          const middle = file.content.slice(openIdx + h1Matches[0][0].length, closeIdx);
          const after = file.content.slice(closeIdx + '</h1>'.length);
          const patched = `${before}${key}\n<h2${attrStr}>${middle}</h2>${after}`;
          write(file.path, patched);
          applied.push({ fix: 'postdetail-h1-demote', file: rel });
        } else {
          skipped.push({ fix: 'postdetail-h1-demote', reason: 'no-closing-h1', file: rel });
        }
      } else {
        skipped.push({ fix: 'postdetail-h1-demote', reason: 'no-h1-in-file', file: rel });
      }
    }
  }
}

const out = path.join(RUN_DIR, 'perf-fixes-applied.jsonl');
fs.writeFileSync(out, applied.map(a => JSON.stringify(a)).join('\n') + (applied.length ? '\n' : ''));

const skipOut = path.join(RUN_DIR, 'perf-fixes-skipped.jsonl');
fs.writeFileSync(skipOut, skipped.map(s => JSON.stringify(s)).join('\n') + (skipped.length ? '\n' : ''));

console.log(`[perf-fixer] applied=${applied.length} skipped=${skipped.length}`);
console.log(`[perf-fixer] applied: ${JSON.stringify(applied)}`);
if (skipped.length) console.log(`[perf-fixer] skipped: ${JSON.stringify(skipped)}`);
console.log(`[perf-fixer] artifact → ${out}`);
