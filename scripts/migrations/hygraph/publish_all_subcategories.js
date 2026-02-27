#!/usr/bin/env node

/**
 * Publish All TechnologySubcategory entries to PUBLISHED in Hygraph.
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT;
const TOKEN = process.env.VITE_HYGRAPH_TOKEN;

async function makeRequest(query, variables = {}) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

const PUBLISH_MUTATION = `
  mutation PublishTechnologySubcategory($id: ID!) {
    publishTechnologySubcategory(where: { id: $id }, to: PUBLISHED) {
      id
      slug
      stage
    }
  }
`;

async function main() {
  if (!ENDPOINT || !TOKEN) {
    console.error('Missing VITE_HYGRAPH_ENDPOINT or VITE_HYGRAPH_TOKEN');
    process.exit(1);
  }

  const rawPath = new URL('../../../all_subcategories_raw.json', import.meta.url);
  const data = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

  console.log(`Publishing ${data.length} subcategories to PUBLISHED...\n`);

  let ok = 0;
  let err = 0;

  for (const sub of data) {
    const result = await makeRequest(PUBLISH_MUTATION, { id: sub.id });
    if (result.error || result.errors) {
      const msg = result.error || result.errors?.[0]?.message || '';
      if (msg.includes('already published') || msg.includes('Already published')) {
        ok++;
        process.stdout.write('.');
      } else {
        console.log(`❌ ${sub.slug}: ${msg}`);
        err++;
      }
    } else {
      ok++;
      process.stdout.write(ok % 20 === 0 ? `${ok}\n` : '.');
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n\nDone. Published: ${ok}, errors: ${err}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
