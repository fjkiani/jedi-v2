import { request, gql } from 'graphql-request';
import { INTELLIGENCE_UNITS } from '../constants/intelligenceUnits';

const graphqlAPI = import.meta.env.VITE_HYGRAPH_ENDPOINT;

export const getAgents = async () => {
    const query = gql`
    query GetAgents {
      agents(first: 10, stage: PUBLISHED) {
        id
        name
        codename
        tagline
        description
        icon
        capabilities
        status
        imageUrl {
          url
        }
        color
      }
    }
  `;

    try {
        // Attempt to fetch from Hygraph
        const result = await request(graphqlAPI, query);

        // If we get results, return them. 
        // We might need to map them if the schema slightly differs, 
        // but for now we assume the schema will match the query.
        if (result.agents && result.agents.length > 0) {
            return result.agents.map(agent => ({
                ...agent,
                // Ensure capabilities is parsed if it comes as JSON, or use as is
                capabilities: Array.isArray(agent.capabilities) ? agent.capabilities : [],
                // Ensure imageUrl is a string if it comes as an asset object
                imageUrl: agent.imageUrl?.url || agent.imageUrl
            }));
        }

        throw new Error("No agents found in Hygraph");
    } catch (error) {
        console.warn("Falling back to static Intelligence Units:", error.message);
        // Fallback to static constant
        return INTELLIGENCE_UNITS;
    }
};
