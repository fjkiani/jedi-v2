
import { request, gql } from 'graphql-request';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const endpoint = process.env.VITE_GRAPHCMS_ENDPOINT || "https://api-us-east-1-shared-usea1-02.hygraph.com/v2/cm6idxq1001h807we4x90439y/master";

const query = gql`
  query SimpleProbe {
    technologies(first: 100) {
      name
      slug
    }
  }
`;

async function main() {
    try {
        const data = await request(endpoint, query);
        console.log("--- START LIST ---");
        data.technologies.forEach(t => console.log(`${t.name} -> ${t.slug}`));
        console.log("--- END LIST ---");
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();
