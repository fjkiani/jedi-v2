export const commonLayouts = {
  horizontal: {
    spacing: { x: 300, y: 170 },
    startPosition: { x: 100, y: 80 }
  },
  vertical: {
    spacing: { x: 300, y: 200 },
    startPosition: { x: 100, y: 50 }
  }
};

export const defaultDiagram = {
  useCase: {
    title: "System Architecture",
    description: "Basic system architecture overview",
    features: [
      "Component Integration",
      "Data Flow Management",
      "System Monitoring",
      "Security Controls"
    ],
    deployment: {
      environments: [
        "Development",
        "Staging",
        "Production"
      ],
      infrastructure: [
        "Cloud Platform",
        "Containers",
        "Serverless"
      ]
    }
  },
  nodes: [
    // ... default nodes
  ],
  connections: [
    // ... default connections
  ]
}; 