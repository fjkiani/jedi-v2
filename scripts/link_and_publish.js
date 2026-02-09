
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

const LINK_AND_PUBLISH = gql`
  mutation LinkAndPublish($useCaseSlug: String!, $categorySlug: String!) {
    updateUseCase(
      where: { slug: $useCaseSlug }
      data: { category: { connect: { slug: $categorySlug } } }
    ) {
      id
      title
      stage
      category {
        name
      }
    }
  }
`;

const PUBLISH_ONLY = gql`
  mutation PublishOnly($slug: String!) {
    publishUseCase(where: { slug: $slug }, to: PUBLISHED) {
      id
      title
      stage
      category {
        name
      }
    }
  }
`;

async function main() {
    const useCaseSlug = "ai-powered-research-assistant";
    const categorySlug = "ai-agents";

    console.log(`Linking Use Case "${useCaseSlug}" to Category "${categorySlug}"...`);

    try {
        // Step 1: Link (Update Draft)
        const updateData = await client.request(LINK_AND_PUBLISH, {
            useCaseSlug,
            categorySlug
        });
        console.log("Update Success:", updateData.updateUseCase.title);
        console.log("   - Linked Category (Draft):", updateData.updateUseCase.category.name);

        // Step 2: Publish
        console.log("Publishing...");
        const publishData = await client.request(PUBLISH_ONLY, { slug: useCaseSlug });
        console.log("Publish Success:", publishData.publishUseCase.title);
        console.log("   - Published Category:", publishData.publishUseCase.category ? publishData.publishUseCase.category.name : "None");

    } catch (error) {
        console.error("Operation Failed:", error);
        if (error.response && error.response.errors) {
            console.error("GraphQL Errors:", JSON.stringify(error.response.errors, null, 2));
        }
    }
}

main();
