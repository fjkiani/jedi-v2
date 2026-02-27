# Technology Details: Audit & Plan

Audit and enhancement are driven by **audit output** (JSON) and **Hygraph schema**. No hard-coded tech or subcategory lists; worklists are derived from the audit file.

---

## 1. Schema (source: Hygraph)

**Technology** – content fields used for “details” in the app:

| Field | Type | Required | App use |
|-------|------|----------|--------|
| `description` | String | ✓ | Cards, hero |
| `features` | String | No | Comma-separated list in UI |
| `businessMetrics` | String | No | Comma-separated list in UI |
| `additonalDetails` | String | No | Long-form (schema typo: "additonal") |
| `category` | Relation | ✓ | Grouping |
| `subcategories` | Relation[] | ✓ | Grouping |

**Category / Subcategory** – define hierarchy; technologies link to one category and zero or more subcategories.

---

## 2. Audit output shape (required contract)

The plan assumes an audit artifact with this structure. Scripts must produce it; the plan consumes it.

- **Root:** `{ subcategories: [...], uncategorizedTechnologies: [...], summary: { ... } }`.
- **Per subcategory:**  
  `{ subcategory: { id, name, slug }, totalTechs, missingContent: { features, businessMetrics, additonalDetails }, enhancementScore, priority, technologies: [...] }`.  
  Each technology: `{ id, name, slug, description, features, businessMetrics, additonalDetails, category, subcategories }`.
- **summary:** at least `totalSubcategories`, `totalTechnologies`, `technologiesWithSubcategories`, `uncategorizedTechnologies` (count or length), and counts per `priority` if used.
- **Priority** must be computed from the same rule everywhere: e.g. `enhancementScore < 0.67 → HIGH`, `0.33 ≤ enhancementScore < 0.67 → MEDIUM`, else `LOW`. The plan does not assume specific counts (e.g. “6 HIGH”); it filters by `priority`.

**Where the audit comes from:**  
Regenerate via `scripts/migrations/hygraph/fetch_all_technologies.js` (or equivalent) that: (1) fetches all technologies with `category`, `subcategories`, and the three content fields; (2) groups by subcategory; (3) for each subcategory computes `missingContent` (count of techs with empty features / businessMetrics / additonalDetails) and `enhancementScore`; (4) assigns `priority` from that score; (5) writes the JSON. Uncategorized = technologies with empty `subcategories` (or `subcategories_none` in Hygraph).

---

## 3. Definitions (testable)

**Missing (for a single technology):**

- `features`: `value == null || (typeof value === 'string' && value.trim() === '')`
- `businessMetrics`: same predicate
- `additonalDetails`: same predicate

**Enhancement score (for a subcategory):**  
`(number of technologies in that subcategory with all three of features, businessMetrics, additonalDetails non-missing) / totalTechs`.  
So: 0 = none complete, 1 = all complete.

**Priority (for a subcategory):**  
Use the same thresholds as the script that writes the audit (e.g. HIGH / MEDIUM / LOW from `enhancementScore`). The plan only references `item.priority` from the audit.

**Needs update (content quality):**  
Apply only when a field is non-missing. Fail if: (a) no concrete capability or outcome stated, (b) same sentence appears on another technology, (c) metric with no number or no source. Pass when: capability/outcome is specific, text is unique, metrics are quantified and traceable to a real implementation or client.

---

## 4. How to traverse (no hard-coded names)

