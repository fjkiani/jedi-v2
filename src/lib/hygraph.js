import { GraphQLClient } from 'graphql-request';

const endpoint = import.meta.env.VITE_HYGRAPH_ENDPOINT;
const token = import.meta.env.VITE_HYGRAPH_TOKEN;

if (!endpoint || !token) {
  console.error('Hygraph configuration missing:', {
    hasEndpoint: !!endpoint,
    hasToken: !!token
  });
}

const hygraphClient = new GraphQLClient(endpoint || '', {
  headers: {
    Authorization: `Bearer ${token || ''}`,
  },
  fetchOptions: {
    cache: 'no-store',
  },
});

// Test function to check connection
const testConnection = async () => {
  try {
    const query = `
      query {
        __schema {
          types {
            name
          }
        }
      }
    `;
    
    const result = await hygraphClient.request(query);
    console.log('Hygraph connection test successful');
    return true;
  } catch (error) {
    console.error('Hygraph connection test failed:', error);
    return false;
  }
};

export { hygraphClient, testConnection }; 