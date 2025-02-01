import React from 'react';
import { Helmet } from 'react-helmet-async';

const TwitterCard = ({ post }) => {
  if (!post) return null;

  const {
    title = 'Jedi Labs',  // Provide default values
    excerpt = 'Explore the latest in AI and technology',
    featuredImage,
    author,
    createdAt,
    slug
  } = post;

  // Get author data (handle array structure)
  const authorData = author?.[0];
  const authorName = authorData?.name;

  // Ensure absolute URL for image
  const imageUrl = featuredImage?.url;
  const baseUrl = 'https://www.jedilabs.org';
  const currentUrl = `${baseUrl}/blog/post/${slug}`;

  // Debug what's being rendered
  console.log('Twitter Card Meta tags:', {
    title,
    description: excerpt,
    image: imageUrl,
    url: currentUrl,
    author: authorName
  });

  return (
    <Helmet>
      {/* Twitter Card Tags - Must come first */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@JediLabs" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={excerpt} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {authorName && <meta name="twitter:creator" content={authorName} />}
      
      {/* OpenGraph Tags */}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={excerpt} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta property="og:site_name" content="Jedi Labs" />
      
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={excerpt} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Article Metadata */}
      <meta property="article:published_time" content={createdAt} />
      {authorName && <meta property="article:author" content={authorName} />}
      
      {/* Image Dimensions for Twitter/OG */}
      {imageUrl && (
        <>
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta name="twitter:image:alt" content={title} />
        </>
      )}
    </Helmet>
  );
};

export default TwitterCard; 