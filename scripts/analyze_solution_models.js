
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
  query FullDump {
    __schema {
      types {
        name
        kind
        fields {
          name
          type {
            name
            kind
            ofType {
              name
            }
          }
        }
      }
    }
  }
`;

async function main() {
  console.log("Full Schema Dump Initiated...");
  try {
    const data = await client.request(INTROSPECTION);

    // Filter for our relevant types
    const targetTypes = ["IndustryApplication", "UseCase", "Category", "Technology", "Solution"];

    data.__schema.types
      .filter(t => targetTypes.includes(t.name))
      .forEach(t => {
        console.log(`\n=== TYPE: ${t.name} ===`);
        t.fields.forEach(f => {
          const typeName = f.type.name || f.type.ofType?.name || f.type.kind;
          console.log(`  - ${f.name} (${typeName})`);
        });
      });

  } catch (error) {
    console.error("Dump failed:", error.message);
  }
}

main();
