export const createResponseTemplate = ({
  icon,
  title,
  query,
  modelName,
  modelVersion,
  capabilities,
  sections
}) => ({
  header: {
    icon,
    title,
    query,
    model: {
      name: modelName,
      version: modelVersion,
      capabilities
    },
    timestamp: new Date().toISOString(),
    responseId: `JL-${Math.random().toString(36).substr(2, 6)}`
  },
  sections,
  footer: {
    metrics: {
      confidence: "94.7%",
      dataPoints: "1.2M",
      processingTime: "3.2s"
    },
    certifications: [
      "🔒 Enterprise Secure",
      "✓ Industry Certified",
      "📊 Analytics Ready"
    ],
    poweredBy: "JediLabs AI™"
  }
});

export const sectionTemplates = {
  processingSection: (details) => ({
    icon: "🤖",
    title: "HOW AI PROCESSED YOUR QUERY",
    subsections: [
      {
        marker: "🔸",
        title: "Query Processing",
        subtitle: "📊 Analysis",
        mainPoint: details.mainPoint,
        details: details.steps
      }
    ]
  }),

  discoverySection: (discoveries) => ({
    icon: "🔬",
    title: "MAJOR DISCOVERIES",
    discoveries: discoveries.map(d => ({
      marker: "🔸",
      title: d.title,
      process: {
        title: "Analysis Process:",
        steps: d.steps
      },
      result: {
        type: "KEY FINDING",
        highlight: d.highlight,
        points: d.points
      }
    }))
  }),

  technicalSection: (validation) => ({
    icon: "🧪",
    title: "TECHNICAL VALIDATION",
    validation: {
      marker: "🔸",
      title: "Validation Process",
      process: {
        title: "Methodology:",
        steps: validation.steps
      },
      finding: {
        type: "VALIDATION RESULT",
        highlight: validation.highlight,
        points: validation.points
      }
    }
  })
}; 