1. **Worklist by priority**  
   From audit: `subcategories.filter(s => s.priority === 'HIGH')`, then MEDIUM, then LOW. For each group, iterate `s.technologies` in a stable order (e.g. `s.technologies.sort((a,b) => (a.slug || '').localeCompare(b.slug || ''))`.

2. **What to do per technology**  
   For each tech in the worklist:  
   - If `features` is missing → set `features`.  
   - If `businessMetrics` is missing → set `businessMetrics`.  
   - If `additonalDetails` is missing → set `additonalDetails`.  
   - If a field is non-missing but fails “needs update” → rewrite to pass.

3. **Uncategorized**  
   From audit: `uncategorizedTechnologies` (or derive: all technologies that appear in no `subcategories[].technologies`). For each: (1) optionally assign to a subcategory in Hygraph; (2) then apply same fill/update rules for the three fields.

4. **Categories**  
   Used only for grouping in the audit. If you want to process by category, group subcategories by their technologies’ `category` (e.g. by `category[0].slug`), then apply the same priority order within each category.

---

## 5. Content rules (pass/fail)

- **features:** Pass = each item is a concrete capability (what it does or supports). Fail = marketing adjective only, or no concrete capability.
- **businessMetrics:** Pass = each item is a measurable outcome (number or clear metric) tied to a real or documented use. Fail = “improves efficiency” (or similar) with no number or source.
- **additonalDetails:** Pass = structured (e.g. sections), references real implementations or clients where relevant, no copy-paste from another tech. Fail = generic paragraph, or duplicate of another technology.

Do not invent metrics. If no real number exists, state the kind of outcome (e.g. “reduces manual review time”) without a made-up percentage.

---

## 6. Procedures

**Refresh audit (single source of truth)**  
Run the script that outputs the audit JSON (e.g. `fetch_all_technologies.js` extended to emit the subcategory structure above, or a small wrapper that reads its output and builds `subcategories` + `uncategorizedTechnologies` + `summary`). Save to the path your tooling expects (e.g. `subcategory_enhancement_analysis.json`). All downstream steps read from this file; no manual lists.

**Build worklist**  
Read audit JSON → `high = subcategories.filter(s => s.priority === 'HIGH')` → for each, collect `s.technologies` → flatten to one list (optionally keeping `subcategory.slug` for logging). Repeat for MEDIUM, then LOW. Then append `uncategorizedTechnologies`. That order is the full worklist.

**Update in Hygraph**  
For each technology in the worklist, call `updateTechnology` (or MCP `update_entry` for Technology) with only the fields that were filled or changed: `features`, `businessMetrics`, `additonalDetails`. Use `id` from the audit. Write to DRAFT; publish after review. Throttle (e.g. delay between requests) to avoid rate limits.

---

## 7. Checklist (data-driven)

- [ ] Run audit script; overwrite audit JSON.
- [ ] Verify audit shape: `subcategories[]`, `uncategorizedTechnologies`, `summary` with expected keys.
- [ ] Build worklist: HIGH → MEDIUM → LOW → uncategorized (from audit, no hard-coded slugs).
- [ ] For each technology in worklist: fix missing fields; fix “needs update” on non-missing fields.
- [ ] Push updates to Hygraph (DRAFT), then publish.
- [ ] Quality pass: spot-check for duplicate text and unsourced metrics.

---

## 8. Scripts and files

| Asset | Role |
|-------|------|
| Audit script (e.g. `fetch_all_technologies.js` or equivalent) | Produces audit JSON with the shape in §2. |
| `subcategory_enhancement_analysis.json` | Default path for audit output; plan reads from here. |
| `enhance_technology_content.js` | Example of calling Hygraph update; adapt to read worklist from audit JSON. |
| MCP `get_entity_schema` / `update_entry` | Schema and single-entry updates when not rate-limited. |

If the audit script uses a different output path or shape, update §2 and the “Refresh audit” step so the plan stays applicable.

---

## 9. Applicability

- **New technologies/subcategories:** Re-run audit; worklist and priorities come from the new output. No doc edit.
- **Changed schema:** If Technology gets new content fields, add them to §1, add “missing” rules in §3, and include them in the audit script’s `missingContent` and in the update payload in §6.
- **Different priority thresholds:** Change only in the audit script; the plan still filters by `priority` from the JSON.

No tech names, no subcategory names, and no counts are fixed in this doc; they all come from the audit.
