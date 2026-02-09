#!/usr/bin/env node

/**
 * Push Implementation Content to Hygraph
 *
 * Reads extracted/implementation_content.json and updates UseCase implementation
 * (or documentationSectionsJson, simulationConfigJson when schema supports them).
 *
 * Prerequisites:
 * - Run extract_implementation_content.js first
 * - UseCase.implementation field exists (Json type)
 * - Optional: add documentationSectionsJson, simulationConfigJson via schema migration
 *
 * @see DYNAMIC_IMPLEMENTATIONS_AND_SIMULATION_PLAN.md
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXTRACTED_FILE = path.join(__dirname, 'extracted', 'implementation_content.json');

const ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT;
const TOKEN = process.env.VITE_HYGRAPH_TOKEN;

/**
 * No hardcoded slug map. hygraphUseCaseSlug comes from SOLUTION_REGISTRY
 * (populated by extract script from each solution config).
 */

async function makeRequest(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      'gcms-stage': 'DRAFT',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');
  return json.data;
}

async function getUseCaseIdBySlug(slug) {
  const data = await makeRequest(
    `query ($slug: String!) {
      useCaseS(where: { slug: $slug }, first: 1) {
        id
        title
        slug
      }
    }`,
    { slug }
  );
  const uc = data?.useCaseS?.[0];
  if (!uc) return null;
  return uc.id;
}

async function updateUseCaseImplementation(useCaseId, implementation) {
  const mutation = `
    mutation UpdateUseCaseImplementation($id: ID!, $implementation: Json!) {
      updateUseCase(where: { id: $id }, data: { implementation: $implementation }) {
        id
        title
        implementation
      }
    }
  `;
  await makeRequest(mutation, { id: useCaseId, implementation });
}

async function main() {
  console.log('🚀 Push Implementation Content to Hygraph\n');

  if (!ENDPOINT || !TOKEN) {
    console.error('❌ Missing VITE_HYGRAPH_ENDPOINT or VITE_HYGRAPH_TOKEN');
    process.exit(1);
  }

  if (!fs.existsSync(EXTRACTED_FILE)) {
    console.error(`❌ Run extract_implementation_content.js first. Expected: ${EXTRACTED_FILE}`);
    process.exit(1);
  }

  const content = JSON.parse(fs.readFileSync(EXTRACTED_FILE, 'utf8'));

  for (const [industryKey, solutions] of Object.entries(content.industries || {})) {
    for (const [solutionKey, data] of Object.entries(solutions)) {
      const useCaseSlug = data?.hygraphUseCaseSlug;

      if (!useCaseSlug) {
        console.log(`⏭️  No hygraphUseCaseSlug for ${industryKey}/${solutionKey}, skipping (add to SOLUTION_REGISTRY)`);
        continue;
      }

      const useCaseId = await getUseCaseIdBySlug(useCaseSlug);
      if (!useCaseId) {
        console.log(`⚠️  UseCase not found: ${useCaseSlug}, skipping`);
        continue;
      }

      const implementation = {
        documentationSections: data.documentation,
        simulationConfig: data.implementation?.metrics ? { metrics: data.implementation.metrics } : null,
        diagramConfig: data.diagram || null,
        ...data.implementation,
      };

      await updateUseCaseImplementation(useCaseId, implementation);
      console.log(`✅ Updated ${useCaseSlug} with implementation data`);
    }
  }

  console.log('\n✅ Push complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
