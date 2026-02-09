# Solutions routing & Hygraph audit

## Summary

- **Home:** Featured AI Applications is commented out; **JEDI Applications Preview** (APPLICATIONS REGISTRY teaser) is shown instead and links to `/jedi`.
- **Header (Infrastructure dropdown):** Category slugs from Hygraph are mapped so links go to existing solution pages; unknown slugs send users to `/solutions`.

## Hygraph categories (solution slugs)

From `categories(stage: PUBLISHED)`:

| Slug                    | Name                 | Mapped URL / behavior                    |
|-------------------------|----------------------|------------------------------------------|
| `ml`                    | Machine-Learning     | `/solutions/ai-ml-solutions`             |
| `automation`            | Automation           | `/solutions/ai-agents`                   |
| `data-engineering`      | Data Engineering     | `/solutions/data-engineering`            |
| `frontend-development`  | Frontend Development | `/solutions/full-stack-development`      |
| `ai-agents`             | AI Agents            | `/solutions/ai-agents`                   |
| `nlp-nlu`               | NLP/NLU              | `/solutions` (list; no dedicated page)  |
| `task-planning`         | Task Planning        | `/solutions`                             |
| `decision-algorithms`   | Decision Algorithms  | `/solutions`                             |
| `system-integration-tech` | System Integration | `/solutions`                             |
| `continuous-learning`   | Continuous Learning  | `/solutions`                             |

## App-side solution content (constants)

These slugs have full content in `src/constants/solutions/` and are used when Hygraph has no/enough data:

- `ai-ml-solutions` (ai-ml.js)
- `ai-agents` (ai-agents.js)
- `data-engineering` (data-engineering.js)
- `full-stack-development` (full-stack.js)

## How SolutionPage works

1. **Route:** `/solutions/:slug` → `SolutionPage`.
2. **Data:**  
   - Fetches `GET_SOLUTION_BY_SLUG` from Hygraph (category by `slug`: doctrine, technologies, relatedUseCases).  
   - Falls back to `getSolutionBySlug(slug)` from `@/constants/solutions` if needed.
3. **Layout:** Same for all solutions: hero, problem/value, use cases swiper, architecture, tech stack, etc. (same as `/solutions/ai-ml-solutions`).
4. **Not found:** If no solution is found, the page shows “Solution not found” and lists links to the four solutions above plus “Return to Solutions” to `/solutions`.

## Header slug mapping (where it’s done)

In `src/components/Header.jsx`, when building the Infrastructure dropdown from Hygraph categories:

- `SOLUTION_SLUG_MAP`: `automation` → `ai-agents`, `ml` → `ai-ml-solutions`, `frontend-development` → `full-stack-development`.
- `VALID_SOLUTION_SLUGS`: `ai-ml-solutions`, `ai-agents`, `data-engineering`, `full-stack-development`.
- If category slug is in the map → use mapped slug in `/solutions/{slug}`.
- Else if in `VALID_SOLUTION_SLUGS` → use `/solutions/{slug}`.
- Else → use `/solutions` (list page).

Adding new solution pages later: add the slug to `VALID_SOLUTION_SLUGS` (and optionally to `SOLUTION_SLUG_MAP` if a Hygraph category slug should point to it), and add the solution in `src/constants/solutions/` and in `src/constants/solutions/index.js`.
