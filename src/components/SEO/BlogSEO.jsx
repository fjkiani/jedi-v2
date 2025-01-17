import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';

export const BlogSEO = ({ post = null, isBlogIndex = false }) => {
  console.log('🚀 BlogSEO mounted with:', { 
    isBlogIndex, 
    hasPost: !!post,
    postSlug: post?.slug,
    postTitle: post?.title 
  });

  const { data: seoData, loading, error } = useSEO(post?.slug, 'blog', post);

  useEffect(() => {
    console.log('🔄 BlogSEO effect running with:', {
      loading,
      error,
      seoData
    });

    if (loading) {
      console.log('⏳ Loading SEO data...');
      return;
    }

    if (error) {
      console.error('❌ SEO Error:', error);
      return;
    }

    if (!seoData) {
      console.warn('⚠️ No SEO data available');
      return;
    }

    console.log('✅ Updating meta tags with:', seoData);

    try {
      // Update meta tags
      document.title = seoData.title;
      console.log('📝 Updated title:', seoData.title);
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
        console.log('➕ Created meta description tag');
      }
      metaDescription.content = seoData.description;
      console.log('📝 Updated meta description:', seoData.description);

      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
        console.log('➕ Created meta keywords tag');
      }
      metaKeywords.content = seoData.keywords;
      console.log('📝 Updated meta keywords:', seoData.keywords);

      // Update OpenGraph tags
      console.log('🔄 Updating OpenGraph tags...');
      updateOpenGraphTag('og:title', seoData.title);
      updateOpenGraphTag('og:description', seoData.description);
      if (seoData.ogImage) {
        updateOpenGraphTag('og:image', seoData.ogImage);
      }
      updateOpenGraphTag('og:type', 'article');
      updateOpenGraphTag('og:site_name', 'Jedi Labs Blog');

      // Add schema.org structured data for blog posts
      console.log('🏗 Generating structured data for:', {
        type: isBlogIndex ? 'Blog' : 'BlogPosting',
        title: seoData.title,
        author: seoData.author?.name
      });

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': isBlogIndex ? 'Blog' : 'BlogPosting',
        'headline': seoData.title,
        'description': seoData.description,
        'keywords': seoData.keywords,
        'articleBody': seoData.content,
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

      if (seoData.author) {
        structuredData.author = {
          '@type': 'Person',
          'name': seoData.author.name,
          'description': seoData.author.bio,
          'image': seoData.author.photo?.url
        };
        console.log('➕ Added author data to structured data');
      }

      if (seoData.ogImage) {
        structuredData.image = seoData.ogImage;
        console.log('➕ Added image to structured data');
      }

      if (seoData.categories?.length) {
        structuredData.articleSection = seoData.categories.map(cat => cat.name).join(', ');
        console.log('➕ Added categories to structured data:', structuredData.articleSection);
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
      
      console.log('✅ SEO setup complete', {
        title: document.title,
        description: metaDescription.content,
        keywords: metaKeywords.content,
        structuredData: JSON.parse(scriptTag.textContent)
      });
    } catch (error) {
      console.error('❌ Error setting up SEO:', error);
    }
  }, [seoData, loading, error, isBlogIndex]);

  return null;
};

function updateOpenGraphTag(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
    console.log(`➕ Created OpenGraph tag: ${property}`);
  }
  tag.content = content;
  console.log(`📝 Updated OpenGraph tag ${property}:`, content);
} 