import { Helmet } from 'react-helmet-async';
import { useSEO } from '@/hooks/useSEO';

export const TechnologySEO = ({ slug }) => {
  const { data, loading, error } = useSEO(slug, 'technology');

  if (loading) return null;
  if (error) {
    console.error('Technology SEO Error:', error);
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{data.siteName}</title>
      <meta name="description" content={data.description} />
      <meta name="keywords" content={data.keywords} />
      
      {/* OpenGraph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={data.siteName} />
      <meta property="og:description" content={data.description} />
      {data.ogImage && (
        <>
          <meta property="og:image" content={data.ogImage} />
          <meta property="og:image:alt" content={data.siteName} />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={data.siteName} />
      <meta name="twitter:description" content={data.description} />
      {data.ogImage && <meta name="twitter:image" content={data.ogImage} />}
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": data.siteName,
          "description": data.description,
          "keywords": data.keywords,
          "image": data.ogImage,
          "author": {
            "@type": "Organization",
            "name": "Jedi Labs"
          }
        })}
      </script>
    </Helmet>
  );
}; 