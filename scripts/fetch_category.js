
import dotenv from 'dotenv';
import { GraphQLClient, gql } from 'graphql-request';

dotenv.config();

const endpoint = process.env.VITE_HYGRAPH_ENDPOINT;
const token = process.env.VITE_HYGRAPH_TOKEN;

const client = new GraphQLClient(endpoint, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

const QUERY_CATEGORY = gql`
  query GetCategory($slug: String!) {
    categories(where: { slug: $slug }) {
      name # Or title? Introspection said 'name' for Category or CategoryDemo?
      slug
      description
      # technologyCategory field?
    }
    # Also try querying technologies linked to it
    technologies: technologyS(where: { category_some: { slug: $slug } }) {
      name
      icon
      subcategories {
        name
      }
    }
  }
`;

async function main() {
    const slug = 'ai-agents'; // Testing with one from user list
    console.log(`Fetching Category: ${slug}...`);
    try {
        const data = await client.request(QUERY_CATEGORY, { slug });
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error fetching data:", error);

        // If categories query fails, maybe it's categoryDemos?
        if (error.message.includes('categories')) {
            console.log("Retrying with categoryDemos...");
            const QUERY_DEMO = gql`
        query GetCategoryDemo($slug: String!) {
          categoryDemos(where: { slug: $slug }) {
            name
            slug
          }
        }
       `;
            try {
                const data2 = await client.request(QUERY_DEMO, { slug });
                console.log(JSON.stringify(data2, null, 2));
            } catch (e) { console.error("Retry failed:", e); }
        }
    }
}

main();
