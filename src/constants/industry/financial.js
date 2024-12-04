export const financial = {
  id: 'financial',
  title: "Financial Services",
  icon: "chart-column",
  color: "from-[#2196F3] to-[#0D47A1]",
  heroImage: "/images/industries/financial-hero.jpg",
  description: "Transform financial services with AI-powered solutions for risk assessment, fraud detection, and automated trading.",
  solutions: [
    {
      id: "fraud-detection",
      title: "Fraud Detection",
      description: "Real-time fraud detection using advanced ML algorithms",
      fullDescription: "Our AI-powered fraud detection system processes millions of transactions in real-time, identifying suspicious patterns and preventing fraudulent activities before they impact your business.",
      metrics: [
        { label: "Detection Accuracy", value: "99.9%" },
        { label: "Response Time", value: "60% faster" },
        { label: "Annual Savings", value: "$2M+" }
      ],
      technologies: ["Neural Networks", "Anomaly Detection", "Real-time Processing"],
      benefits: [
        "Prevent financial losses",
        "Protect customer trust",
        "Reduce false positives",
        "24/7 monitoring"
      ],
      caseStudies: [
        {
          title: "Major Bank Fraud Prevention",
          description: "How we helped a major bank reduce fraud losses by 75%",
          metrics: ["$5M saved", "90% faster detection", "50% fewer false positives"],
          link: "/case-studies/bank-fraud-prevention"
        }
      ]
    },
    // Add more solutions...
  ]
};
