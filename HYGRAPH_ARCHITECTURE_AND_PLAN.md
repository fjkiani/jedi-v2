# Hygraph Architecture & Technology Enhancement Plan

## Document Purpose
Comprehensive fetch, documentation, and plan for updating technologies—from schema and relationships through to implementation approach. Top-to-bottom understanding.

---

## 1. HYGRAPH CONTENT COUNTS (Fetched)

| Model | Count |
|-------|-------|
| **Technology** | 221 |
| **UseCase** | 19 |
| **Industry** | 15 |
| **IndustryApplication** | 11 |
| **Category** | 12 |
| **TechnologySubcategory** | 62 |
| **JediComponent** | 6 |

---

## 2. HYGRAPH SCHEMA – Key Types

### 2.1 Technology
| Field | Type | Notes |
|-------|------|-------|
| id, name, slug | Required | |
| description | String (required) | |
| icon | String (required) | URL, not Asset |
| features | String | Comma-separated |
| businessMetrics | String | Comma-separated |
| additonalDetails | String | Note typo in schema |
| priority | Int (required) | |
| **Relations** | | |
| category | [Category] | Many |
| subcategories | [TechnologySubcategory] | Many |
| useCases | [UseCase] | Many |
| industryApplication | [IndustryApplication] | Many |
| integratedBy | [Technology] | Tech-to-tech |
| integrations | [Technology] | Tech-to-tech |

### 2.2 UseCase
| Field | Type | Notes |
|-------|------|-------|
| id, title, slug | | |
| description, capabilities, queries, metrics | | |
| implementation | Json | |
| **Relations** | | |
| industry | Industry | Single |
| technologies | [Technology] | Many |
| industryApplication | [IndustryApplication] | Many |
| architecture | Architecture | Single |
| category | Category | Single |

### 2.3 Industry
| Field | Type |
|-------|------|
| id, name, slug | |
| description, fullDescription, benefits, capabilities, keyFeaturesJson, statisticsJson |
| industryApplication | [IndustryApplication] |

### 2.4 IndustryApplication
| Field | Type | Notes |
|-------|------|-------|
| id, applicationTitle | | No slug field |
| industry | Industry | Single |
| useCase | [UseCase] | Many |
| jediComponent | [JediComponent] | Many |
| technology | [Technology] | Many |
| industryChallenge, jediApproach | RichText | |
| keyCapabilities, expectedResults | | |

### 2.5 Category
| Field | Type |
|-------|------|
| id, name, slug |
| technologySubcategory | [TechnologySubcategory] |
| technologies | [Technology] |

### 2.6 TechnologySubcategory
| Field | Type |
|-------|------|
| id, name, slug, description |
| features, additonalDetails |
| technology | [Technology] (inverse) |
| category | Category |
| jediComponent | JediComponent |

### 2.7 JediComponent
| Field | Type |
|-------|------|
| id, name, slug |

### 2.8 Architecture (embedded in UseCase)
| Field | Type |
|-------|------|
| description | |
| components | [{ name, description, details, explanation }] |
| flow | [{ step, description, details }] |

---

## 3. RELATIONSHIP GRAPH (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TOP LEVEL                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Category (12)                                                               │
│    └── technologySubcategory [TechnologySubcategory] (62 subcats)            │
│    └── technologies [Technology]                                             │
│                                                                              │
│  Industry (15)                                                               │
│    └── industryApplication [IndustryApplication] (11 apps)                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        MIDDLE – CROSS-CONNECTORS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  IndustryApplication (11)                                                    │
│    ├── industry → Industry                                                   │
│    ├── useCase → [UseCase]       (0–3 use cases per app)                     │
│    ├── jediComponent → [JediComponent]                                       │
│    └── technology → [Technology]                                             │
│                                                                              │
│  UseCase (19)                                                                │
│    ├── industry → Industry                                                   │
│    ├── technologies → [Technology]                                           │
│    ├── industryApplication → [IndustryApplication]                           │
│    ├── category → Category                                                   │
│    └── architecture → Architecture (components, flow)                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        BOTTOM – LEAF ENTITIES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  Technology (221)                                                            │
│    ├── category → [Category]                                                 │
│    ├── subcategories → [TechnologySubcategory]                               │
│    ├── useCases → [UseCase]                                                  │
│    └── industryApplication → [IndustryApplication]                           │
│                                                                              │
│  TechnologySubcategory (62)                                                  │
│    └── technology → [Technology]  (inverse)                                  │
│                                                                              │
│  JediComponent (6): JEDI Ensemble™, JEDI AutoTune™, JEDI Rules™,             │
│    ProteinBind, JEDI Deploy™, JEDI Monitor™                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. URL ROUTING & DATA MAPPING

