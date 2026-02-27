# Use Case Build & Push: Recalibration

How use cases are built and pushed in this project, and how to add the Healthcare Receptionist & Clinical Operations use case.

---

## 1. How We Build and Push Use Cases

### Pipeline

1. **Author JSON** – Create an extracted JSON file in `scripts/migrations/hygraph/extracted/` with the required shape.
2. **Push to Hygraph** – Run `push_use_case_from_json.py --input path/to/file.json`.
3. **Publish** – The script creates or updates the UseCase, then publishes to PUBLISHED.

### Push script contract

**Script:** `scripts/migrations/hygraph/push_use_case_from_json.py`

**Input shape (what it reads):**

```
{
  "industrySlug": "healthcare",           // required; must exist in Hygraph
  "useCase": {
    "title": "...",
    "slug": "healthcare-receptionist-clinical-operations",
    "description": "...",
    "capabilities": ["...", "..."],
    "queries": ["...", "..."],
    "metrics": ["...", "..."],
    "architecture": {
      "description": "...",
      "components": [
        { "name": "...", "description": "...", "details": "...", "explanation": ["..."] }
      ],
      "flow": [
        { "step": "...", "description": "...", "details": "..." }
      ]
    },
    "implementation": { ... }             // optional; used on both CREATE and UPDATE
  }
}
```

**Script behavior:**
- Resolves `industrySlug` to an Industry ID (script errors if industry not found).
- Queries UseCase by slug. If found → updates title, description, capabilities, queries, metrics, implementation. (Note: architecture flow must be added via updateArchitecture if missing.)
- If not found → creates UseCase with architecture (components + flow) and implementation; then optionally links to IndustryApplication by title.
- Always publishes after create/update.
- IndustryApplication link: if `industry.industryApplication` exists, links UseCase to the app by `applicationTitle`.

**Prerequisites:**
- `VITE_HYGRAPH_ENDPOINT` and `VITE_HYGRAPH_TOKEN` in `.env`.
- Industry (e.g. `healthcare`) must exist in Hygraph (create via `industries.py` if needed).

---

## 2. Reference: Existing Use Cases

| Use Case | File | Industry | Slug |
|----------|------|----------|------|
| 24/7 Voice AI | `use_case_24_7_voice_ai_langchain.json` | telecommunications | 24-7-voice-ai-customer-service |
| Telecom (full page) | `hygraph_page_content_financial-services_advanced-fraud-detection-system.json` | financial-services | advanced-fraud-detection-system |
| Education | `hygraph_page_content_future-education_learn-intelligence-copilot.json` | future-education | learn-intelligence-copilot |
| CrisPRO Oncology | Created via `create_crispro_oncology_copilot.py` | healthcare | crispro-oncology-copilot |

**Simplest template:** `use_case_24_7_voice_ai_langchain.json` – flat, no industry nesting, just `industrySlug` + `useCase`.

---

## 3. Healthcare Receptionist: Mapping Proposal → JSON

### Root

| Field | Value |
|-------|--------|
| `industrySlug` | `healthcare` |
| `useCase.slug` | `healthcare-receptionist-clinical-operations` (or shorter: `healthcare-receptionist-ai`) |
| `useCase.title` | Healthcare Receptionist & Clinical Operations AI |

### useCase.description

Concise paragraph: problem (no-shows, manual scheduling, triage gaps) and what the AI does (HIPAA-compliant patient intake, FHIR-based scheduling, insurance checks, clinical triage, multi-channel coordination). ~3–5 sentences.

### useCase.capabilities

Map from proposal's 5 categories → 6–10 concrete bullets, e.g.:

- Patient intake with FHIR Patient resource creation, HIPAA consent capture
- Appointment scheduling with provider availability and FHIR Appointment
- Insurance eligibility and prior-authorization checks
- Clinical triage with urgency assessment and safety escalation
- HIPAA-compliant multi-channel (SMS, email, portal)
- Post-discharge follow-up and care-plan coordination

### useCase.queries

4–6 demo questions (e.g. “How does the AI handle chest pain calls?”, “What FHIR resources does it create?”, “How do you verify insurance eligibility?”).

### useCase.metrics

4–6 measurable outcomes from the proposal (e.g. resolution rate, no-show reduction, triage accuracy, FHIR resource validity).

