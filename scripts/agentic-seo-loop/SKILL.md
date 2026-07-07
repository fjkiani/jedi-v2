---
name: agentic-seo-loop
description: Automated round-4 SEO iteration loop for Vite/React sites (targets jedi-v2 by default). Auto-seeds keywords from prerendered dist, harvests Semrush volume+KD, calls a Google generative-language model per candidate for title/description/H1 proposals, applies changes on a branch, rebuilds + audits, and pushes for PR review. Idempotent per-run; every write is guarded by a sentinel comment.
---

# agentic-seo-loop

Automated SEO iteration loop for a Vite/React site that already has a prerender + audit suite (see the `vite-seo-prerender` skill for the underlying rendering pipeline this loop consumes and produces changes for).

## When to use

- After a manual SEO baseline is in place (unique titles, descriptions, canonicals, JSON-LD, prerender + audit scripts).
- When you want to run one iteration of: measure → analyze → inject → re-audit, keyed off actual search-volume + keyword-difficulty data rather than intuition.
- When you want the loop's proposals landed on a **staged branch + PR**, not force-merged.

## What it does

1. **Auto-seed** ~30 candidate keywords from the site's existing `dist/**/index.html` titles/H1s/JSON-LD names. No new topic spaces without a manual override.
2. **Semrush harvest** (US market by default) via the Keyword Magic Tool RapidAPI endpoint. Cached to disk keyed on SHA1(kw+country) so re-runs cost nothing.
3. **Page match** each keyword against the site's route inventory via title/h1/slug token overlap.
4. **LLM proposal** per candidate — Google Gemini 2.5 Flash by default (the Gemma 4 26B A4B IT endpoint was intermittently 500ing during initial rollout; the client falls back automatically and can be pointed at any model on your key via `--model`).
5. **Rank** by `volume × (1 − kd/100) × confidence` and cap at 20 edits + 5 new topic pages per pass.
6. **Apply changes in parallel:**
   - `perf-fixer.mjs` — deterministic CWV/perf carryovers (no LLM)
   - `content-injector.mjs` — patch `<SEO>` component attrs + `<h1>` on non-CMS routes
   - `page-scaffolder.mjs` — new `/topics/<slug>/index.jsx` pages + App.jsx / sitemap / enumerator registration
7. **Rebuild** the site (`npm run build:prerender`) and **audit** (`npm run audit:all`). Abort if audits regress.
8. **Commit + push** to `agent/round4-<UTC-timestamp>`. Merge is manual.

## Requirements

- Repo with a `round3-jedi-seo` (or configured) base branch containing:
  - `npm run build:prerender` producing `dist/`
  - `npm run audit:all` returning non-zero on regressions
  - A `<SEO>` component using string-literal `title` / `description` attributes on non-CMS pages
- Node 20+ in the environment
- `cheerio` installed in the target repo's `node_modules` (auto-installed on first run if missing)
- Env vars:
  - `SEMRUSH_API_KEY` — RapidAPI key for the Keyword Magic Tool
  - `GEMMA_API_KEY` — Google Generative Language API key (AQ.* or AIza)

## Usage

```bash
export SEMRUSH_API_KEY='...'
export GEMMA_API_KEY='...'
export JEDI_V2_REPO=/path/to/your/repo

# Full pass — the default entry point
node /path/to/skill/scripts/orchestrator.mjs

# Common overrides
node /path/to/skill/scripts/orchestrator.mjs \
  --repo=/path/to/repo \
  --base-branch=main \
  --max-edits=15 \
  --max-new=3 \
  --model=gemini-2.5-flash

# Dry run — extract seeds + snapshot audit, no branch mutation
node /path/to/skill/scripts/orchestrator.mjs --dry-run

# Smoke test — one Semrush call + one Gemini call, no writes
node /path/to/skill/scripts/analyst.mjs --smoke
```

## Artifacts

Each run creates a directory under `/mnt/shared-workspace/agentic-seo-loop/<run-id>/`:

| File | What |
|---|---|
| `manifest.json` | Run metadata: branch, base commit, worker count, timestamps, final commit sha |
| `seeds.json` | Deduped keyword candidates extracted from dist |
| `page-index.json` | Per-route title / h1 / description / JSON-LD from dist |
| `keyword-data.json` | Normalized Semrush payload for every seed |
| `edit-proposals.jsonl` | Gemini proposals for existing pages |
| `new-page-proposals.jsonl` | Gemini proposals for new /topics/<slug> pages |
| `perf-fixes-applied.jsonl` | What w2 patched |
| `edits-applied.jsonl` | What w3 patched |
| `pages-scaffolded.jsonl` | What w4 created |
| `cms-proposals-not-applied.jsonl` | Blog-post edits — CMS-owned, hand off to whoever manages Hygraph |
| `audit-before.json` / `audit-after.json` | Pre/post prerender-scan summaries |
| `audit-diff.json` | Structured before/after delta |
| `run-summary.md` | Human-readable summary |

## Rollback

```bash
# The base branch is untouched. To walk back:
git checkout <base-branch>
git branch -D agent/round4-<timestamp>       # local only
git push origin --delete agent/round4-<timestamp>  # if you already pushed
```

## Known limitations

- **CMS-owned routes** — Most of jedi-v2 is Hygraph-driven. Only ~18 top-level index pages have real `.jsx` files editable by the injector (see `EDITABLE_ROUTES` in `scripts/content-injector.mjs` for the canonical list). Everything under `/blog/*`, `/technology/*`, `/solutions/*`, `/use-cases/*`, `/methodology/*`, `/industries/*`, `/team/*`, `/careers/*`, `/case-studies/*`, `/ai-training/*` is rendered by a shared component and shipped to `cms-proposals-not-applied.jsonl` for hand-off to CMS operators.
- **String-literal attributes only** — the content injector rewrites `<SEO title="..." description="...">` when both are string literals. Dynamic JSX values (`title={foo}`) are left alone.
- **US-only** — Semrush is queried for the US market. Global/UK data is cached in the raw payload for future rounds if you want to expand.
- **Gemini free-tier daily quota is 20 req/day/model.** After ~40 seeds, the loop will exhaust the primary model's quota; the client falls through `gemini-2.5-flash → gemini-2.5-flash-lite → gemini-2.0-flash → gemma-4-31b-it`. Once all fallbacks are drained, proposals get dropped with `invalid-json`. Reset happens at midnight PT. Analyst paces at 5s between calls (`--llm-pace-ms=N` to override).
- **Gemma models don't reliably return clean JSON.** They tend to echo reasoning. Kept in fallback chain but expect low quality vs Gemini.
- **404 prerenders** — Old stale prerenders that render as 404 pages are filtered from seeds by `seedsFromDist` (their titles start with "404"). If you see junk keywords, verify no new 404 pattern is bypassing the filter.
- **Perf-fixer scope** — Only fixes for files that exist in the current codebase. Speculative fixes from earlier drafts were removed. Currently ships one fix: `postdetail-h1-demote`. Add new fixes to `scripts/perf-fixer.mjs` following the sentinel-guarded idempotent pattern.
- **Confidence floor** — Proposals with `confidence < 0.5` are dropped by the orchestrator before writes.

## References

- `references/README-agentic-seo.md` — deeper architecture notes and worker roles
- `references/gemma-prompt-templates.md` — exact prompts used, safe to edit for prompt-tuning
- `references/troubleshooting.md` — what the common failure modes look like and how to recover
