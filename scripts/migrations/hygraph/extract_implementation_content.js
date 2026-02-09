#!/usr/bin/env node

/**
 * Extract Implementation Content (Dynamic — No Hardcoding)
 *
 * Reads from SOLUTION_REGISTRY (single source of truth). Discovers all
 * industries and solutions dynamically. Outputs JSON for push script.
 *
 * No hardcoded industry:solution mappings. Add entries to SOLUTION_REGISTRY;
 * this script discovers them automatically.
 *
 * @see DYNAMIC_IMPLEMENTATIONS_AND_SIMULATION_PLAN.md
 * @see src/constants/registry/solutionRegistry.js
 */

import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { SOLUTION_REGISTRY } from '../../../src/constants/registry/solutionRegistry.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'extracted');
const OUTPUT_FILE = join(OUTPUT_DIR, 'implementation_content.json');

/**
 * Serialize content for Hygraph. Handles nested objects; strips functions.
 */
function serializeForHygraph(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(serializeForHygraph);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'function') continue;
    out[k] = serializeForHygraph(v);
  }
  return out;
}

function main() {
  console.log('📦 Extracting implementation content from SOLUTION_REGISTRY\n');

  const industries = {};
  let count = 0;

  for (const [industryId, solutions] of Object.entries(SOLUTION_REGISTRY)) {
    industries[industryId] = {};
    for (const [solutionId, config] of Object.entries(solutions)) {
      if (!config) continue;
      const { documentation, implementation, diagrams, hygraphUseCaseSlug } = config;
      industries[industryId][solutionId] = {
        hygraphUseCaseSlug: hygraphUseCaseSlug || null,
        documentation: serializeForHygraph(documentation) || null,
        implementation: serializeForHygraph(implementation) || null,
        diagram: serializeForHygraph(diagrams) || null,
      };
      count++;
      console.log(`  ✓ ${industryId}/${solutionId} → ${hygraphUseCaseSlug || '(no Hygraph slug)'}`);
    }
  }

  const payload = {
    extractedAt: new Date().toISOString(),
    source: 'SOLUTION_REGISTRY',
    industries,
  };

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf8');

  console.log(`\n✅ Extracted ${count} solution(s) to ${OUTPUT_FILE}`);
}

main();
