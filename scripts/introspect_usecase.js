
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
  query IntrospectUseCase {
    __type(name: "UseCase") {
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
        console.log("Introspecting UseCase Type...");
        const data = await client.request(QUERY);

        if (data.__type) {
            const fields = data.__type.fields.map(f => {
                let typeName = f.type.name;
                if (!typeName && f.type.ofType) {
                    typeName = `[${f.type.ofType.name}]`;
                }
                return `${f.name}: ${typeName} (${f.type.kind})`;
            });

            console.log("FIELDS on UseCase Type:");
            fields.sort().forEach(f => console.log(`  - ${f}`));
        } else {
            console.log("Type 'UseCase' not found. Trying 'useCase' or 'UseCaseS'...");
        }

    } catch (error) {
        console.error("Query Failed:", error);
    }
}

main();
