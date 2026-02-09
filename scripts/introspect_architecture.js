
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
  query IntrospectArchitecture {
    architecture: __type(name: "Architecture") {
        name
        fields {
          name
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
`;

async function main() {
    try {
        console.log("Introspecting Architecture Type...");
        const data = await client.request(QUERY);

        if (data.architecture) {
            console.log("FIELDS on Architecture Type:");
            data.architecture.fields.forEach(f => {
                console.log(`- ${f.name} (${f.type.kind})`);
            });
        } else {
            console.log("Type 'Architecture' not found.");
        }

    } catch (error) {
        console.error("Query Failed:", error);
    }
}

main();
