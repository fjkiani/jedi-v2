
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

const QUERY = gql`
  query CheckImplementationData {
    useCases(first: 10) {
      title
      slug
      implementation
    }
  }
`;

async function main() {
    try {
        console.log("Checking Use Case Implementation Data...");
        const data = await client.request(QUERY);

        const validCases = data.useCases.filter(uc => uc.implementation && Object.keys(uc.implementation).length > 0);

        console.log(`Total Use Cases Scanned: ${data.useCases.length}`);
        console.log(`Use Cases with Valid Implementation JSON: ${validCases.length}`);

        if (validCases.length > 0) {
            console.log("\nValid Cases Found:");
            validCases.forEach(uc => {
                console.log(`- ${uc.title} (${uc.slug})`);
                console.log(`  Keys: ${Object.keys(uc.implementation).join(', ')}`);
            });
        } else {
            console.log("\n⚠️ No Use Cases have 'implementation' JSON data populated.");
        }

    } catch (error) {
        console.error("Query Failed:", error);
    }
}

main();
