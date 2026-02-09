
import { GraphQLClient, gql } from 'graphql-request';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const endpoint = process.env.VITE_HYGRAPH_ENDPOINT;
const token = process.env.VITE_HYGRAPH_TOKEN;

if (!endpoint) {
    console.error('Error: VITE_HYGRAPH_ENDPOINT is not set in .env');
    process.exit(1);
}

const client = new GraphQLClient(endpoint, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

const QUERY = gql`
  query GetResearchAssistant {
    useCaseS(where: { slug: "ai-powered-research-assistant" }) {
      title
      slug
      description
      capabilities
      metrics
      implementation
      architecture {
        description
        components {
          name
          description
          details
          explanation
        }
        flow {
          step
          description
          details
        }
      }
      industryApplication {
        applicationTitle
        industryChallenge { html }
        jediApproach { html }
        expectedResults
      }
    }
  }
`;

async function main() {
    try {
        console.log('Fetching "AI-Powered Research Assistant" data...');
        const data = await client.request(QUERY);

        if (!data.useCaseS || data.useCaseS.length === 0) {
            console.log('No use case found with slug "ai-powered-research-assistant".');

            // Fallback search
            console.log('Searching for any Research Assistant...');
            const fallbackQuery = gql`
        query Search {
          useCaseS(where: { title_contains: "Research" }, first: 5) {
            title
            slug
          }
        }
      `;
            const fallbackData = await client.request(fallbackQuery);
            console.log('Found alternatives:', fallbackData.useCaseS);
        } else {
            const useCase = data.useCaseS[0];
            console.log('\n--- TARGET USE CASE FOUND ---');
            console.log('Title:', useCase.title);
            console.log('Implementation Data:', JSON.stringify(useCase.implementation, null, 2));
            console.log('Architecture Data:', JSON.stringify(useCase.architecture, null, 2));
            console.log('Metrics:', useCase.metrics);
            console.log('Capabilities:', useCase.capabilities);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

main();
