// Shared route enumerator used by both prerender and generate-sitemap.
// Fetches static + dynamic Hygraph slugs, returns a de-duplicated route list.

import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();

const hygraphClient = new GraphQLClient(
  process.env.VITE_HYGRAPH_ENDPOINT || '',
  {
    headers: { Authorization: `Bearer ${process.env.VITE_HYGRAPH_TOKEN || ''}` },
  }
);

async function hygraphRequest(query, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await hygraphClient.request(query);
    } catch (e) {
      if (e.response?.status === 429 && i < retries - 1) {
        const delay = Math.pow(2, i + 1) * 2000;
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw e;
      }
    }
  }
}

// Static routes mirror App.jsx <Route path="..."> declarations.
export const staticRoutes = [
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
  { path: '/methodology', changefreq: 'monthly', priority: 0.7 },
  { path: '/pricing', changefreq: 'monthly', priority: 0.75 },
  { path: '/ai-training', changefreq: 'weekly', priority: 0.75 },
  { path: '/deployments', changefreq: 'monthly', priority: 0.7 },
  { path: '/explore', changefreq: 'weekly', priority: 0.75 },
  // R3 additions:
  { path: '/benchmarks', changefreq: 'weekly', priority: 0.85 },
  { path: '/glossary', changefreq: 'weekly', priority: 0.8 },
];

export async function fetchDynamicRoutes() {
  if (!process.env.VITE_HYGRAPH_ENDPOINT) {
    console.warn('[routes] No Hygraph endpoint. Static routes only.');
    return [];
  }

  const routes = [];

  try {
    const postsResult = await hygraphRequest(`
      { posts(stage: PUBLISHED) { slug updatedAt } }
    `);
    if (postsResult?.posts) {
      const priorityPosts = ['identity-missing-pillar-agentic-ai', 'pilot-to-production-agentic-ai-smbs', 'building-web3', 'ai-agents'];
      routes.push(...postsResult.posts.map(p => ({
        path: `/blog/post/${p.slug}`,
        lastmod: p.updatedAt?.split('T')[0],
        changefreq: 'weekly',
        priority: priorityPosts.includes(p.slug) ? 0.85 : 0.7,
      })));
      console.log(`[routes] posts: ${postsResult.posts.length}`);
    }
  } catch (e) { console.log(`[routes] posts skipped: ${e.message.slice(0, 100)}`); }

  try {
    const teamResult = await hygraphRequest(`
      { teamMembers(stage: PUBLISHED) { slug updatedAt } }
    `);
    if (teamResult?.teamMembers) {
      routes.push(...teamResult.teamMembers.map(t => ({
        path: `/team/${t.slug}`,
        lastmod: t.updatedAt?.split('T')[0],
        changefreq: 'monthly',
        priority: 0.7,
      })));
      console.log(`[routes] team: ${teamResult.teamMembers.length}`);
    }
  } catch (e) { console.log(`[routes] team skipped: ${e.message.slice(0, 100)}`); }

  try {
    const categoriesResult = await hygraphRequest(`
      { categories(stage: PUBLISHED) { slug updatedAt } }
    `);
    if (categoriesResult?.categories) {
      routes.push(...categoriesResult.categories.map(c => ({
        path: `/solutions/${c.slug}`,
        lastmod: c.updatedAt?.split('T')[0],
        changefreq: 'weekly',
        priority: 0.8,
      })));
      console.log(`[routes] solutions: ${categoriesResult.categories.length}`);
    }
  } catch (e) { console.log(`[routes] solutions skipped: ${e.message.slice(0, 100)}`); }

  try {
    const techResult = await hygraphRequest(`
      { technologyS(stage: PUBLISHED) { slug updatedAt useCases { slug updatedAt } } }
    `);
    if (techResult?.technologyS) {
      routes.push(...techResult.technologyS.map(t => ({
        path: `/technology/${t.slug}`,
        lastmod: t.updatedAt?.split('T')[0],
        changefreq: 'weekly',
        priority: 0.8,
      })));
      techResult.technologyS.forEach(t => {
        if (t.useCases) {
          routes.push(...t.useCases.map(uc => ({
            path: `/technology/${t.slug}/use-case/${uc.slug}`,
            lastmod: uc.updatedAt?.split('T')[0],
            changefreq: 'weekly',
            priority: 0.7,
          })));
        }
      });
      console.log(`[routes] tech: ${techResult.technologyS.length}`);
    }
  } catch (e) { console.log(`[routes] tech skipped: ${e.message.slice(0, 100)}`); }

  try {
    const industriesResult = await hygraphRequest(`
      { industries(stage: PUBLISHED) { slug updatedAt } }
    `);
    if (industriesResult?.industries) {
      routes.push(...industriesResult.industries.map(i => ({
        path: `/industries/${i.slug}`,
        lastmod: i.updatedAt?.split('T')[0],
        changefreq: 'monthly',
        priority: 0.75,
      })));
      console.log(`[routes] industries: ${industriesResult.industries.length}`);
    }
  } catch (e) { console.log(`[routes] industries skipped: ${e.message.slice(0, 100)}`); }

  try {
    const useCasesResult = await hygraphRequest(`
      { useCaseS(stage: PUBLISHED) { slug updatedAt industry { slug } } }
    `);
    if (useCasesResult?.useCaseS) {
      const valid = useCasesResult.useCaseS.filter(uc => uc.industry?.slug);
      routes.push(...valid.map(uc => ({
        path: `/industries/${uc.industry.slug}/${uc.slug}`,
        lastmod: uc.updatedAt?.split('T')[0],
        changefreq: 'monthly',
        priority: 0.7,
      })));
      console.log(`[routes] industry use-cases: ${valid.length}`);
    }
  } catch (e) { console.log(`[routes] use-cases skipped: ${e.message.slice(0, 100)}`); }

  // Case studies (Article model in some Hygraph schemas)
  try {
    const caseStudiesResult = await hygraphRequest(`
      { articles(stage: PUBLISHED) { slug updatedAt } }
    `);
    if (caseStudiesResult?.articles) {
      routes.push(...caseStudiesResult.articles.map(a => ({
        path: `/case-studies/${a.slug}`,
        lastmod: a.updatedAt?.split('T')[0],
        changefreq: 'monthly',
        priority: 0.75,
      })));
      console.log(`[routes] case studies: ${caseStudiesResult.articles.length}`);
    }
  } catch (e) { console.log(`[routes] case-studies skipped: ${e.message.slice(0, 100)}`); }

  return routes;
}

export async function getAllRoutes() {
  const dynamic = await fetchDynamicRoutes();
  const seen = new Set();
  const all = [];
  for (const r of [...staticRoutes, ...dynamic]) {
    if (!seen.has(r.path)) {
      seen.add(r.path);
      all.push(r);
    }
  }
  console.log(`[routes] total unique: ${all.length}`);
  return all;
}

// If invoked directly, print the route list.
if (import.meta.url === `file://${process.argv[1]}`) {
  getAllRoutes().then(r => {
    console.log(JSON.stringify(r.map(x => x.path), null, 2));
  });
}
