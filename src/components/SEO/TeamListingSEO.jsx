import SEO from '@/components/SEO';

export const TeamListingSEO = () => {
  const teamListingSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Jedi Labs Team",
    "description": "Meet the talented team behind Jedi Labs, driving innovation in AI and cloud solutions.",
    "url": "https://jedilabs.org/team",
    "employee": [] // Populated dynamically when we have the team data
  };

  return (
    <SEO
      title="Team | Jedi Labs — Engineers, Researchers, Operators"
      description="Meet the Jedi Labs team — AI engineers, researchers, and operators building production systems for real business problems."
      path="/team"
      ogImage="https://jedilabs.org/og/og-team.png"
      keywords="Jedi Labs team, AI engineers, machine learning researchers, engineering team"
      jsonLd={teamListingSchema}
    />
  );
};
