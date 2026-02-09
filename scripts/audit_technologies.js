
import { request, gql } from 'graphql-request';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const endpoint = process.env.VITE_GRAPHCMS_ENDPOINT || "https://api-us-east-1-shared-usea1-02.hygraph.com/v2/cm6idxq1001h807we4x90439y/master";

const REQUIRED_SLUGS = [
    'react', 'figma', // Architect
    'python', 'openai', 'tensorflow', // Forge
    'aws', 'docker', 'kubernetes', // Awaken
    'postgresql', 'hygraph-cms' // Evolve
];

// Query categories to get technologies, avoiding potentially broken root query
const query = gql`
  query AuditTech {
    categories(first: 100) {
      name
      technologies(first: 100) {
        name
        slug
      }
    }
  }
`;

async function main() {
    try {
        console.log("--- START AUDIT ---");
        const data = await request(endpoint, query);

        // Flatten technologies
        const allTech = [];
        data.categories.forEach(c => {
            c.technologies.forEach(t => {
                allTech.push({ name: t.name, slug: t.slug, category: c.name });
            });
        });

        console.log(`Found ${allTech.length} total technologies in Hygraph.`);

        // Check Requirements
        const found = [];
        const missing = [];
        const suggestions = {};

        REQUIRED_SLUGS.forEach(reqSlug => {
            const match = allTech.find(t => t.slug === reqSlug);
            if (match) {
                found.push(reqSlug);
            } else {
                missing.push(reqSlug);
                // Simple fuzzy search for suggestions
                const potential = allTech.find(t => t.slug.includes(reqSlug) || reqSlug.includes(t.slug));
                if (potential) {
                    suggestions[reqSlug] = potential.slug;
                }
            }
        });

        console.log("\n--- STATUS REPORT ---");
        console.log("✅ FOUND EXACT MATCHES:", found.length > 0 ? found.join(', ') : "None");
        console.log("❌ MISSING SLUGS:", missing.length > 0 ? missing.join(', ') : "None");

        if (Object.keys(suggestions).length > 0) {
            console.log("\n--- SUGGESTIONS ---");
            Object.entries(suggestions).forEach(([req, sugg]) => {
                console.log(`For '${req}', maybe use '${sugg}'?`);
            });
        }

        console.log("\n--- ALL AVAILABLE SLUGS ---");
        allTech.forEach(t => console.log(`${t.slug} (${t.name})`));

        console.log("--- END AUDIT ---");

    } catch (error) {
        console.error("Audit Failed:", error.message);
    }
}

main();
