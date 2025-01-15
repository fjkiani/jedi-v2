import { useEffect, useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { hygraphClient } from '@/lib/hygraph';

export const TestSEO = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Log results
  useEffect(() => {
    const fetchAllTechnologies = async () => {
      try {
        console.log('\n=== Fetching All Technologies SEO Data ===');
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
                  architecture {
                    description
                  }
                }
              }
            }
          }
        `;

        const result = await hygraphClient.request(query);
        
        result.categories?.forEach(category => {
          category.technologies?.forEach(tech => {
            // Generate SEO data for each technology
            const useCaseDescriptions = tech.useCases?.map(uc => 
              `${uc.title}: ${uc.description}`
            ).join('. ') || '';

            const capabilities = tech.useCases?.flatMap(uc => 
              uc.capabilities || []
            ).filter(Boolean);

            const seoData = {
              title: `${tech.name} - ${category.name} | Jedi Labs`,
              description: [
                tech.description,
                useCaseDescriptions && `Use Cases: ${useCaseDescriptions}`
              ].filter(Boolean).join('. '),
              keywords: [
                tech.name,
                category.name,
                'AI Technology',
                'Cloud Solutions',
                ...(capabilities || [])
              ].filter(Boolean).join(', '),
              useCases: tech.useCases
            };

            // console.log(`\n  📌 Technology: ${tech.name}`);
            // console.log(`     SEO Title: ${seoData.title}`);
            // console.log(`     SEO Description: ${seoData.description}`);
            // console.log(`     SEO Keywords: ${seoData.keywords}`);
            
            if (tech.useCases?.length) {
              console.log('     Use Cases:');
              tech.useCases.forEach(useCase => {
                // console.log(`       • ${useCase.title}`);
                // console.log(`         ${useCase.description}`);
                if (useCase.capabilities?.length) {
                }
              });
            }
          });
        });
        
        setTechnologies(result.categories);
        setLoading(false);
        console.log('\n=== End Technology SEO Data ===\n');
      } catch (error) {
        console.error('Error fetching technologies:', error);
        setLoading(false);
      }
    };

    fetchAllTechnologies();
  }, []);

  if (loading) {
    return null;
  }

  return null;
}; 