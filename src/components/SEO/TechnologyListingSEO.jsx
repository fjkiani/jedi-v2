import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';

export const TechnologyListingSEO = () => {
  const { data: seoData, loading, error } = useSEO('technologies', 'page');

  useEffect(() => {
    if (!loading && !error) {
      try {
        const structuredData = {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          'name': 'AI and Cloud Technologies | Jedi Labs',
          'description': 'Explore our comprehensive suite of AI and cloud technologies. From machine learning frameworks to cloud infrastructure solutions.',
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
        document.title = 'AI and Cloud Technologies | Jedi Labs';
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.name = 'description';
          document.head.appendChild(metaDescription);
        }
        metaDescription.content = 'Explore our comprehensive suite of AI and cloud technologies. From machine learning frameworks to cloud infrastructure solutions.';

        // Update OpenGraph tags
        updateOpenGraphTag('og:title', 'AI and Cloud Technologies | Jedi Labs');
        updateOpenGraphTag('og:description', 'Explore our comprehensive suite of AI and cloud technologies. From machine learning frameworks to cloud infrastructure solutions.');
        updateOpenGraphTag('og:type', 'website');
      } catch (error) {
        console.error('Error setting technology listing SEO:', error);
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