# Solutions Page Front-End Plan

## Reference Page
**URL:** `http://localhost:3007/solutions/ai-ml-solutions`  
**Component:** `src/pages/solutions/SolutionPage.jsx`

---

## 1. Current Schema & Data Flow

### Hygraph Query (`GET_SOLUTION_BY_SLUG`)

| Source | Returns | Shape |
|--------|---------|-------|
| `categories(where: { slug })` | Category | id, name, slug, description |
| `technologyS(where: { category_some: { slug } })` | Technologies | id, name, slug, icon, description, category, **subcategories** (name, slug) |
| `useCaseS(where: { category: { slug } })` | Use Cases | title, slug, description, queries, implementation, architecture, industryApplication |

### Hygraph Model Relationships

```
Category
├── technologies (Technology[])
├── useCase (UseCase)
├── technologySubcategory (TechnologySubcategory[])
├── [NEW] tagline, problemStatement, valueProposition, typicalUseCases, technologyNarrative, keyOutcomes
└── [NEW] heroImage, displayOrder, featured

Technology
├── category (Category[])
├── subcategories (TechnologySubcategory[])
└── icon, name, slug, description

TechnologySubcategory
├── technology (Technology[])
├── category (Category)
├── name, slug, description
└── (groups technologies into e.g. "Agent Core", "Databases")
```

### Current Tech Stack Transformation

```javascript
// From SolutionPage.jsx (lines 163-184)
// Technologies are grouped by subcategory
fetchedTechnologies.forEach(tech => {
  tech.subcategories.forEach(sub => {
    techStackMap[sub.name][tech.name] = { icon: tech.icon, category: sub.name };
  });
});
// Result: { "Agent Core": { "LangChain": {...} }, "Databases": { "Weaviate": {...} } }
```

---

## 2. Current Page Layout (ai-ml-solutions)

| Section | Source | Component |
|---------|--------|-----------|
| **Hero** | solution.title, description, icon | Static |
| **ZETA System Monitor** | activeModules (from techStack count), deployedUseCases | Calculated |
| **Strategic Analysis** | strategyIntel (from IndustryApplication) | ZetaStrategyBrief |
| **Live Simulation** | simulationSource (Hygraph UseCase or static fallback) | ZetaSimulation |
| **System Architecture** | techStack → TechStoryTopology, OR architecture → SolutionArchitecture | TechStoryTopology / SolutionArchitecture |
| **Proven Use Cases** | useCases (Hygraph) | UseCaseCard swiper |
| **CTA** | Static | Button |

### Architecture Rendering Logic

- **If `techStack` has data:** Show **TechStoryTopology** (cards grouped by subcategory)
- **Else if `solution.architecture` exists:** Show **SolutionArchitecture** (ReactFlow nodes + deep-dive grid)
- **ai-agents:** Always uses hardcoded techStack, never fetches from Hygraph for tech
- **ai-ml, data-engineering:** Use Hygraph techStack when available; fallback to static architecture

---

## 3. Rendering Plan: Hygraph + Hard-Coded

### 3.1 Keep Hard-Coded Architecture (ai-ml.js)

The static `aiMlSolution.architecture` provides:
- Rich nodes with `technologies` (nested object: `{ frameworks: ["TensorFlow", "PyTorch"], ... }`)
- Connections between nodes
- Used by **SolutionArchitecture** and **ArchitectureDiagram**

**Recommendation:** Keep as fallback. Use when:
- Hygraph Category has no architecture relation, OR
- We want the detailed pipeline diagram (Data Sources → Model Serving → etc.)

### 3.2 Hygraph Technologies → TechStoryTopology

**Current flow:** Technologies grouped by `subcategories` → `techStackMap` → **TechStoryTopology**

**Enhancement:**
1. Extend `GET_SOLUTION_BY_SLUG` to fetch Category enhanced fields: `tagline`, `problemStatement`, `valueProposition`, `technologyNarrative`, `heroImage`, `typicalUseCases`
2. Ensure `technologyS` includes `subcategories { name, slug }` so grouping works
3. If Hygraph returns technologies: build `techStackMap` from them
4. If no Hygraph techs (e.g. ai-agents): use static `aiAgentsSolution.techStack`

### 3.3 Merge Strategy: Hygraph First, Static Fallback

```
1. Fetch Category by slug (ai-ml or ai-ml-solutions)
2. Fetch technologies where category includes this slug
3. Build techStackMap:
   - Group by Technology.subcategories[].name
   - Each tech: { icon, category, slug } (add slug for /technology/:slug links)
4. Architecture:
   - Option A: TechStoryTopology (when techStack has data) — CURRENT
   - Option B: SolutionArchitecture (when static architecture exists) — FALLBACK
   - Option C: Both — TechStoryTopology for "Technology Stack", SolutionArchitecture for "Pipeline Diagram"
```

---

## 4. Proposed Tab Structure (Future)

Align with Use Case detail page and Case Study:

| Tab | Content | Source |
|-----|---------|--------|
| **Overview** | Hero, tagline, description, valueProposition | Category (Hygraph) |
| **Terminal / Test** | Live Simulation (queries from UseCase) | ZetaSimulation |
| **The Problem** | problemStatement | Category |
| **Architecture** | System Architecture | TechStoryTopology OR SolutionArchitecture |
| **Technologies** | techStack by subcategory, technologyNarrative | Category + Technologies |
| **Use Cases** | Proven Use Cases swiper | UseCases (Hygraph) |
| **Resources** | Links, PDFs | Category (if we add) |

---

## 5. GraphQL Query Updates

### Extend `GET_SOLUTION_BY_SLUG`

```graphql
categories(where: { slug: $slug }) {
  id name slug description
  tagline
  problemStatement { raw html }
  valueProposition { raw html }
  typicalUseCases { raw html }
  technologyNarrative { raw html }
  keyOutcomes { raw html }
  heroImage { url }
  displayOrder
  featured
}
# technologies and relatedUseCases unchanged
```

### Technology Links

Add `slug` to tech objects so cards can link to `/technology/:slug`.

---

## 6. Component Updates

| Component | Change |
|-----------|--------|
| **SolutionPage** | Fetch Category enhanced fields; pass to new sections |
| **TechStoryTopology** | Add `Link` to `/technology/:slug` when slug present |
| **ZetaStrategyBrief** | Already receives strategyIntel; optional: use Category.problemStatement if no IndustryApplication |
| **Hero** | Optional: use Category.heroImage if set |

---

## 7. Implementation Order

1. **Phase 1:** Extend `GET_SOLUTION_BY_SLUG` with Category new fields
2. **Phase 2:** Update SolutionPage to use Category.tagline, valueProposition in Hero/Overview
3. **Phase 3:** Add technology slug to TechStoryTopology cards → link to `/technology/:slug`
4. **Phase 4:** Add tabbed layout (Overview, Terminal, Architecture, Technologies, Use Cases)
5. **Phase 5:** Use Category.problemStatement when no IndustryApplication; add heroImage

---

## 8. Schema Summary

| Model | Role on Solutions Page |
|-------|------------------------|
| **Category** | Page identity (ai-ml). Title, description, story fields. |
| **Technology** | Listed in tech stack. Grouped by subcategory. |
| **TechnologySubcategory** | Groups technologies (e.g. "Agent Core", "Databases"). |
| **UseCase** | Use case cards; simulation source; IndustryApplication for "soul". |