| URL Pattern | Component | Hygraph Query | Key Params |
|-------------|-----------|---------------|------------|
| `/industries/:industryId` | IndustryPage | `industries(where: { slug })` | industryId = industry.slug |
| `/industries/:industryId/solutions/:solutionId` | SolutionPage | `useCase(where: { slug })` | solutionId = useCase.slug |
| `/technology/:slug` | EnhancedTechnologyDetail | `technologyS(where: { slug })` | slug = technology.slug |
| `/technology/:slug/use-case/:useCaseSlug` | TechnologyDetail | use case by slug | |
| `/technology/jedi-ensemble` etc. | JediComponentPage | Jedi component | |
| `/solutions/*` | SolutionsPage | Local + Hygraph | |
| `/jedi` | JediPage | jediDataService (local) | |

**Important:** SolutionPage uses **UseCase.slug** as `solutionId`, not IndustryApplication. IndustryApplication does not have a slug.

---

## 5. CURRENT STATE – Industry ↔ UseCase ↔ IndustryApplication

| Industry | Slug | IndustryApplications | UseCases (via app or useCase.industry) |
|----------|------|----------------------|----------------------------------------|
| Financial Services | financial-services | Real-time Fraud Detection & Prevention | (no useCase linked) |
| Healthcare | healthcare | Accelerating Drug Target Identification | biomedical-research-intelligence-assistant |
| Technology | technology | 100x Engineering Acceleration, Agentic Talent Acquisition | intelligent-manufacturing-operations-agent, biomedical-research-intelligence-assistant, medical-image-classification |
| Retail | retail | AI-Powered Personalization & Inventory Optimization | (none) |
| Manufacturing | manufacturing | Agentic Smart Factory Operations | (none) |
| Energy | energy | Agentic Grid Optimization & Renewable Integration | intelligent-manufacturing-operations-agent |
| Education | education | Agentic Personalized Learning Orchestration | medical-image-classification |
| Media & Entertainment | media-entertainment | Agentic Content Personalization & Monetization | (none) |
| Telecommunications | telecommunications | Agentic Network Operations (AIOps) | (none) |

**UseCase slugs that drive SolutionPage URLs:**
- ai-powered-medical-diagnostics
- ai-powered-research-assistant
- biomedical-research-intelligence-assistant
- advanced-fraud-detection-system
- clinical-decision-support
- predictive-maintenance-optimization
- intelligent-recommendation-engine
- intelligent-manufacturing-operations-agent
- medical-image-classification
- (1 use case has null slug: student-retention-ai)

**Note:** frappebot-crm-agent exists in `create_frappebot.py` / `jedi_agents_manifest.py` but was not present in the sampled UseCase list; may need to be created or verified.

---

## 6. TECHNOLOGY TAB DATA SOURCES

| Tab | Hygraph Fields | Local (aiMlTechStack, solutions) | Status |
|-----|----------------|----------------------------------|--------|
| **Overview** | description, businessMetrics | capabilities | ✅ |
| **Features** | features (string) | primaryUses (array) | ⚠️ Format merge |
| **Architecture** | useCases[].architecture | architecture, deploymentOptions | ❌ 7% from Hygraph |
| **Integration** | — | integrationSteps, codeExamples | ❌ Local only |
| **Use Cases** | relatedUseCases (via useCases) | useCases | ❌ 7% from Hygraph |
| **Resources** | additonalDetails | documentation, tutorials | ❌ Local / empty |

---

## 7. LOCAL CONSTANTS (Non-Hygraph)

| Path | Purpose |
|------|---------|
| `src/constants/solutions/ai-ml.js` | aiMlSolution – architecture, techStack |
| `src/constants/solutions/data-engineering.js` | dataEngineeringSolution |
| `src/constants/solutions/full-stack.js` | fullStackSolution |
| `src/constants/solutions/ai-agents.js` | aiAgentsSolution |
| `src/constants/techCategories/aiMlTechStack.js` | Tech details (OpenAI, etc.) – primaryUses, useCases, deploymentOptions |
| `src/constants/jedi/*` | JEDI implementations, architecture |
| `src/constants/implementations/*` | Industry-specific implementations (financial, healthcare) |
| `src/constants/registry/*` | Registries, mappers |

