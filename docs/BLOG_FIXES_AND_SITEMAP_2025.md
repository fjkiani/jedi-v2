# Blog Fixes & Sitemap Audit 2025

*Executed: Feb 2025*

---

## Summary of Changes

### 1. Blog URL 404 Fix
- **Root cause**: Sitemap and Google had `/blog/ai-agents` but the app route is `/blog/post/:slug` → actual URL is `/blog/post/ai-agents`.
- **Fix**: 
  - Added 301 redirects in `vercel.json` for legacy URLs: `/blog/ai-agents`, `/blog/aws-railway`, `/blog/building-web3`, etc. → `/blog/post/:slug`
  - Added `BlogLegacyRedirect` in App.jsx for client-side fallback
  - Updated sitemap generator to output `/blog/post/${post.slug}` (correct path)

### 2. Sitemap Generator
- **Hygraph retry logic**: Added `hygraphRequest()` with exponential backoff for 429 rate limits
- **Blog path fix**: Posts now use `/blog/post/:slug` (was `/blog/:slug`)
- **Dynamic routes**: Industries (8), industry use cases (6), posts (9) — 23 dynamic routes
- **Priority boost**: SEO-heavy posts (identity-missing-pillar-agentic-ai, ai-agents, building-web3, jedilabs) get priority 0.85

### 3. Solutions Page
- **SEO**: Added SEO component with JEDI-focused title and description
- **Copy**: "Production AI Solutions" — AI agents, data engineering, JEDI Ensemble/Rules/Automate
- **Path**: `/solutions` — no redirect; page kept as index for solution cards

### 4. Blog Content (Drafts / Updates)

**building-web3** (NEW)
- Draft: `scripts/blog/drafts/building-web3.json`
- Angle: Web3 + healthcare + patient data ownership (self-sovereign identity, consent management)
- Run: `npm run blog:create -- --file scripts/blog/drafts/building-web3.json --publish`

**aws-railway** (REWRITE)
- Draft: `scripts/blog/drafts/aws-railway-rewrite.json`
- Angle: "Leverage, don't delete" — keep indexed URL, update content for ECS→Railway migration, SEO value
- Update in Hygraph: Use `update_entry` or Hygraph UI to replace content. Slug stays `aws-railway`.

**ai-agents** (REWORD)
- Existing post exists; 404 was URL-only. Redirect fixes it.
- To reword: Update in Hygraph with agentic AI / production co-pilots angle (align with pilot-to-production draft).

### 5. Vercel Redirects
```json
"redirects": [
  {"source": "/blog/ai-agents", "destination": "/blog/post/ai-agents", "permanent": true},
  {"source": "/blog/aws-railway", "destination": "/blog/post/aws-railway", "permanent": true},
  {"source": "/blog/building-web3", "destination": "/blog/post/building-web3", "permanent": true},
  ... (all known slugs)
]
```

---

## Next Steps

1. **Create building-web3**: `npm run blog:create -- --file scripts/blog/drafts/building-web3.json --publish`
2. **Update aws-railway**: In Hygraph, replace content with `scripts/blog/drafts/aws-railway-rewrite.json`
3. **Update ai-agents**: In Hygraph, reword to agentic AI / production co-pilots
4. **Regenerate sitemap**: `npm run generate-sitemap` (run after creating building-web3)
5. **Submit sitemap**: Resubmit in Google Search Console after deploy
