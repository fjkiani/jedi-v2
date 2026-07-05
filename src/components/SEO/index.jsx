import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RootSEO } from './RootSEO';
import { TeamSEO } from './TeamSEO';
import { TeamListingSEO } from './TeamListingSEO';
import { SITE_URL, DEFAULT_META } from '@/constants/seo';

/**
 * SEO component - accepts optional props for page-level overrides.
 *
 * Uses <Helmet> from react-helmet-async. React-helmet-async rules:
 * - Direct <Helmet> children only, no conditionals or maps.
 * - Return a single <Helmet> (no fragment wrapper needed).
 * - No inline JSON stringification inside <script> children; pre-stringify.
 */
const SEO = ({
  title, description, keywords, path = '/', ogUrl, ogImage,
  ogType = 'website', robots, jsonLd,
}) => {
  const url = ogUrl || `${SITE_URL}${path === '/' ? '' : path}`;
  const metaTitle = title || DEFAULT_META.title;
  const metaDesc = description || DEFAULT_META.description;
  const metaKeywords = keywords || DEFAULT_META.keywords;
  const image = ogImage || DEFAULT_META.ogImage;
  const metaRobots = robots || 'index, follow';

  // JSON-LD serialization. For arrays, emit as a single JSON array so crawlers see
  // multiple entities in one <script> block (per schema.org convention).
  const jsonLdString = jsonLd
    ? (Array.isArray(jsonLd)
        ? JSON.stringify(jsonLd.map(b => typeof b === 'string' ? JSON.parse(b) : b))
        : typeof jsonLd === 'string' ? jsonLd : JSON.stringify(jsonLd))
    : null;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content={metaRobots} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDesc} />
      <meta property="twitter:image" content={image} />
      <link rel="canonical" href={url} />
      {jsonLdString ? <script type="application/ld+json">{jsonLdString}</script> : null}
    </Helmet>
  );
};

export {
  RootSEO,
  TeamSEO,
  TeamListingSEO,
  SEO as default
};
