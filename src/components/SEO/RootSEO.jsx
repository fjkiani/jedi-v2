import { Helmet } from 'react-helmet-async';
import { useSEO } from '@/hooks/useSEO';

export const RootSEO = () => {
  const { global, loading, error } = useSEO();

  // Default SEO values
  const defaults = {
    siteName: "Jedi Labs",
    description: "Advanced AI and Cloud Solutions for modern businesses. We specialize in secure, scalable AI implementations, custom solutions, and enterprise-grade technology consulting.",
    keywords: "AI, Machine Learning, Cloud Computing, Enterprise Solutions, Digital Transformation",
    ogImage: "https://www.jedilabs.org/assets/logo-gZ7BNsor.png"
  };

  if (loading) return null;
  if (error) {
    console.error('SEO Error:', error, 'Using default values');
  }

  // Use global data if available, otherwise use defaults
  const seoData = {
    siteName: global?.siteName || defaults.siteName,
    description: global?.description || defaults.description,
    keywords: global?.keywords || defaults.keywords,
    ogImage: global?.ogImage || defaults.ogImage
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": seoData.siteName,
    "url": "https://www.jedilabs.org",
    "logo": seoData.ogImage,
    "description": seoData.description
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": seoData.siteName,
    "url": "https://www.jedilabs.org",
    "description": seoData.description
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{seoData.siteName} - {seoData.description}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      
      {/* Robots Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Canonical */}
      <link rel="canonical" href="https://www.jedilabs.org" />
      
      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={seoData.siteName} />
      <meta property="og:title" content={`${seoData.siteName} - Advanced AI Solutions`} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={seoData.ogImage} />
      <meta property="og:image:alt" content={seoData.siteName} />
      <meta property="og:url" content="https://www.jedilabs.org" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.siteName} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.ogImage} />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify([organizationSchema, websiteSchema])}
      </script>
    </Helmet>
  );
}; 