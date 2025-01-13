import { Helmet } from 'react-helmet-async';

export const TeamListingSEO = () => {
  const teamListingSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Jedi Labs Team",
    "description": "Meet the talented team behind Jedi Labs, driving innovation in AI and cloud solutions.",
    "url": "https://www.jedilabs.org/team",
    "employee": [] // This will be populated dynamically when we have the team data
  };

  return (
    <Helmet>
      <title>Our Team | Jedi Labs</title>
      <meta name="description" content="Meet the innovative team behind Jedi Labs. Our experts in AI, cloud solutions, and digital transformation are driving the future of technology." />
      <meta name="keywords" content="Jedi Labs team, AI experts, cloud solutions specialists, technology innovators" />
      <link rel="canonical" href="https://www.jedilabs.org/team" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(teamListingSchema)}
      </script>
    </Helmet>
  );
}; 