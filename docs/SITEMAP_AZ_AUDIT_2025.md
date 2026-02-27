# Sitemap A–Z Audit & Indexed Pages Checklist

**Date:** February 3, 2025  
**Scope:** Every URL in `public/sitemap.xml` – route mapping, SEO, and A+ content quality.

---

## 1. Sitemap Update Behavior

| Question | Answer |
|----------|--------|
| **Does sitemap auto-update?** | **Yes.** `npm run generate-sitemap` is now part of the `build` script. Each deploy regenerates `public/sitemap.xml`. |
| **When does it run?** | Before `vite build` – so every `npm run build` or production deploy. |
| **What generates it?** | `scripts/generate-sitemap.js` – fetches routes from Hygraph (posts, industries, use cases) and merges with static routes. |

---

## 2. URL Format Fixes Applied

| Issue | Fix |
|-------|-----|
| **Industry solution URLs** | Sitemap used `/industries/:industry/solutions/:slug` but routes use `/industries/:industry/:slug`. Sitemap generator updated to match routes. |
| **Collaboration.jsx hardcoded URL** | Changed `/industries/healthcare/solutions/crispro-oncology-copilot` → `/industries/healthcare/crispro-oncology-copilot` |

---

## 3. Route → Sitemap URL Mapping (A–Z)

All sitemap URLs map to valid routes. No 404s expected.

### Static Routes

| Sitemap URL | Route | Component | SEO | Status |
|-------------|-------|-----------|-----|--------|
| `/` | `/` | Hero, TransformationMethodology, etc. | RootSEO + default | ✅ A+ |
| `/jedi` | `/jedi` | JediPageEnhanced | Helmet (title/desc) | ✅ A+ |
| `/solutions` | `/solutions` | SolutionsPage | PAGE_META.solutions | ✅ A+ |
| `/industries` | `/industries/*` (index) | IndustriesOverview | PAGE_META.industries (added) | ✅ A+ |
| `/use-cases` | `/use-cases` | UseCasesPage | PAGE_META.useCases | ✅ A+ |
| `/case-studies` | `/case-studies` | CaseStudiesPage | PAGE_META.caseStudies | ✅ A+ |
| `/infrastructure` | `/infrastructure` | InfrastructurePage | PAGE_META.infrastructure (added) | ✅ A+ |
| `/team` | `/team` | TeamListing | TeamListingSEO | ✅ A+ |
| `/careers` | `/careers` | CareersPage | SEO | ✅ A+ |
| `/blog` | `/blog` | Blog | BlogSEO | ✅ A+ |
| `/technology` | `/technology` | TechnologyStack | PAGE_META.technology (added) | ✅ A+ |
| `/about` | `/about` | AboutUs | Helmet | ✅ A+ |
| `/contact` | `/contact` | ContactUs | Helmet | ✅ A+ |

### Dynamic Routes – Blog

| Sitemap URL | Route | Component | SEO | Status |
|-------------|-------|-----------|-----|--------|
| `/blog/post/ai-agents` | `/blog/post/:slug` | BlogPost | BlogSEO(post) | ✅ A+ |
| `/blog/post/graph-rag` | `/blog/post/:slug` | BlogPost | BlogSEO(post) | ✅ A+ |
| `/blog/post/knowledge-graph` | `/blog/post/:slug` | BlogPost | BlogSEO(post) | ✅ A+ |
| `/blog/post/aws-railway` | `/blog/post/:slug` | BlogPost | BlogSEO(post) | ✅ A+ |
| `/blog/post/supabase-etl` | `/blog/post/:slug` | BlogPost | BlogSEO(post) | ✅ A+ |
| `/blog/post/ora-hackathon` | `/blog/post/:slug` | BlogPost | BlogSEO(post) | ✅ A+ |
| `/blog/post/evo-2` | `/blog/post/:slug` | BlogPost | BlogSEO(post) | ✅ A+ |
| `/blog/post/jedilabs` | `/blog/post/:slug` | BlogPost | BlogSEO(post) | ✅ A+ |
| `/blog/post/identity-missing-pillar-agentic-ai` | `/blog/post/:slug` | BlogPost | BlogSEO(post) | ✅ A+ |

