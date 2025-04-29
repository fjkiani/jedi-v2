import React from 'react';
import { Helmet } from 'react-helmet-async';

export const RootSEO = () => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "JediLabs",
            "url": "https://jedilabs.org",
            "logo": "https://jedilabs.org/logo.png",
            "description": "JediLabs helps businesses achieve exponential growth through AI-powered solutions, strategic consulting, and innovative services.",
            "sameAs": [
              "https://twitter.com/jedilabs",
              "https://www.linkedin.com/company/jedilabs",
              "https://github.com/jedilabs"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-800-123-4567",
              "contactType": "customer service",
              "availableLanguage": ["English"]
            }
          }
        `}
      </script>
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://jedilabs.org",
            "name": "JediLabs - 100x Business Transformation Solutions",
            "description": "JediLabs helps businesses achieve exponential growth through AI-powered solutions, strategic consulting, and innovative services.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://jedilabs.org/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}
      </script>
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "100x Business Transformation",
            "provider": {
              "@type": "Organization",
              "name": "JediLabs"
            },
            "description": "Our comprehensive business transformation services help organizations achieve exponential growth through AI-powered solutions, strategic consulting, and innovative services.",
            "serviceType": "Business Transformation",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          }
        `}
      </script>
    </Helmet>
  );
}; 