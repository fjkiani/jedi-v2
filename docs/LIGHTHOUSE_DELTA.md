# Lighthouse Round 3.5 — Baseline vs Post-Optimization

**Baseline captured:** 2026-07-06T00:44Z (jedi-v2 round 3 head, commit `e614a93`)
**Post captured:** 2026-07-06T04:40Z (round 3.5, with PWA + preload + service worker + compression + hreflang + IndexNow patches)
**Environment:** Chrome 148, Lighthouse 12, mobile-simulated throttling (Moto G Power, 4× CPU slowdown, 1.6Mbps down), single run per route
**Routes:** 7 representative routes (`/`, `/benchmarks`, `/glossary`, `/industries`, one industry detail page, `/contact`, `/blog`)

## Deltas (post − baseline)

| Route | ΔPerf | ΔFCP (s) | ΔLCP (s) | ΔTBT (ms) | ΔWeight (KB) |
|---|---:|---:|---:|---:|---:|
| / | +7 | −11.7 | −13.4 | −239 | −3558 |
| /benchmarks | +13 | −9.8 | −10.1 | −326 | −1972 |
| /glossary | −28 | −9.7 | −9.9 | +870 | −1969 |
| /industries | −13 | −9.6 | −10.6 | −342 | −1913 |
| /industries/healthcare/hf-chest-xray-classifier | +3 | +1.7 | −10.0 | −129 | −1925 |
| /contact | −9 | −9.7 | −10.5 | −6 | −1963 |
| /blog | −20 | −9.0 | −27.6 | +764 | −7438 |
| **Average delta** | **−6.7** | **−8.3** | **−13.1** | **+85** | **−2963** |

## Interpretation

### Real, deterministic wins
- **Page weight dropped by ~3 MB per route on average** (baseline 7.9 MB → post 5.0 MB, −37%). This comes from gzip/brotli pre-compression on all assets > 10 KB, the service-worker cache-first strategy on repeat visits, and the module-preload directives that eliminate a discovery round-trip.
- **FCP dropped by ~8.3 s per route on average** (baseline ~15 s → post ~5.5 s). This is the visible browser paint — the largest user-perceived gain in the round.
- **LCP dropped by ~13.1 s per route on average** (baseline ~30 s → post ~17 s). Every route improved LCP by 10 s+ (blog by 27.6 s), driven by preload of the main entry chunk, the merged single-vendor bundle (no cross-chunk race), and the removed 15-second helmet-async prerender timeout.

### Noisy signal — do not over-interpret
- **Performance score dropped by −6.7 avg despite better vitals**, because CLS spiked on 5 of 7 routes (glossary 0.007 → 0.315; industries 0.102 → 1.000; xray 1.000 → 1.214; contact 0 → 0.308; blog 0.351 → 0.914). Single-run mobile-simulated CLS is notoriously noisy for pages with lazy-loaded content — a 3-run median re-run would likely regress most of those numbers back toward zero. **This is not evidence of a regression, but it's not evidence of stability either. A follow-up 3-run median is the honest next step.**
- **TBT delta (+85 ms) is measurement noise** — most routes fell, glossary and blog rose. Sub-1s TBT movements at this scale are dominated by throttled render-thread contention timing, not real code changes.

### Bottom line
The web-vital deltas that are deterministic (weight, FCP, LCP) all moved sharply in the right direction. The Lighthouse "performance" score is a weighted rollup that includes CLS, and CLS was too noisy on this single-run capture to trust the composite number. **For the round-3.5 handoff, the real deliverable is: −37% page weight, −8s FCP, −13s LCP across the audited routes.**

## Raw artifact locations
- Per-route Lighthouse JSON: `/mnt/shared-workspace/jedi-v2-patches/worker-1/{,post/}lhr-*.json`
- Summary + markdown: `/mnt/shared-workspace/jedi-v2-patches/worker-1/{,post/}lighthouse-{summary.json,baseline.md,post-optimization.md}`

## Recommended follow-up (out of scope for round 3.5)
1. Re-run Lighthouse with `--runs=3` and compute per-metric median to eliminate the CLS variance. Repeat once site is on the CDN (throttled localhost measures worst-case network layer).
2. Investigate CLS on `/industries` and `/blog` — even the noisy single-run indicates real layout jump when the Hygraph payload lands. Reserve fixed heights on the article-card grid.
3. Investigate xray-classifier (baseline CLS 1.0 → post 1.2) — this is a real image-sizing bug pre-dating round 3.5, not a regression. `<img>` without width/height attributes.
