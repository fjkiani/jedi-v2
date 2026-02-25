# Technology Audit & Plan (Bulletproof)

## Audit Summary (Feb 2025)

| Check | Result |
|-------|--------|
| **fetch_all_technologies.js** | ✅ Runs; 221 technologies fetched from Hygraph (DRAFT stage) |
| **npm run build** | ✅ Succeeds |
| **npm run lint** | ⚠️ 738 issues (716 errors) – pre-existing; not blocking build |
| **Unit/integration tests** | ❌ None – no Jest/Vitest; validation = build + scripts |
| **Minimum standard (description + features)** | **221/221** meet strict (desc≥100, feat≥30) after de-slop + fill-minimum runs |

---

## Data Flow (Source of Truth)

```
Hygraph (technologyS, DRAFT)
    ↓
technologyService.getTechnologyBySlug(slug)
    ↓ GET_TECHNOLOGY_BY_SLUG: technologyS(where: { slug })
    ↓ GET_USE_CASES_BY_TECH
    ↓
EnhancedTechnologyDetail
    ↓ merges with findLocalTechData() (aiMlTechStack, solutions)
    ↓
Display: description, features, businessMetrics, relatedUseCases
```

**Additional Details** – Removed from UI. Hygraph still stores `additonalDetails`; we no longer render it.

---

## Minimum Standard (Hugging Face Level)

Each technology must have:

1. **description** – 2–3 sentences, >50 chars; JEDI context when applicable  
2. **features** – Comma-separated or list, >10 chars (e.g. "NLP, Computer Vision, Transfer Learning")

**Optional:** businessMetrics (scannable bullets). **Not required:** additonalDetails (removed from display).

---

## Audit Results (from fetch_all_technologies.js)

| Metric | Count |
|--------|-------|
| Total technologies | 221 |
| **Lenient** (desc >50 chars AND features >10 chars) | 166 |
| **Strict** (desc ≥100 chars AND features ≥30 chars) | 105 |
| Missing/weak description | 24 |
| Missing/weak features | 39 |

**Criteria:** “Meets minimum” = non-empty description + non-empty features. Lenient uses >50 and >10 character length; strict uses ≥100 and ≥30 (closer to Hugging Face level). Use strict for “really filled out” count.

**Sample slugs meeting lenient minimum:** langchain, huggingface, react, spacy, react-ai, vector-databases, web-ui, zapier, rest-api, oauth2, tree-of-thoughts, apache-airflow, prometheus, encryption, gpt-4

---

## Tightened: "Properly filled" (no slop)

Many of the 105 "strict" entries used the same generic copy-paste (e.g. "powerful technology solution that enables advanced capabilities", "High Performance Architecture, Scalable Design, Easy Integration"). **De-slop migration (Feb 2025)** replaced that content for 87 technologies via `scripts/migrations/hygraph/de_slop_technologies.js`.

| Filter | Before | After de-slop |
|--------|--------|----------------|
| Of 105 strict | 105 | 105 |
| With generic slop | 87 | **0** |
| No slop + unique + JEDI in description | 13 | **~100** |

**Properly filled (sample):** langchain, huggingface, react, spacy, weaviate, tensorflow, postgresql, mongodb, apache-airflow, grafana, redis, neo4j, crew-ai, and 87+ more with unique, JEDI-relevant description and features.

**Fill-minimum:** Script `de_slop_technologies.js` has `FILL_MAP` for technologies that did not meet strict length. All 116 filled. **Result: 221/221 meet strict (desc≥100 chars, features≥30 chars).**

**No AI slop / final fix:** `FINAL_FIX` in the same script removes remaining slop phrases (e.g. "comprehensive framework") and adds JEDI to any long description that lacked it. Applied to langchain, gpus, tpus, horovod, new-relic, kfserving. **Audit: 0 slop phrases, 0 duplicate descriptions, 0 duplicate features, 0 techs with 100+ char description missing JEDI.**

---

## Known Issues

### 1. fetch_all_technologies.js – Category Bug

- **Issue:** `tech.category` is an array in Hygraph; script uses `tech.category?.name`.
- **Effect:** "Technologies by Category: undefined: 221 technologies".
- **Fix:** Use `tech.category?.[0]?.name` or iterate over `tech.category`.

### 2. fetch_all_technologies.js – Enhancement Criteria

- **Issue:** "Needs enhancement" includes additonalDetails, which we no longer show.
- **Fix:** Change to: needs enhancement = missing description OR missing features.

### 3. technologyService.js – Duplicate Method

