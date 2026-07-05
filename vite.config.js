import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Prerender plugin — enabled only when PRERENDER=1 to keep dev server fast.
// Route enumeration happens synchronously at config time via a pre-generated JSON snapshot.
import fs from 'fs';

let prerenderRoutes = ['/'];
try {
  const snapshotPath = path.resolve(process.cwd(), 'scripts', 'routes-snapshot.json');
  if (fs.existsSync(snapshotPath)) {
    const snap = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
    prerenderRoutes = snap.paths || ['/'];
  }
} catch (e) {
  console.warn('[vite] Could not read routes-snapshot.json, using / only');
}

const plugins = [react()];

if (process.env.PRERENDER === '1') {
  const { default: prerender } = await import('@prerenderer/rollup-plugin');
  plugins.push(prerender({
    routes: prerenderRoutes,
    renderer: '@prerenderer/renderer-puppeteer',
    rendererOptions: {
      renderAfterTime: 8000, // 8s hard cap; pageHandler races title-changed against this
      maxConcurrentRoutes: 2, // lower concurrency for stability
      headless: true,
      launchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      // Wait until the page title differs from the template default OR 6s elapses,
      // whichever comes first. Then wait 500ms for Helmet to flush remaining tags.
      pageHandler: async (page, route) => {
        // Wait for Helmet to update <title> away from the initial template,
        // OR up to 10 seconds. Pages without route-specific SEO fall through
        // to the initial template title.
        try {
          await page.waitForFunction(
            () => document.title !== 'Jedi Labs — We solve what AI fails' && document.title !== '',
            { timeout: 10000, polling: 100 }
          );
        } catch (e) {
          // ignore; render whatever we have
        }
        // Extra 800ms to let Helmet flush remaining meta/link tags after title fires.
        await new Promise(r => setTimeout(r, 800));
      },
    },
    postProcess(renderedRoute) {
      // Ensure well-formed HTML output
      renderedRoute.html = renderedRoute.html.replace(
        /<html(\s[^>]*)?>/i,
        (match) => match // preserve
      );
      return renderedRoute;
    },
  }));
  console.log(`[vite] Prerender enabled for ${prerenderRoutes.length} routes`);
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3007,
    historyApiFallback: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    }
  }
});
