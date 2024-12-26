export const createDiagram = (config) => {
  // Add default values and validation
  const defaultConfig = {
    useCase: {
      title: "",
      description: "",
      businessValue: [],
      capabilities: []
    },
    nodes: [],
    connections: [],
    deployment: {
      environments: [],
      infrastructure: [],
      monitoring: []
    }
  };

  return { ...defaultConfig, ...config };
}; 