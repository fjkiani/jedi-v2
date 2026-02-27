# Sitemap & SEO Audit 2025

*Last updated: Feb 2025*

---

## Summary of Changes

### 1. Messaging Alignment
- **Hero**: "Production AI Co-Pilots." + agentic AI consulting tagline
- **SEO default**: JEDI Labs — Agentic AI Co-Pilots for SMBs | Production, Not Pilots
- **RootSEO (schema.org)**: Organization, WebSite, Service updated to agentic AI / production co-pilots positioning
- **About page**: Aligned with JEDI Ensemble™, JEDI Rules™, JEDI Automate™ — deployed for production, not pilots

### 2. Sitemap Enhancements
**Static routes added:**
- `/jedi` (priority 0.95)
- `/use-cases` (priority 0.9)
- `/case-studies` (priority 0.85)
- `/infrastructure` (priority 0.8)
- `/careers` (priority 0.8)

**Dynamic routes:**
- Industries: `industries(stage: PUBLISHED)` 
- Industry use cases: `useCaseS(stage: PUBLISHED)` → `/industries/{industrySlug}/solutions/{useCaseSlug}`
- Posts, team, solutions, technologies (all with `stage: PUBLISHED`)

**Note:** `useCaseS` may hit Hygraph rate limits during generation. Run `npm run generate-sitemap` during low-traffic periods. Consider caching or running as a build step.

### 3. SEO Component Updates
- **SEO/index.jsx**: Now accepts `title`, `description`, `keywords`, `path`, `ogUrl`, `ogImage` props for page-level overrides
- **Central constants**: `src/constants/seo.js` — DEFAULT_META, PAGE_META, SITE_URL
- **Page-specific SEO**: UseCasesPage, CaseStudiesPage, JediPage updated with aligned copy
- **Canonical URLs**: Applied via path/ogUrl for proper indexing

### 4. robots.txt
- Already references `https://jedilabs.org/sitemap.xml`
- Disallows 404, api, admin, static assets

### 5. Index.html
- Title and meta description updated
- og:site_name: JEDI Labs

---

## Recommended Next Steps

1. **Run sitemap after deploy**: Add `npm run generate-sitemap` to CI/CD or post-deploy hook
2. **Submit to Search Console**: Verify sitemap in Google Search Console
3. **Add page-specific SEO** to remaining pages (Solutions list, Technology list, Blog list) using PAGE_META from seo.js
4. **Structured data**: Consider Article schema for blog posts, FAQPage for common questions
5. **Image optimization**: Ensure og-image.jpg and twitter-image.jpg exist at 1200x630px

---

## Target Keywords (from DEFAULT_META)

- agentic AI, AI co-pilots, production AI
- SMB AI, healthcare AI, finance AI, education AI
- JEDI Ensemble, JEDI Rules, JEDI Automate
- MCP, NLP, LLM
- AI consulting, AI development
