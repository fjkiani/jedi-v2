# How to Fill Out All Technology Details

Technologies in Hygraph have three content fields that power the app’s technology pages. You can fill them in bulk with scripts or manually in Hygraph.

---

## 1. Technology fields in Hygraph

| Field | Type | Purpose |
|-------|------|--------|
| **description** | String | Short overview (used in cards and hero). |
| **features** | String | Comma-separated list of features (e.g. `"RAG, Semantic search, GraphQL API"`). |
| **businessMetrics** | String | Comma-separated metrics (e.g. `"95% search accuracy, 99.9% uptime"`). |
| **additonalDetails** | String | Long-form content (note: schema typo “additonal”). Markdown/HTML for tabs. |

Relations: **category**, **subcategories**, **useCases** (optional).

---

## 2. Option A: Run the existing enhancement script (recommended)

The repo has a script that updates **description**, **features**, **businessMetrics**, and **additonalDetails** for a fixed set of technologies (LangChain, Hugging Face, Weaviate, PyTorch, PostgreSQL) with JEDI-focused content.

**Steps:**

1. **Env**  
   In project root, ensure `.env` has:
   - `VITE_HYGRAPH_ENDPOINT` = your Hygraph API URL  
   - `VITE_HYGRAPH_TOKEN` = your Hygraph token  

2. **Run (from project root):**
   ```bash
   node scripts/migrations/hygraph/enhance_technology_content.js
   ```
   Or, if you use the package runner:
   ```bash
   node --experimental-vm-modules scripts/migrations/hygraph/enhance_technology_content.js
   ```
   (If you hit “Cannot use import”, ensure Node supports ES modules or use a runner that does.)

3. **What it does**  
   - Queries Hygraph for each technology by **slug** (e.g. `langchain`, `weaviate`).  
   - Updates only technologies that exist and that are listed in the script’s `ENHANCED_TECHNOLOGIES` object.  
   - Writes to **DRAFT**; you still need to **publish** each technology in Hygraph for the content to show on the live site.

4. **Add more technologies**  
   Edit `scripts/migrations/hygraph/enhance_technology_content.js`: add another entry to `ENHANCED_TECHNOLOGIES` with the same shape (name, description, features, businessMetrics, architecture, integration, useCases, resources). The script uses `techSlug` as the key (must match Hygraph `slug`).

---

## 3. Option B: Python script (all technologies, JEDI content)

For a broader set of technologies and JEDI-oriented text:

```bash
cd /path/to/brainwave-main
source venv/bin/activate   # or your venv
pip install gql requests python-dotenv   # if needed
python scripts/migrations/hygraph/enhance_technologies_with_jedi.py
```

- Fetches all technologies from Hygraph (DRAFT).  
- For each, can set description, features, businessMetrics, and a long-form “additional details” style field (if the script writes to `additonalDetails`).  
- Check the script’s `get_all_technologies` and update mutation to confirm it updates the same three content fields + additonalDetails.

Again: updates are in DRAFT; publish in Hygraph when you want them live.

---

## 4. Option C: Hygraph UI (manual)

1. Open [Hygraph](https://app.hygraph.com) → your project.  
2. Go to the **Technology** model (or “Technologies” in the sidebar).  
3. Open a technology.  
4. Fill:
   - **Description**
   - **Features** (comma-separated)
   - **Business metrics** (comma-separated)
   - **Additonal details** (rich text / markdown)  
5. Save and **Publish**.

---

## 5. Option D: Bulk CSV/JSON and custom script

For many technologies:

1. Export a list of technologies (e.g. slug, name, and the four content fields above) to CSV or JSON.  
2. Write a small script that:
   - Reads the file.
   - For each row, calls Hygraph `updateTechnology` (by slug or id) with:
     - `description`, `features`, `businessMetrics`, `additonalDetails`.
   - Uses the same env vars and DRAFT stage as above.  
3. Run the script, then publish in Hygraph as needed.

Reference mutation (from `TECHNOLOGY_SCHEMA_ANALYSIS.md`):

```graphql
mutation UpdateTechnologyContent(
  $id: ID!
  $description: String
  $features: String
  $businessMetrics: String
  $additonalDetails: String
) {
  updateTechnology(where: { id: $id }, data: {
    description: $description
    features: $features
    businessMetrics: $businessMetrics
    additonalDetails: $additonalDetails
  }) {
    id
    name
    slug
  }
}
```

Use `technologyS(where: { slug: "..." }) { id }` to resolve slug → id if you only have slugs.

---

## 6. Content guidelines (from your rules)

- **Real implementations:** Prefer JEDI/client examples over generic marketing.  
- **Measurable metrics:** Use real or plausible metrics (e.g. “80% faster response times” where you can back it).  
- **JEDI components:** Where relevant, mention JEDI Ensemble™, JEDI Rules™, JEDI AutoTune™, CrisPRO, etc.  
- **additonalDetails:** Use for tabs/long content: architecture, integration, use cases, resources. Markdown is fine if the field supports it.

---

## 7. Quick reference

| Goal | Action |
|------|--------|
| Fill 5 key techs (LangChain, Weaviate, etc.) with JEDI content | Run `enhance_technology_content.js` (Option A). |
| Fill many techs with JEDI-style text | Run `enhance_technologies_with_jedi.py` (Option B). |
| Fix or tweak a few techs by hand | Use Hygraph UI (Option C). |
| Bulk upload from spreadsheet | Use CSV/JSON + update script (Option D). |

After any script run, open Hygraph → Technologies → pick a record → **Publish** so the changes appear on the site.
