import { GraphQLClient } from 'graphql-request';

const endpoint = import.meta.env.VITE_HYGRAPH_ENDPOINT;
const token = import.meta.env.VITE_HYGRAPH_TOKEN;

if (!endpoint || !token) {
  console.error('Hygraph configuration missing:', {
    hasEndpoint: !!endpoint,
    hasToken: !!token
  });
}

// Create base GraphQL client
const baseClient = new GraphQLClient(endpoint || '', {
  headers: {
    Authorization: `Bearer ${token || ''}`,
  },
  fetchOptions: {
    cache: 'no-store',
  },
});

// Simple in-memory cache for GraphQL responses
const queryCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting queue
let requestQueue = [];
let isProcessingQueue = false;
const MAX_CONCURRENT_REQUESTS = 2;
const REQUEST_DELAY = 500; // 500ms between requests

// Enhanced client with retry logic and caching
class EnhancedHygraphClient {
  constructor(client) {
    this.client = client;
  }

  async request(query, variables = {}, options = {}) {
    // Create cache key
    const cacheKey = JSON.stringify({ query, variables });
    
    // Check cache first
    if (queryCache.has(cacheKey)) {
      const cached = queryCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('[Hygraph] Using cached response for query');
        return cached.data;
      } else {
        queryCache.delete(cacheKey);
      }
    }

    // Add to queue and process
    return new Promise((resolve, reject) => {
      requestQueue.push({
        query,
        variables,
        options,
        cacheKey,
        resolve,
        reject,
        retries: 0
      });
      
      this.processQueue();
    });
  }

  async processQueue() {
    if (isProcessingQueue || requestQueue.length === 0) {
      return;
    }

    isProcessingQueue = true;

    while (requestQueue.length > 0) {
      const batch = requestQueue.splice(0, MAX_CONCURRENT_REQUESTS);
      
      // Process batch concurrently
      await Promise.all(
        batch.map(request => this.executeRequest(request))
      );

      // Wait before next batch
      if (requestQueue.length > 0) {
        await this.delay(REQUEST_DELAY);
      }
    }

    isProcessingQueue = false;
  }

  async executeRequest(request) {
    const { query, variables, cacheKey, resolve, reject, retries } = request;
    
    try {
      console.log(`[Hygraph] Executing request (attempt ${retries + 1})`);
      const data = await this.client.request(query, variables);
      
      // Cache successful response
      queryCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      resolve(data);
    } catch (error) {
      console.error(`[Hygraph] Request failed (attempt ${retries + 1}):`, error);
      
      // Handle rate limiting with exponential backoff
      if (error.response?.status === 429 && retries < 3) {
        const backoffDelay = Math.pow(2, retries) * 1000; // 1s, 2s, 4s
        console.log(`[Hygraph] Rate limited, retrying in ${backoffDelay}ms`);
        
        await this.delay(backoffDelay);
        request.retries = retries + 1;
        
        // Re-add to queue for retry
        requestQueue.unshift(request);
        return;
      }
      
      // Handle other errors or max retries reached
      if (error.response?.status === 429) {
        console.error('[Hygraph] Rate limit exceeded, max retries reached');
        reject(new Error('Hygraph API rate limit exceeded. Please try again later.'));
      } else {
        reject(error);
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Clear cache method
  clearCache() {
    queryCache.clear();
    console.log('[Hygraph] Cache cleared');
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: queryCache.size,
      keys: Array.from(queryCache.keys()).slice(0, 5) // First 5 keys for debugging
    };
  }
}

// Create enhanced client instance
const hygraphClient = new EnhancedHygraphClient(baseClient);

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

// Export enhanced client and utilities
export { 
  hygraphClient, 
  testConnection, 
  endpoint as hygraphEndpoint 
}; 