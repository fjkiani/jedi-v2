
import { request, gql } from 'graphql-request';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env from portal/.env.local (assuming that's where the token is, based on previous tasks)
// Attempting to resolve path relative to script location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const endpoint = process.env.VITE_GRAPHCMS_ENDPOINT || "https://api-us-east-1-shared-usea1-02.hygraph.com/v2/cm6idxq1001h807we4x90439y/master"; // Fallback from what I've seen in other files if env fails

const query = gql`
  query InspectContent {
    posts {
      title
      slug
      categories {
        name
        slug
      }
    }
    categories {
      name
      slug
    }
  }
`;

async function main() {
    console.log("Endpoint:", endpoint);
    try {
        const data = await request(endpoint, query);
        console.log("--- POSTS ---");
        data.posts.forEach(p => console.log(`[POST] ${p.title} (slug: ${p.slug}) - Cats: ${p.categories.map(c => c.name).join(', ')}`));

        console.log("\n--- CATEGORIES ---");
        data.categories.forEach(c => console.log(`[CAT] ${c.name} (slug: ${c.slug})`));

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

main();
