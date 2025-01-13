import { Helmet } from 'react-helmet';

export const TeamSEO = ({ teamMember }) => {
  if (!teamMember) return null;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": teamMember.name,
    "jobTitle": teamMember.role,
    "description": teamMember.bio,
    "image": teamMember.image?.url,
    "url": `https://www.jedilabs.org/team/${teamMember.slug}`,
    "sameAs": teamMember.socialLink?.map(social => social.url).filter(Boolean)
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
      <title>{`${teamMember.name} - ${teamMember.role} | Jedi Labs`}</title>
      <meta name="description" content={teamMember.bio} />
      
      {/* OpenGraph tags */}
      <meta property="og:title" content={`${teamMember.name} - ${teamMember.role}`} />
      <meta property="og:description" content={teamMember.bio} />
      {teamMember.image?.url && <meta property="og:image" content={teamMember.image.url} />}
      <meta property="og:type" content="profile" />
      <meta property="og:url" content={`https://www.jedilabs.org/team/${teamMember.slug}`} />
      
      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${teamMember.name} - ${teamMember.role}`} />
      <meta name="twitter:description" content={teamMember.bio} />
      {teamMember.image?.url && <meta name="twitter:image" content={teamMember.image.url} />}
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify([personSchema, breadcrumbSchema])}
      </script>
    </Helmet>
  );
};
