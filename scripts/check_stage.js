
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

const CHECK_STAGE = gql`
  query CheckStage($slug: String!) {
    useCase(where: { slug: $slug }, stage: DRAFT) {
      title
      stage
      category {
        name
        slug
      }
    }
    published: useCase(where: { slug: $slug }, stage: PUBLISHED) {
      title
      stage
      category {
        name
        slug
      }
    }
  }
`;

async function main() {
    const slug = "ai-powered-research-assistant";
    console.log(`Checking stage for: ${slug}...`);

    try {
        const data = await client.request(CHECK_STAGE, { slug });
        console.log("DRAFT Version:", data.useCase ? "Exists" : "Missing");
        if (data.useCase) {
            console.log("   - Category:", data.useCase.category ? data.useCase.category.name : "None");
        }

        console.log("PUBLISHED Version:", data.published ? "Exists" : "Missing");
        if (data.published) {
            console.log("   - Category:", data.published.category ? data.published.category.name : "None");
        }

    } catch (error) {
        console.error("Check Failed:", error);
    }
}

main();
