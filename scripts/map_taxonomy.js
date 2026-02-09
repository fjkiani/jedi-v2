
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
  query MapTaxonomy {
    categories(first: 100) {
      name
      technologies(first: 100) {
        name
        slug
      }
    }
    technologies(first: 1000) {
      name
      slug
      category
    }
  }
`;

async function main() {
    try {
        console.log("--- START TAXONOMY MAP ---");
        const data = await request(endpoint, query);

        const allTech = data.technologies;
        console.log(`Found ${allTech.length} total technologies.`);

        // Sort by name for easier reading
        allTech.sort((a, b) => a.name.localeCompare(b.name));

        const map = {};
        allTech.forEach(t => map[t.slug] = t.name);

        // Check specific targets mentioned by user and requirements
        const targets = [
            'huggingface', 'python', 'react', 'figma', 'openai', 'tensorflow',
            'aws', 'docker', 'kubernetes', 'postgresql', 'hygraph', 'next-js'
        ];

        console.log("\n--- TARGET VERIFICATION ---");
        targets.forEach(target => {
            // Direct match
            if (map[target]) {
                console.log(`✅ [DIRECT] ${target} -> ${map[target]}`);
            } else {
                // Fuzzy match
                const fuzzy = allTech.find(t => t.slug.includes(target) || target.includes(t.slug));
                if (fuzzy) {
                    console.log(`⚠️ [FUZZY] ${target} -> Not found, but found '${fuzzy.slug}' (${fuzzy.name})`);
                } else {
                    console.log(`❌ [MISSING] ${target}`);
                }
            }
        });

        // Write full dump to file for manual inspection
        const dumpPath = path.resolve(__dirname, 'taxonomy_dump.json');
        fs.writeFileSync(dumpPath, JSON.stringify(allTech, null, 2));
        console.log(`\nFull taxonomy dumped to ${dumpPath}`);

        console.log("--- END MAP ---");

    } catch (error) {
        console.error("Map Failed:", error.message);
    }
}

main();
