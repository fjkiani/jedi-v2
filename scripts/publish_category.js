
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

const client = new GraphQLClient(endpoint, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

const PUBLISH_CATEGORY = gql`
  mutation PublishCategory($slug: String!) {
    publishCategory(where: { slug: $slug }, to: PUBLISHED) {
      id
      name
      stage
    }
  }
`;

async function main() {
    const slug = "ai-agents";
    console.log(`Publishing Category "${slug}"...`);

    try {
        const data = await client.request(PUBLISH_CATEGORY, { slug });
        console.log("Successfully Published:", data.publishCategory.name);
        console.log("Stage:", data.publishCategory.stage);
    } catch (error) {
        console.error("Publish Failed:", error);
    }
}

main();
