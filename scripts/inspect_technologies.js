
import { request, gql } from 'graphql-request';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const endpoint = process.env.VITE_GRAPHCMS_ENDPOINT || "https://api-us-east-1-shared-usea1-02.hygraph.com/v2/cm6idxq1001h807we4x90439y/master";

const query = gql`
  query GetAllTechnologies {
    technologies(first: 100) {
      name
      slug
    }
  }
`;

async function main() {
    try {
        console.log("Fetching technologies from:", endpoint);
        const data = await request(endpoint, query);

        const lines = [];
        lines.push("--- TECHNOLOGIES ---");
        data.technologies.forEach(t => lines.push(`[TECH] ${t.name} (slug: ${t.slug})`));

        const outputPath = path.resolve(__dirname, '../temp_tech_list.txt');
        fs.writeFileSync(outputPath, lines.join('\n'));
        console.log(`Wrote ${lines.length} lines to ${outputPath}`);

        // Also log to console for good measure, but keep it brief
        console.log(lines.slice(0, 10).join('\n'));
        if (lines.length > 10) console.log(`... and ${lines.length - 10} more.`);

    } catch (error) {
        console.error("Error fetching technologies:", error);
    }
}

main();
