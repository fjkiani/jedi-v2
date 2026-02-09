# ZETA SOLUTION REFORGE: "De-Dump" Protocol

**Target:** `/solutions/ai-ml-solutions` (and all dynamic/category pages)
**Current Status:** "The Dump" (Unstructured mix of static/dynamic data, visually "off").
**Root Cause:** Hygraph Schema for `Category` is thin (`name`, `slug`, `desc`, `technologies`). It lacks "Architecture" or "Benefits" fields.

---

## AGENT CONTEXT: Implementation Guide for Enhancement

> **Purpose:** This section gives another agent the file locations, data flow, and constraints needed to execute the ZETA reforge without rediscovering the codebase.

### File Locations & Routing

| What | Path |
|------|------|
| **Main Solution Page** | `src/pages/solutions/SolutionPage.jsx` |
| **Route** | `/solutions/:slug` (e.g. `/solutions/ai-ml-solutions`) — defined in `App.jsx` |
| **Solution Architecture Component** | `src/components/solutions/SolutionArchitecture.jsx` |
| **Architecture Diagram** | `src/components/diagrams/ArchitectureDiagram.jsx` → uses `DiagramView`, `UseCaseView`, `DeploymentView` |
| **Static Solution Data** | `src/constants/solutions/ai-ml.js` (and `full-stack`, `data-engineering`, `ai-agents`) |
| **Solution Registry** | `src/constants/solutions/index.js` — `getSolutionBySlug(slug)` returns static solution |
| **Hygraph Query** | `src/graphql/queries/solutions.js` — `GET_SOLUTION_BY_SLUG` fetches `categories` + `technologies` (with `subcategories`) |

> **Note:** There are *two* different `SolutionPage.jsx` files:
> - `src/pages/solutions/SolutionPage.jsx` → **this one** (category/solution pages like ai-ml-solutions)
> - `src/features/industries/pages/SolutionPage.jsx` → industry use-case pages (`/industries/:industryId/solutions/:solutionId`)

### Current Data Flow

1. **Page load:** `SolutionPage` calls `getSolutionBySlug(slug)` for static fallback, then `hygraphClient.request(GET_SOLUTION_BY_SLUG, { slug })`.
2. **Hygraph returns:**
   - `categories[0]` → `{ id, name, slug, description }` (no architecture, no benefits)
   - `technologies` → `{ id, name, slug, icon, description, category, subcategories: [{ name, slug }] }`
3. **Merge logic (lines 116–147):** Technologies are grouped by `subcategories[].name` into `techStackMap` (e.g. `{ "Agent Core": { "LangChain": {...} }, "Vector DBs": { "Weaviate": {...} } }`).
4. **State:** `solution` is updated with `title`, `description`, `techStack` from Hygraph; **`architecture` stays from static** (`ai-ml.js` has full `architecture` with nodes, connections).

### Architecture: Static vs Dynamic

- **Architecture** is **always from static** `aiMlSolution.architecture` — Hygraph has no architecture field for Category.
- `SolutionArchitecture` expects: `{ title, description, nodes: [{ id, label, x, y, description, technologies }] }`.
- `ArchitectureDiagram` / `DiagramView` expect a different shape (from `architectureDiagrams` / `getDiagramBySlug`).
- **Problem:** For dynamic categories (or future ones without static mapping), the static diagram is misleading or missing.

### Schema Constraints (Hygraph)

- **Category:** `id`, `name`, `slug`, `description` only. No `architecture`, `benefits`, or `metrics`.
- **Technology:** Has `subcategories: [Subcategory]`. Subcategories have `name`, `slug`.
- **Subcategory reference:** See `.cursor/rules/technology-subcategory-enhancement-strategy.mdc` for full subcategory list (e.g. "Agent Core", "Vector Databases", "Memory", "Tools").

### What Exists vs What to Build

| Component | Exists? | Location | Notes |
|-----------|---------|----------|-------|
| Hero | Yes | `SolutionPage.jsx` lines 201–232 | Uses `solution.title`, `solution.description`. Business metrics from `solution.businessValue?.metrics` (static only). |
| Architecture | Yes | `SolutionArchitecture.jsx` | Renders static `architecture` + `ArchitectureDiagram`. |
| Tech Stack | Yes | `SolutionPage.jsx` lines 287–321 | Renders `solution.techStack` (already grouped by subcategory from Hygraph). |
| Use Cases | Yes | `SolutionPage.jsx` lines 246–284 | Swiper of `UseCaseCard`. Fetches ALL use cases (not filtered by category). |
| **TechTopology** | No | — | New component: graph of technologies by subcategory. Use `solution.techStack` structure. |
| **System Stats Ticker** | No | Hero | "Active Modules: X \| Deployed Use Cases: Y" — derive from `technologies.length` and filtered use cases. |

### Enhancement Checklist for Agent

