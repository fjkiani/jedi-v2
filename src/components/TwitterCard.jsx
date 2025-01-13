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
  console.log('Meta tags being rendered:', {
    title,
    description: excerpt,
    image: imageUrl,
    url: currentUrl,
    author: authorName
  });

  return (
    <Helmet>
      {/* LinkedIn primarily looks for these specific OpenGraph tags */}
      <meta name="image" property="og:image" content={imageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={excerpt} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Jedi Labs" />
      
      {/* Ensure image dimensions are specified */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={excerpt} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Article specific metadata */}
      <meta property="article:published_time" content={createdAt} />
      {authorName && <meta property="article:author" content={authorName} />}
      {authorName && <meta name="author" content={authorName} />}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={excerpt} />
      {authorName && <meta name="twitter:creator" content={authorName} />}
    </Helmet>
  );
};

export default TwitterCard; 