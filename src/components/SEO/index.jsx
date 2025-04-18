import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RootSEO } from './RootSEO';
import { TeamSEO } from './TeamSEO';
import { TeamListingSEO } from './TeamListingSEO';

// Main SEO component that can be used as a default
const SEO = () => {
  return (
    <Helmet>
      <title>JediLabs - 100x Business Transformation Solutions</title>
      <meta name="description" content="JediLabs helps businesses achieve exponential growth through AI-powered solutions, strategic consulting, and innovative services. Transform your organization and unlock your 100x potential." />
      <meta name="keywords" content="100x business growth, business transformation, exponential growth, AI solutions, strategic consulting, digital transformation, operational excellence, process optimization, business innovation, growth strategy, technology implementation, customer experience transformation, data-driven decisions, enterprise AI, business acceleration" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://jedilabs.org/" />
      <meta property="og:title" content="JediLabs - 100x Business Transformation Solutions" />
      <meta property="og:description" content="Transform your business and achieve exponential growth with JediLabs. Our AI-powered solutions and strategic consulting help organizations unlock their 100x potential." />
      <meta property="og:image" content="https://jedilabs.org/og-image.jpg" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://jedilabs.org/" />
      <meta property="twitter:title" content="JediLabs - 100x Business Transformation Solutions" />
      <meta property="twitter:description" content="Transform your business and achieve exponential growth with JediLabs. Our AI-powered solutions and strategic consulting help organizations unlock their 100x potential." />
      <meta property="twitter:image" content="https://jedilabs.org/twitter-image.jpg" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://jedilabs.org/" />
    </Helmet>
  );
};

export {
  RootSEO,
  TeamSEO,
  TeamListingSEO,
  SEO as default
}; 