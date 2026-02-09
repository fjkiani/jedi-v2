
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

const GET_SOLUTION_BY_SLUG = gql`
  query GetSolutionBySlug($slug: String!) {
    categories(where: { slug: $slug }) {
      id
      name
      slug
    }
    relatedUseCases: useCaseS(where: { category: { slug: $slug } }, first: 10) {
      title
      slug
      implementation
      architecture {
        components { name }
        flow { step }
      }
    }
  }
`;

async function main() {
    const slug = "ai-agents"; // The page the user is checking
    console.log(`Fetching solution data for slug: ${slug}...`);

    try {
        const data = await client.request(GET_SOLUTION_BY_SLUG, { slug });

        console.log("Categories Found:", data.categories.length);
        if (data.categories.length > 0) {
            console.log("Category Name:", data.categories[0].name);
        } else {
            console.error("No Category found! This is why the page might be broken or using static fallback.");
        }

        console.log("\nRelated Use Cases Found:", data.relatedUseCases.length);
        data.relatedUseCases.forEach((uc, i) => {
            console.log(`\n[${i + 1}] ${uc.title} (${uc.slug})`);

            const impl = uc.implementation;
            console.log("   - Implementation Type:", typeof impl);
            if (impl) {
                console.log("   - Has Implementation Data: YES");
                // Check for queries
                // Note: usage in SolutionPage is: uc.implementation.queries
                // If impl is a string, JSON.parse it first to check
                if (typeof impl === 'object') {
                    console.log("   - Queries Length:", impl.queries ? impl.queries.length : "undefined");
                } else {
                    console.log("   - Raw Implementation (first 50 chars):", impl.substring(0, 50));
                }
            } else {
                console.log("   - Has Implementation Data: NO");
            }

            console.log("   - Architecture:", uc.architecture ? "Present" : "Missing");
        });

    } catch (error) {
        console.error("Query Failed:", error);
    }
}

main();
