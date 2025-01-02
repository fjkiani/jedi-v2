const API_URL = import.meta.env.VITE_API_URL;

const getMockResponse = function(useCase, query) {
  console.log('getMockResponse called with:', { useCase, query });

  // Helper function to safely stringify objects
  const stringifyComponent = (comp) => {
    if (typeof comp === 'string') return comp;
    if (!comp) return '';
    
    let result = '';
    if (comp.name) result += comp.name;
    if (comp.description) result += `: ${comp.description}`;
    if (comp.details && Array.isArray(comp.details)) {
      result += '\n' + comp.details.map(d => `• ${d}`).join('\n');
    }
    return result;
  };

  return {
    header: {
      icon: "🤖",
      title: useCase.title || "AI Analysis",
      query: query
    },
    sections: [
      {
        icon: "🔍",
        title: "SYSTEM OVERVIEW",
        description: useCase.implementation?.overview || "",
        subsections: [
          {
            title: "System Architecture",
            content: stringifyComponent(useCase.implementation?.architecture)
          },
          {
            title: "Core Components",
            content: (useCase.implementation?.architecture?.components || [])
              .map(stringifyComponent)
          }
        ]
      },
      {
        icon: "⚙️",
        title: "PROCESSING FLOW",
        description: "Step-by-step implementation process",
        subsections: [
          {
            title: "Analysis Steps",
            content: (useCase.implementation?.architecture?.flow || [])
              .map(step => stringifyComponent({
                name: step.step,
                description: step.description,
                details: step.details
              }))
          }
        ]
      },
      {
        icon: "💡",
        title: "CAPABILITIES",
        description: "System capabilities and technical specifications",
        subsections: [
          {
            title: "Key Features",
            content: (useCase.implementation?.capabilities || [])
              .map(stringifyComponent)
          },
          {
            title: "Technical Details",
            content: (useCase.technologies || []).map(tech => 
              stringifyComponent({
                name: tech.name,
                description: tech.description,
                details: tech.stack ? [`Technologies: ${tech.stack.join(', ')}`] : []
              })
            )
          }
        ]
      }
    ],
    footer: {
      metrics: {
        confidence: `${85 + Math.floor(Math.random() * 10)}%`,
        dataPoints: `${1 + Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 9)}M+`,
        processingTime: `${1 + Math.random() * 2}.${Math.floor(Math.random() * 9)}s`
      },
      certifications: [
        "🔒 Enterprise Ready",
        "✓ Industry Certified",
        "📊 Performance Optimized"
      ]
    }
  };
};

export const openAIService = {
  async generateResponse(useCase, query) {
    try {
      console.log('Generating response for:', { useCase, query });
      
      // Add loading delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return getMockResponse(useCase, query);
    } catch (error) {
      console.error("Industry AI Service Error:", error);
      throw error;
    }
  }
}; 

