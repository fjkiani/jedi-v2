import express from 'express';
import { gitStatus, gitBranches } from '../lib/git.mjs';

const REPO = process.env.SEO_AGENT_REPO || '/workspace/jedi-v2';

export function makeRouter() {
  const r = express.Router();

  r.get('/status', (req, res) => {
    res.json({ ok: true, repo: REPO, ...gitStatus(REPO) });
  });

  r.get('/branches', (req, res) => {
    res.json({ ok: true, repo: REPO, ...gitBranches(REPO) });
  });

  return r;
}
