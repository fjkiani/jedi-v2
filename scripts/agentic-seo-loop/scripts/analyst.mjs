#!/usr/bin/env node
/**
 * w1 — analyst
 *
 * LLM-bound single lane. Reads seeds + page-index, runs Semrush harvest,
 * matches keywords to pages, calls Gemma per candidate. Emits two artifacts
 * downstream workers consume:
 *   - edit-proposals.jsonl
 *   - new-page-proposals.jsonl
 *
 * Usage:
 *   node analyst.mjs --run-dir /mnt/shared-workspace/agentic-seo-loop/<run-id>
 *   node analyst.mjs --smoke  # ping both APIs with one keyword, don't write files
 */

import fs from 'node:fs';
import path from 'node:path';
import { SemrushClient } from './lib/semrush.mjs';
import { GemmaClient, buildEditPrompt, buildNewPagePrompt } from './lib/gemma.mjs';
import { matchKeyword, opportunityScore } from './lib/page-matcher.mjs';

const args = Object.fromEntries(process.argv.slice(2)
  .map(a => a.startsWith('--') ? a.slice(2).split('=') : [a, true])
  .map(([k, v]) => [k, v === undefined ? true : v]));

const SEMRUSH_KEY = process.env.SEMRUSH_API_KEY;
const GEMMA_KEY = process.env.GEMMA_API_KEY;
if (!SEMRUSH_KEY) { console.error('SEMRUSH_API_KEY missing'); process.exit(2); }
if (!GEMMA_KEY) { console.error('GEMMA_API_KEY missing'); process.exit(2); }

const COUNTRY = (args.country || 'us').toLowerCase();
const MIN_VOLUME = parseInt(args['min-volume'] || '10', 10);
const MAX_KD = parseInt(args['max-kd'] || '80', 10);
const MAX_EDITS = parseInt(args['max-edits'] || '20', 10);
const MAX_NEW = parseInt(args['max-new'] || '5', 10);

const semrush = new SemrushClient({
  apiKey: SEMRUSH_KEY,
  cacheDir: process.env.SEMRUSH_CACHE_DIR || '/mnt/shared-workspace/agentic-seo-loop/_cache/semrush',
});
const gemma = new GemmaClient({
  apiKey: GEMMA_KEY,
  ...(args.model ? { model: args.model } : {}),
});
console.log(`[analyst] llm model: ${gemma.model} (fallbacks: ${gemma.fallbackModels.join(', ') || 'none'})`);

if (args.smoke) {
  console.log('[analyst] smoke test — one keyword through both APIs');
  const kw = 'ai evaluation';
  const s = await semrush.fetchOne(kw, COUNTRY);
  console.log(`[analyst] semrush ok — "${kw}" ${COUNTRY} volume=${s?.volume} kd=${s?.kdPct}%`);
  const prompt = buildEditPrompt({
    keyword: kw, country: COUNTRY.toUpperCase(), volume: s?.volume, kdPct: s?.kdPct,
    intent: s?.intent, route: '/about', title: 'About | Jedi Labs Research',
    description: 'Jedi Labs is a production-AI evaluation company.', h1: 'About Jedi Labs',
  });
  const g = await gemma.generateJson(prompt);
  console.log(`[analyst] gemma ok — retried=${g.retried} title="${g.data?.proposed_title || 'NULL'}"`);
  console.log(`[analyst] stats semrush=${JSON.stringify(semrush.stats)} gemma=${JSON.stringify(gemma.stats)}`);
  process.exit(g.data ? 0 : 1);
}

const RUN_DIR = args['run-dir'];
if (!RUN_DIR) { console.error('--run-dir required (or pass --smoke)'); process.exit(2); }

const seedsPath = path.join(RUN_DIR, 'seeds.json');
const pagesPath = path.join(RUN_DIR, 'page-index.json');
const seeds = JSON.parse(fs.readFileSync(seedsPath, 'utf8'));
const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
console.log(`[analyst] loaded ${seeds.length} seeds, ${pages.length} pages`);

// Semrush harvest
const harvest = [];
for (let i = 0; i < seeds.length; i++) {
  const kw = seeds[i].keyword;
  process.stdout.write(`[analyst] [${i + 1}/${seeds.length}] semrush "${kw}" ... `);
  const data = await semrush.fetchOne(kw, COUNTRY);
  if (!data) { console.log('no-data'); continue; }
  console.log(`vol=${data.volume} kd=${data.kdPct ?? '-'}%`);
  harvest.push(data);
}
fs.writeFileSync(path.join(RUN_DIR, 'keyword-data.json'), JSON.stringify(harvest, null, 2));
console.log(`[analyst] semrush stats ${JSON.stringify(semrush.stats)} — kept ${harvest.length}/${seeds.length}`);

// Filter — drop low-value keywords early
const qualified = harvest.filter(k => k.volume >= MIN_VOLUME && (k.kdPct == null || k.kdPct <= MAX_KD));
console.log(`[analyst] qualified after vol>=${MIN_VOLUME}, kd<=${MAX_KD}: ${qualified.length}`);

