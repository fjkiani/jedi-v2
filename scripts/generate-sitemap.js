import { GraphQLClient } from 'graphql-request';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://jedilabs.org';

// Create Hygraph client
const hygraphClient = new GraphQLClient(
  process.env.VITE_HYGRAPH_ENDPOINT || '',
  {
    headers: {
      Authorization: `Bearer ${process.env.VITE_HYGRAPH_TOKEN || ''}`,
    },
  }
);

// Static routes configuration
const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/solutions', changefreq: 'weekly', priority: 0.9 },
  { path: '/industries', changefreq: 'weekly', priority: 0.9 },
  { path: '/team', changefreq: 'weekly', priority: 0.8 },
  { path: '/blog', changefreq: 'daily', priority: 0.8 },
  { path: '/technology', changefreq: 'weekly', priority: 0.8 },
  // { path: '/tech-stack', changefreq: 'weekly', priority: 0.8 },
  // { path: '/tech', changefreq: 'weekly', priority: 0.8 },
  { path: '/about', changefreq: 'monthly', priority: 0.7 },
  { path: '/contact', changefreq: 'monthly', priority: 0.7 }
];

async function fetchDynamicRoutes() {
  if (!process.env.VITE_HYGRAPH_ENDPOINT) {
    console.warn('No Hygraph endpoint configured. Using only static routes.');
    return [];
  }

  try {
    console.log('Fetching from Hygraph...');
    const routes = [];
    
    // Query posts
    try {
      const postsResult = await hygraphClient.request(`
        {
          posts {
            slug
            updatedAt
          }
        }
      `);

      if (postsResult.posts) {
        routes.push(
          ...postsResult.posts.map(post => ({
            path: `/blog/${post.slug}`,
            lastmod: post.updatedAt.split('T')[0],
            changefreq: 'weekly',
            priority: 0.7
          }))
        );
        console.log('Posts found:', postsResult.posts.length);
      }
    } catch (e) {
      console.log('No posts found');
    }

    // Query team members
    try {
      const teamResult = await hygraphClient.request(`
        {
          authors {
            slug
            updatedAt
          }
        }
      `);
      
      if (teamResult.authors) {
        routes.push(
          ...teamResult.authors.map(team => ({
            path: `/team/${team.slug}`,
            lastmod: team.updatedAt.split('T')[0],
            changefreq: 'monthly',
            priority: 0.7
          }))
        );
        console.log('Team members found:', teamResult.authors.length);
      }
    } catch (e) {
      console.log('No team members found');
    }

    // Query solutions
    try {
      const solutionsResult = await hygraphClient.request(`
        {
          solutions {
            slug
            updatedAt
          }
        }
      `);
      
      if (solutionsResult.solutions) {
        routes.push(
          ...solutionsResult.solutions.map(solution => ({
            path: `/solutions/${solution.slug}`,
            lastmod: solution.updatedAt.split('T')[0],
            changefreq: 'weekly',
            priority: 0.8
          }))
        );
        console.log('Solutions found:', solutionsResult.solutions.length);
      }
    } catch (e) {
      console.log('No solutions found');
    }

    // Query technologies with use cases
    try {
      const techResult = await hygraphClient.request(`
        {
          technologies {
            slug
            updatedAt
            useCases {
              slug
              updatedAt
            }
          }
        }
      `);
      
      if (techResult.technologies) {
        // Add main technology routes
        routes.push(
          ...techResult.technologies.map(tech => ({
            path: `/technology/${tech.slug}`,
            lastmod: tech.updatedAt.split('T')[0],
            changefreq: 'weekly',
            priority: 0.8
          }))
        );

        // Add technology use case routes
        techResult.technologies.forEach(tech => {
          if (tech.useCases) {
            routes.push(
              ...tech.useCases.map(useCase => ({
                path: `/technology/${tech.slug}/use-case/${useCase.slug}`,
                lastmod: useCase.updatedAt.split('T')[0],
                changefreq: 'weekly',
                priority: 0.7
              }))
            );
          }
        });

        console.log('Technologies found:', techResult.technologies.length);
      }
    } catch (e) {
      console.log('No technologies found');
    }

    // Query industries with solutions
    try {
      const industriesResult = await hygraphClient.request(`
        {
          industries {
            slug
            updatedAt
            solutions {
              slug
              updatedAt
            }
          }
        }
      `);
      
      if (industriesResult.industries) {
        // Add main industry routes
        routes.push(
          ...industriesResult.industries.map(industry => ({
            path: `/industries/${industry.slug}`,
            lastmod: industry.updatedAt.split('T')[0],
            changefreq: 'monthly',
            priority: 0.7
          }))
        );

        // Add industry solution routes
        industriesResult.industries.forEach(industry => {
          if (industry.solutions) {
            routes.push(
              ...industry.solutions.map(solution => ({
                path: `/industries/${industry.slug}/${solution.slug}`,
                lastmod: solution.updatedAt.split('T')[0],
                changefreq: 'monthly',
                priority: 0.7
              }))
            );
          }
        });

        console.log('Industries found:', industriesResult.industries.length);
      }
    } catch (e) {
      console.log('No industries found');
    }

    console.log(`Found ${routes.length} dynamic routes`);
    return routes;
  } catch (error) {
    console.error('Error fetching dynamic routes:', error.message);
    if (error.response) {
      console.error('GraphQL response:', JSON.stringify(error.response, null, 2));
    }
    console.warn('Continuing with static routes only');
    return [];
  }
}

function generateSitemapXml(routes) {
  const today = new Date().toISOString().split('T')[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod || today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

async function generateSitemap() {
  try {
    // Get all routes
    const dynamicRoutes = await fetchDynamicRoutes();
    const allRoutes = [
      ...staticRoutes,
      ...dynamicRoutes
    ];

    // Generate sitemap XML
    const sitemapXml = generateSitemapXml(allRoutes);

    // Write to file
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);

    console.log('Sitemap generated successfully!');
    console.log(`Total routes: ${allRoutes.length}`);
    console.log(`- Static routes: ${staticRoutes.length}`);
    console.log(`- Dynamic routes: ${dynamicRoutes.length}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// Run the script
generateSitemap(); 