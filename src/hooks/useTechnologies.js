import { useState, useEffect } from 'react';
import { hygraphClient } from '../lib/hygraph';

// Cache for technologies
const techCache = {
  list: null,
  lastFetch: null
};

export const useTechnologies = () => {
  const [state, setState] = useState({
    technologies: techCache.list || [],
    loading: !techCache.list,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchTechnologies = async () => {
      // Use cache if available
      if (techCache.list) {
        setState({
          technologies: techCache.list,
          loading: false,
          error: null
        });
        return;
      }

      try {
        console.log('Fetching technologies...');
        const query = `
          query {
            categories {
              technologies {
                name
                description
                icon
                useCases {
                  id
                  title
                  description
                  capabilities
                  architecture {
                    description
                    components {
                      name
                      description
                    }
                  }
                }
              }
            }
          }
        `;

        const result = await hygraphClient.request(query);
        console.log('Raw API response:', result);
        
        if (!result.categories) {
          throw new Error('No categories returned from API');
        }

        // Flatten technologies from all categories
        const technologies = result.categories
          ?.flatMap(cat => cat.technologies) || [];

        console.log('Processed technologies:', technologies);

        // Cache the result
        techCache.list = technologies;
        
        if (isMounted) {
          setState({
            technologies,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          stack: error.stack
        });
        
        if (isMounted) {
          setState({
            technologies: [],
            loading: false,
            error: error.message || 'Failed to load technologies'
          });
        }
      }
    };

    fetchTechnologies();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}; 