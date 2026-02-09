
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

const PUBLISH_USE_CASE = gql`
  mutation PublishUseCase($slug: String!) {
    publishUseCase(where: { slug: $slug }, to: PUBLISHED) {
      id
      title
      stage
    }
  }
`;

async function main() {
    const slug = "ai-powered-research-assistant";
    console.log(`Publishing Use Case "${slug}"...`);

    try {
        const data = await client.request(PUBLISH_USE_CASE, { slug });
        console.log("Successfully Published:", data.publishUseCase.title);
        console.log("Stage:", data.publishUseCase.stage);
    } catch (error) {
        console.error("Publish Failed:", error);
    }
}

main();
