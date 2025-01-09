export const jediArchitecture = {
  title: "JediLabs Workflow",
  description: "Our innovative approach to transforming ideas into impactful solutions",
  layout: {
    type: "workflow",
    spacing: { x: 300, y: 200 },
    startPosition: { x: 100, y: 100 }
  },
  nodes: [
    // Top Row - Core Workflow
    {
      id: "vision_analysis",
      label: "Vision Analysis",
      x: 100,
      y: 100,
      description: "Understanding and shaping client vision",
      features: [
        "Strategic Assessment",
        "Innovation Planning",
        "Impact Analysis"
      ]
    },
    {
      id: "tech_strategy",
      label: "Technology Strategy",
      x: 400,
      y: 100,
      description: "Crafting optimal technical approaches",
      features: [
        "Architecture Design",
        "Stack Selection",
        "Scalability Planning"
      ]
    },
    {
      id: "innovation_lab",
      label: "Innovation Lab",
      x: 700,
      y: 100,
      description: "Exploring cutting-edge solutions",
      features: [
        "Prototype Development",
        "Tech Exploration",
        "Proof of Concepts"
      ]
    },
    {
      id: "engineering",
      label: "Engineering Excellence",
      x: 1000,
      y: 100,
      description: "Building robust solutions",
      features: [
        "Quality Development",
        "Best Practices",
        "Performance Optimization"
      ]
    },
    {
      id: "delivery",
      label: "Solution Delivery",
      x: 1300,
      y: 100,
      description: "Deploying production-ready systems",
      features: [
        "Deployment Strategy",
        "Performance Monitoring",
        "System Reliability"
      ]
    },

    // Bottom Row - Support & Enhancement
    {
      id: "client_collaboration",
      label: "Client Collaboration",
      x: 100,
      y: 300,
      description: "Working closely with stakeholders",
      features: [
        "Regular Updates",
        "Feedback Integration",
        "Partnership Growth"
      ]
    },
    {
      id: "quality_assurance",
      label: "Quality Assurance",
      x: 400,
      y: 300,
      description: "Ensuring excellence at every step",
      features: [
        "Automated Testing",
        "Performance Testing",
        "Security Validation"
      ]
    },
    {
      id: "knowledge_hub",
      label: "Knowledge Hub",
      x: 700,
      y: 300,
      description: "Sharing and growing expertise",
      features: [
        "Best Practices",
        "Tech Research",
        "Innovation Sharing"
      ]
    },
    {
      id: "continuous_improvement",
      label: "Continuous Improvement",
      x: 1000,
      y: 300,
      description: "Evolving and enhancing solutions",
      features: [
        "Performance Analysis",
        "System Evolution",
        "Innovation Updates"
      ]
    },
    {
      id: "success_metrics",
      label: "Success Metrics",
      x: 1300,
      y: 300,
      description: "Measuring and ensuring impact",
      features: [
        "KPI Tracking",
        "Impact Assessment",
        "Value Measurement"
      ]
    }
  ],
  connections: [
    // Top Row Connections
    {
      from: "vision_analysis",
      to: "tech_strategy",
      label: "Strategic Direction",
      type: "primary"
    },
    {
      from: "tech_strategy",
      to: "innovation_lab",
      label: "Technical Approach",
      type: "primary"
    },
    {
      from: "innovation_lab",
      to: "engineering",
      label: "Validated Solutions",
      type: "primary"
    },
    {
      from: "engineering",
      to: "delivery",
      label: "Production Systems",
      type: "primary"
    },
    // Bottom Row Connections
    {
      from: "client_collaboration",
      to: "quality_assurance",
      label: "Requirements & Feedback",
      type: "primary"
    },
    {
      from: "quality_assurance",
      to: "knowledge_hub",
      label: "Best Practices",
      type: "primary"
    },
    {
      from: "knowledge_hub",
      to: "continuous_improvement",
      label: "Innovation Insights",
      type: "primary"
    },
    {
      from: "continuous_improvement",
      to: "success_metrics",
      label: "Enhancement Data",
      type: "primary"
    },
    // Cross Connections
    {
      from: "success_metrics",
      to: "vision_analysis",
      label: "Success Insights",
      type: "feedback"
    },
    {
      from: "client_collaboration",
      to: "vision_analysis",
      label: "Client Input",
      type: "feedback"
    },
    {
      from: "knowledge_hub",
      to: "innovation_lab",
      label: "Innovation Flow",
      type: "feedback"
    }
  ],
  styles: {
    primary: {
      stroke: "#6366f1",
      strokeWidth: 2,
      strokeDasharray: "5 5",
      animated: true
    },
    feedback: {
      stroke: "#6366f1",
      strokeWidth: 2,
      strokeDasharray: "5 5",
      animated: true
    }
  }
}; 