### useCase.architecture

**description:** 2–3 sentences on flow: inbound patient request → orchestration layer (calendar, FHIR, triage logic) → multi-channel output; all PHI handled with HIPAA controls.

**components (5–7):**

1. Patient intake & registration (demographics, consent, FHIR Patient)
2. Clinical scheduling engine (calendar, FHIR Appointment, availability)
3. Insurance & auth layer (eligibility, prior auth, Coverage)
4. Clinical triage & routing (urgency, ICD-10, escalation)
5. Multi-channel orchestrator (SMS, email, portal, HIPAA templates)
6. FHIR resource layer (Patient, Appointment, Coverage, Observation, CarePlan)

Each: `name`, `description`, `details`, `explanation` (array).

**flow (5–8 steps):**

1. Request arrives (phone/SMS/portal)
2. Identity & consent
3. Intake or triage (depending on channel)
4. Scheduling / insurance checks
5. Confirmation and notifications
6. Logging and FHIR resource creation

Each: `step`, `description`, `details`.

### useCase.implementation

Object with (optional but useful):

- `requirements`: list of strings (FHIR access, MCP servers, telephony, etc.)
- `success_metrics`: list matching `metrics`
- `integration_points`: calendar, email, SMS, FHIR endpoints, task management

---

## 4. Implementation Steps for Healthcare Receptionist

1. **Ensure industry exists**
   - `healthcare` should already exist (CrisPRO uses it).
   - If missing: run `industries.py` (or equivalent) to create Healthcare.

2. **Create extracted JSON**
   - Path: `scripts/migrations/hygraph/extracted/use_case_healthcare_receptionist_clinical_operations.json`
   - Use the mapping in §3 and the shape in §1.
   - Use `use_case_24_7_voice_ai_langchain.json` as the structural template.

3. **Push**
   ```bash
   cd scripts/migrations/hygraph
   python push_use_case_from_json.py --input extracted/use_case_healthcare_receptionist_clinical_operations.json
   ```

4. **Verify**
   - In Hygraph: UseCase with slug `healthcare-receptionist-clinical-operations` (or chosen slug).
   - In app: `/industries/healthcare/solutions/healthcare-receptionist-clinical-operations`.

5. **Technology links (post-push)**
   - The push script does not connect technologies.
   - Connect in Hygraph UI or via a separate script: LangChain, Weaviate (or vector DB), FHIR-related techs if modeled.

6. **IndustryApplication link (optional)**
   - If there is an IndustryApplication for healthcare reception/clinical ops, add `industry.industryApplication` to the JSON so the push script can link it by `applicationTitle`.

---

## 5. Files Reference

| File | Purpose |
|------|---------|
| `scripts/migrations/hygraph/push_use_case_from_json.py` | Creates/updates UseCase from JSON and publishes |
| `scripts/migrations/hygraph/extracted/use_case_24_7_voice_ai_langchain.json` | Minimal template |
| `scripts/migrations/hygraph/create_crispro_oncology_copilot.py` | Different pattern (custom mutation, tech linking); use for reference, not as push input |
| `docs/USE_CASE_PLAN_CANCER_RESEARCH.md` | Planning template for another healthcare use case |

---

## 6. Proposal → JSON Checklist

- [ ] `industrySlug`: healthcare
- [ ] `useCase.slug`: chosen slug (e.g. `healthcare-receptionist-clinical-operations`)
- [ ] `useCase.title`: Healthcare Receptionist & Clinical Operations AI
- [ ] `useCase.description`: problem + solution, 3–5 sentences
- [ ] `useCase.capabilities`: 6–10 bullets
- [ ] `useCase.queries`: 4–6 demo questions
- [ ] `useCase.metrics`: 4–6 measurable outcomes
- [ ] `useCase.architecture.description`
- [ ] `useCase.architecture.components`: 5–7 entries
- [ ] `useCase.architecture.flow`: 5–8 steps
- [ ] `useCase.implementation`: requirements, success_metrics, integration_points (optional)
- [ ] Save to `extracted/use_case_healthcare_receptionist_clinical_operations.json`
- [ ] Run `push_use_case_from_json.py --input <path>`
- [ ] Verify in Hygraph and app; connect technologies if needed
