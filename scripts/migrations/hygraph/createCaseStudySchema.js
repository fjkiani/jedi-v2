/**
 * Creates the Case Study model in Hygraph using your .env project.
 * Uses VITE_HYGRAPH_ENDPOINT and VITE_HYGRAPH_TOKEN from .env
 *
 * Run: node scripts/migrations/hygraph/createCaseStudySchema.js
 *
 * REQUIREMENTS:
 * - Token must have Management API permissions (Project Settings > Permanent Auth Tokens)
 * - Create a token with "Manage schema" or full management access
 */

import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();

const ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT;
const TOKEN = process.env.VITE_HYGRAPH_TOKEN;

if (!ENDPOINT || !TOKEN) {
  console.error('Missing .env: VITE_HYGRAPH_ENDPOINT and VITE_HYGRAPH_TOKEN are required');
  process.exit(1);
}

// Hygraph Migration API uses the Content API endpoint
const client = new GraphQLClient(ENDPOINT, {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

const SUBMIT_BATCH_MUTATION = `
  mutation SubmitBatch($data: BatchMigrationInput!) {
    submitBatchChanges(data: $data) {
      id
      name
      status
      createdAt
      finishedAt
    }
  }
`;

const run = async () => {
  console.log('Creating Case Study schema (project from .env)...');

  const migrationName = 'add-case-study-' + Date.now();

  const result = await client.request(SUBMIT_BATCH_MUTATION, {
    data: {
      name: migrationName,
      changes: [
        {
          operation_name: 'createModel',
          params: {
            apiId: 'CaseStudy',
            apiIdPlural: 'CaseStudies',
            displayName: 'Case Study',
            description: 'Client success stories and project outcomes',
          },
        },
        {
          operation_name: 'createSimpleField',
          params: {
            parentApiId: 'CaseStudy',
            apiId: 'title',
            type: 'STRING',
            displayName: 'Title',
            isRequired: true,
            isTitle: true,
          },
        },
        {
          operation_name: 'createSimpleField',
          params: {
            parentApiId: 'CaseStudy',
            apiId: 'slug',
            type: 'STRING',
            displayName: 'Slug',
            isRequired: true,
            isUnique: true,
          },
        },
        {
          operation_name: 'createSimpleField',
          params: {
            parentApiId: 'CaseStudy',
            apiId: 'excerpt',
            type: 'STRING',
            displayName: 'Excerpt',
          },
        },
        {
          operation_name: 'createSimpleField',
          params: {
            parentApiId: 'CaseStudy',
            apiId: 'clientName',
            type: 'STRING',
            displayName: 'Client Name',
          },
        },
        {
          operation_name: 'createSimpleField',
          params: {
            parentApiId: 'CaseStudy',
            apiId: 'results',
            type: 'STRING',
            displayName: 'Results / Metrics',
          },
        },
        {
          operation_name: 'createSimpleField',
          params: {
            parentApiId: 'CaseStudy',
            apiId: 'description',
            type: 'RICHTEXT',
            displayName: 'Description',
          },
        },
        {
          operation_name: 'createSimpleField',
          params: {
            parentApiId: 'CaseStudy',
            apiId: 'coverImageUrl',
            type: 'STRING',
            displayName: 'Cover Image URL',
          },
        },
      ],
    },
  });

  if (result?.submitBatchChanges?.id) {
    console.log('Migration submitted:', result.submitBatchChanges.name);
    console.log('Case Study schema created successfully.');
  } else {
    console.log('Response:', JSON.stringify(result, null, 2));
  }
};

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err.message);
    if (err.response?.errors) {
      console.error('GraphQL errors:', JSON.stringify(err.response.errors, null, 2));
    }
    console.log('\nIf the token lacks Management API permissions:');
    console.log('1. Go to Hygraph Studio > Project Settings > Permanent Auth Tokens');
    console.log('2. Create a token with "Manage schema" or full management access');
    console.log('3. Update VITE_HYGRAPH_TOKEN in .env');
    console.log('\nOr add the Case Study model manually in Hygraph Studio > Schema.');
    process.exit(1);
  });
