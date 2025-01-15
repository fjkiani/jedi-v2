import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';

export const BlogSEO = ({ slug }) => {
  const { data: seoData, loading, error } = useSEO(slug, 'blog');

  useEffect(() => {
    if (!loading && !error && seoData) {
      try {
        const structuredData = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': seoData.title,
          'description': seoData.description,
          'image': seoData.ogImage,
          'datePublished': seoData.publishedAt,
          'dateModified': seoData.updatedAt,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': window.location.href
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Jedi Labs',
            'url': 'https://www.jedilabs.org'
          }
        };

        // Add author information if available
        if (seoData.author) {
          structuredData.author = {
            '@type': 'Person',
            'name': seoData.author.name,
            'description': seoData.author.bio,
            'image': seoData.author.photo?.url
          };
        }

        // Add the structured data to head
        let scriptTag = document.querySelector('#structured-data');
        if (!scriptTag) {
          scriptTag = document.createElement('script');
          scriptTag.id = 'structured-data';
          scriptTag.type = 'application/ld+json';
          document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(structuredData, null, 2);

        // Update meta tags
        document.title = seoData.title;
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.name = 'description';
          document.head.appendChild(metaDescription);
        }
        metaDescription.content = seoData.description;

        // Update OpenGraph tags
        updateOpenGraphTag('og:title', seoData.title);
        updateOpenGraphTag('og:description', seoData.description);
        if (seoData.ogImage) {
          updateOpenGraphTag('og:image', seoData.ogImage);
        }
        updateOpenGraphTag('og:type', 'article');
        
        // Add article specific OG tags
        if (seoData.publishedAt) {
          updateOpenGraphTag('article:published_time', seoData.publishedAt);
        }
        if (seoData.updatedAt) {
          updateOpenGraphTag('article:modified_time', seoData.updatedAt);
        }
        if (seoData.author) {
          updateOpenGraphTag('article:author', seoData.author.name);
        }
      } catch (error) {
        console.error('Error setting blog SEO:', error);
      }
    }
  }, [seoData, loading, error]);

  return null;
};

function updateOpenGraphTag(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.content = content;
} 