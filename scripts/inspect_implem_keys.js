
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

const INSPECT_KEYS = gql`
  query InspectKeys($slug: String!) {
    useCase(where: { slug: $slug }, stage: PUBLISHED) {
      title
      implementation
    }
  }
`;

async function main() {
    const slug = "ai-powered-research-assistant";
    console.log(`Inspecting keys for: ${slug}...`);

    try {
        const data = await client.request(INSPECT_KEYS, { slug });
        if (data.useCase && data.useCase.implementation) {
            const impl = data.useCase.implementation;
            console.log("Implementation Type:", typeof impl);

            let obj = impl;
            if (typeof impl === 'string') {
                try {
                    obj = JSON.parse(impl);
                    console.log("Parsed JSON Successfully.");
                } catch (e) {
                    console.error("Failed to parse JSON:", e.message);
                }
            }

            if (typeof obj === 'object') {
                console.log("Keys:", Object.keys(obj));
                // Check specific keys
                if (obj.queries) console.log("Has 'queries': YES, Length:", obj.queries.length);
                else console.log("Has 'queries': NO");

                if (obj.query) console.log("Has 'query': YES");
            }

        } else {
            console.log("No implementation data found.");
        }

    } catch (error) {
        console.error("Inspection Failed:", error);
    }
}

main();
