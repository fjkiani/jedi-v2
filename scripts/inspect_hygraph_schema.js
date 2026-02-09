
import dotenv from 'dotenv';
import { GraphQLClient, gql } from 'graphql-request';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const endpoint = process.env.VITE_HYGRAPH_ENDPOINT;
const token = process.env.VITE_HYGRAPH_TOKEN;

if (!endpoint) {
    console.error("Error: VITE_HYGRAPH_ENDPOINT not found in .env");
    process.exit(1);
}

const client = new GraphQLClient(endpoint, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

const INTROSPECTION_QUERY = gql`
  query IntrospectSchema {
    __schema {
      types {
        name
        kind
        description
        fields {
          name
          description
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  }
`;

async function main() {
    console.log("Fetching Hygraph schema...");
    try {
        const data = await client.request(INTROSPECTION_QUERY);
        const types = data.__schema.types.filter(t => t.kind === 'OBJECT' && !t.name.startsWith('__'));

        // Sort interesting types to the top
        const interestingTypes = ['Solution', 'Technology', 'TechnologySubcategory', 'UseCase', 'Industry'];

        console.log(`Found ${types.length} Object Types.`);

        types.forEach(type => {
            // Basic filtering to reduce noise (ignore connection/edge types unless relevant)
            if (type.name.endsWith('Connection') || type.name.endsWith('Edge') || type.name.endsWith('Aggregate')) return;

            console.log(`\n=== TYPE: ${type.name} ===`);
            if (type.description) console.log(`Description: ${type.description}`);

            if (type.fields) {
                console.log("Fields:");
                type.fields.forEach(field => {
                    let fieldType = field.type.name;
                    if (!fieldType && field.type.kind === 'NON_NULL') {
                        fieldType = `${field.type.ofType.name}!`;
                    } else if (!fieldType && field.type.kind === 'LIST') {
                        fieldType = `[${field.type.ofType.name}]`;
                    }
                    console.log(`  - ${field.name} (${fieldType})`);
                });
            }
        });

    } catch (error) {
        console.error("Error fetching schema:", error);
    }
}

main();
