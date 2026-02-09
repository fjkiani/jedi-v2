
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
  query IntrospectRoot {
    __schema {
      queryType {
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
  }
`;

async function main() {
    try {
        console.log("Introspecting Root Query...");
        const data = await client.request(QUERY);

        if (data.__schema && data.__schema.queryType) {
            console.log("ROOT QUERY FIELDS:");
            const fields = data.__schema.queryType.fields.map(f => f.name).sort();
            fields.forEach(f => console.log(`- ${f}`));
        }

    } catch (error) {
        console.error("Query Failed:", error);
    }
}

main();
