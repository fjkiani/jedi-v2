import { Helmet } from 'react-helmet';

export const RootSEO = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Jedi Labs",
    "url": "https://www.jedilabs.org",
    "logo": "https://www.jedilabs.org/assets/logo-gZ7BNsor.png",
    "description": "Advanced AI and Cloud Solutions",
    "sameAs": [
      "https://www.linkedin.com/company/jedilabs",
      "https://twitter.com/jedilabs",
      // Add other social media URLs
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Jedi Labs",
    "url": "https://www.jedilabs.org",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.jedilabs.org/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Google verification */}
      <meta name="google-site-verification" content="d4cdbca54979656a" />
      
      {/* Basic SEO */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Advanced AI and Cloud Solutions - Jedi Labs provides cutting-edge technology services including AI agents, cloud solutions, and digital transformation." />
      <meta name="keywords" content="AI, Cloud Solutions, Digital Transformation, Technology Services, AI Agents" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://www.jedilabs.org" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify([organizationSchema, websiteSchema])}
      </script>
    </Helmet>
  );
}; 