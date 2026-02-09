#!/usr/bin/env node
/**
 * Generate .cursor/mcp.json from .env so Cursor can connect to the Hygraph MCP server.
 * Uses VITE_HYGRAPH_TOKEN or HYGRAPH_TOKEN from .env (same token works for MCP).
 * Run from repo root: node scripts/setup-hygraph-mcp.js
 */
import dotenv from 'dotenv';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const envPath = join(root, '.env');
const examplePath = join(root, '.cursor', 'mcp.json.example');
const mcpPath = join(root, '.cursor', 'mcp.json');

dotenv.config({ path: envPath });

const token = process.env.HYGRAPH_TOKEN || process.env.VITE_HYGRAPH_TOKEN;
if (!token) {
  console.error('Missing HYGRAPH_TOKEN or VITE_HYGRAPH_TOKEN in .env');
  process.exit(1);
}

let config;
if (existsSync(mcpPath)) {
  config = JSON.parse(readFileSync(mcpPath, 'utf8'));
} else if (existsSync(examplePath)) {
  config = JSON.parse(readFileSync(examplePath, 'utf8'));
} else {
  console.error('No .cursor/mcp.json or .cursor/mcp.json.example found');
  process.exit(1);
}

if (config.mcpServers?.hygraph?.env) {
  config.mcpServers.hygraph.env.HYGRAPH_TOKEN = token;
}

writeFileSync(mcpPath, JSON.stringify(config, null, 2), 'utf8');
console.log('Wrote .cursor/mcp.json with token from .env. Restart Cursor (or refresh MCP) to connect to Hygraph.');
