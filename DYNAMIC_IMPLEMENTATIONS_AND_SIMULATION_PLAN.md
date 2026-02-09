# Dynamic Implementations & Simulation Plan

---

## Drift Recalibration (Feb 2025)

**What went wrong:** Extract and push scripts used hardcoded industry:solution → UseCase slug mappings, violating the plan's "no hardcoding" principle. Adding a new implementation required editing migration scripts.

**Root cause:** The mapping lived in the script instead of the single source of truth (SOLUTION_REGISTRY).

**Fix applied:**
| Component | Before | After |
|-----------|--------|-------|
| **SOLUTION_REGISTRY** | No Hygraph link | Added `hygraphUseCaseSlug` per solution (configuration) |
| **extract_implementation_content.js** | Hardcoded paths/imports | Imports SOLUTION_REGISTRY, iterates all industries/solutions |
| **push_implementation_to_hygraph.js** | `USE_CASE_SLUG_MAP` | Uses `hygraphUseCaseSlug` from extracted data |
| **implementationDataService** | `LOCAL_DOCS` hardcoded | Derived from SOLUTION_REGISTRY |

**How to add new content now:** Add entry to SOLUTION_REGISTRY with `hygraphUseCaseSlug`. Run extract → push. No script edits.

---

## Scaffolding Status (Completed)

| Item | Status |
|------|--------|
| `src/services/implementationDataService.js` | ✅ Created — Hygraph-first, local fallback |
| `scripts/migrations/hygraph/extract_implementation_content.js` | ✅ Created — `npm run extract:implementation` |
| `scripts/migrations/hygraph/push_implementation_to_hygraph.js` | ✅ Created — `npm run push:implementation` |
| `scripts/migrations/hygraph/SCHEMA_IMPLEMENTATION_FIELDS.md` | ✅ Created — Schema guidance |
| `src/pages/solutions/tabs/DocumentationTab.jsx` | ✅ Updated — Uses implementationDataService, supports useCaseData |
| npm scripts | ✅ `extract:implementation`, `push:implementation` |

---

## Executive Summary

**Goal:** Move implementation content (documentation, code examples, diagrams, simulation config) from hardcoded constants into Hygraph, so technologies and use cases can demonstrate real interactive simulations—not text dumps.

**Scope:** Schema changes, migration scripts, frontend data flow, and component wiring. Affects Technology, UseCase, IndustryApplication, and new content models.

---

## 1. CURRENT STATE — What's Hardcoded

### 1.1 Data Sources (All Local)

| Path | Content | Consumers |
|------|---------|-----------|
| `constants/implementations/industries/financial/documentation.js` | `fraudDetectionDocs` — sections with `codeExample`, `keyPoints`, `challenges` | DocumentationTab, solutionRegistry |
| `constants/implementations/industries/healthcare/documentation.js` | Healthcare docs (similar structure) | DocumentationTab |
| `constants/implementations/data-collection.js` | `dataCollectionDocs` — sections with `codeExample: { title, description, code }` | Data collection flows |
| `constants/implementations/industries/financial/sections/*/diagram.js` | ReactFlow-style nodes, edges, useCase metadata | ArchitectureDiagram, getIndustryDiagram |
| `constants/registry/industrySectionsRegistry.js` | `INDUSTRY_SECTIONS` — section IDs, labels, icons per industry | getSectionsForIndustry |
| `constants/registry/industryDiagramsRegistry.js` | `INDUSTRY_DIAGRAMS` — diagram by industry+section | getIndustryDiagram |
| `constants/implementations/fraudDetectionStimulator.jsx` | Multi-step simulator (TransactionForm → ProcessingPipeline → ResultsDashboard) | FraudDetectionSimulator |
| `constants/implementations/industries/financial/fraudDetection.js` | Metrics, exampleQueries | fraudDetectionImplementation |

### 1.2 Data Structures (Target for Hygraph)

**Documentation Section (per section):**
```
{
  title: string,
  content: string,
  keyPoints?: string[],
  codeExample?: {
    title: string,
    description?: string,
    code: string,          // runs in LiveCodeEditor (JS) or CodeBlock (Python)
    language?: string     // 'javascript' | 'python'
  },
  challenges?: [{ name, description, solution, codeExample? }],
  detailedExplanation?: string
}
```

