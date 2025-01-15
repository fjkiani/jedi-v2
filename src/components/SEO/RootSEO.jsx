import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';

export const RootSEO = ({ slug, type = 'page' }) => {
  const { data: seoData, loading, error } = useSEO(slug, type);

  useEffect(() => {
    if (!loading && !error) {
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

      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = seoData.keywords;

      // Update OpenGraph tags
      updateOpenGraphTag('og:title', seoData.title);
      updateOpenGraphTag('og:description', seoData.description);
      if (seoData.ogImage) {
        updateOpenGraphTag('og:image', seoData.ogImage);
      }

      // Add schema.org structured data for technologies
      if (type === 'technology' && seoData.useCases) {
        const structuredData = {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: seoData.title,
          description: seoData.description,
          applicationCategory: 'Technology',
          offers: {
            '@type': 'Offer',
            category: type
          },
          usageInfo: seoData.useCases?.map(uc => ({
            '@type': 'HowTo',
            name: uc.title,
            description: uc.description,
            step: uc.capabilities?.map(cap => ({
              '@type': 'HowToStep',
              text: cap
            }))
          }))
        };

        let scriptTag = document.querySelector('#structured-data');
        if (!scriptTag) {
          scriptTag = document.createElement('script');
          scriptTag.id = 'structured-data';
          scriptTag.type = 'application/ld+json';
          document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(structuredData);
      }
    }
  }, [seoData, loading, error, type]);

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