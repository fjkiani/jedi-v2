import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { hygraphClient } from '@/lib/hygraph';
import { RootSEO } from './RootSEO';

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
        
        // Verify structured data
        console.log('\n=== Structured Data Verification ===');
        const structuredDataScript = document.querySelector('#structured-data');
        if (structuredDataScript) {
          console.log('✅ Structured Data found in head:');
          const data = JSON.parse(structuredDataScript.textContent);
          console.log('Schema Type:', data['@type']);
          console.log('Name:', data.name);
          console.log('Description:', data.description);
          console.log('Usage Info:', data.usageInfo?.length + ' use cases');
          console.log('\nFull Structured Data:');
          console.log(JSON.stringify(data, null, 2));
        } else {
          console.log('❌ No structured data script found');
          console.log('\nDebug Info:');
          console.log('1. SEO Data State:', {
            title: techSEO?.title,
            hasUseCases: Boolean(techSEO?.useCases),
            useCasesCount: techSEO?.useCases?.length
          });
          
          console.log('\n2. Document Head Scripts:');
          const allScripts = Array.from(document.head.getElementsByTagName('script'));
          allScripts.forEach((script, index) => {
            console.log(`Script ${index + 1}:`, {
              id: script.id || 'no-id',
              type: script.type,
              content: script.type === 'application/ld+json' ? 'JSON-LD Content' : 'Other Content'
            });
          });
          
          console.log('\n3. RootSEO Props:', {
            slug: 'huggingface',
            type: 'technology'
          });
        }
        console.log('=== End Structured Data Verification ===\n');
      }
    }
    
    console.log('\n=== End Test Results ===\n');
  }, [rootLoading, rootError, rootSEO, techLoading, techError, techSEO]);

  return (
    <>
      <RootSEO slug="huggingface" type="technology" />
    </>
  );
}; 