---

## 8. QUERIES & MUTATIONS

### Queries (singular / list)
- `technology` / `technologyS`
- `useCase` / `useCaseS`
- `industry` / `industries`
- `industryApplication` / `industryApplications`
- `category` / `categories`
- `technologySubcategory` / `technologySubcategories`
- `jediComponent` / `jediComponents`

### Mutations
- create/update/delete/publish: Technology, UseCase, Industry, IndustryApplication, Category, TechnologySubcategory, JediComponent

---

## 9. IMPLEMENTATION PLAN (Top to Bottom)

### Phase 1: Schema & Relationship Clarity
1. Confirm IndustryApplication ↔ UseCase linkage for all 11 applications.
2. Identify technologies with no useCases or industryApplication.
3. List TechnologySubcategory ↔ Technology mappings.

### Phase 2: Subcategory-First Enhancement
1. **Audit by subcategory** – For each of 62 subcategories, list technologies.
2. **Prioritize** – Agent Core, Vector Databases, ML Frameworks, etc.
3. **Per subcategory** – Ensure technologies have category, subcategories, and links to use cases.

### Phase 3: Connect Technologies to Content
1. **Technology → UseCase** – Connect 221 technologies to relevant use cases (target: top 50+).
2. **Technology → IndustryApplication** – Connect to applications where the tech is used.
3. **Technology → JediComponent** – Link to JEDI components where applicable.

### Phase 4: Populate Tab Content
1. **Overview** – Ensure description + businessMetrics for all.
2. **Features** – Parse features string in UI; optionally add JEDI points to additonalDetails.
3. **Architecture** – Rely on useCases[].architecture; connect techs to use cases with architecture.
4. **Integration** – Use additonalDetails (markdown) until schema adds dedicated fields.
5. **Use Cases** – Populate via useCases relation; link to SolutionPage URLs.
6. **Resources** – Use additonalDetails for links; consider adding documentation/github/website fields.

### Phase 5: Enhancement Pipeline
1. **Fetch** – Run fetch_all_technologies.js → technologies_for_enhancement.json.
2. **Enrich** – Add JEDI content for top techs.
3. **Push** – Script that reads JSON and calls updateTechnology.
4. **Verify** – Run verify_enhancements.js.

### Phase 6: Unify Data Sources
1. Decide: migrate aiMlTechStack into Hygraph or keep as fallback.
2. Ensure technologyService and EnhancedTechnologyDetail use consistent data flow.
3. Fix category display (avoid “Uncategorized”).

---

## 10. FILES REFERENCE

### Fetch / Audit
- `scripts/migrations/hygraph/fetch_all_technologies.js` → technologies_for_enhancement.json
- `scripts/migrations/hygraph/audit_technology_tabs.js` → technology_tabs_audit_report.json

### Update
- `scripts/migrations/hygraph/enhance_ml_technologies.js`
- `scripts/migrations/hygraph/enhance_technology_content.js`
- `scripts/migrations/hygraph/enhance_ai_agents.js`

### Schema Introspection
- `scripts/migrations/hygraph/list_types.py`
- `scripts/migrations/hygraph/audit_full_schema.py`

### App Components
- `src/pages/technology/EnhancedTechnologyDetail.jsx` – Technology tabs
- `src/features/industries/pages/SolutionPage.jsx` – Use case / solution page
- `src/features/industries/pages/IndustryPage.jsx` – Industry page
- `src/services/technologyService.js` – Technology data fetching

---

## 11. DECISIONS NEEDED

1. **IndustryApplication slug** – Schema has no slug; SolutionPage uses UseCase.slug. Confirm intended URL model.
2. **frappebot-crm-agent** – Verify existence in Hygraph and correct industry/slug.
3. **Schema changes** – Add documentation, github, website to Technology?
4. **Local constants** – Migrate aiMlTechStack into Hygraph or keep as fallback?
5. **Order of work** – Subcategory-first vs technology-first vs use-case-first.

---

*Document generated from Hygraph introspection and codebase audit.*
