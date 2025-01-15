import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { hygraphClient } from '@/lib/hygraph';

export const TestSEO = () => {
  // Test root page SEO (default)
  const { data: rootSEO, loading: rootLoading, error: rootError } = useSEO();
  
  // Test technology SEO
  const { data: techSEO, loading: techLoading, error: techError } = useSEO('huggingface', 'technology');

  // Log results
  useEffect(() => {
    const fetchAllTechnologies = async () => {
      try {
        console.log('\n=== Fetching All Technologies ===');
        const query = `
          query {
            categories {
              name
              technologies {
                name
                description
                icon
                useCases {
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
        
        console.log('\n📊 Technology Categories:');
        result.categories?.forEach(category => {
        //   console.log(`\n🔹 Category: ${category.name}`);
          category.technologies?.forEach(tech => {
            // console.log(`\n  📌 Technology: ${tech.name}`);
            // console.log(`     Description: ${tech.description}`);
            
            if (tech.useCases?.length) {
            //   console.log('     Use Cases:');
              tech.useCases.forEach(useCase => {
                // console.log(`       • ${useCase.title}`);
                // console.log(`         ${useCase.description}`);
                if (useCase.capabilities?.length) {
                //   console.log('         Capabilities:', useCase.capabilities.join(', '));
                }
              });
            }
          });
        });
        
        console.log('\n=== End Technology List ===\n');
      } catch (error) {
        console.error('Error fetching technologies:', error);
      }
    };

    fetchAllTechnologies();

    // Log SEO test results
    console.log('=== SEO Test Results ===');
    
    if (!rootLoading) {
      console.log('\n📄 Root Page SEO Status:', rootError ? '❌ Error' : '✅ Success');
      if (rootError) {
        console.error('Root Error:', rootError);
      } else {
        console.log('Root Data:', rootSEO);
      }
    }

    if (!techLoading) {
      console.log('\n🔧 Technology SEO Status:', techError ? '❌ Error' : '✅ Success');
      if (techError) {
        console.error('Technology Error:', techError);
      } else {
        console.log('Technology SEO Data:', techSEO);
      }
    }
    
    console.log('\n=== End Test Results ===\n');
  }, [rootLoading, rootError, rootSEO, techLoading, techError, techSEO]);

  return null;
}; 