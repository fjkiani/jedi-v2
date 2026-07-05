# Jedi-v2 SEO Gap Register — Post-J-0 Baseline

**Generated**: 2026-07-05 after first successful prerender build (74 routes, 73 HTML files).

## Framework state (J-0 complete)

- `@prerenderer/rollup-plugin@0.3.12` + `@prerenderer/renderer-puppeteer@1.2.4` installed
- `PRERENDER=1 vite build` produces static HTML per route via Puppeteer (5s Hygraph settle time, 4 concurrent routes)
- `scripts/enumerate-routes.mjs` — shared Hygraph route resolver
- `scripts/snapshot-routes.mjs` — writes JSON snapshot vite.config.js reads synchronously
- Build time: ~2 min 10 s for 74 routes
- Full build now: 138 MB dist (was already this size — HTML additions are minor)

## Baseline audit results

| Metric | Baseline | Target |
|---|---|---|
| HTML pages prerendered | 73 | 74+ |
| Pages with route-specific title | 5 | 73 |
| Pages with GENERIC meta description | 72 | 0 |
| Pages missing og:image | 71 | 0 |
| Pages missing canonical | 70 | 0 |
| Pages with 0 H1 | 13 | 0 |
| Pages with multiple H1s | 2 | 0 |
| Generic anchor occurrences ("Learn more/Read more/Click here/Show more/Show details") | 197 | <20 |
| Sitemap URLs | 67 | 74+ |
| `llms.txt` present | ❌ | ✅ |
| `/benchmarks` page exists | ❌ | ✅ |
| `/glossary` page exists | ❌ | ✅ |
| `robots.txt` blocks `/*.html$` | ⚠️ blocks prerendered routes | fix required |

## Critical blockers (fix before shipping)

### robots.txt SEO regression
```
Disallow: /*.html$
```
This pattern **blocks the prerendered HTML files** that Puppeteer generates at `/team/index.html`, `/blog/post/*/index.html`, etc. Must remove or narrow this rule so crawlers can index the prerendered content.

### Route-specific SEO components missing
Only 5 of 73 pages currently ship route-specific `<title>`:
- Team members (dynamic Hygraph): 4 pages
- Blog posts (dynamic Hygraph): 5 pages  
- `/team` listing: 1 page

**68 pages need SEO components added**. Coverage plan:
- Blog index/posts — has `BlogSEO`, needs propagation
- Technology pages — has `TechnologySEO` + `TechnologyListingSEO`, needs wiring to routes
- Team — has `TeamSEO`/`TeamListingSEO`, needs wiring for all 4 members  
- Case studies (0-9 routes) — needs `CaseStudySEO` (create)
- Solutions (10 routes) — needs `SolutionSEO` (create)
- Industries (8 routes) — needs `IndustrySEO` (create)
- Industry solutions (10 routes) — needs `IndustrySolutionSEO` (create)
- Methodology, careers, contact, about, jedi, pricing, ai-training, deployments, infrastructure, explore, use-cases (static pages) — needs individual `<Helmet>` blocks or a `PageSEO` wrapper

## R3 workstream assignments (5-worker parallel)

### worker-0 — J-2-A: Route SEO components + build orchestration
- Create `PageSEO` reusable wrapper component
- Create `CaseStudySEO`, `SolutionSEO`, `IndustrySEO`, `IndustrySolutionSEO`, `MethodologySEO`
- Wire route-level Helmet metadata to all 68 pages currently generic
- Sole builder for full R3 verification

### worker-1 — J-2-B: /benchmarks page
- Create `src/pages/benchmarks/BenchmarksPage.jsx`
- Add route in App.jsx: `<Route path="/benchmarks" element={<BenchmarksPage />} />`
- Populate with jedi-v2's honest curves proof data (from HF space integrations)
- Include Dataset + HowTo + DataDownload JSON-LD

### worker-2 — J-2-C: /glossary, llms.txt, /api/oracle.json
- Create `src/pages/glossary/GlossaryPage.jsx` with DefinedTermSet JSON-LD
- Create `public/llms.txt` with canonical facts
- Create `public/api/oracle.json` for AI-crawler-friendly canonical facts

### worker-3 — J-2-D: Internal mesh cleanup
- Grep 197 generic anchor occurrences
- Rewrite to descriptive: "Read more" → "Read the case study", "Learn more" → context-specific
- Add `RelatedLinks` cross-references to Benchmarks/Glossary/Technology pages
- Target: 0 generic anchors, ≥15 inbound links to /benchmarks and /glossary

### worker-4 — J-2-E: OG images + sitemap + robots.txt fix
- Generate 5-7 static PNG OG templates via `sharp` in `public/og/`:
  - `og-home.png`, `og-technology.png`, `og-team.png`, `og-blog.png`, `og-case-study.png`, `og-solution.png`, `og-about.png`
- Fix `robots.txt`: remove `Disallow: /*.html$`
- Update `scripts/generate-sitemap.js` to sync with `enumerate-routes.mjs` (or replace with new script)
- Ensure sitemap includes 74+ URLs matching prerender output

## Content templates required

### /benchmarks (based on caspro's structure adapted for jedi-v2)
Real jedi-v2 proofs (from HF spaces):
- Chest X-ray classifier — n, AUROC, F1
- Coastline segmentation — IoU, pixel accuracy
- ESC-50 audio classifier — top-1, top-5
- CLIP video scenes — retrieval metrics

### /glossary (initial 20-30 terms)
Focus: AI/ML terminology, jedi-v2 methodology concepts (evaluation curves, per-class F1, deployment patterns, MLOps concepts)

### llms.txt
Canonical facts for AI crawlers:
- Company: Jedi Labs
- Mission
- 4 shipped demos with metrics
- Technology stack
- Contact
- Sitemap link

## Acceptance criteria for J-2 complete

- [ ] 5 audit scripts pass on `dist/`
- [ ] 73/73 pages have route-specific title
- [ ] 0 pages missing og:image  
- [ ] 0 pages missing canonical
- [ ] 0 pages with multi-H1
- [ ] All pages have single H1
- [ ] <20 generic anchor occurrences total
- [ ] Sitemap has 74+ URLs
- [ ] `/benchmarks` and `/glossary` render with JSON-LD
- [ ] `llms.txt` at root
- [ ] `robots.txt` no longer blocks HTML routes
