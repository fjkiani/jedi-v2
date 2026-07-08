import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { startProcess, subscribe, listActive, killRun, getRunning, isActive } from '../lib/spawn-stream.mjs';
import { listRunDirs, readJsonSafe, readJsonlSafe } from '../lib/util.mjs';

const REPO = process.env.SEO_AGENT_REPO || '/workspace/jedi-v2';
const RUNS_DIR = process.env.SEO_AGENT_RUNS_DIR || '/mnt/shared-workspace/agentic-seo-loop';

export function makeRouter() {
  const r = express.Router();

  // POST /api/orchestrator/run — kick a full orchestrator pass
  r.post('/run', (req, res) => {
    const body = req.body || {};
    const runsDir = path.resolve(RUNS_DIR);
    fs.mkdirSync(runsDir, { recursive: true });

    // Prevent duplicate concurrent runs
    if (isActive('orchestrator')) {
      return res.status(409).json({ ok: false, error: 'orchestrator already running' });
    }

    const scriptPath = path.join(REPO, 'scripts/agentic-seo-loop/scripts/orchestrator.mjs');
    if (!fs.existsSync(scriptPath)) {
      return res.status(500).json({ ok: false, error: `orchestrator.mjs missing at ${scriptPath}` });
    }

    const args = [scriptPath];
    if (body.dryRun) args.push('--dry-run');
    if (body.skipRebuild) args.push('--skip-rebuild');
    if (body.model) args.push(`--model=${body.model}`);
    if (body.maxEdits != null) args.push(`--max-edits=${body.maxEdits}`);
    if (body.maxNew != null) args.push(`--max-new=${body.maxNew}`);
    if (body.baseBranch) args.push(`--base-branch=${body.baseBranch}`);

    const logFile = path.join(runsDir, `_agent-server-orchestrator.log.jsonl`);
    const started = startProcess('orchestrator', {
      cmd: 'node',
      args,
      cwd: REPO,
      env: {
        SEMRUSH_API_KEY: process.env.SEMRUSH_API_KEY,
        GEMMA_API_KEY: process.env.GEMMA_API_KEY,
        JEDI_V2_REPO: REPO,
      },
      logFile,
    });
    if (!started.ok) return res.status(409).json({ ok: false, error: started.error });
    res.json({ ok: true, key: 'orchestrator', started_at: started.entry.startedAt });
  });

  // POST /api/orchestrator/kill
  r.post('/kill', (req, res) => {
    const r = killRun('orchestrator');
    res.status(r.ok ? 200 : 400).json(r);
  });

  // GET /api/orchestrator/status
  r.get('/status', (req, res) => {
    const active = listActive();
    const runs = listRunDirs(RUNS_DIR).slice(0, 20);
    res.json({ active, recent_runs: runs });
  });

  // GET /api/orchestrator/stream — SSE live logs
  r.get('/stream', (req, res) => {
    res.setHeader('content-type', 'text/event-stream');
    res.setHeader('cache-control', 'no-cache');
    res.setHeader('connection', 'keep-alive');
    res.flushHeaders?.();
    const key = req.query.key || 'orchestrator';
    const sub = subscribe(key, res);
    if (!sub.ok) {
      res.write(`data: ${JSON.stringify({ ts: new Date().toISOString(), stream: 'system', line: `[no run in progress for '${key}']` })}\n\n`);
      // Send a keepalive so client's EventSource doesn't error out
      const iv = setInterval(() => {
        try { res.write(': keepalive\n\n'); } catch { clearInterval(iv); }
      }, 15000);
      req.on('close', () => clearInterval(iv));
    }
  });

  // GET /api/runs — list previous runs
  r.get('/runs', (req, res) => {
    res.json({ runs: listRunDirs(RUNS_DIR) });
  });

  // GET /api/runs/:runId — return all artifacts for a run
  r.get('/runs/:runId', (req, res) => {
    const runId = req.params.runId;
    const runDir = path.join(RUNS_DIR, runId);
    if (!fs.existsSync(runDir)) return res.status(404).json({ ok: false, error: 'not found' });
    const manifest = readJsonSafe(path.join(runDir, 'manifest.json'));
    const auditBefore = readJsonSafe(path.join(runDir, 'audit-before.json'));
    const auditAfter = readJsonSafe(path.join(runDir, 'audit-after.json'));
    const auditDiff = readJsonSafe(path.join(runDir, 'audit-diff.json'));
    const seeds = readJsonSafe(path.join(runDir, 'seeds.json'));
    const kw = readJsonSafe(path.join(runDir, 'keyword-data.json'));
    const pageIndex = readJsonSafe(path.join(runDir, 'page-index.json'));
    const editProposals = readJsonlSafe(path.join(runDir, 'edit-proposals.jsonl'));
    const newPageProposals = readJsonlSafe(path.join(runDir, 'new-page-proposals.jsonl'));
    const editsApplied = readJsonlSafe(path.join(runDir, 'edits-applied.jsonl'));
    const editsSkipped = readJsonlSafe(path.join(runDir, 'edits-skipped.jsonl'));
    const cmsHandoff = readJsonlSafe(path.join(runDir, 'cms-proposals-not-applied.jsonl'));
    const perfApplied = readJsonlSafe(path.join(runDir, 'perf-fixes-applied.jsonl'));
    const perfSkipped = readJsonlSafe(path.join(runDir, 'perf-fixes-skipped.jsonl'));
    const pagesScaffolded = readJsonlSafe(path.join(runDir, 'pages-scaffolded.jsonl'));
    res.json({
      run_id: runId,
      manifest,
      audit_before: auditBefore,
      audit_after: auditAfter,
      audit_diff: auditDiff,
      seeds,
      keyword_data: kw,
      page_index_summary: {
        page_count: pageIndex?.length || 0,
        sample: pageIndex?.slice(0, 5) || [],
      },
      counts: {
        edit_proposals: editProposals.length,
        new_page_proposals: newPageProposals.length,
        edits_applied: editsApplied.length,
        edits_skipped: editsSkipped.length,
        cms_handoff: cmsHandoff.length,
        perf_applied: perfApplied.length,
        perf_skipped: perfSkipped.length,
        pages_scaffolded: pagesScaffolded.length,
      },
      edit_proposals: editProposals,
      new_page_proposals: newPageProposals,
      edits_applied: editsApplied,
      edits_skipped: editsSkipped,
      cms_handoff: cmsHandoff,
      perf_applied: perfApplied,
      perf_skipped: perfSkipped,
      pages_scaffolded: pagesScaffolded,
    });
  });

  return r;
}
