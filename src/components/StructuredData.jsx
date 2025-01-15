const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Fahad Kiani",
    "jobTitle": "Solutions Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "JediLabs"
    },
    "url": "https://www.jedilabs.org",
    "sameAs": [
      "https://www.linkedin.com/in/your-linkedin",
      "https://github.com/your-github",
      // Add other social media profiles
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Engineering",
      "Enterprise Solutions"
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

export default StructuredData; 