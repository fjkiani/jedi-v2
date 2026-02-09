
import { request, gql } from 'graphql-request';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const endpoint = process.env.VITE_GRAPHCMS_ENDPOINT || "https://api-us-east-1-shared-usea1-02.hygraph.com/v2/cm6idxq1001h807we4x90439y/master";

const mutation = gql`
  mutation CreateMissingTechnologies {
    createTechnology(data: { name: "Python", slug: "python", category: "Language", description: "High-level programming language for general-purpose programming." }) { id }
    createTechnology(data: { name: "OpenAI", slug: "openai", category: "AI/ML", description: "AI research and deployment company." }) { id }
    createTechnology(data: { name: "Figma", slug: "figma", category: "Design", description: "Collaborative interface design tool." }) { id }
    createTechnology(data: { name: "PostgreSQL", slug: "postgresql", category: "Database", description: "Open source relational database." }) { id }
    createTechnology(data: { name: "Hygraph", slug: "hygraph", category: "CMS", description: "Federated Content Platform." }) { id }
    createTechnology(data: { name: "Next.js", slug: "next-js", category: "Frontend", description: "The React Framework for the Web." }) { id }
  }
`;

async function main() {
    try {
        console.log("--- CREATING MISSING TECH ---");
        // Note: This might fail if slugs already exist but weren't returned by previous queries due to pagination limits or draft status.
        // Ideally we would check first, but for now we try creation.
        const data = await request(endpoint, mutation);
        console.log("✅ Successfully created missing technologies:\n", JSON.stringify(data, null, 2));

        // Publish them? (Optional, usually requires another ID-based mutation)
        console.log("⚠️ Technologies created in DRAFT state. You may need to publish them in Hygraph UI.");

    } catch (error) {
        console.error("Creation Failed:", error.message);
    }
}

main();
