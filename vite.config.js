import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import viteCompression from 'vite-plugin-compression';

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

const plugins = [
  react(),
  // Pre-compress assets so hosting layers (Netlify, Vercel, Nginx, S3+CloudFront)
  // serve .gz / .br directly instead of running on-the-fly compression.
  // Only compress files > 10 KB.
  viteCompression({
    algorithm: 'gzip',
    ext: '.gz',
    threshold: 10240,
    deleteOriginFile: false,
    verbose: false,
  }),
  viteCompression({
    algorithm: 'brotliCompress',
    ext: '.br',
    threshold: 10240,
    deleteOriginFile: false,
    verbose: false,
  }),
];

if (process.env.PRERENDER === '1') {
  const { default: prerender } = await import('@prerenderer/rollup-plugin');
  plugins.push(prerender({
    routes: prerenderRoutes,
    renderer: '@prerenderer/renderer-puppeteer',
    rendererOptions: {
      renderAfterTime: 3000,
      maxConcurrentRoutes: 2,
      headless: true,
      launchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      pageHandler: async (page, route) => {
        // Wait for react-helmet-async to have run. When Helmet has updated the
        // head, it stamps every tag it added with data-rh="true". If we see one,
        // SEO fired. This is stricter than waiting for a title change (which
        // could be spoofed by the default template title matching a page title).
        try {
          await page.waitForFunction(
            () => document.querySelector('meta[data-rh="true"]') !== null,
            { timeout: 15000, polling: 150 }
          );
        } catch (e) {
          console.warn(`[prerender] ${route} — helmet-async did not run within 15s (chunk load likely stuck)`);
        }

        // Route-specific wait for CMS-driven content to fully resolve. Without
        // this, /blog/post/* snapshots can capture the loading state because
        // helmet-async fires on BlogPage's slug-derived fallback title before
        // Hygraph's getPostDetails() promise settles. When post content is
        // resolved, PostDetail mounts a heading (h1 or h2) with class starting
        // with "text-3xl" and TwitterCard emits its OG image meta. Wait for
        // either signal, up to 10s, before snapshotting.
        if (route.startsWith('/blog/post/')) {
          try {
            await page.waitForFunction(
              // PostDetail renders <h1 class="text-3xl md:text-4xl ..."> once
              // Hygraph's getPostDetails resolves. TwitterCard emits an og:image
              // pointing at the CMS-hosted asset (hygraph or media.graphassets).
              () => {
                if (document.querySelector('h1.text-3xl')) return true;
                const og = document.querySelector('meta[property="og:image"]');
                const src = og?.getAttribute('content') || '';
                return src.includes('media.graphassets.com') || src.includes('hygraph');
              },
              { timeout: 10000, polling: 200 }
            );
          } catch (e) {
            console.warn(`[prerender] ${route} — CMS post did not resolve within 10s, snapshot may use slug-derived fallback`);
          }
        }

        // Extra settle time so lazy-loaded page components can finish mounting
        // and emit their own JSON-LD / structured data before we snapshot.
        await new Promise(r => setTimeout(r, 1500));
      },
    },
    postProcess(renderedRoute) {
      renderedRoute.html = renderedRoute.html.replace(
        /<html(\s[^>]*)?>/i,
        (match) => match
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
    // Raise the warning ceiling but keep individual chunks under 600KB via manualChunks.
    chunkSizeWarningLimit: 800,
    // Larger inline threshold means fewer small requests but bigger initial CSS/JS.
    // 4096 is the vite default; keep it.
    assetsInlineLimit: 4096,
    minify: 'terser',
    terserOptions: {
      compress: {
        // Only strip console.log/debug in production; keep console.warn/error so
        // Sentry & user-facing error logging still work.
        pure_funcs: ['console.log', 'console.debug', 'console.info'],
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
    // CSS code splitting: one CSS chunk per async import.
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Manual chunk grouping. Vendor libs are split by concern so common shell
        // pages don't have to download reactflow / chart / monaco / three unless
        // they actually need them.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          // IMPORTANT — do NOT separate React into its own chunk.
          // Many older libs (react-slick, react-flow, syntax highlighters) read
          // `React.PureComponent` at top-level module evaluation. If React is in
          // a different chunk, Rollup can end up with a circular chunk edge, and
          // the loader initialises `vendor.js` before `vendor-react.js` is done —
          // producing "Cannot read properties of undefined (reading 'PureComponent')"
          // at runtime. Keeping React in the default vendor chunk avoids this
          // whole class of bug. React itself is tiny (~50 KB gzipped) — the
          // "vendor-react" split was a micro-optimisation and not worth the
          // reliability cost.

          // Heavy, opt-in libraries only — routes that don't use them shouldn't
          // pay the download cost. These are safe to split because they DON'T
          // do top-level React access at import time (they're modern React
          // libraries using hooks / function components).

          // Monaco editor — very heavy (several hundred KB)
          if (id.includes('/@monaco-editor/') || id.includes('/monaco-editor/')) {
            return 'vendor-monaco';
          }

          // Chart libs — only ~4 routes use them
          if (id.includes('/chart.js/') || id.includes('/react-chartjs-2/')) {
            return 'vendor-chart';
          }

          // GraphQL / Hygraph client — only blog routes use it
          if (id.includes('/graphql-request/') || id.includes('/@apollo/')) {
            return 'vendor-gql';
          }

          // Everything else — React, react-dom, framer-motion, react-flow,
          // react-slick, react-syntax-highlighter, helmet-async, react-icons,
          // and all remaining node_modules — stays in the single vendor chunk.
          // Yes this is a big chunk, but it's cache-hit on every route, and it
          // avoids ALL cross-chunk React ordering hazards.
          return 'vendor';
        },
      },
    },
  },
  server: {
    port: 3007,
    historyApiFallback: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
    proxy: {
      // SEO agent backend — spawns orchestrator/workers, exposes SSE streams.
      // Run alongside the dev server via `npm run seo:agent` (port 5175).
      '/api': {
        target: process.env.SEO_AGENT_URL || 'http://localhost:5175',
        changeOrigin: true,
        ws: true,
        // SSE needs the response to be flushed line-by-line; disable proxy buffering.
        selfHandleResponse: false,
      },
    },
  }
});
