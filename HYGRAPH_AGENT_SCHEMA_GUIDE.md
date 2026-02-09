# Hygraph Schema Guide: Agent Registry

To fully activate **Phase 5 (The Neural Uplink)** for the Agent Registry, you need to create a new Model in Hygraph called `Agent`.

Once created and populated, the `JediComponentsShowcase` component will automatically switch from using the hardcoded "Active Duty" units to the live data from Hygraph.

## 1. Create Model: `Agent`

*   **Display Name:** Agent
*   **API ID:** `agent`
*   **Plural API ID:** `agents`
*   **Description:** An autonomous AI unit or persona (e.g., CrisPRO, FrappeBot).

## 2. Fields Definition

Add the following fields to the `Agent` model:

| Display Name | API ID | Type | Validations / Settings |
| :--- | :--- | :--- | :--- |
| **Name** | `name` | Single Line Text | Required, Title Field |
| **Codename** | `codename` | Single Line Text | Required, Unique (e.g., "CrisPRO") |
| **Tagline** | `tagline` | Single Line Text | Required |
| **Description** | `description` | Multi Line Text | Required |
| **Icon Name** | `icon` | Single Line Text | Required (Matches Lucide/Heroicon name, e.g., "heart", "cpu") |
| **Status** | `status` | Single Line Text | Enum or Text: "ACTIVE_DUTY", "DEPLOYED", "LEARNING" |
| **Color Gradient** | `color` | Single Line Text | Tailwind classes (e.g., "from-pink-500 to-rose-500") |
| **Avatar / Image** | `imageUrl` | Asset | Single Image (The visual representation of the agent) |
| **Capabilities** | `capabilities` | JSON | A list of objects: `[{ name: "Skill", description: "Details" }]` |

## 3. Sample Data (for "CrisPRO")

*   **Name:** THE ONCOLOGIST
*   **Codename:** CrisPRO
*   **Tagline:** Precision Medicine Agent
*   **Description:** Specialized in metastasis interception, AlphaFold protein folding integration, and clinical trial matching.
*   **Icon:** `heart`
*   **Status:** `ACTIVE_DUTY`
*   **Color:** `from-pink-500 to-rose-500`
*   **Capabilities (JSON Editor):**
    ```json
    [
      { "name": "AlphaFold Integration", "description": "Predicts protein structures for drug targets." },
      { "name": "Trial Matching", "description": "Matches patients to clinical trials with high precision." },
      { "name": "Metastasis Pattern Recognition", "description": "Identifies potential spread vectors." }
    ]
    ```

## 4. Verification

After publishing your `Agent` content, the application will automatically pick it up. If no agents are found, it falls back to the hardcoded `INTELLIGENCE_UNITS`.
