#!/usr/bin/env node
/**
 * Extract all Hygraph content that powers a given industry/solution page.
 * Uses the same GraphQL queries as the app (IndustryPage + SolutionPage).
 * No hardcoding: reads industry slug and solution slug from args or defaults.
 *
 * Usage:
 *   node scripts/migrations/hygraph/extract_page_content.js
 *   node scripts/migrations/hygraph/extract_page_content.js [industrySlug] [solutionSlug]
 *   node scripts/migrations/hygraph/extract_page_content.js financial-services advanced-fraud-detection-system
 *
 * Output: writes hygraph_page_content_<industry>_<solution>.json (and logs path).
 */

import dotenv from 'dotenv';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', '..', '..');
dotenv.config({ path: join(root, '.env') });

const ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT;
const TOKEN = process.env.VITE_HYGRAPH_TOKEN;

if (!ENDPOINT || !TOKEN) {
  console.error('Missing VITE_HYGRAPH_ENDPOINT or VITE_HYGRAPH_TOKEN in .env');
  process.exit(1);
}

const industrySlug = process.argv[2] || 'financial-services';
const solutionSlug = process.argv[3] || 'advanced-fraud-detection-system';

const GET_INDUSTRY_DETAIL_WITH_APPLICATIONS = `query GetIndustryDetailWithApplications($slug: String!) {
  industries(where: { slug: $slug }, stage: PUBLISHED, first: 1) {
    id
    name
    slug
    description
    fullDescription { raw }
    benefits
    capabilities
    keyFeaturesJson
    statisticsJson
    industryApplication {
      id
      applicationTitle
      tagline
      industryChallenge { raw }
      jediApproach { raw }
      keyCapabilities
      expectedResults
      jediComponent {
        id
        name
        slug
        icon { url }
      }
      technology {
        id
        name
        slug
        icon
      }
    }
  }
}`;

const GET_USE_CASE_DETAIL = `query GetUseCaseDetail($slug: String!) {
  useCase(where: { slug: $slug }, stage: PUBLISHED) {
    id
    title
    slug
    description
    capabilities
    queries
    metrics
    implementation
    industry {
      name
      slug
      description
    }
    technologies(first: 10) {
      id
      name
      slug
      description
    }
    category {
      id
      slug
      name
      technologies {
        id
        name
        slug
        description
      }
    }
    industryApplication {
      id
      applicationTitle
      relevantEngine
    }
    architecture {
      id
      description
      components(orderBy: name_ASC) {
        id
        name
        description
        details
        explanation
      }
      flow(orderBy: step_ASC) {
        id
        step
        description
        details
      }
    }
  }
}`;

async function graphqlRequest(query, variables) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Hygraph ${res.status}: ${text}`);
  }
  const json = await res.json();
  if (json.errors && json.errors.length) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function main() {
  console.log(`Extracting content for /industries/${industrySlug}/solutions/${solutionSlug}`);
  console.log('Fetching from Hygraph Content API...');

  const [industryData, useCaseData] = await Promise.all([
    graphqlRequest(GET_INDUSTRY_DETAIL_WITH_APPLICATIONS, { slug: industrySlug }),
    graphqlRequest(GET_USE_CASE_DETAIL, { slug: solutionSlug }),
  ]);

  const industry = industryData?.industries?.[0] ?? null;
  const useCase = useCaseData?.useCase ?? null;

  const payload = {
    extractedAt: new Date().toISOString(),
    urlPath: `/industries/${industrySlug}/solutions/${solutionSlug}`,
    industrySlug,
    solutionSlug,
    industry: industry,
    useCase: useCase,
  };

  const outDir = join(root, 'scripts', 'migrations', 'hygraph', 'extracted');
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, `hygraph_page_content_${industrySlug}_${solutionSlug}.json`);
  writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf8');

  console.log('Wrote:', outFile);
  console.log('Industry:', industry ? `${industry.name} (id: ${industry.id})` : 'not found');
  console.log('Use case:', useCase ? `${useCase.title} (id: ${useCase.id})` : 'not found');
  if (industry?.industryApplication?.length) {
    console.log('Industry applications:', industry.industryApplication.length);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