**Diagram (ReactFlow):**
```
{
  nodes: [{ id, label, description, x, y, type, technologies?, metrics? }],
  edges?: [{ source, target }],
  useCase?: { title, description, businessValue[], capabilities[], examples[] }
}
```

**Simulation Config (FraudDetectionStimulator-style):**
```
{
  steps: [
    { id, interactive: { fields } },      // TransactionForm
    { id, visualization: { stages } },    // ProcessingPipeline
    { id, visualization: { panels } }     // ResultsDashboard
  ]
}
```

**Implementation Metadata:**
```
{
  exampleQueries: { samples: string[] },
  placeholder: string,
  metrics: { items: [{ label, value, description, details }] }
}
```

---

## 2. HYGRAPH SCHEMA — Proposed Changes

### 2.1 New Models / Components

#### Option A: Extend Existing Models (Minimal Schema Change)

| Model | New Fields | Notes |
|-------|------------|-------|
| **Technology** | `integrationSteps` (String, list), `codeExamples` (Json) | Json: `[{ title, code, language }]` |
| **UseCase** | `documentationSections` (Json), `simulationConfig` (Json) | Reuse `implementation` (Json) or add structured fields |
| **IndustryApplication** | `documentationSections` (Json), `simulationConfig` (Json) | Same as UseCase |

**Pros:** Quick, no new models.  
**Cons:** Json is opaque in Hygraph UI; hard to validate; no relations.

---

#### Option B: New Models + Relations (Recommended)

**New Models:**

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **DocumentationSection** | One section (e.g., "How Fraud Detection Works") | title, content, keyPoints (String list), codeExample (embedded component) |
| **CodeExample** (Component) | Reusable code snippet | title, description, code (String), language (Enum: JAVASCRIPT, PYTHON) |
| **ArchitectureDiagram** | Diagram config (nodes/edges as Json) | name, nodesJson (Json), edgesJson (Json), useCaseMetadata (Json) |
| **SimulationConfig** | Simulation steps | name, stepsJson (Json), type (Enum: FRAUD_DETECTION, DATA_PIPELINE, etc.) |

**New Relations:**

| Model | Relation | Target |
|-------|----------|--------|
| **Technology** | documentationSections → [DocumentationSection] | DocumentationSection |
| **Technology** | simulationConfig → SimulationConfig | SimulationConfig (optional) |
| **UseCase** | documentationSections → [DocumentationSection] | DocumentationSection |
| **UseCase** | architectureDiagram → ArchitectureDiagram | ArchitectureDiagram (extend existing Architecture) |
| **UseCase** | simulationConfig → SimulationConfig | SimulationConfig |
| **IndustryApplication** | documentationSections → [DocumentationSection] | DocumentationSection |
| **IndustryApplication** | simulationConfig → SimulationConfig | SimulationConfig |

---

#### Option C: Hybrid — Json First, Models Later

1. **Phase 1:** Add Json fields to Technology, UseCase, IndustryApplication:
   - `documentationSectionsJson` (Json)
   - `simulationConfigJson` (Json)
   - `diagramConfigJson` (Json) — for diagrams not covered by existing Architecture
2. **Phase 2:** Migrate to proper models when content volume justifies it.

---

### 2.2 Schema Migration Steps (Hygraph)

1. Create **CodeExample** component (title, description, code, language).
2. Create **DocumentationSection** model with embedded CodeExample component (optional).
3. Create **SimulationConfig** model (name, type, stepsJson).
4. Create **ArchitectureDiagramConfig** model if diagrams diverge from existing Architecture (nodesJson, edgesJson).
5. Add relational fields to Technology, UseCase, IndustryApplication.

---

## 3. DATA FLOW — Frontend

### 3.1 Current Flow (Hardcoded)

```
Industry ID (e.g. 'financial')
    → getSectionsForIndustry(industryId) → INDUSTRY_SECTIONS[industryId]
    → getIndustryDiagram(industryId, sectionId) → INDUSTRY_DIAGRAMS[industryId][sectionId]
    → docs = industry.id === 'financial' ? fraudDetectionDocs : documentation
    → section.codeExample → CodeBlock + "Try it Live" → LiveCodeEditor
```

### 3.2 Target Flow (Hygraph-First)

