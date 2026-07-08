// Individual worker endpoints — run a single worker on demand against an existing run-dir.
// Useful for demonstrating each capability in isolation without the full orchestrator flow.

import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { startProcess, getRunning, isActive, killRun } from '../lib/spawn-stream.mjs';

const REPO = process.env.SEO_AGENT_REPO || '/workspace/jedi-v2';
const RUNS_DIR = process.env.SEO_AGENT_RUNS_DIR || '/mnt/shared-workspace/agentic-seo-loop';
const SKILL_ROOT = path.join(REPO, 'scripts/agentic-seo-loop/scripts');

const WORKERS = {
  analyst: 'analyst.mjs',
  'perf-fixer': 'perf-fixer.mjs',
  'content-injector': 'content-injector.mjs',
  'page-scaffolder': 'page-scaffolder.mjs',
  'cms-injector': 'cms-injector.mjs',
};

export function makeRouter() {
  const r = express.Router();

  // GET /api/workers — list registered workers with running state
  r.get('/', (req, res) => {
    const out = {};
    for (const [name, script] of Object.entries(WORKERS)) {
      const scriptPath = path.join(SKILL_ROOT, script);
      const entry = getRunning(`worker:${name}`);
      out[name] = {
        script: `scripts/agentic-seo-loop/scripts/${script}`,
        exists: fs.existsSync(scriptPath),
        running: isActive(`worker:${name}`),
        last_exit_code: entry?.exitCode ?? null,
        last_started_at: entry?.startedAt || null,
        last_ended_at: entry?.endedAt || null,
      };
    }
    res.json({ workers: out });
  });

  // POST /api/workers/:name/run — spawn worker, optionally passing --run-dir
  r.post('/:name/run', (req, res) => {
    const name = req.params.name;
    if (!WORKERS[name]) return res.status(404).json({ ok: false, error: `unknown worker: ${name}` });
    const script = WORKERS[name];
    const scriptPath = path.join(SKILL_ROOT, script);
    if (!fs.existsSync(scriptPath)) {
      return res.status(500).json({ ok: false, error: `script missing: ${scriptPath}` });
    }
    const body = req.body || {};
    let runDir = body.runDir;
    // Analyst does not need runDir — it creates one. Everyone else needs one.
    if (!runDir && name !== 'analyst') {
      return res.status(400).json({ ok: false, error: 'runDir required for this worker' });
    }
    if (!runDir) {
      // Analyst-only: create a fresh runDir with timestamp
      const ts = new Date().toISOString().replace(/[-:]/g, '').slice(0, 13);
      runDir = path.join(RUNS_DIR, `smoke-${name}-${ts}`);
      fs.mkdirSync(runDir, { recursive: true });
    }

    const key = `worker:${name}`;
    if (isActive(key)) return res.status(409).json({ ok: false, error: 'already running' });

    const args = [scriptPath, `--run-dir=${runDir}`, `--repo=${REPO}`];
    if (name === 'analyst') {
      if (body.country) args.push(`--country=${body.country}`);
      if (body.maxEdits) args.push(`--max-edits=${body.maxEdits}`);
      if (body.maxNew) args.push(`--max-new=${body.maxNew}`);
      if (body.model) args.push(`--model=${body.model}`);
      if (body.smoke) args.push('--smoke');
    }
    if (name === 'cms-injector') {
      if (body.previewOnly) args.push('--preview-only');
      if (body.confirm) args.push('--confirm');
    }

    const started = startProcess(key, {
      cmd: 'node',
      args,
      cwd: REPO,
      env: {
        SEMRUSH_API_KEY: process.env.SEMRUSH_API_KEY,
        GEMMA_API_KEY: process.env.GEMMA_API_KEY,
        VITE_HYGRAPH_ENDPOINT: process.env.VITE_HYGRAPH_ENDPOINT,
        VITE_HYGRAPH_TOKEN: process.env.VITE_HYGRAPH_TOKEN,
        HYGRAPH_MANAGEMENT_ENDPOINT: process.env.HYGRAPH_MANAGEMENT_ENDPOINT,
        HYGRAPH_MANAGEMENT_TOKEN: process.env.HYGRAPH_MANAGEMENT_TOKEN,
        JEDI_V2_REPO: REPO,
      },
    });
    if (!started.ok) return res.status(409).json({ ok: false, error: started.error });
    res.json({ ok: true, key, runDir, started_at: started.entry.startedAt });
  });

  r.post('/:name/kill', (req, res) => {
    const name = req.params.name;
    const result = killRun(`worker:${name}`);
    res.status(result.ok ? 200 : 400).json(result);
  });

  return r;
}
