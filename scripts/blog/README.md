# Blog Workflow: Research → Write → Publish

Targeted blog creation using industry audit data and Hygraph.

## 1. Research Topic

Get keywords, outlines, and suggested titles for a topic:

```bash
npm run blog:research -- --topic "agentic AI"
npm run blog:research -- --topic ai-identity --format json
```

**Topics:** `agentic-ai` | `ai-identity` | `voice-ai` | `rag-enterprise` | `co-pilots`

## 2. Write Post

Create a JSON file in `scripts/blog/drafts/`:

```json
{
  "title": "Identity Is the Missing Pillar of Agentic AI",
  "slug": "identity-pillar-agentic-ai",
  "excerpt": "91% of orgs use AI agents; 44% have no governance. Why identity is the missing pillar.",
  "content": {
    "children": [
      { "type": "paragraph", "children": [{ "text": "Your first paragraph." }] },
      { "type": "heading-two", "children": [{ "text": "A Section Heading" }] },
      { "type": "paragraph", "children": [{ "text": "More content." }] }
    ]
  },
  "featuredPost": false
}
```

**Content format:** Slate AST. See [Hygraph Rich Text](https://hygraph.com/docs/api-reference/content-api/rich-text-field).

## 3. Publish to Hygraph

```bash
npm run blog:create -- --file scripts/blog/drafts/my-post.json --publish
```

Omit `--publish` to create as draft only.

## Audit Data

- **docs/BLOG_CONTENT_AUDIT_2025.md** – Full audit with trends, keywords, sources
- **scripts/blog/audit-data.json** – Structured data used by `blog:research`

## Environment

Requires `.env`:

- `VITE_HYGRAPH_ENDPOINT` or `VITE_GRAPHCMS_ENDPOINT`
- `VITE_HYGRAPH_TOKEN`

Token needs Content API write permissions.
