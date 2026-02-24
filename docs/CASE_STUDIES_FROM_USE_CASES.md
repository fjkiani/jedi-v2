# Case Studies from Use Cases

The app has a **Case Study** content type and a **Use Case** content type. They serve different purposes: we **change the content** so one is "how it's built," the other is "how it's applied in the real world."

---

## Current state

| Source | Model | Content |
|--------|--------|--------|
| **Case Studies page** (`/case-studies`) | `CaseStudy` | Fetches `caseStudies` from Hygraph; shows grid of cards; detail at `/case-studies/:slug`. |
| **Case study detail** | `CaseStudy` | Expects: title, slug, excerpt, clientName, results, coverImageUrl, videoUrl, description (rich text), pdfDeck, galleryImages, technologies. |
| **Use cases** | `UseCase` | Live in Hygraph: title, slug, description, capabilities, queries, metrics, implementation, architecture (flow, components), industry, technologies. Shown at `/industries/:industryId/solutions/:solutionId`. |

CaseStudy and UseCase are separate models; there is no UseCase → CaseStudy relation in the schema.

---

## Content split (no duplication)

| Content type | Purpose | Where it lives | What we write |
|--------------|---------|----------------|----------------|
| **Use case** | How it's built / functionality | `UseCase` in Hygraph; industry/solution pages | Features, architecture, flow, implementation, metrics. Technical and solution-focused. |
| **Case study** | How it's applied in the real world | `CaseStudy` in Hygraph; `/case-studies/:slug` | A **story**: theoretical or near-future scenario, concrete situation, how the solution is applied, outcomes. Story-led; not feature lists. |

Same solution (e.g. Healthcare Receptionist) can have both: one use case (the build) and one case study (the application story). Content is different by design — no duplicate copy.

---

## Case study content: story, not fluff

Case studies are **applied-in-real-world** narratives. They should feel **futuristic but grounded** — plausible near-future or theoretical scenarios, not marketing fluff.

**Do**
- One clear scenario (e.g. "A regional hospital group in 2027…", "A mid-size engineering team adopts…").
- Concrete situation: who, what context, what pressure or constraint.
- How the solution is **applied** (decisions, rollout, integration points) — not a list of features.
- Outcomes in plain language (e.g. "no-show rate dropped", "pipelines self-heal"); metrics only where they support the story.
- Short, specific sentences; no filler.

**Don't**
- Copy use case capabilities or architecture into the case study.
- Use vague claims ("transformative", "cutting-edge") without a concrete scene.
- Invent client names or results; use theoretical or anonymized scenarios and plausible outcomes.

---

## Case study structure (for Hygraph)

| Field | Use for |
|-------|--------|
| **title** | Scenario or application name (e.g. "Regional health system rolls out AI reception") |
| **slug** | URL-safe; can align with use case for pairing, e.g. `healthcare-receptionist-application` |
| **clientName** | Theoretical or anonymized (e.g. "Regional Health System", "Mid-size SaaS") or "Theoretical scenario" |
| **excerpt** | 2–3 sentences: setting + what was applied + one outcome. Story hook, not feature summary. |
| **results** | 2–5 outcome bullets; concrete and plausible. |
| **description** | Rich text: **Scenario** (who, context, pressure), **How it was applied** (what they did with the solution), **Outcomes** (what changed). Story only; no architecture or implementation details. |
| **technologies** | Link same as the paired use case for "See how it's built" to solution page. |

**Ways to create CaseStudy entries**
- **Manual:** In Hygraph, create a CaseStudy, fill with story content per template below, link technologies, publish.
- **Script / MCP:** Map scenario + application + outcomes to CaseStudy shape; `create_entry` then `publish_entry`. Rich text as Slate AST.

---

## Format template (case study = application story)

```
Title:    [Application scenario] — e.g. "When a hospital group turned front desk over to AI"
Slug:     [URL-safe] — e.g. healthcare-receptionist-application
Client:   [Theoretical / anonymized] — e.g. "Regional hospital group" or "Theoretical scenario"
Excerpt:  [2–3 sentences: setting, what they applied, one concrete outcome. No feature list.]

Description (rich text):
  ## Scenario
  [Who, context, pressure. e.g. "A 12-site hospital group was losing referrals to no-shows and hold times. Front desk couldn't scale."]

  ## How it was applied
  [What they did with the solution: rollout, integration points, decisions. Not "we built X" — "they ran intake via X, triage via Y."]

  ## Outcomes
  [What changed: 2–5 concrete results. Plausible, not invented.]

Results (plain): [Same outcomes as bullets or one line]
Technologies: [Link same as use case for "See how it's built"]
```

Use this for each case study paired to a use case (Healthcare Receptionist, GitLab MLOps, 24/7 Voice AI, CrisPRO, etc.): **use case** = how it's built; **case study** = how it's applied in a real-world-style scenario.

---

## Files

| File | Purpose |
|------|--------|
| `src/pages/caseStudies/CaseStudiesPage.jsx` | Fetches caseStudies; shows grid of case study cards. |
| `src/pages/caseStudies/CaseStudyDetailPage.jsx` | Fetches caseStudy by slug; shows story content and "See how it's built" link to solution/use case. |
| `src/graphql/queries/caseStudies.js` | GET_CASE_STUDIES, GET_CASE_STUDY_BY_SLUG. |
| `docs/schema-templates/CASESTUDY_SCHEMA_TEMPLATE.md` | CaseStudy content template. |
| `scripts/migrations/hygraph/createCaseStudySchema.js` | Creates CaseStudy model (already exists in project). |