**Note:** Legacy `/blog/:slug` (no `post/`) redirects to `/blog/post/:slug` via `BlogLegacyRedirect` and `vercel.json` 301s.

### Dynamic Routes – Industries

| Sitemap URL | Route | Component | SEO | Status |
|-------------|-------|-----------|-----|--------|
| `/industries/healthcare` | `:industryId` | IndustryPage | Dynamic SEO | ✅ A+ |
| `/industries/financial-services` | `:industryId` | IndustryPage | Dynamic SEO | ✅ A+ |
| `/industries/technology` | `:industryId` | IndustryPage | Dynamic SEO | ✅ A+ |
| `/industries/education` | `:industryId` | IndustryPage | Dynamic SEO | ✅ A+ |
| `/industries/telecommunications` | `:industryId` | IndustryPage | Dynamic SEO | ✅ A+ |
| `/industries/transportation-logistics` | `:industryId` | IndustryPage | Dynamic SEO | ✅ A+ |
| `/industries/government-public-sector` | `:industryId` | IndustryPage | Dynamic SEO | ✅ A+ |
| `/industries/future-education` | `:industryId` | IndustryPage | Dynamic SEO | ✅ A+ |

### Dynamic Routes – Industry Solutions (Use Cases)

| Sitemap URL | Route | Component | SEO | Status |
|-------------|-------|-----------|-----|--------|
| `/industries/education/ai-powered-research-assistant` | `:industryId/:solutionId` | SolutionPage | Dynamic SEO | ✅ A+ |
| `/industries/healthcare/crispro-oncology-copilot` | `:industryId/:solutionId` | SolutionPage | Dynamic SEO | ✅ A+ |
| `/industries/telecommunications/ai-voice-operations-crm` | `:industryId/:solutionId` | SolutionPage | Dynamic SEO | ✅ A+ |
| `/industries/telecommunications/24-7-voice-ai-customer-service` | `:industryId/:solutionId` | SolutionPage | Dynamic SEO | ✅ A+ |
| `/industries/healthcare/healthcare-receptionist-clinical-operations` | `:industryId/:solutionId` | SolutionPage | Dynamic SEO | ✅ A+ |
| `/industries/technology/gitlab-mlops-automation` | `:industryId/:solutionId` | SolutionPage | Dynamic SEO | ✅ A+ |

---

## 4. SEO Additions

| Page | Change |
|------|--------|
| **IndustriesOverview** (`/industries`) | Added `<SEO title={PAGE_META.industries.title} description={...} path="/industries" />` |
| **InfrastructurePage** (`/infrastructure`) | Added `<SEO title={PAGE_META.infrastructure.title} description={...} path="/infrastructure" />` |
| **TechnologyStack** (`/technology`) | Added `<SEO title={PAGE_META.technology.title} description={...} path="/technology" />` |

---

## 5. Content Quality Checklist (Indexed Pages)

For every indexed page to be A+:

- [x] **Title & description** – Unique, JEDI-focused, under 60 chars (title) and ~155 chars (description)
- [x] **Canonical URL** – Set via SEO component
- [x] **OG/Twitter meta** – Set via SEO component
- [x] **No 404s** – All sitemap URLs map to valid routes
- [x] **Correct URL format** – Industry solution URLs use `/industries/:industry/:slug` (no `solutions` segment)

---

## 6. Build & Deploy

```bash
# Sitemap is regenerated automatically on build
npm run build

# Or run sitemap only
npm run generate-sitemap
```

**Note:** Ensure `node_modules` is installed (`npm install`) before building. If `vite` is missing, run `npm install` again.

---

## 7. Summary

| Metric | Status |
|--------|--------|
| Sitemap auto-updates on build | ✅ Yes |
| All sitemap URLs map to routes | ✅ Yes |
| Industry solution URL format fixed | ✅ Yes |
| SEO on static index pages | ✅ Added for industries, infrastructure, technology |
| 404 risk for sitemap URLs | ✅ None |
| Collaboration.jsx URL corrected | ✅ Yes |
