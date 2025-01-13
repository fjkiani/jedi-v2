import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import sitemap from 'vite-plugin-sitemap';
import { hygraphClient } from './src/lib/hygraph'; // Assuming you have this set up

// Dynamic route generation function
const getDynamicRoutes = async () => {
  try {
    // Base routes that are always present
    const staticRoutes = ['/', '/solutions', '/team', '/about', '/blog'];
    
    // Get dynamic routes from Hygraph
    const { teams } = await hygraphClient.request(`
      {
        teams {
          slug
        }
      }
    `);
    const teamRoutes = teams.map(team => `/team/${team.slug}`);

    // Add other dynamic routes as needed
    // For example, blog posts, solutions, etc.
    const { solutions } = await hygraphClient.request(`
      {
        solutions {
          slug
        }
      }
    `);
    const solutionRoutes = solutions.map(solution => `/solutions/${solution.slug}`);

    // Combine all routes
    return [...staticRoutes, ...teamRoutes, ...solutionRoutes];
  } catch (error) {
    console.error('Error generating dynamic routes:', error);
    // Fallback to static routes if there's an error
    return ['/', '/solutions', '/team', '/about', '/blog'];
  }
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
