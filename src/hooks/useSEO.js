import { useState, useEffect } from 'react';
import { hygraphClient } from '../lib/hygraph';

const defaults = {
  title: 'Jedi Labs - Advanced AI and Cloud Solutions',
  description: 'Advanced AI and Cloud Solutions for modern businesses. We specialize in secure, scalable AI implementations, custom solutions, and enterprise-grade technology consulting.',
  keywords: 'AI, Machine Learning, Cloud Computing, Enterprise Solutions, Digital Transformation',
  ogImage: null,
  author: null,
  teamMember: null
};

export const useSEO = (slug, type = 'page') => {
  const [state, setState] = useState({
    data: defaults,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isActive = true;
    const requestId = Math.random().toString(36).substring(7);

    const fetchSEOData = async () => {
      console.log(`🔍 [${requestId}] Fetching SEO data for ${type}${slug ? `: ${slug}` : ''}`);
      
      try {
        // If no slug is provided and it's a page type, use defaults (for root page)
        if (!slug && type === 'page') {
          console.log(`✅ [${requestId}] Using default SEO values for root page`);
          if (isActive) {
            setState({
              data: defaults,
              loading: false,
              error: null
            });
          }
          return;
        }

        let query;
        
        if (type === 'technology') {
          query = `
            query GetTechnologyBySlug($slug: String!) {
              technologyS(where: { slug: $slug }) {
                id
                name
                slug
                description
                icon
                features
                businessMetrics
                category {
                  id
                  name
                  slug
                }
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
          `;
        } else {
          // Default page query
          query = `
            query GetPageSEO($slug: String!) {
              posts(where: { slug: $slug }) {
                title
                description
              }
            }
          `;
        }

        console.log(`📡 [${requestId}] Executing ${type} query...`);
        const result = await hygraphClient.request(query, { slug });
        
        if (!isActive) {
          console.log(`⚠️ [${requestId}] Request cancelled - component unmounted`);
          return;
        }

        if (type === 'technology') {
          const tech = result.technologyS?.[0];

          if (tech) {
            console.log(`✅ [${requestId}] Found technology: ${tech.name}`);
            
            // Create rich meta description with use cases
            const useCaseDescriptions = tech.useCases?.map(uc => 
              `${uc.title}: ${uc.description}`
            ).join('. ') || '';

            const metaDescription = [
              tech.description,
              tech.features && `Features: ${tech.features}`,
              tech.businessMetrics && `Metrics: ${tech.businessMetrics}`,
              useCaseDescriptions && `Use Cases: ${useCaseDescriptions}`
            ].filter(Boolean).join('. ');

            // Create rich keywords including capabilities from use cases
            const capabilities = tech.useCases?.flatMap(uc => 
              uc.capabilities || []
            ).filter(Boolean);

            const keywords = [
              tech.name,
              tech.category?.name,
              'AI Technology',
              'Cloud Solutions',
              tech.features,
              ...capabilities
            ].filter(Boolean).join(', ');

            const seoData = {
              ...defaults,
              title: `${tech.name} - ${tech.category?.name || 'Technology'} | Jedi Labs`,
              description: metaDescription,
              keywords: keywords,
              ogImage: tech.icon || defaults.ogImage,
              useCases: tech.useCases // Include use cases in SEO data for potential structured data
            };

            console.log(`📝 [${requestId}] Generated SEO data:`, seoData);

            if (isActive) {
              setState({
                data: seoData,
                loading: false,
                error: null
              });
            }
          } else {
            throw new Error(`Technology not found: ${slug}`);
          }
        } else {
          const post = result.posts?.[0];
          if (post) {
            console.log(`✅ [${requestId}] Found post: ${post.title}`);
            if (isActive) {
              setState({
                data: {
                  ...defaults,
                  title: post.title || defaults.title,
                  description: post.description || defaults.description
                },
                loading: false,
                error: null
              });
            }
          } else {
            console.log(`⚠️ [${requestId}] No post found for slug: ${slug}, using defaults`);
            if (isActive) {
              setState({
                data: defaults,
                loading: false,
                error: null
              });
            }
          }
        }
      } catch (error) {
        console.error(`❌ [${requestId}] SEO Error:`, {
          type,
          slug,
          error: error.message,
          response: error.response,
          stack: error.stack
        });
        if (isActive) {
          setState({
            data: defaults,
            loading: false,
            error: error.message || 'Failed to load SEO data'
          });
        }
      }
    };

    fetchSEOData();

    return () => {
      isActive = false;
      console.log(`🧹 [${requestId}] Cleaning up SEO request`);
    };
  }, [slug, type]);

  return state;
};