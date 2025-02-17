import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';

export const TeamSEO = ({ slug }) => {
  const { data: seoData, loading, error } = useSEO(slug, 'team');

  useEffect(() => {
    if (!loading && !error && seoData.teamMember) {
      try {
        const structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Person',
          'name': seoData.teamMember.name,
          'jobTitle': seoData.teamMember.role,
          'description': seoData.teamMember.bio,
          'image': seoData.teamMember.image?.url,
          'worksFor': {
            '@type': 'Organization',
            'name': 'Jedi Labs',
            'url': 'https://www.jedilabs.org'
          },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': window.location.href
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
        document.title = `${seoData.teamMember.name} - ${seoData.teamMember.role} | Jedi Labs`;
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.name = 'description';
          document.head.appendChild(metaDescription);
        }
        metaDescription.content = seoData.teamMember.bio;

        // Update OpenGraph tags
        updateOpenGraphTag('og:title', `${seoData.teamMember.name} - ${seoData.teamMember.role}`);
        updateOpenGraphTag('og:description', seoData.teamMember.bio);
        if (seoData.teamMember.image?.url) {
          updateOpenGraphTag('og:image', seoData.teamMember.image.url);
        }
        updateOpenGraphTag('og:type', 'profile');
      } catch (error) {
        console.error('Error setting team member SEO:', error);
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
