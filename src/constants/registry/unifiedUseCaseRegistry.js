export const UNIFIED_USE_CASE_REGISTRY = {
  // Industry-specific use cases
  "fraud-detection": {
    id: "fraud-detection",
    title: "Fraud Detection",
    type: "industry-specific",
    industry: "financial",
    solutions: ["ai-ml-solutions"], // Links to solution constants
    technologies: {
      primary: "openai",
      related: ["langchain", "neural-networks"]
    },
    // Keep existing industry implementation
    industryImplementation: {
      description: "Real-time fraud detection using advanced ML algorithms",
      metrics: [
        { label: "Detection Accuracy", value: "99.9%" },
        { label: "Response Time", value: "60% faster" },
        { label: "Annual Savings", value: "$2M+" }
      ],
      benefits: [
        "Prevent financial losses",
        "Protect customer trust",
        "Reduce false positives",
        "24/7 monitoring"
      ]
    },
    // Add AI response template (like CRISPR)
    aiResponseTemplate: {
      header: {
        icon: "🔒",
        title: "Fraud Detection Assistant",
        capabilities: ["Pattern Analysis", "Risk Assessment", "Real-time Detection"]
      },
      sections: [
        // ... similar to CRISPR template
      ]
    }
  }
};
