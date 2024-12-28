import { GraphQLClient } from 'graphql-request';

const HYGRAPH_ENDPOINT = import.meta.env.VITE_HYGRAPH_ENDPOINT;
const HYGRAPH_TOKEN = import.meta.env.VITE_HYGRAPH_TOKEN;

export const hygraphClient = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`
  }
}); 