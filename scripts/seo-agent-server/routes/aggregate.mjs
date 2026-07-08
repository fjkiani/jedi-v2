// Aggregate endpoints — expose cross-run views of the SEO loop's memory.
//
// /api/aggregate/keywords  — merged Semrush harvest across all runs, deduped
//                            by keyword, with last-seen stats + which run/s
//                            produced them.
// /api/aggregate/page-index — merged crawler view of the site: every route
//                            the loop knows about, annotated with CMS-owned
//                            status derived from the cms-injector route map.

import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { readJsonSafe, listRunDirs } from '../lib/util.mjs';

const RUNS_DIR = process.env.SEO_AGENT_RUNS_DIR || '/mnt/shared-workspace/agentic-seo-loop';

// Kept in sync with cms-injector.mjs ROUTE_MODELS.
const CMS_PREFIXES = [
  { prefix: '/blog/post/', model: 'Post' },
  { prefix: '/technology/', model: 'Technology' },
  { prefix: '/use-cases/', model: 'UseCase' },
  { prefix: '/case-studies/', model: 'CaseStudy' },
  { prefix: '/industries/', model: 'Industry' },
];

function detectCmsModel(route) {
  for (const m of CMS_PREFIXES) if (route.startsWith(m.prefix)) return m.model;
  return null;
}

export function makeRouter() {
  const r = express.Router();

  r.get('/keywords', (req, res) => {
    // Aggregate keyword-data.json across all runs.
    const runs = listRunDirs(RUNS_DIR);
    const byKeyword = new Map();
    for (const run of runs) {
      const p = path.join(run.path, 'keyword-data.json');
      const arr = readJsonSafe(p);
      if (!Array.isArray(arr)) continue;
      for (const k of arr) {
        const key = k.keyword;
        if (!key) continue;
        const cur = byKeyword.get(key) || { keyword: key, seen_in_runs: [] };
        // Keep the most recent stats (later runs override earlier)
        cur.country = k.country || cur.country;
        cur.volume = k.volume ?? cur.volume;
        cur.kdPct = k.kdPct ?? cur.kdPct;
        cur.kdLabel = k.kdLabel || cur.kdLabel;
        cur.cpc = k.cpc || cur.cpc;
        cur.intent = k.intent || cur.intent;
        cur.competitiveDensity = k.competitiveDensity || cur.competitiveDensity;
        cur.competitiveDensityScore = k.competitiveDensityScore ?? cur.competitiveDensityScore;
        cur.monetization = k.monetization ?? cur.monetization;
        cur.lastUpdate = k.lastUpdate || cur.lastUpdate;
        cur.lastSeenRunId = run.run_id;
        cur.seen_in_runs = [...new Set([...cur.seen_in_runs, run.run_id])];
        // Opportunity score — same formula as analyst uses.
        // volume * (1 - kd/100) → higher = easier + higher volume
        cur.opportunity = (cur.volume || 0) * Math.max(0, 1 - ((cur.kdPct || 100) / 100));
        byKeyword.set(key, cur);
      }
    }
    const list = [...byKeyword.values()].sort((a, b) => b.opportunity - a.opportunity);
    // Summary stats
    const total = list.length;
    const withVolume = list.filter((k) => (k.volume || 0) > 0);
    const summary = {
      total,
      unique_countries: [...new Set(list.map((k) => k.country).filter(Boolean))],
      volume_gt_0: withVolume.length,
      top_by_opportunity: list.slice(0, 10).map((k) => ({
        keyword: k.keyword, volume: k.volume, kdPct: k.kdPct, opportunity: k.opportunity,
      })),
      avg_kd: total ? Math.round(list.reduce((s, k) => s + (k.kdPct || 0), 0) / total) : 0,
      total_volume: list.reduce((s, k) => s + (k.volume || 0), 0),
    };
    res.json({ ok: true, summary, keywords: list });
  });

  r.get('/page-index', (req, res) => {
    // Return page-index from the most recent completed run (has the freshest
    // crawl). Also annotate each with cms_owned status.
    const runs = listRunDirs(RUNS_DIR);
    let idx = null; let sourceRun = null;
    for (const run of runs) {
      const p = path.join(run.path, 'page-index.json');
      const arr = readJsonSafe(p);
      if (Array.isArray(arr) && arr.length) { idx = arr; sourceRun = run.run_id; break; }
    }
    if (!idx) return res.status(404).json({ ok: false, error: 'no page-index.json found in any run' });

    const annotated = idx.map((p) => {
      const cmsModel = detectCmsModel(p.route);
      const titleLen = (p.title || '').length;
      const descLen = (p.description || '').length;
      // Flags for at-a-glance triage
      const flags = [];
      if (titleLen === 0) flags.push('no_title');
      else if (titleLen < 15) flags.push('short_title');
      else if (titleLen > 65) flags.push('long_title');
      if (descLen === 0) flags.push('no_desc');
      else if (descLen < 50) flags.push('short_desc');
      else if (descLen > 160) flags.push('long_desc');
      if (!p.h1) flags.push('no_h1');
      return {
        ...p,
        title_length: titleLen,
        description_length: descLen,
        cms_owned: !!cmsModel,
        cms_model: cmsModel,
        flags,
      };
    });
    const cmsCount = annotated.filter((p) => p.cms_owned).length;
    res.json({
      ok: true,
      source_run: sourceRun,
      summary: {
        total: annotated.length,
        cms_owned: cmsCount,
        static_owned: annotated.length - cmsCount,
        flagged: annotated.filter((p) => p.flags.length > 0).length,
        by_cms_model: CMS_PREFIXES.reduce((acc, m) => {
          acc[m.model] = annotated.filter((p) => p.cms_model === m.model).length;
          return acc;
        }, {}),
      },
      pages: annotated,
    });
  });

  return r;
}
