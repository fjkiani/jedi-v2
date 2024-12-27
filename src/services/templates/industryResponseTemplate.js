import { IMPLEMENTATION_MAP } from '../industryService';

const createIndustryResponse = (config) => {
  const {
    icon,
    title,
    query,
    capabilities = [],
    processingSteps = [],
    discoveries = [],
    validation = {},
    implementation = {}
  } = config;

  return {
    title: implementation.title || "Fraud Detection & Prevention",
    sections: [
      {
        icon: "🤖",
        title: "SYSTEM OVERVIEW",
        subsections: [
          {
            title: "System Architecture",
            content: implementation.architecture?.description || "Our fraud detection system employs a sophisticated multi-layered approach."
          },
          {
            title: "Core Components",
            content: implementation.architecture?.components?.map(comp => 
              `${comp.name}: ${comp.description}\n${comp.explanation?.join('\n• ')}`
            ) || []
          }
        ]
      },
      {
        icon: "⚡",
        title: "PROCESSING FLOW",
        subsections: [
          {
            title: "Analysis Steps",
            content: implementation.architecture?.flow?.map(step => 
              `${step.step}: ${step.description}\n• ${step.details || ''}`
            ) || []
          }
        ]
      },
      {
        icon: "🎯",
        title: "CAPABILITIES",
        subsections: [
          {
            title: "Key Features",
            content: implementation.architecture?.components?.map(comp => 
              `${comp.name}:\n• ${comp.explanation?.join('\n• ')}`
            ) || []
          },
          {
            title: "Technical Details",
            content: implementation.architecture?.components?.map(comp => 
              `${comp.name}:\n• Technologies: ${comp.technologies?.join(', ')}\n• ${comp.details}`
            ) || []
          }
        ]
      }
    ]
  };
};

export const getIndustryResponse = (industry, useCaseId, query) => {
  // Get the implementation from the service's IMPLEMENTATION_MAP
  const implementation = IMPLEMENTATION_MAP[useCaseId];
  
  if (!implementation) {
    throw new Error(`No implementation found for use case: ${useCaseId}`);
  }

  return createIndustryResponse({
    icon: "🔒",
    title: "Fraud Detection Analysis",
    query,
    implementation
  });
};

export default getIndustryResponse; 