import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { hygraphClient } from '@/lib/hygraph';
import { RootSEO } from './RootSEO';

export const TestSEO = () => {
  // Test root page SEO (default)
  const { data: rootSEO, loading: rootLoading, error: rootError } = useSEO();

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
                slug
                description
                icon
                useCases {
                  title
                  description
                  capabilities
                }
              }
            }
          }
        `;

        const result = await hygraphClient.request(query);
        
        console.log('\n📊 Technology SEO Status:');
        result.categories?.forEach(category => {
          category.technologies?.forEach(tech => {
            // console.log(`\n🔧 Testing SEO for ${tech.name}:`);
            
            // Mount RootSEO for each technology
            const rootSEO = document.createElement('div');
            rootSEO.innerHTML = `<div id="seo-test-${tech.slug}"></div>`;
            document.body.appendChild(rootSEO);
            
            // Add RootSEO component
            const seoComponent = <RootSEO slug={tech.slug} type="technology" />;
            
            // console.log(`  • Category: ${category.name}`);
            // console.log(`  • Slug: ${tech.slug}`);
            // console.log(`  • Description: ${tech.description}`);
            // console.log(`  • Use Cases: ${tech.useCases?.length || 0}`);
            
            // Verify structured data
            const structuredDataScript = document.querySelector('#structured-data');
            if (structuredDataScript) {
              // console.log('  ✅ Structured Data generated');
              try {
                const data = JSON.parse(structuredDataScript.textContent);
                // console.log('  • Schema Type:', data['@type']);
                // console.log('  • Title:', data.headline);
              } catch (e) {
                console.log('  ❌ Error parsing structured data');
              }
            } else {
              // console.log('  ❌ No structured data found');
            }
          });
        });
        
        console.log('\n=== End Technology SEO Tests ===\n');
      } catch (error) {
        console.error('Error testing technologies:', error);
      }
    };

    fetchAllTechnologies();

    // Log root SEO test results
    if (!rootLoading) {
      console.log('\n📄 Root Page SEO Status:', rootError ? '❌ Error' : '✅ Success');
      if (rootError) {
        console.error('Root Error:', rootError);
      } else {
        console.log('Root Data:', rootSEO);
      }
    }
  }, [rootLoading, rootError, rootSEO]);

  return null;
}; 