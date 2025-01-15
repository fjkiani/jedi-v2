import { Helmet } from 'react-helmet-async';
import { useSEO } from '@/hooks/useSEO';

export const TeamSEO = ({ teamMember }) => {
  const { global } = useSEO();

  if (!teamMember) return null;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": teamMember.name,
    "jobTitle": teamMember.role,
    "description": teamMember.bio,
    "image": teamMember.image?.url,
    "url": `https://www.jedilabs.org/team/${teamMember.slug}`,
    "worksFor": {
      "@type": "Organization",
      "name": global?.siteName || "Jedi Labs",
      "url": "https://www.jedilabs.org",
      "logo": "https://www.jedilabs.org/logo.png",
      "@id": "https://www.jedilabs.org/#organization"
    },
    "sameAs": teamMember.socialLinks?.map(social => social.url) || [],
    "knowsAbout": teamMember.expertise || [],
    "alumniOf": teamMember.education || [],
    "skills": teamMember.skills || []
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.jedilabs.org/#organization",
    "name": global?.siteName || "Jedi Labs",
    "url": "https://www.jedilabs.org",
    "logo": "https://www.jedilabs.org/logo.png",
    "sameAs": global?.socialLinks || []
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.jedilabs.org"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Team",
        "item": "https://www.jedilabs.org/team"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": teamMember.name,
        "item": `https://www.jedilabs.org/team/${teamMember.slug}`
      }
    ]
  };

  return (
    <Helmet>
      <html lang="en" />
      <title>{`${teamMember.name} - ${teamMember.role} | Jedi Labs`}</title>
      <meta name="description" content={teamMember.bio} />
      <link rel="canonical" href={`https://www.jedilabs.org/team/${teamMember.slug}`} />
      
      {/* OpenGraph tags */}
      <meta property="og:site_name" content={global?.siteName || "Jedi Labs"} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={`${teamMember.name} - ${teamMember.role}`} />
      <meta property="og:description" content={teamMember.bio} />
      {teamMember.image?.url && <meta property="og:image" content={teamMember.image.url} />}
      {teamMember.image?.url && <meta property="og:image:alt" content={`${teamMember.name} - ${teamMember.role}`} />}
      <meta property="og:type" content="profile" />
      <meta property="og:url" content={`https://www.jedilabs.org/team/${teamMember.slug}`} />
      
      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@JediLabs" />
      <meta name="twitter:title" content={`${teamMember.name} - ${teamMember.role}`} />
      <meta name="twitter:description" content={teamMember.bio} />
      {teamMember.image?.url && <meta name="twitter:image" content={teamMember.image.url} />}
      {teamMember.image?.url && <meta name="twitter:image:alt" content={`${teamMember.name} - ${teamMember.role}`} />}
      
      {/* Additional meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={teamMember.name} />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {`${JSON.stringify([personSchema, organizationSchema, breadcrumbSchema])}`}
      </script>
    </Helmet>
  );
};
