import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: import.meta.env.VITE_HYGRAPH_API_URL, // Make sure this env variable is set
  cache: new InMemoryCache(),
}); 

export { client }; 
