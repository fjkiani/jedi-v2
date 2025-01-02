import { GraphQLClient } from 'graphql-request';

const hygraphClient = new GraphQLClient(
  import.meta.env.VITE_HYGRAPH_ENDPOINT || '',
  {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_HYGRAPH_TOKEN || ''}`,
    },
  }
);

export { hygraphClient }; 