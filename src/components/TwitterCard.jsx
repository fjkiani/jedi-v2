import React from 'react';
import { Helmet } from 'react-helmet-async';

const TwitterCard = ({ post }) => {
  if (!post) return null;

  const {
    title = '',
    excerpt = '',
    featuredImage,
    author,
    createdAt,
    slug
  } = post;

  // Ensure we have absolute URLs
  const baseUrl = 'https://www.jedilabs.org';
  const currentUrl = `${baseUrl}/blog/post/${slug}`;
  const imageUrl = featuredImage?.url || '';

  console.log('Post data for meta tags:', {
    title,
    excerpt,
    image: imageUrl,
    author: author?.name,
    date: createdAt
  });

  return (
    <Helmet>
      {/* Essential Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={excerpt} />
      <meta name="author" content={author?.name} />
      
      {/* LinkedIn Specific Tags */}
      <meta property="og:site_name" content="Jedi Labs" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={excerpt} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="article" />
      
      {/* Article Specific Tags */}
      <meta property="article:published_time" content={createdAt} />
      <meta property="article:author" content={author?.name} />
      <meta property="article:section" content="Technology" /> {/* Adjust based on your content */}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@JediLabs" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={excerpt} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Schema.org markup for LinkedIn */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": title,
          "description": excerpt,
          "image": imageUrl,
          "author": {
            "@type": "Person",
            "name": author?.name
          },
          "publisher": {
            "@type": "Organization",
            "name": "Jedi Labs",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png` // Add your logo URL
            }
          },
          "datePublished": createdAt,
          "url": currentUrl
        })}
      </script>
    </Helmet>
  );
};

export default TwitterCard; 