```
Technology slug / UseCase slug / IndustryApplication
    → Hygraph query fetches:
        - documentationSections { title, content, keyPoints, codeExample { title, code, language } }
        - simulationConfig { stepsJson, type }
        - architectureDiagram { nodesJson, edgesJson } OR useCase.architecture
    → DocumentationTab / EnhancedTechnologyDetail uses fetched data
    → Fallback: local constants if Hygraph returns empty (backward compat)
```

### 3.3 Services to Update

| Service | Changes |
|---------|---------|
| `technologyService.js` | Extend GET_TECHNOLOGY_BY_SLUG to fetch documentationSections, simulationConfig, codeExamples |
| `useCaseService.js` | Fetch documentationSections, simulationConfig for use cases |
| (New) `implementationDataService.js` | Central service: getDocumentationForTechnology(slug), getSimulationForUseCase(slug), getDiagramForSection(industryId, sectionId) |

### 3.4 Component Updates

| Component | Changes |
|-----------|---------|
| `DocumentationTab.jsx` | Accept `documentation` prop from Hygraph; fallback to fraudDetectionDocs if empty |
| `EnhancedTechnologyDetail.jsx` | Integration tab: use CodeBlock + "Try it Live" for codeExamples from Hygraph |
| `ArchitectureDiagram.jsx` | Accept diagram config from Hygraph (nodesJson, edgesJson) |
| `FraudDetectionSimulator` | Accept `config` from Hygraph simulationConfig |
| `industrySectionsRegistry.js` | `getSectionsForIndustry` merges Hygraph sections with local fallback |
| `industryDiagramsRegistry.js` | `getIndustryDiagram` fetches from Hygraph; fallback to local |

---

## 4. MIGRATION STRATEGY

### 4.1 Content Migration (Local → Hygraph)

1. **Audit** — List all sections in fraudDetectionDocs, dataCollectionDocs, healthcare docs.
2. **Extract** — Script to read `constants/implementations/**/*.js` and output structured JSON.
3. **Transform** — Map to Hygraph create mutations (DocumentationSection, CodeExample, SimulationConfig).
4. **Push** — Migration script: create entries, link to Technology/UseCase/IndustryApplication.
5. **Verify** — Queries to confirm data present.

### 4.2 Diagram Migration

- Diagrams are complex (nodes, edges, positions). Options:
  - Store as **Json** in a single field (diagramConfigJson).
  - Or create **DiagramNode**, **DiagramEdge** models with relations (more flexible but more work).

---

## 5. PHASED IMPLEMENTATION PLAN

### Phase 1: Schema & Minimal Json Fields (Week 1–2)

- [ ] Add to Technology: `documentationSectionsJson` (Json), `codeExamplesJson` (Json).
- [ ] Add to UseCase: `documentationSectionsJson` (Json), `simulationConfigJson` (Json).
- [ ] Add to IndustryApplication: same as UseCase.
- [ ] Migration script: push fraudDetectionDocs sections as Json into one UseCase (e.g. advanced-fraud-detection-system).
- [ ] Update technologyService, useCaseService to fetch these fields.
- [ ] Update DocumentationTab to prefer Hygraph data; fallback to local.
- **Deliverable:** One use case (fraud detection) with documentation from Hygraph.

### Phase 2: Code Examples & LiveCodeEditor (Week 2–3)

- [ ] Ensure codeExamplesJson structure: `[{ title, code, language }]`.
- [ ] Update EnhancedTechnologyDetail Integration tab: render each code example with CodeBlock + "Try it Live" button.
- [ ] Wire LiveCodeEditor for JS examples (Python: show CodeBlock only, no Run).
- [ ] Migrate LangChain, Hugging Face, and 2–3 other tech code examples to Hygraph.
- **Deliverable:** Technology pages show real code blocks with "Try it Live" from Hygraph.

### Phase 3: Simulation Config (Week 3–4)

- [ ] Define simulationConfigJson schema (steps, type, fields).
- [ ] Migrate FraudDetectionSimulator config to Hygraph (link to fraud detection use case).
- [ ] Update components that render simulations to accept config from Hygraph.
- [ ] Add "Run Simulation" entry point on SolutionPage / UseCase detail when simulationConfig exists.
- **Deliverable:** Fraud detection simulation config driven by Hygraph.

