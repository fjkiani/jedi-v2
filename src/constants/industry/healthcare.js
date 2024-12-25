export const healthcare = {
  id: 'healthcare',
  title: "Healthcare & Life Sciences",
  icon: "health",
  color: "from-[#4CAF50] to-[#1B5E20]",
  heroImage: "/images/industries/healthcare-hero.jpg",
  description: "Transform healthcare delivery with AI-powered diagnostics, patient care, and operational efficiency.",
  solutions: [
    {
      id: "patient-risk-analysis",
      title: "Patient Risk Analysis",
      description: "AI-powered patient monitoring and risk assessment",
      icon: "activity",
      techStack: {
        primary: {
          id: "clinical-ai",
          usage: "Core clinical analysis engine"
        },
        supporting: [
          {
            id: "fhir",
            usage: "Healthcare data integration",
            features: ["Real-time monitoring", "EHR Integration"]
          },
          {
            id: "ml-models",
            usage: "Clinical prediction models",
            features: ["Risk Assessment", "Pattern Recognition"]
          }
        ]
      },
      // ... other solution details
    }
  ]
};
