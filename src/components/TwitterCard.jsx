import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * TwitterCard — emits ONLY the OG image + Twitter card meta tags for a blog
 * post. Title / description / canonical are owned by <SEO> in BlogPage.tsx.
 *
 * Round 3.5 fix: previously this component also emitted <title>, <meta name=
 * description>, and <link canonical>. Because it mounts inside PostDetail
 * (after Hygraph resolves), react-helmet-async treated it as a later writer
 * and clobbered BlogPage's already-set title. That stripped the
 * "| Jedi Labs Research" brand suffix from every blog post title and blew
 * one route (audio-ml, 89 chars) past the 70-char audit ceiling. Removing
 * those tags here restores BlogPage's SEO as the single source of truth for
 * blog-post <title>/<meta description>/canonical.
 */
const TwitterCard = ({ post }) => {
  if (!post) return null;

  const { title = 'Jedi Labs', excerpt = '', featuredImage, author, createdAt, slug } = post;
  const authorData = author?.[0];
  const authorName = authorData?.name;
  const imageUrl = featuredImage?.url;
  const baseUrl = 'https://www.jedilabs.org';
  const currentUrl = `${baseUrl}/blog/post/${slug}`;

  return (
    <Helmet>
      {/* Image + article-specific metadata (does NOT clobber title/description) */}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Jedi Labs" />
      <meta property="article:published_time" content={createdAt} />
      {authorName && <meta property="article:author" content={authorName} />}
      {authorName && <meta name="author" content={authorName} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={imageUrl} />
      {authorName && <meta name="twitter:creator" content={authorName} />}
    </Helmet>
  );
};

export default TwitterCard;
