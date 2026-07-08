// Hygraph client for the SEO agent — uses BOTH the content CDN
// (VITE_HYGRAPH_ENDPOINT for reads) AND the management endpoint (for schema
// introspection and eventual write mutations if a management token is provided).
//
// IMPORTANT: env values are read lazily inside each call. When server.mjs is
// invoked with node, .env.local is loaded AFTER the ES-module import phase
// finishes, so any variable read at module-top would be undefined even though
// it is later available in process.env.

import fetch from 'node-fetch';

function readEnv() {
  return {
    CDN: process.env.VITE_HYGRAPH_ENDPOINT || process.env.HYGRAPH_ENDPOINT || null,
    CDN_TOKEN: process.env.VITE_HYGRAPH_TOKEN || process.env.HYGRAPH_TOKEN || null,
    MGMT: process.env.HYGRAPH_MANAGEMENT_ENDPOINT || null,
    MGMT_TOKEN: process.env.HYGRAPH_MANAGEMENT_TOKEN || null,
  };
}

async function graphql(endpoint, token, query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.text();
  let parsed;
  try { parsed = JSON.parse(body); } catch { parsed = { errors: [{ message: body.slice(0, 500) }] }; }
  if (!res.ok) {
    return { ok: false, status: res.status, errors: parsed.errors || [{ message: body.slice(0, 200) }] };
  }
  if (parsed.errors) return { ok: false, status: res.status, errors: parsed.errors };
  return { ok: true, data: parsed.data };
}

export async function content(query, variables) {
  const { CDN, CDN_TOKEN } = readEnv();
  if (!CDN) return { ok: false, errors: [{ message: 'VITE_HYGRAPH_ENDPOINT missing' }] };
  return graphql(CDN, CDN_TOKEN, query, variables);
}

export async function management(query, variables) {
  const { MGMT, MGMT_TOKEN } = readEnv();
  if (!MGMT || !MGMT_TOKEN) {
    return { ok: false, errors: [{ message: 'management endpoint/token not configured' }] };
  }
  return graphql(MGMT, MGMT_TOKEN, query, variables);
}

export function hygraphConfig() {
  const { CDN, CDN_TOKEN, MGMT, MGMT_TOKEN } = readEnv();
  return {
    cdn_endpoint: CDN || null,
    cdn_token_present: !!CDN_TOKEN,
    management_endpoint: MGMT || null,
    management_token_present: !!MGMT_TOKEN,
  };
}
