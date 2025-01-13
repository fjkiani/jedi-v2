import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import sitemap from 'vite-plugin-sitemap';

// Dynamic route generation function
const getDynamicRoutes = async () => {
  // Base routes that are always present
  const staticRoutes = ['/', '/solutions', '/team', '/about', '/blog'];
  
  // Only attempt to get dynamic routes if we have the Hygraph endpoint
  if (process.env.VITE_HYGRAPH_ENDPOINT) {
    try {
      const { hygraphClient } = await import('./src/lib/hygraph');
      
      // Get dynamic routes from Hygraph
      const { teams } = await hygraphClient.request(`
        {
          teams {
            slug
          }
        }
      `);
      const teamRoutes = teams.map(team => `/team/${team.slug}`);

      const { solutions } = await hygraphClient.request(`
        {
          solutions {
            slug
          }
        }
      `);
      const solutionRoutes = solutions.map(solution => `/solutions/${solution.slug}`);

      return [...staticRoutes, ...teamRoutes, ...solutionRoutes];
    } catch (error) {
      console.warn('Warning: Could not fetch dynamic routes:', error);
      return staticRoutes;
    }
  }
  
  // Return static routes if no Hygraph endpoint is configured
  console.warn('Warning: No Hygraph endpoint configured, using static routes only');
  return staticRoutes;
};

export default defineConfig(async () => ({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://www.jedilabs.org',
      generateRobotsTxt: true,
      exclude: ['/404'],
      outDir: 'dist',
      routes: await getDynamicRoutes()
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
}));
