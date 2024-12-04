import React from 'react';
import { Helmet } from 'react-helmet-async';

const TwitterCard = ({ post }) => {
  if (!post) return null;

  const {
    title = '',
    excerpt = '',
    featuredImage = {},
    slug = ''
  } = post;

  const imageUrl = featuredImage?.url || '';
  const baseUrl = 'https://yourwebsite.com'; // Replace with your actual domain

  return (
    <Helmet>
      {/* Open Graph Meta Tags */}
      {title && <meta property="og:title" content={title} />}
      {excerpt && <meta property="og:description" content={excerpt} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {slug && <meta property="og:url" content={`${baseUrl}/blog/${slug}`} />}
      <meta property="og:type" content="article" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@YourTwitterHandle" />
      {title && <meta name="twitter:title" content={title} />}
      {excerpt && <meta name="twitter:description" content={excerpt} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  );
};

export default TwitterCard; 