1. **Hero "Zeta Flavor"**
   - Inject "Status: Active", "Protocol: [slug]" when description is short.
   - Add System Stats: `Active Modules: ${technologies.length}` and `Deployed Use Cases: ${useCasesFilteredByCategory?.length}` (requires filtering use cases by category or linking logic).

2. **Architecture / TechTopology**
   - **Option A:** Hide `SolutionArchitecture` when data is from Hygraph and no static architecture mapping exists (check if `solution.id` matches a known static slug).
   - **Option B:** Build `TechTopology` component: input `solution.techStack` (or raw technologies), group by subcategory, render as connected nodes (e.g. ReactFlow or simple CSS flow). MVP: simple flow layout, no fake static images.
   - Reuse `solution.techStack` structure: `{ [subcategoryName]: { [techName]: { icon, category } } }`.

3. **Tech Stack "Loadout View"**
   - Refactor existing tech grid (lines 292–318) to: compact list, grouped by subcategory, terminal/HUD aesthetic, monospace for data.

4. **Use Cases "Mission Reports"**
   - Keep Swiper; restyle cards to "Mission Report" look (borders, monospace labels, dark-mode dominance).

5. **Filter Use Cases**
   - `GET_USE_CASES` returns all use cases. To show "Deployed Use Cases: N" and filter by solution, either:
     - Extend query to filter by `category`/`solution` relationship, or
     - Filter client-side if use cases have `category`/`solutions` field in Hygraph.

### Gotchas & Dependencies

- **Slug mismatch:** Hygraph may use `ai-ml` while routes use `ai-ml-solutions`. SolutionPage retries with `slug.replace('-solutions', '')` (lines 99–103).
- **Theme:** `useTheme()` / `isDarkMode` used throughout. Zeta calls for "dark mode dominance" — ensure new components respect `isDarkMode`.
- **Icons:** Tech cards use `details.icon` (URL from Hygraph). Fallback to `Icon` component if missing.
- **Existing conventions:** See `.cursor/rules/jedi-core-components.mdc`, `business-focused-content-enhancement.mdc` for content standards.

---

## 2. IMPLEMENTATION DIRECTIVES (The "How")

### A. HERO SECTION ENHANCEMENT
*   **File:** `src/pages/solutions/SolutionPage.jsx`
*   **Logic:**
    *   Calculate `activeModules` = Total count of technologies in `solution.techStack`.
    *   Calculate `deployedUseCases` = Count of `useCases` filtered by `category.slug === slug`.
*   **Visual:** Add a "Systems Monitor" bar below the description.
    ```jsx
    <div className="flex gap-4 text-xs font-mono text-primary-1 uppercase tracking-widest border border-n-6 bg-n-8/50 p-2 rounded">
      <span>Active Modules: {techCount}</span>
      <span>//</span>
      <span>Deployments: {caseCount}</span>
    </div>
    ```

### B. TECH TOPOLOGY (The "Living Architecture")
*   **Component:** `src/components/solutions/TechTopology.jsx` (NEW)
*   **Library:** `reactflow` (reuse existing dependency).
*   **Data Transformation:**
    *   **Center Node:** Solution Name (e.g. "AI Agents"). Type: `input`. Position: `{x: 0, y: 0}`.
    *   **Layer 1 Nodes:** Subcategories (e.g. "Memory"). Type: `default`. Connected to Center.
    *   **Layer 2 Nodes:** Technologies (e.g. "Pinecone"). Type: `output`. Connected to Subcategory.
*   **Styling:**
    *   Dark Mode default.
    *   Edges: `smoothstep`, animated.
    *   Nodes: Minimal borders, glowing effects for active paths.
*   **Integration:** In `SolutionPage.jsx`, render `<TechTopology />` if `!solution.architecture`.

### C. TECH LOADOUT (The "Arsenal")
*   **Component:** `src/components/solutions/TechLoadout.jsx` (NEW)
*   **Visual:** "Terminal List" instead of Grid.
*   **Layout:**
    *   Header: Subcategory Name (e.g. ">> AGENT CORE").
    *   Body: List of techs with icons.
    *   CSS: `font-mono`, `border-l-2 border-primary-1`, `bg-n-8`.

### D. USE CASE FILTERING
*   **Logic:** `SolutionPage.jsx` currently fetches ALL use cases.
*   **Fix:**
    ```javascript
    const filteredUseCases = useCases.filter(uc => 
      uc.category?.slug === slug || 
      uc.tags?.includes(slug) // Fallback if schema varies
    );
    ```
*   **Display:** Only pass `filteredUseCases` to the Swiper.

## 3. EXECUTION ORDER (72-Hour Sprint)
1.  **Frontend Logic:** Implement `filteredUseCases` and "System Stats" in Page. (Quick Win)
2.  **Visual Core:** Build `TechTopology` to replace the missing Architecture section. (High Impact)
3.  **Refinement:** Build `TechLoadout` to replace the Tech Grid. (Polish)
4.  **Styles:** Apply Zeta (Dark/Mono) theme overrides.

**Status:** Awaiting Launch Command.
