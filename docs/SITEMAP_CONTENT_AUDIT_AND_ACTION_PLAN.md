# Sitemap Content Audit & Action Plan

**Date:** February 2025  
**Goal:** Every sitemap URL delivers A+ content. No empty pages or "Check back soon!" placeholders.

---

## 1. Data Model Summary (from Hygraph)

### Industries & Content Sources

| Industry (slug) | `industryApplication` count | `useCaseS` (by industry) | Current page behavior |
|-----------------|-----------------------------|---------------------------|------------------------|
| **healthcare** | 1 ("Accelerating Drug Target Identification") | 2: crispro-oncology-copilot, healthcare-receptionist-clinical-operations | ✅ Has content (ApplicationDisplay) |
| **financial-services** | 0 | 0 | ❌ "Check back soon!" |
| **technology** | 0 | 1: gitlab-mlops-automation | ❌ "Check back soon!" (doesn't show useCases) |
| **education** | 0 | 1: ai-powered-research-assistant | ❌ "Check back soon!" (doesn't show useCases) |
| **telecommunications** | 0 | 2: ai-voice-operations-crm, 24-7-voice-ai-customer-service | ❌ "Check back soon!" (doesn't show useCases) |
| **transportation-logistics** | 0 | 0 | ❌ "Check back soon!" |
| **government-public-sector** | 0 | 0 | ❌ Empty / "Check back soon!" |
| **future-education** | 0 | 0 | ❌ "Check back soon!" |

### Root Cause

**IndustryPage** only renders `industryApplication`. When empty, it shows the placeholder. It does **not** use `useCaseS` at all. So industries like Education, Technology, Telecommunications have rich useCases but show "Check back soon!" because `industryApplication` is empty.

---

## 2. URL-by-URL Audit (from sitemap)

### Industry index & detail pages

| URL | Content status | Issue |
|-----|----------------|-------|
| `/industries` | OK | Industries overview – links to all industries |
| `/industries/healthcare` | ✅ **Gold** | Has 1 industryApplication, rich content – **UI/UX needs improvement** |
| `/industries/financial-services` | ❌ Empty | 0 applications, 0 useCases → placeholder |
| `/industries/technology` | ❌ Empty | 0 applications, **1 useCase exists** → placeholder (not shown) |
| `/industries/education` | ❌ Empty | 0 applications, **1 useCase exists** → placeholder (not shown) |
| `/industries/telecommunications` | ❌ Empty | 0 applications, **2 useCases exist** → placeholder (not shown) |
| `/industries/transportation-logistics` | ❌ Empty | 0 applications, 0 useCases → placeholder |
| `/industries/government-public-sector` | ❌ Empty | 0 applications, 0 useCases → placeholder |
| `/industries/future-education` | ❌ Empty | 0 applications, 0 useCases → placeholder |

### Industry solution (use case) detail pages

| URL | Content status | Notes |
|-----|----------------|-------|
| `/industries/education/ai-powered-research-assistant` | ✅ Has content | UseCase detail page |
| `/industries/healthcare/crispro-oncology-copilot` | ✅ Has content | UseCase detail page |
| `/industries/healthcare/healthcare-receptionist-clinical-operations` | ✅ Has content | UseCase detail page |
| `/industries/telecommunications/ai-voice-operations-crm` | ✅ Has content | UseCase detail page |
| `/industries/telecommunications/24-7-voice-ai-customer-service` | ✅ Has content | UseCase detail page |
| `/industries/technology/gitlab-mlops-automation` | ✅ Has content | UseCase detail page |

### Static & other pages (not audited live here)

| URL | Expected status |
|-----|------------------|
| `/`, `/jedi`, `/solutions`, `/use-cases`, `/case-studies`, etc. | OK |
| Blog posts | OK (Hygraph-driven) |

---

## 3. Action Plan

### Phase 1: Use `useCaseS` on IndustryPage (quick win)

**Problem:** Education, Technology, Telecommunications have useCases in Hygraph but IndustryPage ignores them.

**Solution:** In `IndustryPage.jsx`:

1. **Fetch `useCaseS`** for the current industry (e.g. `useCaseS(where: { industry: { slug: $slug } })`).
2. **Display logic:**
   - If `industryApplication.length > 0` → render ApplicationDisplay (current behavior).
   - Else if `useCaseS.length > 0` → render cards linking to `/industries/:industry/:slug` (same pattern as IndustrySolutions).
   - Else → use dynamic fallback (Phase 2).

**Result:** Education, Technology, Telecommunications will show real solution cards instead of "Check back soon!".

---

### Phase 2: Dynamic fallback for industries with no content

**Problem:** Financial Services, Transportation & Logistics, Government & Public Sector, Future Education have neither industryApplication nor useCaseS.

**Options:**

| Option | Description | Effort | Recommendation |
|--------|-------------|--------|-----------------|
| **A. Remove from sitemap** | Exclude empty industry pages from sitemap until content exists | Low | No – creates dead links, bad for SEO |
| **B. Dynamic context fallback** | Use Industry fields (description, fullDescription, benefits, capabilities) + JEDI framework to render a useful page | Medium | ✅ Yes |
| **C. Hygraph content** | Add IndustryApplication or link useCases in Hygraph | High | Yes, long-term |

**Implementation for Option B (Dynamic Fallback):**

1. Use existing Industry fields: `description`, `fullDescription`, `benefits`, `capabilities`.
2. When both `industryApplication` and `useCaseS` are empty:
   - Render: Hero, industry description, RichText fullDescription, benefits list, capabilities list, JEDI overview for that industry.
   - Add CTA: "Request Consultation" for that industry.
3. No "Check back soon!" – every industry page has useful content.

---

### Phase 3: Healthcare UI/UX (gold standard)

**Goal:** Improve Healthcare page design and reuse it for all industries.

- Audit current Healthcare page layout, hierarchy, and components.
- Refactor IndustryPage to:
  - Use a consistent, high-quality layout.
  - Support both ApplicationDisplay (industryApplication) and useCase cards (useCaseS).
  - Support the dynamic fallback layout (Phase 2).

---

### Phase 4: Sitemap hygiene

**Rule:** Include an industry URL in the sitemap only if the page has meaningful content.

- After Phase 1 + 2, all industry pages should have content.
- Optionally, lower `priority` for industries using only dynamic fallback until richer content is added in Hygraph.

---

## 4. Implementation Checklist

### Phase 1: Use useCaseS on IndustryPage ✅ DONE

- [x] Added `GET_USE_CASES_FOR_INDUSTRY` query to fetch `useCaseS(where: { industry: { slug: $slug } })`.
- [x] In IndustryPage: fetch industry + useCaseS in parallel.
- [x] Render logic: `industryApplication` → ApplicationDisplay; else `useCaseS` → IndustrySolutionCard grid; else dynamic fallback.
- [x] Education, Technology, Telecommunications now show solution cards.

### Phase 2: Dynamic fallback for empty industries ✅ DONE

- [x] When both empty: render fullDescription, benefits, capabilities via `renderRichTextSection` / `renderListSection`.
- [x] If all three empty: show generic JEDI value prop paragraph.
- [x] No more "Check back soon!" for any industry.

### Phase 3: Healthcare UI/UX improvements

- [ ] Review Healthcare page (gold standard) layout and components.
- [ ] Create reusable IndustryPage layouts: ApplicationDisplay, useCase cards, dynamic fallback.
- [ ] Ensure consistent spacing, typography, and CTAs across all industry pages.

### Phase 4: Sitemap review

- [ ] Confirm all industry URLs in sitemap resolve to pages with real content.
- [ ] Consider `priority` adjustments for fallback-only industries.
- [ ] Re-run `generate-sitemap` after changes.

---

## 5. Files to Modify

| File | Changes |
|------|---------|
| `src/features/industries/pages/IndustryPage.jsx` | Add useCaseS fetch + render; add dynamic fallback when both are empty |
| `src/features/industries/components/IndustrySolutionCard.jsx` | Reuse or adapt for useCase cards on IndustryPage |
| `scripts/generate-sitemap.js` | Optional: adjust priority or inclusion rules for industry URLs |
| `docs/SITEMAP_CONTENT_AUDIT_AND_ACTION_PLAN.md` | Update as work progresses |

---

## 6. Expected Outcomes

| Industry | Before | After Phase 1 | After Phase 2 |
|----------|--------|---------------|---------------|
| Healthcare | ✅ Content | ✅ Content | ✅ Content + better UI |
| Education | Placeholder | ✅ useCase cards | ✅ useCase cards |
| Technology | Placeholder | ✅ useCase cards | ✅ useCase cards |
| Telecommunications | Placeholder | ✅ useCase cards | ✅ useCase cards |
| Financial Services | Placeholder | Placeholder | ✅ Dynamic fallback |
| Transportation & Logistics | Placeholder | Placeholder | ✅ Dynamic fallback |
| Government & Public Sector | Placeholder | Placeholder | ✅ Dynamic fallback |
| Future Education | Placeholder | Placeholder | ✅ Dynamic fallback |
