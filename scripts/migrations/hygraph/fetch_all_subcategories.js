#!/usr/bin/env node

/**
 * Fetch All Technology Subcategories from Hygraph
 * Gets id, name, slug, description, features, additonalDetails for audit and enhancement.
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
      'gcms-stage': 'DRAFT',
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

async function main() {
  const query = `
    query {
      categories(first: 100) {
        id
        name
        slug
        technologySubcategory {
          id
          name
          slug
          description
          features
          additonalDetails
        }
      }
    }
  `;

  const result = await makeRequest(query);
  if (result.error) {
    console.error('Request error:', result.error);
    process.exit(1);
  }
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    process.exit(1);
  }

  const categories = result.data?.categories || [];
  const byId = new Map();
  categories.forEach((cat) => {
    (cat.technologySubcategory || []).forEach((sub) => {
      if (!byId.has(sub.id)) {
        byId.set(sub.id, { ...sub, category: { id: cat.id, name: cat.name, slug: cat.slug } });
      }
    });
  });
  const list = Array.from(byId.values()).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  console.log('Fetched', list.length, 'subcategories (from', categories.length, 'categories)');
  if (list[0]) console.log('Sample keys:', Object.keys(list[0]).join(', '));

  const outPath = new URL('../../../all_subcategories_raw.json', import.meta.url);
  fs.writeFileSync(outPath, JSON.stringify(list, null, 2));
  console.log('Saved to all_subcategories_raw.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
