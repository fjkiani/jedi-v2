// Writes routes-snapshot.json for vite.config.js to consume synchronously.
// Runs before `vite build --mode=production` when prerendering.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllRoutes } from './enumerate-routes.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const routes = await getAllRoutes();
  const snapshot = {
    generatedAt: new Date().toISOString(),
    paths: routes.map(r => r.path),
    detail: routes,
  };
  const outPath = path.resolve(__dirname, 'routes-snapshot.json');
  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2));
  console.log(`[snapshot] wrote ${routes.length} paths to ${path.relative(process.cwd(), outPath)}`);
}

main().catch(e => {
  console.error('[snapshot] failed:', e);
  process.exit(1);
});
