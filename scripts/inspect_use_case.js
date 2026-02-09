
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
  query InspectCorrect {
    useCaseS(first: 100) {
      title
      slug
      implementation
      architecture {
        description
        # Trying components again, if it fails I will remove
        components {
           name 
           description
           details
           explanation
        }
        flow {
          step
          description
          details
        }
      }
      industryApplication {
        applicationTitle
        industryChallenge { html }
        jediApproach { html }
        keyCapabilities
        expectedResults
      }
    }
  }
`;

async function main() {
    const targetTitle = "Research";

    try {
        console.log(`Inspecting Use Cases (Correct Schema 'useCaseS')...`);
        const data = await client.request(QUERY);

        // Client-side filtering
        const matches = data.useCaseS.filter(uc =>
            uc.title.toLowerCase().includes(targetTitle.toLowerCase()) ||
            uc.slug.includes('research')
        );

        if (matches.length > 0) {
            console.log(`\nFOUND ${matches.length} MATCHES:`);
            matches.forEach(uc => {
                console.log(`Title: ${uc.title}`);
                console.log(`Slug: ${uc.slug}`);
                console.log("--------------------------------------------------");
                console.log("IMPLEMENTATION JSON:", uc.implementation ? "PRESENT (length " + JSON.stringify(uc.implementation).length + ")" : "MISSING");
                console.log("ARCHITECTURE:", uc.architecture ? "PRESENT" : "MISSING");
                console.log("INDUSTRY APP:", uc.industryApplication ? "PRESENT" : "MISSING");

                if (uc.implementation) {
                    console.log("--- IMPLEMENTATION CONTENT ---");
                    console.log(JSON.stringify(uc.implementation, null, 2));
                }
                if (uc.architecture) {
                    console.log("--- ARCHITECTURE CONTENT ---");
                    console.log(JSON.stringify(uc.architecture, null, 2));
                }
                if (uc.industryApplication) {
                    console.log("--- INDUSTRY APP CONTENT ---");
                    console.log(JSON.stringify(uc.industryApplication, null, 2));
                }
                console.log("==================================================\n");
            });
        } else {
            console.log("No matching Use Case found.");
            console.log("Available Titles:", data.useCaseS.map(u => u.title).join(", "));
        }

    } catch (error) {
        console.error("Query Failed:", error);
    }
}

main();
