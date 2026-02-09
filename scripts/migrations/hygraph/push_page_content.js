#!/usr/bin/env node
/**
 * Push extracted page content to Hygraph by running existing migration scripts
 * with --input <path>. No GraphQL or mutation logic here; all logic lives in:
 *
 *   - industries.py                 (create industry if missing)
 *   - populate_industry_details.py (update industry content)
 *   - populate_industry_applications.py (create/update industry application)
 *   - push_use_case_from_json.py    (create/update use case, link app, publish)
 *
 * Usage:
 *   node scripts/migrations/hygraph/push_page_content.js [path-to-extracted.json]
 *   node scripts/migrations/hygraph/push_page_content.js
 *     (default: extracted/hygraph_page_content_future-education_learn-intelligence-copilot.json)
 *
 * Requires: .env with VITE_HYGRAPH_ENDPOINT, VITE_HYGRAPH_TOKEN (and Python with gql, requests, dotenv).
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', '..', '..');
const hygraphDir = join(root, 'scripts', 'migrations', 'hygraph');
const extractedDir = join(hygraphDir, 'extracted');

function getPayloadPath() {
  const arg = process.argv[2];
  if (arg) {
    const resolved = arg.startsWith('/') ? arg : join(root, arg);
    if (existsSync(resolved)) return resolved;
    const inExtracted = join(extractedDir, arg);
    if (existsSync(inExtracted)) return inExtracted;
  }
  const defaultPath = join(extractedDir, 'hygraph_page_content_future-education_learn-intelligence-copilot.json');
  if (existsSync(defaultPath)) return defaultPath;
  console.error('No JSON file found. Pass path or use default extracted file.');
  process.exit(1);
}

function runPython(scriptName, inputPath) {
  const scriptPath = join(hygraphDir, scriptName);
  if (!existsSync(scriptPath)) {
    console.error(`Script not found: ${scriptPath}`);
    process.exit(1);
  }
  console.log(`\n>>> ${scriptName} --input ${inputPath}`);
  execSync(process.platform === 'win32' ? 'python' : 'python3', ['-u', scriptPath, '--input', inputPath], {
    cwd: root,
    stdio: 'inherit',
  });
}

function main() {
  const path = getPayloadPath();
  console.log('Pushing content from:', path);

  runPython('industries.py', path);
  runPython('populate_industry_details.py', path);
  runPython('populate_industry_applications.py', path);
  runPython('push_use_case_from_json.py', path);

  console.log('\nDone.');
}

main();
