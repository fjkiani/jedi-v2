
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
  query InspectSchema {
    categories(first: 100) {
      name
      slug
      technologies(first: 100) {
        name
        slug
      }
    }
  }
`;

async function main() {
    try {
        console.log("--- START SIMPLE INSPECT ---");
        const data = await request(endpoint, query);

        const all = [];
        data.categories.forEach(c => {
            if (c.technologies) {
                c.technologies.forEach(t => all.push({ ...t, category: c.name }));
            }
        });

        console.log(`Found ${all.length} technologies via Categories.`);

        // Sort by name for easier reading
        all.sort((a, b) => a.name.localeCompare(b.name));

        // Check targets
        const targets = [
            'huggingface', 'python', 'react', 'figma', 'openai', 'tensorflow',
            'aws', 'docker', 'kubernetes', 'postgresql', 'hygraph', 'next-js'
        ];

        all.forEach(t => console.log(`${t.name} (${t.slug}) [${t.category}]`));

        console.log("\n--- TARGET MATCHES ---");
        targets.forEach(target => {
            const match = all.find(t => t.slug === target);
            if (match) console.log(`✅ ${target}`);
            else console.log(`❌ ${target}`);
        });

        console.log("--- END INSPECT ---");

    } catch (error) {
        console.error("Inspect Failed:", error.message);
    }
}

main();
