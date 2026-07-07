#!/usr/bin/env node
/**
 * w0 — orchestrator.
 *
 * End-to-end pass:
 *   1. Read config (site repo, branch base, keys) from env / config file
 *   2. Create run-id + shared workspace directory
 *   3. Cut a fresh branch `agent/round4-<UTC-timestamp>` from the base commit
 *   4. Extract seeds from dist + write page-index.json
 *   5. Kick analyst → wait for edit-proposals + new-page-proposals
 *   6. Kick perf-fixer, content-injector, page-scaffolder (deterministic parallel)
 *   7. Rebuild + audit; abort if audits regress
 *   8. Compute audit before/after diff
 *   9. Commit + push
 *
 * This is the single entry point users invoke. Individual workers can be
 * dispatched to separate machines by wrapping their step in a remote call —
 * for round 4 we run them all on the same machine but in parallel where
 * they're independent.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
// NOTE: `seedsFromDist` (uses cheerio) and `summarize` (uses cheerio) are
// imported dynamically AFTER we sync scripts into the repo, so ES-module
// resolution finds `cheerio` in the target repo's node_modules rather than
// failing at load-time from the skill's persistent path.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2)
  .map(a => a.startsWith('--') ? a.slice(2).split('=') : [a, true])
  .map(([k, v]) => [k, v === undefined ? true : v]));

// SKILL_ROOT is the persistent skill package location. REPO is the target
// repository we're editing. On each run we sync SKILL_ROOT → REPO/scripts/agentic-seo-loop/
// so the branch is self-contained (the automation code that produced the changes
// travels with the changes). Node's ES-module resolver runs relative to file
// location, so the workers need to sit inside the repo tree to see its
// node_modules (specifically `cheerio`).
const SKILL_ROOT = args['skill-root'] || path.resolve(__dirname, '..');
const REPO = args.repo || process.env.JEDI_V2_REPO || '/workspace/jedi-v2';
const BASE_BRANCH = args['base-branch'] || 'round3-jedi-seo';
const DIST_DIR = path.join(REPO, 'dist');
const CONFIG_PATH = args.config || path.join(__dirname, '..', 'config', 'jedi-v2.yaml');
const REPO_SCRIPTS_DIR = path.join(REPO, 'scripts', 'agentic-seo-loop');

if (!process.env.SEMRUSH_API_KEY) { console.error('SEMRUSH_API_KEY missing'); process.exit(2); }
if (!process.env.GEMMA_API_KEY) { console.error('GEMMA_API_KEY missing'); process.exit(2); }

const RUN_ID = args['run-id'] || `round4-${new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)}`;
const RUN_DIR = args['run-dir'] || `/mnt/shared-workspace/agentic-seo-loop/${RUN_ID}`;
fs.mkdirSync(RUN_DIR, { recursive: true });
console.log(`[orch] run-id=${RUN_ID}`);
console.log(`[orch] run-dir=${RUN_DIR}`);

const BRANCH = args.branch || `agent/${RUN_ID}`;
const DRY_RUN = !!args['dry-run'];
const SKIP_REBUILD = !!args['skip-rebuild'];
const SKIP_PUSH = !!args['skip-push'];

function sh(cmd, { cwd = REPO } = {}) {
  console.log(`[orch] $ ${cmd}`);
  return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function shTry(cmd, opts) {
  try { return { ok: true, out: sh(cmd, opts) }; }
  catch (e) { return { ok: false, err: String(e.stderr || e.message).slice(0, 500) }; }
}

// Step 1 — checkout branch. Do NOT bring uncommitted work along; we want
// a clean starting point. We also do NOT force-push in this step.
const initialStatus = sh('git status --porcelain');
if (initialStatus.trim()) {
  console.warn(`[orch] repo has uncommitted changes:\n${initialStatus}\n[orch] stashing before branch cut`);
  sh('git stash push -u -m "agentic-seo-loop precheck"');
}

const currentBranch = sh('git branch --show-current').trim();
console.log(`[orch] current branch: ${currentBranch}, cutting: ${BRANCH} from ${BASE_BRANCH}`);
const baseCommit = sh(`git rev-parse ${BASE_BRANCH}`).trim();
console.log(`[orch] base commit: ${baseCommit}`);

// If branch already exists (re-run), reset to base
if (shTry(`git rev-parse --verify ${BRANCH}`).ok) {
  console.log(`[orch] branch ${BRANCH} already exists, checking out and resetting to ${baseCommit}`);
  sh(`git checkout ${BRANCH}`);
  sh(`git reset --hard ${baseCommit}`);
} else {
  sh(`git checkout -b ${BRANCH} ${baseCommit}`);
}

// Sync skill scripts + config into the repo. This makes the branch reviewable
// on its own — the SEO edits AND the automation that produced them travel
// together — and lets the workers resolve `cheerio` via the repo's node_modules.
console.log(`[orch] syncing skill scripts from ${SKILL_ROOT} into ${REPO_SCRIPTS_DIR}`);
fs.mkdirSync(path.join(REPO_SCRIPTS_DIR, 'scripts', 'lib'), { recursive: true });
fs.mkdirSync(path.join(REPO_SCRIPTS_DIR, 'config'), { recursive: true });
fs.mkdirSync(path.join(REPO_SCRIPTS_DIR, 'references'), { recursive: true });
const copyIfExists = (src, dst) => {
  if (fs.existsSync(src)) fs.copyFileSync(src, dst);
};
// Copy top-level scripts
for (const f of ['orchestrator.mjs', 'analyst.mjs', 'perf-fixer.mjs', 'content-injector.mjs', 'page-scaffolder.mjs']) {
  copyIfExists(path.join(SKILL_ROOT, 'scripts', f), path.join(REPO_SCRIPTS_DIR, 'scripts', f));
}
// Copy shared libs
for (const f of ['semrush.mjs', 'gemma.mjs', 'seed-extractor.mjs', 'page-matcher.mjs', 'audit-diff.mjs']) {
  copyIfExists(path.join(SKILL_ROOT, 'scripts', 'lib', f), path.join(REPO_SCRIPTS_DIR, 'scripts', 'lib', f));
}
// Copy config + skill md + references (best-effort — missing files are OK)
copyIfExists(path.join(SKILL_ROOT, 'config', 'jedi-v2.yaml'), path.join(REPO_SCRIPTS_DIR, 'config', 'jedi-v2.yaml'));
copyIfExists(path.join(SKILL_ROOT, 'SKILL.md'), path.join(REPO_SCRIPTS_DIR, 'SKILL.md'));
for (const f of ['README-agentic-seo.md', 'gemma-prompt-templates.md', 'troubleshooting.md']) {
  copyIfExists(path.join(SKILL_ROOT, 'references', f), path.join(REPO_SCRIPTS_DIR, 'references', f));
}
// Rewrite worker script paths to use the in-repo copies
const REPO_SCRIPTS_ROOT = path.join(REPO_SCRIPTS_DIR, 'scripts');

// Dynamically load the seed-extractor + audit-diff from the in-repo copy so
// their `import 'cheerio'` resolves against the target repo's node_modules.
const seedExtractorMod = await import(path.join(REPO_SCRIPTS_ROOT, 'lib', 'seed-extractor.mjs'));
const auditDiffMod = await import(path.join(REPO_SCRIPTS_ROOT, 'lib', 'audit-diff.mjs'));
const { seedsFromDist } = seedExtractorMod;
const { summarize, diffSummaries } = auditDiffMod;

// Step 2 — capture pre-audit summary from current dist. If dist is stale,
// we'll rebuild after edits anyway.
if (!fs.existsSync(DIST_DIR)) {
  console.error(`[orch] dist/ missing at ${DIST_DIR} — run build first`);
  process.exit(2);
}
console.log('[orch] snapshotting pre-audit summary from dist/');
const auditBefore = summarize(DIST_DIR);
fs.writeFileSync(path.join(RUN_DIR, 'audit-before.json'), JSON.stringify(auditBefore, null, 2));
console.log(`[orch] before: routes=${auditBefore.total_routes} uniqueTitles=${auditBefore.unique_titles} titleAvg=${auditBefore.title_length.avg} multiH1=${auditBefore.multi_h1_offenders.length}`);

// Step 3 — seeds + page-index. Extract more than we plan to keep — Semrush
// filters aggressively (many long-tail terms return "no-data"), so
// oversampling by 2x lets the loop end up with a workable candidate list.
const MAX_SEEDS = parseInt(args['max-seeds'] || '60', 10);
console.log(`[orch] extracting up to ${MAX_SEEDS} seeds from dist`);
const { pages, seeds } = seedsFromDist(DIST_DIR, { maxSeeds: MAX_SEEDS });
fs.writeFileSync(path.join(RUN_DIR, 'seeds.json'), JSON.stringify(seeds, null, 2));
fs.writeFileSync(path.join(RUN_DIR, 'page-index.json'), JSON.stringify(pages, null, 2));
console.log(`[orch] wrote ${pages.length} pages, ${seeds.length} seeds`);

// Step 4 — manifest
const manifest = {
  run_id: RUN_ID,
  started_at: new Date().toISOString(),
  base_branch: BASE_BRANCH,
  base_commit: baseCommit,
  agent_branch: BRANCH,
  repo: REPO,
  dry_run: DRY_RUN,
  worker_count: 5,
  config_path: CONFIG_PATH,
  seed_count: seeds.length,
  page_count: pages.length,
};
fs.writeFileSync(path.join(RUN_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

if (DRY_RUN) {
  console.log('[orch] dry-run: stopping before worker dispatch');
  process.exit(0);
}

// Step 5 — analyst (must run before injector/scaffolder since they consume its output)
console.log('[orch] dispatching analyst');
const analyst = spawnSync('node', [
  path.join(REPO_SCRIPTS_ROOT, 'analyst.mjs'),
  `--run-dir=${RUN_DIR}`,
  `--country=us`,
  ...(args['max-edits'] ? [`--max-edits=${args['max-edits']}`] : []),
  ...(args['max-new'] ? [`--max-new=${args['max-new']}`] : []),
  ...(args.model ? [`--model=${args.model}`] : []),
], { stdio: 'inherit', env: { ...process.env }, cwd: REPO });
if (analyst.status !== 0) {
  console.error(`[orch] analyst failed exit=${analyst.status}`);
  process.exit(3);
}

// Step 6 — deterministic workers (parallel-safe: they patch different files)
// Use `spawn` (async) rather than `spawnSync` so they truly run concurrently.
console.log('[orch] dispatching perf-fixer, content-injector, page-scaffolder in parallel');
async function runWorker(name, script) {
  const { spawn } = await import('node:child_process');
  return new Promise((resolve) => {
    const p = spawn('node', [path.join(REPO_SCRIPTS_ROOT, script), `--run-dir=${RUN_DIR}`, `--repo=${REPO}`], {
      stdio: 'inherit', env: { ...process.env }, cwd: REPO,
    });
    p.on('close', (status) => resolve({ name, status }));
    p.on('error', (err) => resolve({ name, status: -1, err: String(err.message) }));
  });
}
const workerResults = await Promise.all([
  runWorker('perf-fixer', 'perf-fixer.mjs'),
  runWorker('content-injector', 'content-injector.mjs'),
  runWorker('page-scaffolder', 'page-scaffolder.mjs'),
]);
for (const r of workerResults) {
  console.log(`[orch] worker ${r.name} exit=${r.status}`);
  if (r.status !== 0) console.warn(`[orch] worker ${r.name} non-zero exit — continuing (partial changes acceptable)`);
}

// Step 7 — rebuild + audit
if (SKIP_REBUILD) {
  console.log('[orch] --skip-rebuild set, skipping rebuild + audit');
} else {
  console.log('[orch] running npm run build:prerender');
  const build = shTry('npm run build:prerender');
  if (!build.ok) {
    console.error(`[orch] build failed:\n${build.err}`);
    console.error('[orch] leaving branch dirty for debugging — no push');
    process.exit(4);
  }
  console.log('[orch] running npm run audit:all');
  const audit = shTry('npm run audit:all');
  if (!audit.ok) {
    console.error(`[orch] audit failed:\n${audit.err}`);
    console.error('[orch] leaving branch dirty for debugging — no push');
    process.exit(5);
  }
  console.log('[orch] audits PASSED');
}

// Step 8 — audit-after summary
if (!SKIP_REBUILD) {
  const auditAfter = summarize(DIST_DIR);
  fs.writeFileSync(path.join(RUN_DIR, 'audit-after.json'), JSON.stringify(auditAfter, null, 2));
  const diff = diffSummaries(auditBefore, auditAfter);
  fs.writeFileSync(path.join(RUN_DIR, 'audit-diff.json'), JSON.stringify(diff, null, 2));
  console.log(`[orch] after: routes=${auditAfter.total_routes} uniqueTitles=${auditAfter.unique_titles} titleAvg=${auditAfter.title_length.avg} multiH1=${auditAfter.multi_h1_offenders.length}`);
  console.log(`[orch] delta: routes=${diff.total_routes.delta} uniqueTitles=${diff.unique_titles.delta} multiH1=${diff.multi_h1_offenders.before_count} → ${diff.multi_h1_offenders.after_count}`);
}

// Step 9 — commit + push
console.log('[orch] preparing commit');
sh('git add -A');
const changes = sh('git status --porcelain').trim();
if (!changes) {
  console.log('[orch] no changes to commit — pass produced zero writes');
} else {
  // Read actual worker outputs so the commit message tells the truth
  const countLines = (f) => {
    try {
      const p = path.join(RUN_DIR, f);
      if (!fs.existsSync(p) || fs.statSync(p).size === 0) return 0;
      return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).length;
    } catch { return 0; }
  };
  const editsApplied = countLines('edits-applied.jsonl');
  const cmsHandoff = countLines('cms-proposals-not-applied.jsonl');
  const perfFixes = countLines('perf-fixes-applied.jsonl');
  const pagesScaffolded = countLines('pages-scaffolded.jsonl');
  // Multi-h1 offender delta — the only structural audit gate this loop enforces
  let auditLine = '';
  try {
    const dp = path.join(RUN_DIR, 'audit-diff.json');
    if (fs.existsSync(dp)) {
      const d = JSON.parse(fs.readFileSync(dp, 'utf8'));
      auditLine = `- Multi-h1 offenders: ${d.multi_h1_offenders.before_count} -> ${d.multi_h1_offenders.after_count}`;
    }
  } catch { /* ignore */ }
  const commitMsg = `agentic-seo-loop pass ${RUN_ID}

- Seeded ${seeds.length} keywords from dist
- Edits applied: ${editsApplied}
- CMS-only proposals (hand-off): ${cmsHandoff}
- Perf/CWV fixes applied: ${perfFixes}
- New topic pages scaffolded: ${pagesScaffolded}
${auditLine}
- Rebuild + audits PASSED

run-dir: ${RUN_DIR}
base: ${BASE_BRANCH}@${baseCommit.slice(0, 7)}
`;
  const msgFile = path.join(RUN_DIR, 'commit-message.txt');
  fs.writeFileSync(msgFile, commitMsg);
  sh(`git commit -F ${msgFile}`);
  const commitSha = sh('git rev-parse HEAD').trim();
  console.log(`[orch] committed ${commitSha}`);
  manifest.commit_sha = commitSha;

  if (SKIP_PUSH) {
    console.log('[orch] --skip-push set, not pushing');
  } else {
    const pushRes = shTry(`git push -u origin ${BRANCH}`);
    if (pushRes.ok) {
      console.log(`[orch] pushed ${BRANCH} to origin`);
      manifest.pushed = true;
    } else {
      console.warn(`[orch] push failed:\n${pushRes.err}\n[orch] check credentials — branch is committed locally`);
      manifest.pushed = false;
      manifest.push_error = pushRes.err;
    }
  }
}

