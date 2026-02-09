#!/usr/bin/env node
/**
 * Test Hygraph MCP endpoint with the app's token.
 * Run from repo root: node scripts/test-hygraph-mcp.js
 * Requires .env with VITE_HYGRAPH_TOKEN (or HYGRAPH_TOKEN for MCP PAT).
 */
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
dotenv.config({ path: join(root, '.env') });

const MCP_URL = 'https://mcp-us-west-2.hygraph.com/cm1fkwyv5084x07mvgzp8hcml/master/mcp';
const token = process.env.HYGRAPH_TOKEN || process.env.VITE_HYGRAPH_TOKEN;

if (!token) {
  console.error('Missing HYGRAPH_TOKEN or VITE_HYGRAPH_TOKEN in .env');
  process.exit(1);
}

const initRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'brainwave-mcp-test', version: '1.0.0' },
  },
};

async function main() {
  console.log('Testing Hygraph MCP endpoint:', MCP_URL);
  console.log('Token length:', token?.length, '(Bearer)');
  try {
    const res = await fetch(MCP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(initRequest),
    });
    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    if (text) {
      try {
        const json = JSON.parse(text);
        console.log('Response:', JSON.stringify(json, null, 2));
      } catch {
        console.log('Body (raw):', text.slice(0, 500));
      }
    }
    if (!res.ok) {
      console.error('MCP test failed. If 401: use an MCP PAT from Hygraph (Project Settings → Access → Generate MCP PAT).');
      process.exit(1);
    }
    console.log('MCP connection OK.');
  } catch (err) {
    console.error('Request error:', err.message);
    process.exit(1);
  }
}

main();
