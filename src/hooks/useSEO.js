import { useState, useEffect } from 'react';
import { hygraphClient } from '@/lib/hygraph';

export const useSEO = (slug, type = 'page', prefetchedData = null) => {
  const [state, setState] = useState({
    data: {
      title: 'Jedi Labs - Advanced AI and Cloud Solutions',
      description: 'Advanced AI and Cloud Solutions for modern businesses. We specialize in secure, scalable AI implementations, custom solutions, and enterprise-grade technology consulting.',
      keywords: 'AI, Machine Learning, Cloud Computing, Enterprise Solutions, Digital Transformation',
      ogImage: null,
      useCases: null
    },
    loading: !prefetchedData,
    error: null
  });

  useEffect(() => {
    let isActive = true;
    const requestId = Math.random().toString(36).substring(7);

    const fetchSEOData = async () => {
      try {
        // If we have prefetched data, use it directly and don't query Hygraph
        if (prefetchedData && Object.keys(prefetchedData).length > 0) {
          console.log(`📦 [${requestId}] Using prefetched data:`, prefetchedData);
          
          // Create rich meta description
          const useCaseDescriptions = prefetchedData.useCases?.map(uc => 
            `${uc.title}: ${uc.description}`
          ).join('. ') || '';

          const metaDescription = [
            prefetchedData.description,
            prefetchedData.features?.length && `Features: ${prefetchedData.features.join(', ')}`,
            prefetchedData.businessMetrics?.length && `Impact: ${prefetchedData.businessMetrics.join(', ')}`,
            useCaseDescriptions && `Use Cases: ${useCaseDescriptions}`
          ].filter(Boolean).join('. ');

          // Create rich keywords
          const keywords = [
            prefetchedData.name,
            prefetchedData.category,
            'AI Technology',
            'Cloud Solutions',
            ...(prefetchedData.features || []),
            ...(prefetchedData.useCases?.map(uc => uc.title) || [])
          ].filter(Boolean).join(', ');

          const seoData = {
            title: `${prefetchedData.name} - ${prefetchedData.category} | Jedi Labs`,
            description: metaDescription,
            keywords: keywords,
            ogImage: prefetchedData.icon || null,
            useCases: prefetchedData.useCases || null
          };

          console.log(`✅ [${requestId}] Generated SEO data from prefetch:`, seoData);
          
          if (isActive) {
            setState({
              data: seoData,
              loading: false,
              error: null
            });
          }
          return;
        }

        // Only proceed with Hygraph query if no prefetched data
        console.log(`🔍 [${requestId}] No prefetched data, querying Hygraph for ${type}${slug ? `: ${slug}` : ''}`);
        
        let query;
        if (type === 'technology') {
          query = `
            query GetTechnology($slug: String!) {
              categories {
                name
                technologies(where: { slug: $slug }) {
                  id
                  name
                  slug
                  description
                  icon
                  features
                  businessMetrics
                  useCases {
                    title
                    description
                    capabilities
                  }
                }
              }
            }
          `;
        } else if (type === 'page' && slug) {
          query = `
            query GetPage($slug: String!) {
              page(where: { slug: $slug }) {
                title
                description
                seo {
                  title
                  description
                  keywords
                }
              }
            }
          `;
        } else {
          // Return default data for root page
          if (isActive) {
            setState(prev => ({
              ...prev,
              loading: false
            }));
          }
          return;
        }

        console.log(`📡 [${requestId}] Executing ${type} query...`);
        const result = await hygraphClient.request(query, { slug });
        console.log(`✅ [${requestId}] Query result:`, result);
        
        if (!isActive) {
          console.log(`⚠️ [${requestId}] Request cancelled - component unmounted`);
          return;
        }

        if (type === 'technology') {
          // Find the first technology with matching slug across all categories
          const tech = result.categories
            ?.flatMap(cat => cat.technologies || [])
            .find(t => t.slug === slug);

          if (tech) {
            console.log(`✅ [${requestId}] Found technology: ${tech.name}`);
            
            // Create rich meta description
            const useCaseDescriptions = tech.useCases?.map(uc => 
              `${uc.title}: ${uc.description}`
            ).join('. ') || '';

            const metaDescription = [
              tech.description,
              tech.features?.length && `Features: ${tech.features.join(', ')}`,
              tech.businessMetrics?.length && `Impact: ${tech.businessMetrics.join(', ')}`,
              useCaseDescriptions && `Use Cases: ${useCaseDescriptions}`
            ].filter(Boolean).join('. ');

            // Create rich keywords
            const keywords = [
              tech.name,
              'AI Technology',
              'Cloud Solutions',
              ...(tech.features || []),
              ...(tech.useCases?.map(uc => uc.title) || [])
            ].filter(Boolean).join(', ');

            const seoData = {
              title: `${tech.name} - Technology | Jedi Labs`,
              description: metaDescription,
              keywords: keywords,
              ogImage: tech.icon || null,
              useCases: tech.useCases || null
            };

            console.log(`✅ [${requestId}] Generated SEO data from Hygraph:`, seoData);

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
          const page = result.page;
          if (page) {
            const seoData = {
              ...state.data,
              ...(page.seo || {}),
              title: page.seo?.title || page.title || state.data.title,
              description: page.seo?.description || page.description || state.data.description
            };

            if (isActive) {
              setState({
                data: seoData,
                loading: false,
                error: null
              });
            }
          } else {
            console.log(`⚠️ [${requestId}] No page found for slug: ${slug}, using defaults`);
            if (isActive) {
              setState(prev => ({
                ...prev,
                loading: false
              }));
            }
          }
        }
      } catch (error) {
        console.error(`❌ [${requestId}] SEO Error:`, {
          type,
          slug,
          message: error.message,
          response: error.response?.errors
        });
        if (isActive) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error.message || 'Failed to load SEO data'
          }));
        }
      }
    };

    fetchSEOData();

    return () => {
      isActive = false;
      console.log(`🧹 [${requestId}] Cleaning up SEO request`);
    };
  }, [slug, type, prefetchedData]);

  return state;
};