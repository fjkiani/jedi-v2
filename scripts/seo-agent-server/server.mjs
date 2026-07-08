// SEO Agent backend — Express server that fronts the agentic-seo-loop skill.
// Endpoints:
//   POST /api/orchestrator/run          — spawn full orchestrator, stream to disk + SSE
//   POST /api/orchestrator/kill         — SIGTERM the current run
//   GET  /api/orchestrator/status       — active runs + recent runs
//   GET  /api/orchestrator/stream?key=  — SSE live logs (default key: orchestrator)
//   GET  /api/orchestrator/runs         — list all past runs
//   GET  /api/orchestrator/runs/:runId  — return full artifacts for a run
//
//   GET  /api/workers                   — list workers
//   POST /api/workers/:name/run         — spawn one worker
//   POST /api/workers/:name/kill        — kill one worker
//
//   GET  /api/audit/dist                — live audit summary from current dist/
//
//   GET  /api/hygraph/config
//   GET  /api/hygraph/introspect
//   GET  /api/hygraph/posts
//   GET  /api/hygraph/technologies
//   GET  /api/hygraph/lookup?slug=...&model=Technology
//
//   GET  /api/repo/status
//   GET  /api/repo/branches
//
// Auth: verifies a Clerk session token sent as `authorization: Bearer <token>` when
// CLERK_SECRET_KEY is set. In demo mode set SEO_AGENT_AUTH=demo to accept an
// unauthenticated dashboard call.

import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import fetch from 'node-fetch';
import { verifyToken } from '@clerk/backend';
import { makeRouter as orchRouter } from './routes/orchestrator.mjs';
import { makeRouter as workersRouter } from './routes/workers.mjs';
import { makeRouter as auditRouter } from './routes/audit.mjs';
import { makeRouter as hygraphRouter } from './routes/hygraph.mjs';
import { makeRouter as repoRouter } from './routes/repo.mjs';
import { makeRouter as aggregateRouter } from './routes/aggregate.mjs';

// Load .env.local first so agent secrets survive dev-server restarts
try {
  const envPath = path.join(process.env.SEO_AGENT_REPO || '/workspace/jedi-v2', '.env.local');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
    }
  }
} catch (e) {
  console.warn('[server] .env.local load failed', e.message);
}

const PORT = Number(process.env.SEO_AGENT_PORT || 5175);
const CLERK_SECRET = process.env.CLERK_SECRET_KEY || null;
const AUTH_MODE = process.env.SEO_AGENT_AUTH || (CLERK_SECRET ? 'clerk' : 'demo');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

// Simple request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[seo-agent] ${req.method} ${req.url} → ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// Clerk auth middleware (mounted on /api/* except /api/health and /api/auth-mode).
// Uses @clerk/backend verifyToken() which:
//   • Verifies the JWT signature against Clerk's JWKS for the configured instance
//   • Validates iss, exp, nbf, iat
//   • Networkless if CLERK_JWT_KEY (PEM) is set, otherwise fetches JWKS once + caches
async function verifyClerkSession(token) {
  if (!CLERK_SECRET) return { ok: false, error: 'no CLERK_SECRET_KEY' };
  try {
    const payload = await verifyToken(token, {
      secretKey: CLERK_SECRET,
      jwtKey: process.env.CLERK_JWT_KEY || undefined,
    });
    return { ok: true, session: payload };
  } catch (e) {
    return { ok: false, error: e.message || 'verify failed' };
  }
}

app.use('/api', async (req, res, next) => {
  if (req.path === '/health' || req.path === '/auth-mode') return next();
  if (AUTH_MODE === 'demo') return next(); // demo mode: no auth
  const authz = req.headers.authorization || '';
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, error: 'missing bearer token' });
  const v = await verifyClerkSession(token);
  if (!v.ok) return res.status(401).json({ ok: false, error: v.error });
  req.session = v.session;
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    ts: new Date().toISOString(),
    auth_mode: AUTH_MODE,
    repo: process.env.SEO_AGENT_REPO,
    runs_dir: process.env.SEO_AGENT_RUNS_DIR,
    env_present: {
      semrush: !!process.env.SEMRUSH_API_KEY,
      gemma: !!process.env.GEMMA_API_KEY,
      clerk_secret: !!process.env.CLERK_SECRET_KEY,
      hygraph_cdn: !!process.env.VITE_HYGRAPH_ENDPOINT,
      hygraph_mgmt: !!process.env.HYGRAPH_MANAGEMENT_TOKEN,
    },
  });
});

app.get('/api/auth-mode', (req, res) => {
  res.json({ auth_mode: AUTH_MODE });
});

app.use('/api/orchestrator', orchRouter());
app.use('/api/workers', workersRouter());
app.use('/api/audit', auditRouter());
app.use('/api/hygraph', hygraphRouter());
app.use('/api/repo', repoRouter());
app.use('/api/aggregate', aggregateRouter());

app.use((err, req, res, next) => {
  console.error('[seo-agent] error:', err);
  res.status(500).json({ ok: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`[seo-agent] listening on http://localhost:${PORT}`);
  console.log(`[seo-agent] auth_mode=${AUTH_MODE}`);
  console.log(`[seo-agent] repo=${process.env.SEO_AGENT_REPO}`);
  console.log(`[seo-agent] runs_dir=${process.env.SEO_AGENT_RUNS_DIR}`);
});
