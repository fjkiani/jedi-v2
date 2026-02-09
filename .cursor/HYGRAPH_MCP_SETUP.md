# Hygraph MCP Server (Cursor)

The Hygraph MCP server is configured in `.cursor/mcp.json` so Cursor can read, create, update, and publish content in your Hygraph project via the Model Context Protocol.

## One-time setup

1. **Get an MCP PAT (Permanent Auth Token)**  
   - In [Hygraph](https://app.hygraph.com): open your project → **Project Settings** → **Access** → **Permanent Auth Tokens**.  
   - Click **Generate MCP PAT**, choose the scope (e.g. **Content MCP Server** or **General MCP Server**), then copy the token.

2. **Put the token in Cursor’s config**  
   - Open `.cursor/mcp.json`.  
   - Replace `REPLACE_WITH_YOUR_MCP_PAT` with your copied MCP PAT (inside the `env.HYGRAPH_TOKEN` value).

3. **Restart Cursor** (or use **Settings → MCP → Refresh**) so the Hygraph server connects.

## Endpoint

The MCP endpoint in `mcp.json` was derived from your Content API URL:

- **Region:** `us-west-2`  
- **Project:** `cm1fkwyv5084x07mvgzp8hcml`  
- **Environment:** `master`  

If your project uses a different region/environment, get the correct URL from **Project Settings → Access → Endpoints → MCP Server API** and update the URL in `.cursor/mcp.json`.

## Security

- Do **not** commit your real MCP PAT. Keep `REPLACE_WITH_YOUR_MCP_PAT` in the repo and set the actual token only in your local `.cursor/mcp.json`.
- Optionally add `.cursor/mcp.json` to `.gitignore` if you store the real token there (then each developer keeps their own local copy).

## Docs

- [Hygraph MCP Server](https://hygraph.com/docs/hygraph-ai/mcp-server)  
- Cursor: use a **manually selected** model; Auto mode may not work with this MCP server.
