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
            "name": "JEDI Labs",
            "url": "https://jedilabs.org",
            "logo": "https://jedilabs.org/logo.png",
            "description": "Agentic AI consulting and development studio. Ships production co-pilots for SMBs across Healthcare, Finance, and Education via JEDI Ensemble™, JEDI Rules™, and JEDI Automate™.",
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
            "name": "JEDI Labs — Agentic AI Co-Pilots for SMBs",
            "description": "Production AI co-pilots for SMBs. Healthcare, Finance, Education. JEDI Ensemble™, JEDI Rules™, JEDI Automate™ — deployed for production, not pilots.",
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
            "name": "Agentic AI Co-Pilot Development",
            "provider": {
              "@type": "Organization",
              "name": "JEDI Labs"
            },
            "description": "Architects and ships agentic AI co-pilots for SMBs using JEDI Ensemble™ (multi-model orchestration), JEDI Rules™ (business logic engine), and JEDI Automate™ (model optimization). Deployed for production, not pilots.",
            "serviceType": "AI Consulting and Development",
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