### Phase 4: Diagrams (Week 4–5)

- [ ] Add diagramConfigJson to UseCase or Architecture (nodes, edges as Json).
- [ ] Migrate financial diagram configs (fraud detection, data integration, ai analysis, decision engine).
- [ ] Update ArchitectureDiagram / getIndustryDiagram to use Hygraph diagram config.
- [ ] Fallback to local INDUSTRY_DIAGRAMS when Hygraph empty.
- **Deliverable:** Architecture diagrams sourced from Hygraph.

### Phase 5: Full Implementation Registry (Week 5–6)

- [ ] Create implementationDataService: resolve documentation + simulation + diagram by Technology/UseCase/IndustryApplication.
- [ ] Migrate remaining industries (healthcare, etc.) and technologies.
- [ ] Deprecate or thin out local constants; use only as fallback.
- [ ] Add admin docs for content editors: how to add new sections, code examples, simulation config.
- **Deliverable:** Single source of truth in Hygraph; local constants as fallback only.

### Phase 6: Polish & Scale (Week 6+)

- [ ] Consider proper models (DocumentationSection, SimulationConfig) if Json becomes unwieldy.
- [ ] Add validation, preview in Hygraph UI.
- [ ] Expand simulations to more use cases (e.g. healthcare patient risk, manufacturing).
- [ ] Performance: cache, lazy load diagrams/simulations.

---

## 6. FILE REFERENCE

### Scripts to Create/Update

| Script | Purpose |
|--------|---------|
| `scripts/migrations/hygraph/extract_implementation_content.js` | Read local implementations, output JSON |
| `scripts/migrations/hygraph/push_documentation_sections.js` | Create/update documentation in Hygraph |
| `scripts/migrations/hygraph/push_simulation_config.js` | Push simulation config to UseCase |
| `scripts/migrations/hygraph/push_diagram_config.js` | Push diagram config to UseCase/Architecture |
| `scripts/migrations/hygraph/add_implementation_schema.js` | Add new Json fields via schema migration |

### Key App Files

| File | Role |
|------|------|
| `src/services/technologyService.js` | Technology + documentation + code examples |
| `src/services/useCaseService.js` | UseCase + documentation + simulation |
| `src/services/implementationDataService.js` | (New) Unified implementation data |
| `src/features/industries/pages/tabs/DocumentationTab.jsx` | Docs + CodeBlock + Try it Live |
| `src/pages/technology/EnhancedTechnologyDetail.jsx` | Integration tab + code examples |
| `src/constants/registry/industrySectionsRegistry.js` | Sections (merge Hygraph + local) |
| `src/constants/registry/industryDiagramsRegistry.js` | Diagrams (merge Hygraph + local) |
| `src/components/copilot/InteractiveSimulation.jsx` | Simulation from responseData |
| `src/constants/implementations/fraudDetectionStimulator.jsx` | Config-driven simulator |

---

## 7. RISKS & MITIGATION

| Risk | Mitigation |
|------|------------|
| Json fields hard to edit in Hygraph | Start with Json; migrate to proper models when needed. Provide CLI/admin scripts for bulk edit. |
| Breaking existing flows | Always fallback to local constants when Hygraph returns empty. Feature-flag new flow. |
| Diagram/simulation config size | Store compressed or split; lazy load. |
| Content migration errors | Validate JSON before push; run verification queries; keep local as source of truth until verified. |

---

## 8. SUCCESS CRITERIA

1. **Technology LangChain** shows code examples with CodeBlock + "Try it Live" from Hygraph.
2. **Fraud detection use case** shows documentation sections and simulation config from Hygraph.
3. **No regression** — existing financial/healthcare flows work with fallback.
4. **Content editable** — New documentation/code/simulation can be added via Hygraph (or migration scripts) without code changes.

---

## 9. DECISIONS NEEDED

1. **Json vs Models** — Start with Json (faster) or invest in proper models from day one?
2. **Technology vs UseCase ownership** — Documentation tied to Technology, UseCase, or both?
3. **Diagram storage** — Single Json field vs DiagramNode/DiagramEdge relations?
4. **Simulation types** — Support multiple simulator UIs (FraudDetectionStimulator, generic step-based) or one generic config schema?

---

*Document created from codebase audit and Hygraph architecture review. Update as implementation progresses.*