// Match + Gemma. Google's free-tier per-minute rate limit is aggressive
// (varies by model, but ~15 RPM was hit during dev). Pace calls at 1
// every 5 seconds to stay well under 15 RPM.
const LLM_INTER_CALL_MS = parseInt(args['llm-pace-ms'] || '5000', 10);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const editCandidates = [];
const newCandidates = [];
const skipped = [];
for (let i = 0; i < qualified.length; i++) {
  if (i > 0) await sleep(LLM_INTER_CALL_MS);
  const k = qualified[i];
  const match = matchKeyword(k.keyword, pages);
  if (match.verdict === 'skip') { skipped.push({ kw: k.keyword, ...match }); continue; }

  if (match.verdict === 'edit') {
    const p = match.page;
    const prompt = buildEditPrompt({
      keyword: k.keyword, country: COUNTRY.toUpperCase(), volume: k.volume, kdPct: k.kdPct,
      intent: k.intent || 'Informational', route: p.route,
      title: p.title || '', description: p.description || '', h1: p.h1 || '',
    });
    process.stdout.write(`[analyst] [${i + 1}/${qualified.length}] gemma-edit "${k.keyword}" → ${p.route} ... `);
    const { data, retried, rawText } = await gemma.generateJson(prompt);
    if (!data) { console.log(`drop (invalid-json${retried ? '-after-retry' : ''})`); continue; }
    const conf = typeof data.confidence === 'number' ? data.confidence : 0.5;
    console.log(`conf=${conf} title="${(data.proposed_title || '').slice(0, 50)}..."`);
    editCandidates.push({
      kind: 'edit',
      route: p.route,
      source_file: p.filepath,
      target_keyword: k.keyword,
      keyword_stats: {
        volume_us: k.volume, kd_pct: k.kdPct, intent: k.intent,
        cpc: k.cpc, competitive_density_score: k.competitiveDensityScore,
      },
      current_title: p.title,
      current_desc: p.description,
      current_h1: p.h1,
      proposed_title: data.proposed_title,
      proposed_desc: data.proposed_desc,
      proposed_h1: data.proposed_h1,
      rationale: data.rationale,
      confidence: conf,
      match_score: match.score,
      opportunity: opportunityScore({ volume: k.volume, kdPct: k.kdPct, confidence: conf }),
      _llm_retried: retried,
    });
  } else if (match.verdict === 'new') {
    const prompt = buildNewPagePrompt({
      keyword: k.keyword, country: COUNTRY.toUpperCase(), volume: k.volume, kdPct: k.kdPct,
      intent: k.intent || 'Informational',
    });
    process.stdout.write(`[analyst] [${i + 1}/${qualified.length}] gemma-new "${k.keyword}" ... `);
    const { data, retried } = await gemma.generateJson(prompt);
    if (!data) { console.log(`drop (invalid-json${retried ? '-after-retry' : ''})`); continue; }
    const conf = typeof data.confidence === 'number' ? data.confidence : 0.5;
    console.log(`conf=${conf} route=${data.proposed_route}`);
    newCandidates.push({
      kind: 'new',
      target_keyword: k.keyword,
      keyword_stats: {
        volume_us: k.volume, kd_pct: k.kdPct, intent: k.intent,
        cpc: k.cpc, competitive_density_score: k.competitiveDensityScore,
      },
      proposed_route: data.proposed_route,
      proposed_title: data.proposed_title,
      proposed_h1: data.proposed_h1,
      proposed_outline: data.proposed_outline,
      proposed_json_ld_type: data.proposed_json_ld_type,
      rationale: data.rationale,
      confidence: conf,
      opportunity: opportunityScore({ volume: k.volume, kdPct: k.kdPct, confidence: conf }),
      _llm_retried: retried,
    });
  }
}

// Rank + cap
const CONF_FLOOR = 0.5;
const edits = editCandidates
  .filter(c => c.confidence >= CONF_FLOOR)
  .sort((a, b) => b.opportunity - a.opportunity)
  .slice(0, MAX_EDITS);
const news = newCandidates
  .filter(c => c.confidence >= CONF_FLOOR)
  .sort((a, b) => b.opportunity - a.opportunity)
  .slice(0, MAX_NEW);

// One proposal per route for edits — if the same route wins on two keywords,
// keep the higher-opportunity one only.
const bestPerRoute = new Map();
for (const e of edits) {
  const existing = bestPerRoute.get(e.route);
  if (!existing || e.opportunity > existing.opportunity) bestPerRoute.set(e.route, e);
}
const dedupedEdits = [...bestPerRoute.values()];

const editOut = path.join(RUN_DIR, 'edit-proposals.jsonl');
const newOut = path.join(RUN_DIR, 'new-page-proposals.jsonl');
fs.writeFileSync(editOut, dedupedEdits.map(e => JSON.stringify(e)).join('\n') + (dedupedEdits.length ? '\n' : ''));
fs.writeFileSync(newOut, news.map(n => JSON.stringify(n)).join('\n') + (news.length ? '\n' : ''));

console.log(`[analyst] wrote ${dedupedEdits.length} edits → ${editOut}`);
console.log(`[analyst] wrote ${news.length} new-page proposals → ${newOut}`);
console.log(`[analyst] skipped ${skipped.length} (ambiguous match) / dropped ${editCandidates.length - dedupedEdits.length + newCandidates.length - news.length} (rank+conf)`);
console.log(`[analyst] final stats semrush=${JSON.stringify(semrush.stats)} gemma=${JSON.stringify(gemma.stats)}`);
