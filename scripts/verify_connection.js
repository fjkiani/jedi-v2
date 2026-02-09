
import dotenv from 'dotenv';
import { GraphQLClient, gql } from 'graphql-request';

dotenv.config();

const endpoint = process.env.VITE_HYGRAPH_ENDPOINT;
const token = process.env.VITE_HYGRAPH_TOKEN;

console.log("Endpoint:", endpoint);
console.log("Token Length:", token ? token.length : 0);

const client = new GraphQLClient(endpoint, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

const QUERY = gql`
  query VerifyConnection {
    industries(first: 1) {
      name
      slug
    }
  }
`;

async function main() {
    try {
        console.log("Verifying Connection...");
        const data = await client.request(QUERY);
        console.log("SUCCESS:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Query Failed:", error);
    }
}

main();
