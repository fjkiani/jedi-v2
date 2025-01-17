import { useState, useEffect } from 'react';
import { hygraphClient } from '@/lib/hygraph';

const defaults = {
  title: 'Jedi Labs - Advanced AI and Cloud Solutions',
  description: 'Advanced AI and Cloud Solutions for modern businesses. We specialize in secure, scalable AI implementations, custom solutions, and enterprise-grade technology consulting.',
  keywords: 'AI, Machine Learning, Cloud Computing, Enterprise Solutions, Digital Transformation',
  ogImage: null
};

export const useSEO = (slug, type = 'page', prefetchedData = null) => {
  const [data, setData] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`🔄 [${requestId}] Starting SEO data fetch for ${type}:${slug}`);

    const fetchSEOData = async () => {
      try {
        // If we have prefetched data, use it
        if (prefetchedData) {
          console.log(`📦 [${requestId}] Using prefetched data:`, prefetchedData);
          const seoData = generateSEOData(type, prefetchedData);
          setData(seoData);
          setLoading(false);
          return;
        }

        // If no slug provided, use defaults
        if (!slug) {
          console.log(`ℹ️ [${requestId}] No slug provided, using defaults`);
          setData(defaults);
          setLoading(false);
          return;
        }

        // Fetch data based on type
        let result;
        if (type === 'blog') {
          const query = `
            query GetBlogPost($slug: String!) {
              post(where: { slug: $slug }) {
                title
                excerpt
                content
                publishedAt
                updatedAt
                categories {
                  name
                }
                author {
                  name
                  bio
                  photo {
                    url
                  }
                }
                coverImage {
                  url
                }
              }
            }
          `;
          
          result = await hygraphClient.request(query, { slug });
          console.log(`📊 [${requestId}] Blog post data:`, result);
          
          if (!result.post) {
            throw new Error(`No blog post found for slug: ${slug}`);
          }

          const seoData = {
            title: `${result.post.title} | Jedi Labs Blog`,
            description: result.post.excerpt || defaults.description,
            keywords: generateBlogKeywords(result.post),
            ogImage: result.post.coverImage?.url,
            content: result.post.content,
            publishedAt: result.post.publishedAt,
            updatedAt: result.post.updatedAt,
            author: result.post.author,
            categories: result.post.categories
          };

          setData(seoData);
        } else if (type === 'technology') {
          const query = `
            query GetTechnology($slug: String!) {
              technologies(where: { slug: $slug }) {
                name
                description
                features
                businessMetrics
                useCases {
                  title
                  description
                  capabilities
                }
                category
              }
            }
          `;
          
          result = await hygraphClient.request(query, { slug });
          console.log(`📊 [${requestId}] Technology data:`, result);
          
          if (!result.technologies?.length) {
            throw new Error(`No technology found for slug: ${slug}`);
          }

          const tech = result.technologies[0];
          const seoData = {
            title: `${tech.name} | Jedi Labs Technology`,
            description: generateTechDescription(tech),
            keywords: generateTechKeywords(tech),
            ogImage: null,
            useCases: tech.useCases
          };

          setData(seoData);
        }

        setLoading(false);
      } catch (err) {
        console.error(`❌ [${requestId}] Error fetching SEO data:`, err);
        setError(err);
        setLoading(false);
      }
    };

    fetchSEOData();
  }, [slug, type, prefetchedData]);

  return { data, loading, error };
};

function generateSEOData(type, data) {
  if (type === 'blog') {
    return {
      title: `${data.title} | Jedi Labs Blog`,
      description: data.excerpt || defaults.description,
      keywords: generateBlogKeywords(data),
      ogImage: data.coverImage?.url,
      content: data.content,
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      author: data.author,
      categories: data.categories
    };
  }
  
  // Default to technology type
  return {
    title: `${data.name} | Jedi Labs Technology`,
    description: generateTechDescription(data),
    keywords: generateTechKeywords(data),
    ogImage: null,
    useCases: data.useCases
  };
}

function generateBlogKeywords(post) {
  const keywords = ['Jedi Labs', 'Blog'];
  
  if (post.categories) {
    keywords.push(...post.categories.map(cat => cat.name));
  }
  
  // Extract key terms from title and excerpt
  const titleWords = post.title.toLowerCase().split(' ');
  keywords.push(...titleWords.filter(word => word.length > 3));
  
  return [...new Set(keywords)].join(', ');
}

function generateTechDescription(tech) {
  let description = tech.description;
  
  if (tech.features?.length) {
    description += ` Key features include: ${tech.features.join(', ')}.`;
  }
  
  if (tech.businessMetrics?.length) {
    description += ` Business benefits: ${tech.businessMetrics.join(', ')}.`;
  }
  
  return description;
}

function generateTechKeywords(tech) {
  const keywords = ['Jedi Labs', 'Technology', tech.name];
  
  if (tech.category) {
    keywords.push(tech.category);
  }
  
  if (tech.features) {
    keywords.push(...tech.features);
  }
  
  if (tech.useCases) {
    tech.useCases.forEach(useCase => {
      if (useCase.capabilities) {
        keywords.push(...useCase.capabilities);
      }
    });
  }
  
  return [...new Set(keywords)].join(', ');
}