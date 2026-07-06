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

const hygraphClient = new GraphQLClient(
  process.env.VITE_HYGRAPH_ENDPOINT || '',
  {
    headers: {
      Authorization: `Bearer ${process.env.VITE_HYGRAPH_TOKEN || ''}`,
    },
  }
);

async function hygraphRequest(query, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await hygraphClient.request(query);
    } catch (e) {
      if (e.response?.status === 429 && i < retries - 1) {
        const delay = Math.pow(2, i + 1) * 2000;
        console.log(`Hygraph 429, retry ${i + 1}/${retries} in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw e;
      }
    }
  }
}

// Static routes configuration - aligned with App.jsx routes
// Kept in sync with scripts/enumerate-routes.mjs staticRoutes.
// NOTE: /deployments is a 301 redirect to /use-cases, so it's intentionally
// excluded here — redirected URLs must not appear in sitemap.xml (Google will
// treat them as duplicates).
const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/jedi', changefreq: 'weekly', priority: 0.95 },
  { path: '/solutions', changefreq: 'weekly', priority: 0.9 },
  { path: '/industries', changefreq: 'weekly', priority: 0.9 },
  { path: '/use-cases', changefreq: 'weekly', priority: 0.9 },
  { path: '/case-studies', changefreq: 'weekly', priority: 0.85 },
  { path: '/infrastructure', changefreq: 'monthly', priority: 0.8 },
  { path: '/team', changefreq: 'weekly', priority: 0.8 },
  { path: '/careers', changefreq: 'weekly', priority: 0.8 },
  { path: '/blog', changefreq: 'daily', priority: 0.8 },
  { path: '/technology', changefreq: 'weekly', priority: 0.8 },
  { path: '/about', changefreq: 'monthly', priority: 0.7 },
  { path: '/contact', changefreq: 'monthly', priority: 0.7 },
  { path: '/benchmarks', changefreq: 'weekly', priority: 0.95 },
  { path: '/glossary', changefreq: 'monthly', priority: 0.7 },
  { path: '/explore', changefreq: 'weekly', priority: 0.85 },
  { path: '/methodology', changefreq: 'monthly', priority: 0.85 },
  { path: '/ai-training', changefreq: 'weekly', priority: 0.75 },
  { path: '/pricing', changefreq: 'monthly', priority: 0.75 }
];

async function fetchDynamicRoutes() {
  if (!process.env.VITE_HYGRAPH_ENDPOINT) {
    console.warn('No Hygraph endpoint configured. Using only static routes.');
    return [];
  }

  try {
    console.log('Fetching from Hygraph...');
    const routes = [];
    
    // Query posts - correct path is /blog/post/:slug per App.jsx
    try {
      const postsResult = await hygraphRequest(`
        {
          posts(stage: PUBLISHED) {
            slug
            updatedAt
          }
        }
      `);

      if (postsResult.posts) {
        // Live Hygraph blog slugs as of Jul 2026 (see docs/SEO_BASELINE.md).
        // Old priority slugs were retired when the CMS content was refreshed.
        const priorityPosts = ['dicom-pipeline', 'geotiffs-to-pixel', 'video-ml-clip', 'audio-ml'];
        routes.push(
          ...postsResult.posts.map(post => ({
            path: `/blog/post/${post.slug}`,
            lastmod: post.updatedAt?.split('T')[0],
            changefreq: 'weekly',
            priority: priorityPosts.includes(post.slug) ? 0.85 : 0.7
          }))
        );
        console.log('Posts found:', postsResult.posts.length);
      }
    } catch (e) {
      console.log('No posts found:', e.message);
    }

    // Query team members (Hygraph uses teamMembers, not authors)
    try {
      const teamResult = await hygraphRequest(`
        {
          teamMembers(stage: PUBLISHED) {
            slug
            updatedAt
          }
        }
      `);
      
      if (teamResult.teamMembers) {
        routes.push(
          ...teamResult.teamMembers.map(team => ({
            path: `/team/${team.slug}`,
            lastmod: team.updatedAt?.split('T')[0],
            changefreq: 'monthly',
            priority: 0.7
          }))
        );
        console.log('Team members found:', teamResult.teamMembers.length);
      }
    } catch (e) {
      console.log('No team members found:', e.message);
    }

    // Query solutions (Hygraph uses categories for solutions)
    try {
      const categoriesResult = await hygraphRequest(`
        {
          categories(stage: PUBLISHED) {
            slug
            updatedAt
          }
        }
      `);
      
      if (categoriesResult.categories) {
        routes.push(
          ...categoriesResult.categories.map(cat => ({
            path: `/solutions/${cat.slug}`,
            lastmod: cat.updatedAt?.split('T')[0],
            changefreq: 'weekly',
            priority: 0.8
          }))
        );
        console.log('Solutions (categories) found:', categoriesResult.categories.length);
      }
    } catch (e) {
      console.log('No solutions (categories) found:', e.message);
    }

    // Query technologies with use cases (Hygraph uses technologyS, not technologies)
    try {
      const techResult = await hygraphRequest(`
        {
          technologyS(stage: PUBLISHED) {
            slug
            updatedAt
            useCases {
              slug
              updatedAt
            }
          }
        }
      `);
      
      if (techResult.technologyS) {
        // Add main technology routes
        routes.push(
          ...techResult.technologyS.map(tech => ({
            path: `/technology/${tech.slug}`,
            lastmod: tech.updatedAt?.split('T')[0],
            changefreq: 'weekly',
            priority: 0.8
          }))
        );

        // Add technology use case routes
        techResult.technologyS.forEach(tech => {
          if (tech.useCases) {
            routes.push(
              ...tech.useCases.map(uc => ({
                path: `/technology/${tech.slug}/use-case/${uc.slug}`,
                lastmod: uc.updatedAt?.split('T')[0],
                changefreq: 'weekly',
                priority: 0.7
              }))
            );
          }
        });

        console.log('Technologies found:', techResult.technologyS.length);
      }
    } catch (e) {
      console.log('No technologies found:', e.message);
    }

    // Query industries (main pages)
    try {
      const industriesResult = await hygraphRequest(`
        {
          industries(stage: PUBLISHED) {
            slug
            updatedAt
          }
        }
      `);
      
      if (industriesResult.industries) {
        routes.push(
          ...industriesResult.industries.map(industry => ({
            path: `/industries/${industry.slug}`,
            lastmod: industry.updatedAt?.split('T')[0],
            changefreq: 'monthly',
            priority: 0.75
          }))
        );
        console.log('Industries found:', industriesResult.industries.length);
      }
    } catch (e) {
      console.log('No industries found:', e.message);
    }

    // Query useCaseS for industry/use-case routes (industries/:industrySlug/solutions/:useCaseSlug)
    try {
      const useCasesResult = await hygraphRequest(`
        {
          useCaseS(stage: PUBLISHED) {
            slug
            updatedAt
            industry {
              slug
            }
          }
        }
      `);
      
      if (useCasesResult.useCaseS) {
        const validUseCases = useCasesResult.useCaseS.filter(uc => uc.industry?.slug);
        routes.push(
          ...validUseCases.map(uc => ({
            path: `/industries/${uc.industry.slug}/${uc.slug}`,
            lastmod: uc.updatedAt?.split('T')[0],
            changefreq: 'monthly',
            priority: 0.7
          }))
        );
        console.log('Industry use cases found:', validUseCases.length);
      }
    } catch (e) {
      console.log('No useCaseS found:', e.message);
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