manifest.ended_at = new Date().toISOString();
fs.writeFileSync(path.join(RUN_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

// Emit a human summary
const summary = [
  `# agentic-seo-loop run summary — ${RUN_ID}`,
  '',
  `- base: \`${BASE_BRANCH}\` @ \`${baseCommit.slice(0, 7)}\``,
  `- branch: \`${BRANCH}\``,
  `- commit: \`${manifest.commit_sha ? manifest.commit_sha.slice(0, 7) : 'n/a'}\``,
  `- pushed: ${manifest.pushed ? 'yes' : 'no'}`,
  '',
  '## Deliverables',
  `- seeds: ${seeds.length}`,
  `- keyword data cached under ${path.join(RUN_DIR, 'keyword-data.json')}`,
  `- edit proposals: ${fs.existsSync(path.join(RUN_DIR, 'edit-proposals.jsonl')) ? fs.readFileSync(path.join(RUN_DIR, 'edit-proposals.jsonl'), 'utf8').trim().split('\n').filter(Boolean).length : 0}`,
  `- new-page proposals: ${fs.existsSync(path.join(RUN_DIR, 'new-page-proposals.jsonl')) ? fs.readFileSync(path.join(RUN_DIR, 'new-page-proposals.jsonl'), 'utf8').trim().split('\n').filter(Boolean).length : 0}`,
  '',
  '## Files at run-dir',
  ...fs.readdirSync(RUN_DIR).sort().map(f => `- ${f}`),
].join('\n');
fs.writeFileSync(path.join(RUN_DIR, 'run-summary.md'), summary);
console.log(summary);
