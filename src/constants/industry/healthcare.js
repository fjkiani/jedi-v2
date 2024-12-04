export const healthcare = {
  id: 'healthcare',
  title: "Healthcare & Life Sciences",
  icon: "health",
  color: "from-[#4CAF50] to-[#1B5E20]",
  heroImage: "/images/industries/healthcare-hero.jpg",
  description: "Transform healthcare delivery with AI-powered diagnostics, patient care, and operational efficiency.",
  solutions: [
    {
      id: "disease-prediction",
      title: "Disease Prediction & Diagnosis",
      description: "AI-powered early disease detection and diagnosis",
      fullDescription: "Leverage advanced machine learning algorithms for early disease detection, accurate diagnosis, and personalized treatment recommendations.",
      metrics: [
        { label: "Diagnostic Accuracy", value: "95%" },
        { label: "Early Detection Rate", value: "+60%" },
        { label: "Time Saved", value: "75%" }
      ],
      technologies: [
        "Deep Learning",
        "Medical Imaging AI",
        "Predictive Analytics"
      ],
      benefits: [
        "Early disease detection",
        "Improved diagnosis accuracy",
        "Reduced healthcare costs",
        "Better patient outcomes"
      ],
      caseStudies: [
        {
          title: "Early Cancer Detection",
          description: "How AI improved cancer detection rates by 45%",
          metrics: ["45% earlier detection", "95% accuracy", "30% cost reduction"],
          link: "/case-studies/cancer-detection"
        }
      ]
    }
  ]
};
