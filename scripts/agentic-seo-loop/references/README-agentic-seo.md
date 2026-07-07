# Deeper architecture notes

## Worker roles

| Worker | Role | Bound by | Writes |
|---|---|---|---|
| w0 orchestrator | Sequences everything | I/O + git | Branch, commit, manifest, audit summaries |
| w1 analyst | Auto-seed + Semrush harvest + Gemini proposals | LLM latency (~1s/req Semrush, ~2s/req Gemini) | `edit-proposals.jsonl`, `new-page-proposals.jsonl`, `keyword-data.json` |
| w2 perf-fixer | Deterministic CWV/perf carryovers | CPU, near-instant | `perf-fixes-applied.jsonl`, patched source files |
| w3 content-injector | Apply w1's edit proposals | CPU, seconds | `edits-applied.jsonl`, patched source files |
| w4 page-scaffolder | Create new topic pages + register routes | CPU, seconds | New `src/pages/topics/<slug>/index.jsx`, edits to App.jsx / enumerate-routes / generate-sitemap |

w2, w3, w4 patch **disjoint files** and run as parallel Node child processes on the same machine. w0 gates on all three completing before rebuild.

## Data flow

```
dist/*.html
   │
   │ (seed-extractor)
   ▼
seeds.json ─────┐
                │
                ▼
        [Semrush harvest] ──► keyword-data.json ──► [Semrush cache]
                │
                ▼
        [Page match]
              │
        ┌─────┴─────┐
        │           │
        ▼           ▼
   edit-cand   new-cand
        │           │
        │ Gemini    │ Gemini
        ▼           ▼
edit-proposals.jsonl   new-page-proposals.jsonl
        │           │
        │           │
        ▼           ▼
  [content-injector]   [page-scaffolder]
        │           │
        └─────┬─────┘
              ▼
        [prerender build]
              │
              ▼
        [audit:all]  ─── FAIL ──► abort, leave branch dirty
              │
              ▼ PASS
        git commit + push
```

`[perf-fixer]` runs in parallel with the two above; its inputs are pure
deterministic (no keyword data), it only patches known-limitations carryovers.

## Idempotency

Every write is guarded by a sentinel comment specific to the file + route:

- `/* seo:round4:content-injected:<route> */` at top of content-injected files
- `/* seo:round4:scaffold:/topics/<slug> */` at top of scaffolded files
- `/* seo:round4:route-registered:/topics/<slug> */` next to App.jsx routes
- `/* seo:round4:postdetail-h1-demote */`, `/* seo:round4:xray-img-aspect */`, `/* seo:round4:article-card-min-height */` for perf-fixer patches

Re-running the orchestrator on the same branch (via `--run-id=<existing>`) resets to base and reapplies from scratch. Re-running with a new run-id creates a new branch.

## Ranking formula

For each Gemini proposal:

```
opportunity = volume × (1 − kd/100) × confidence
```

- `volume` — US search volume from Semrush (integer)
- `kd` — Semrush KD % (0-100)
- `confidence` — Gemini's self-reported 0-1 confidence

Sort descending, cap at 20 edits + 5 new pages. Proposals below `confidence < 0.5` are dropped before ranking.

## When to expand

- **More markets** — Semrush already returns UK/CA/AU/IN alongside US. Set `--country=uk` on analyst or aggregate volumes across regions via a small post-processing step. Cache is keyed per-country so no wasted requests.
- **More seeds** — `seedsFromDist(distRoot, { maxSeeds: N })`. Downstream stays the same.
- **Different LLM** — the client accepts any Google generative-language model id on the same key. Just set `--model=<id>`.
- **Non-jedi-v2 site** — everything but the config file (`config/jedi-v2.yaml`) and the deterministic perf-fixer's hard-coded target files is site-agnostic. For another site, copy `jedi-v2.yaml` to `<site>.yaml`, update the perf-fixer heuristics, and pass `--repo=/path/to/other`.
