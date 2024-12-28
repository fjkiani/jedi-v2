const createIndustryResponse = (industry, implementation) => {
  if (!implementation) return null;

  return {
    title: implementation.title,
    sections: [
      {
        icon: "🤖",
        title: "SYSTEM OVERVIEW",
        subsections: [
          {
            title: "System Architecture",
            content: implementation.architecture?.description
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

export const getIndustryResponse = (industry, implementation) => {
  return createIndustryResponse(industry, implementation);
};

export default getIndustryResponse; 