
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

const INTROSPECTION = gql`
  query DeepDive {
    categoryType: __type(name: "Category") {
      name
      fields {
        name
        type {
           name
           kind
        }
      }
    }
    appType: __type(name: "IndustryApplication") { # Check if this matches introspection
      name
      fields {
        name
        type {
           name
           kind
        }
      }
    }
  }
`;

async function main() {
  console.log("Deep Scan: Locating the Architecture Link...");
  try {
    const data = await client.request(INTROSPECTION);

    if (data.categoryType) {
      console.log("=== Category Fields ===");
      data.categoryType?.fields.forEach(f => console.log(`- ${f.name} (${f.type.name || f.type.kind})`));
    }

    if (data.appType) {
      console.log("\n=== IndustryApplication Fields ===");
      data.appType?.fields.forEach(f => console.log(`- ${f.name} (${f.type.name || f.type.kind})`));
    }

  } catch (error) {
    console.error("Scan failed:", error);
  }
}

main();
