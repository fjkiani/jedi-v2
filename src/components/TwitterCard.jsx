import React from 'react';
import { Helmet } from 'react-helmet-async';

const TwitterCard = ({ post }) => {
  if (!post) return null;

  // Ensure all required fields are available with fallbacks
  const {
    title = 'Jedi Labs Blog',
    excerpt = 'Explore the latest in AI and technology',
    featuredImage = {},
    slug = ''
  } = post;

  // Full URL construction
  const baseUrl = 'https://www.jedilabs.org';
  const currentUrl = `${baseUrl}/blog/post/${slug}`;
  const imageUrl = featuredImage?.url || '/default-image.jpg'; // Add a default image path

  return (
    <Helmet>
      {/* Essential Open Graph Tags */}
      <meta property="og:site_name" content="Jedi Labs" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={excerpt} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="article" />

      {/* Essential Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@JediLabs" /> {/* Replace with your Twitter handle */}
      <meta name="twitter:creator" content="@JediLabs" /> {/* Replace with your Twitter handle */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={excerpt} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:domain" content="jedilabs.org" />

      {/* Additional Meta Tags */}
      <meta name="description" content={excerpt} />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default TwitterCard; 