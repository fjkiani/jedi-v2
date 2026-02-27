# TechnologySubcategory Audit & Plan

## Audit Summary

| Metric | Count |
|--------|-------|
| **Total subcategories** | 34 |
| **With description** | 4 (Data Sources, ML Monitoring, Monitoring & Logging, Security) |
| **With features** | 0 |
| **With additonalDetails** | 0 |
| **Missing all three** | 30 |

**Source:** Fetched via `categories { technologySubcategory { id, name, slug, description, features, additonalDetails } }`, flattened by id. Data in `all_subcategories_raw.json`.

## Target

Each TechnologySubcategory should have:

1. **description** – 2–3 sentences; what the subcategory is and how JEDI uses it where relevant.
2. **features** – Comma-separated capabilities or focus areas for the subcategory.
3. **additonalDetails** – Short paragraph or bullets on use cases and JEDI relevance (optional for UI but filled for consistency).

## Scripts

- **Fetch:** `scripts/migrations/hygraph/fetch_all_subcategories.js` – writes `all_subcategories_raw.json`.
- **Enhance:** `scripts/migrations/hygraph/enhance_subcategories.js` – updates description, features, additonalDetails from a content map (no slop; JEDI where relevant). All 34 updated.
- **Publish:** `scripts/migrations/hygraph/publish_all_subcategories.js` – publishes all subcategories from DRAFT to PUBLISHED. All 34 published.

## Subcategories (by slug)

Agent Core, Alerting, Analytics Environment, API Data Sources, Authentication, Backend (inference-backend), Caching, data ingestion, Data Processing, Data Quality, Data Sources, Data Warehousing, Databases, Deployment (data-deployment), Frameworks, Inference API, Interfaces, Memory, ML Monitoring, Model Serving, Model Training, Monitoring & Logging, Ontologies, Orchestration (data-orchestration), Protocols, Reasoning, Security, Storage (data-storage), Streaming Data, Structured Data, Tool Integration, Transformation (data-transformation), Unstructured Data, Vector Databases (vector-database).