- **Issue:** Two `getLocalTechnologyBySlug` methods (sync at ~390, async at ~418). Async overwrites sync.
- **Effect:** Sync version never used; LocalTechnologyOverview uses async.
- **Fix:** Remove sync version or rename one (e.g. `getLocalTechnologyBySlugSync`).

### 4. Multiple Technology Queries

- **technologyService.js** – Uses `technologyS(where: { slug })` – ✅ working.
- **graphql/queries/technologies.js** – Uses `technology(where: { slug })` (singular) and different fields. Likely legacy or alternate schema.
- **Source of truth:** technologyService for `/technology/:slug`.

---

## Strategic Targeting (Subcategory-First)

From `.cursor/rules/technology-subcategory-enhancement-strategy.mdc` and `subcategory_enhancement_analysis.json`.

### Phase 1: High-Priority Subcategories (66.7% Enhancement Score)

| Subcategory | Technologies | Notes |
|-------------|--------------|-------|
| Structured Data | SQL Databases, NoSQL Databases | Have description + features; missing businessMetrics |
| Unstructured Data | Text Files, Images, Audio | Same |
| Streaming Data | Apache Kafka, AWS Kinesis | Same |
| API Data Sources | Third-party APIs, Web Scraping | Same |
| Data Ingestion | Apache NiFi | Same |
| Security | HashiCorp Vault, Apache Ranger | HashiCorp missing features |

### Phase 2: JEDI-Relevant Subcategories

| Subcategory | Technologies |
|-------------|--------------|
| Agent Core | LangChain ✅, OpenAI Functions, AutoGPT |
| Frameworks | React, Angular, Flutter |
| Vector Databases | Weaviate, FAISS |

### Phase 3: Remaining (34 subcategories)

Tool Integration, Model Training, ML Monitoring, Protocols, Authentication, etc.

---

## Validation Checklist (Before Any Enhancement Push)

1. [ ] Run `node scripts/migrations/hygraph/fetch_all_technologies.js` – no errors.
2. [ ] Run `npm run build` – succeeds.
3. [ ] Confirm target tech has Hygraph id, slug, and at least description + features.
4. [ ] Use Hygraph MCP `update_entry` (or push script) with correct typename `Technology`.
5. [ ] Verify in browser: `/technology/:slug` – description and Key Capabilities render.

---

## MCP Audit Plan (When Rate Limit Allows)

1. `list_entities(typename: "Technology", limit: 100)` – get id, slug, description, features.
2. Filter: `description` empty or &lt;50 chars, OR `features` empty or &lt;10 chars.
3. Group by subcategory (via `subcategory_enhancement_analysis.json` or Hygraph `subcategories`).
4. Output: list of techs needing enhancement, grouped by subcategory.

---

## Enhancement Pipeline

| Step | Script / Action |
|------|------------------|
| Fetch | `node scripts/migrations/hygraph/fetch_all_technologies.js` → `all_technologies_raw.json` |
| Enrich | Add/update description + features for target techs (manual or script). |
| Push | Hygraph MCP `update_entry` or `scripts/migrations/hygraph/` push script. |
| Verify | Re-run fetch; confirm description + features populated; check `/technology/:slug` in browser. |

---

## File References

| File | Purpose |
|------|---------|
| `src/pages/technology/EnhancedTechnologyDetail.jsx` | Main tech detail page (`/technology/:slug`) |
| `src/pages/technology/TechnologyOverview.jsx` | Overview tab; uses `technologyS` query |
| `src/services/technologyService.js` | Hygraph + local fallback; `getTechnologyBySlug`, `getLocalTechnologyBySlug` |
| `scripts/migrations/hygraph/fetch_all_technologies.js` | Fetch all techs; outputs `all_technologies_raw.json` |
| `subcategory_enhancement_analysis.json` | Per-subcategory: techs, missing content, enhancement score |
| `all_technologies_raw.json` | Raw tech data from Hygraph (DRAFT) |
| `.cursor/rules/technology-subcategory-enhancement-strategy.mdc` | Subcategory strategy |
| `.cursor/rules/technology-enhancement-approach.mdc` | Tab structure, JEDI implementations |

---

## Immediate Actions

| Action | Status |
|--------|--------|
| Remove Additional Details from technology UI | ✅ Done |
| Create TECHNOLOGY_AUDIT_AND_PLAN.md | ✅ Done |
| Fix fetch script category bug (tech.category array) | ⏳ Pending |
| Update fetch script enhancement criteria (description + features only) | ⏳ Pending |
| Fix technologyService duplicate getLocalTechnologyBySlug | ⏳ Pending |
| Run MCP audit (list techs missing description/features) | ⏳ Pending (Hygraph 429) |
| Fill description + features for 55 techs failing minimum | ⏳ Pending |
