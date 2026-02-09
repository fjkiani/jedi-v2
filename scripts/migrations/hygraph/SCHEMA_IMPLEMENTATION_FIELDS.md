# Schema: Implementation Fields for Dynamic Content

Add these fields to Hygraph for dynamic documentation, code examples, and simulations.

## Option 1: Use Existing `implementation` (Json) — No Schema Change

The UseCase model already has `implementation` (Json). You can store:

```json
{
  "documentationSections": { "fundamentals": { "title": "...", "sections": [...] } },
  "simulationConfig": { "steps": [...], "type": "FRAUD_DETECTION" },
  "diagramConfig": { "nodes": [...], "edges": [...] }
}
```

Push via `push_implementation_to_hygraph.js`. The implementationDataService will read `implementation.documentationSections`, etc.

## Option 2: Add Dedicated Json Fields (Recommended for clarity)

Run a schema migration (Hygraph Management API) to add:

### UseCase
| Field | Type | Description |
|-------|------|-------------|
| documentationSectionsJson | Json | Documentation sections per sectionId |
| simulationConfigJson | Json | Simulation steps/config |
| diagramConfigJson | Json | ReactFlow nodes/edges |

### Technology
| Field | Type | Description |
|-------|------|-------------|
| codeExamplesJson | Json | Array of `{ title, code, language }` |
| integrationStepsJson | Json | Array of quick-start steps (strings) |

### Migration Operations (Hygraph Management API)

```javascript
// Example: createSimpleField for Technology
{
  operation_name: "createSimpleField",
  params: {
    parentApiId: "Technology",
    apiId: "codeExamplesJson",
    type: "JSON",
    displayName: "Code Examples (JSON)"
  }
}
```

Use `get_management_operation_schema` and `submit_batch_migration` from Hygraph MCP for schema changes.

## Verification

After pushing:
1. Query UseCase by slug and inspect `implementation` or `documentationSectionsJson`
2. Frontend should show docs from Hygraph when implementationDataService fetches successfully
