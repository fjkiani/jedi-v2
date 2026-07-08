// GET /api/audit/dist — live audit summary of the current /dist tree
// Reuses the audit-diff library from the skill

import express from 'express';
import path from 'node:path';
import fs from 'node:fs';

const REPO = process.env.SEO_AGENT_REPO || '/workspace/jedi-v2';

export function makeRouter() {
  const r = express.Router();

  r.get('/dist', async (req, res) => {
    try {
      const distDir = path.join(REPO, 'dist');
      if (!fs.existsSync(distDir)) {
        return res.json({ ok: false, error: 'dist/ missing — run npm run build:prerender' });
      }
      const { summarize } = await import(path.join(REPO, 'scripts/agentic-seo-loop/scripts/lib/audit-diff.mjs'));
      const summary = summarize(distDir);
      // Snapshot the multi-h1 offenders explicitly + top routes by title length
      const routeStats = summary.routes || [];
      const topLongTitles = routeStats
        .filter((r) => r.title)
        .sort((a, b) => (b.title.length - a.title.length))
        .slice(0, 10)
        .map((r) => ({ route: r.route, title: r.title, len: r.title.length }));
      res.json({
        ok: true,
        summary: {
          total_routes: summary.total_routes,
          unique_titles: summary.unique_titles,
          title_length: summary.title_length,
          description_length: summary.description_length,
          has_canonical: summary.has_canonical,
          has_og_image: summary.has_og_image,
          has_json_ld_routes: summary.has_json_ld_routes,
          multi_h1_offenders: summary.multi_h1_offenders,
        },
        top_long_titles: topLongTitles,
      });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  return r;
}
