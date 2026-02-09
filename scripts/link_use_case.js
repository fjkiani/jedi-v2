
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

const LINK_CATEGORY = gql`
  mutation LinkUseCaseToCategory($useCaseSlug: String!, $categorySlug: String!) {
    updateUseCase(
      where: { slug: $useCaseSlug }
      data: { category: { connect: { slug: $categorySlug } } }
    ) {
      id
      title
      category {
        name
        slug
      }
    }
    publishUseCase(where: { slug: $useCaseSlug }, to: PUBLISHED) {
      id
      stage
    }
  }
`;

async function main() {
    const useCaseSlug = "ai-powered-research-assistant";
    const categorySlug = "ai-agents";

    console.log(`Linking Use Case "${useCaseSlug}" to Category "${categorySlug}"...`);

    try {
        const data = await client.request(LINK_CATEGORY, {
            useCaseSlug,
            categorySlug
        });

        console.log("Successfully Linked:", data.updateUseCase.title);
        console.log("Category:", data.updateUseCase.category.name);
        console.log("Published Stage:", data.publishUseCase.stage);

    } catch (error) {
        console.error("Mutation Failed:", error);
    }
}

main();
