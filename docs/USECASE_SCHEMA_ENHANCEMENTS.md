# UseCase Schema Enhancements

## Summary

The UseCase model in Hygraph has been enhanced with story-driven fields to support compelling use-case pages with tabs: Overview, Terminal/Test, The Problem, The Solution, Architecture, Technologies, Results, Implementation, Resources.

## New Fields Added

### Phase 1: Story (Problem–Solution–Outcome)

| Field | Type | Description |
|-------|------|-------------|
| `clientChallenge` | Rich Text | The real problem – pain points, constraints |
| `beforeState` | Rich Text | How things worked before – inefficiencies |
| `jediApproach` | Rich Text | How JEDI solves it – methodology |
| `outcomes` | Rich Text | What changed – behavioral shifts |
| `resultsHeadline` | String | One-line impact (e.g. "80% research time reduction") |
| `resultsNarrative` | Rich Text | Story around the metrics |

### Phase 2: Terminal / Test

| Field | Type | Description |
|-------|------|-------------|
| `queryExamples` | JSON | Structured example inputs/outputs |
| `testScenarios` | Rich Text | Scenarios users can try |

### Phase 3: Media

| Field | Type | Description |
|-------|------|-------------|
| `heroImage` | Asset | Hero/cover image |
| `demoVideoUrl` | String | YouTube/Vimeo demo URL |
| `pdfDeck` | Asset | Presentation or spec PDF |

### Phase 4: Architecture & Tech

| Field | Type | Description |
|-------|------|-------------|
| `architectureNarrative` | Rich Text | How the system is built |
| `technologyNarrative` | Rich Text | Why these technologies |
| `implementationTimeline` | String | e.g. "8–12 weeks" |
| `prerequisites` | Rich Text | Data, integrations, access needed |
| `capabilityNarrative` | Rich Text | Context for capabilities |
| `beforeAfterComparison` | JSON | e.g. `{ before: "4 weeks", after: "3 days" }` |
| `risksAndMitigations` | Rich Text | Risks and mitigations |

## Tab Mapping (for SolutionPage / Use Case Detail)

| Tab | Fields to Display |
|-----|-------------------|
| **Overview** | description, heroImage, resultsHeadline |
| **Terminal / Test** | queries, queryExamples, testScenarios |
| **The Problem** | clientChallenge, beforeState |
| **The Solution** | jediApproach, outcomes |
| **Architecture** | architecture (existing), architectureNarrative |
| **Technologies** | technologies (existing), technologyNarrative |
| **Results** | metrics, resultsHeadline, resultsNarrative, beforeAfterComparison |
| **Implementation** | implementation, implementationTimeline, prerequisites, risksAndMitigations |
| **Resources** | demoVideoUrl, pdfDeck |

## Next Steps

1. Update GraphQL queries in `GetUseCaseDetail` (SolutionPage) to fetch new fields
2. Refactor SolutionPage with tabbed interface
3. Populate new fields for existing use cases (e.g. AI-Powered Research Assistant)
