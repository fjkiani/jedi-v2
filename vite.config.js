import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePluginSitemap } from 'vite-plugin-sitemap';

const routes = [
  '/',
  '/solutions',
  '/team',
  '/about',
  '/blog',
  // Add all your static routes
];

export default defineConfig({
  plugins: [
    react(),
    VitePluginSitemap({
      hostname: 'https://www.jedilabs.org',
      routes: routes,
      robots: [
        {
          userAgent: '*',
          allow: '/',
        }
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    historyApiFallback: true,
  },
});
