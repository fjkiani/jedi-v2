export const manufacturing = {
  id: 'manufacturing',
  title: "Manufacturing & Industry 4.0",
  icon: "settings",
  color: "from-[#FF5722] to-[#BF360C]",
  heroImage: "/images/industries/manufacturing-hero.jpg",
  description: "Revolutionize manufacturing with AI-powered predictive maintenance, quality control, and process optimization.",
  solutions: [
    {
      id: "predictive-maintenance",
      title: "Predictive Maintenance",
      description: "AI-driven equipment maintenance prediction",
      fullDescription: "Prevent equipment failures and optimize maintenance schedules using advanced AI algorithms and IoT sensor data.",
      metrics: [
        { label: "Downtime Reduction", value: "70%" },
        { label: "Cost Savings", value: "45%" },
        { label: "Efficiency Gain", value: "35%" }
      ],
      technologies: [
        "IoT Integration",
        "Machine Learning",
        "Sensor Analytics"
      ],
      benefits: [
        "Reduced downtime",
        "Lower maintenance costs",
        "Extended equipment life",
        "Optimized operations"
      ],
      caseStudies: [
        {
          title: "Smart Factory Transformation",
          description: "How predictive maintenance saved $3M annually",
          metrics: ["70% less downtime", "$3M saved", "50% fewer failures"],
          link: "/case-studies/smart-factory"
        }
      ]
    }
  ]
};

