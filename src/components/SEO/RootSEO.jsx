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
        try {
          console.log('🏗 Generating structured data for technology:', {
            title: seoData.title,
            useCasesCount: seoData.useCases.length
          });

          const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': seoData.title,
            'description': seoData.description,
            'keywords': seoData.keywords,
            'articleBody': seoData.description,
            'mainEntityOfPage': {
              '@type': 'WebPage',
              '@id': window.location.href
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'Jedi Labs',
              'url': 'https://www.jedilabs.org'
            },
            'about': {
              '@type': 'SoftwareApplication',
              'name': seoData.title.split(' - ')[0],
              'applicationCategory': 'Technology',
              'description': seoData.description
            }
          };

          if (seoData.useCases?.length) {
            structuredData.hasPart = seoData.useCases.map(uc => ({
              '@type': 'HowTo',
              'name': uc.title,
              'description': uc.description,
              'step': uc.capabilities?.map(cap => ({
                '@type': 'HowToStep',
                'text': cap
              })) || []
            }));
          }

          // Remove any existing structured data
          const existingScript = document.querySelector('#structured-data');
          if (existingScript) {
            console.log('🗑 Removing existing structured data script');
            existingScript.remove();
          }

          // Create and add new script tag
          console.log('📝 Creating new structured data script');
          const scriptTag = document.createElement('script');
          scriptTag.id = 'structured-data';
          scriptTag.type = 'application/ld+json';
          scriptTag.textContent = JSON.stringify(structuredData, null, 2);
          document.head.appendChild(scriptTag);
          
          console.log('✅ Structured data successfully added to head');
        } catch (error) {
          console.error('❌ Error adding structured data:', error);
        }
      } else {
        console.log('⏭ Skipping structured data:', {
          isTechnology: type === 'technology',
          hasUseCases: Boolean(seoData.useCases),
          useCasesCount: seoData.useCases?.length
        });
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