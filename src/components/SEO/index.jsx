import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RootSEO } from './RootSEO';
import { TeamSEO } from './TeamSEO';
import { TeamListingSEO } from './TeamListingSEO';
import { SITE_URL, DEFAULT_META } from '@/constants/seo';

/**
 * SEO component - accepts optional props for page-level overrides.
 * When used without props (e.g. on App mount), applies default homepage meta.
 * When used with title/description/path, overrides for that page.
 */
const SEO = ({ title, description, keywords, path = '/', ogUrl, ogImage }) => {
  const url = ogUrl || `${SITE_URL}${path === '/' ? '' : path}`;
  const metaTitle = title || DEFAULT_META.title;
  const metaDesc = description || DEFAULT_META.description;
  const metaKeywords = keywords || DEFAULT_META.keywords;
  const image = ogImage || DEFAULT_META.ogImage;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={image} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDesc} />
      <meta property="twitter:image" content={image} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export {
  RootSEO,
  TeamSEO,
  TeamListingSEO,
  SEO as default
}; 