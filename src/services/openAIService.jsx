const API_URL = import.meta.env.VITE_API_URL;

const getQueryAnalysis = (query) => {
  // Analyze query intent and keywords
  const keywords = query.toLowerCase().split(' ');
  const hasKeyword = (word) => keywords.some(k => k.includes(word));

  let analysisType = 'general';
  if (hasKeyword('how') || hasKeyword('implement')) analysisType = 'implementation';
  if (hasKeyword('compare') || hasKeyword('versus')) analysisType = 'comparison';
  if (hasKeyword('optimize') || hasKeyword('improve')) analysisType = 'optimization';
  if (hasKeyword('integrate') || hasKeyword('connect')) analysisType = 'integration';
  if (hasKeyword('secure') || hasKeyword('protect')) analysisType = 'security';

  return analysisType;
};

const getProcessingSteps = (analysisType) => {
  const steps = {
    implementation: [
      "Analyzing implementation requirements",
      "Identifying core components",
      "Mapping technical dependencies",
      "Generating architecture blueprint",
      "Validating system flow"
    ],
    comparison: [
      "Extracting comparison criteria",
      "Analyzing feature sets",
      "Evaluating performance metrics",
      "Generating comparative analysis",
      "Synthesizing recommendations"
    ],
    optimization: [
      "Analyzing current bottlenecks",
      "Identifying optimization targets",
      "Evaluating improvement strategies",
      "Calculating potential gains",
      "Formulating recommendations"
    ],
    integration: [
      "Analyzing system compatibility",
      "Mapping integration points",
      "Evaluating data flow patterns",
      "Identifying connection protocols",
      "Generating integration blueprint"
    ],
    security: [
      "Analyzing security requirements",
      "Identifying potential vulnerabilities",
      "Mapping security protocols",
      "Evaluating protection measures",
      "Generating security framework"
    ],
    general: [
      "Analyzing query context",
      "Processing technical requirements",
      "Evaluating system components",
      "Generating solution architecture",
      "Validating recommendations"
    ]
  };

  return steps[analysisType] || steps.general;
};

const getMockResponse = function(useCase, query) {
  console.log('getMockResponse called with:', { useCase, query });

  const analysisType = getQueryAnalysis(query);
  const processingSteps = getProcessingSteps(analysisType);

  // Helper function to ensure array type
  const ensureArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return [value];
  };

  // Helper function to safely stringify objects
  const stringifyComponent = (comp) => {
    if (typeof comp === 'string') return comp;
    if (!comp) return '';
    
    let result = '';
    if (comp.name) result += comp.name;
    if (comp.description) result += `: ${comp.description}`;
    if (comp.details) {
      const details = ensureArray(comp.details);
      result += '\n' + details.map(d => `🔹 ${d}`).join('\n');
    }
    return result;
  };

  return {
    header: {
      icon: "🤖",
      title: useCase?.title || "AI Analysis",
      query: query
    },
    sections: [
      {
        icon: "🔄",
        title: "IMPLEMENTATION FLOW",
        description: "System Architecture and Flow",
        subsections: [
          {
            title: "Architecture Diagram",
            type: "reactflow",
            content: {
              nodes: useCase?.implementation?.architecture?.flow?.map((step, index) => ({
                id: `${index}`,
                data: { 
                  label: (
                    <div className="bg-transparent p-4 rounded-lg text-sm text-n-3 border border-dashed border-n-6 min-w-[200px]">
                      <div className="font-medium mb-2">{step.step}</div>
                      {step.description}
                    </div>
                  )
                },
                position: { 
                  x: 300 * (index % 3),
                  y: Math.floor(index / 3) * 200
                },
                type: 'default',
                style: { 
                  background: 'transparent', 
                  border: 'none',
                  width: 250,
                },
              })) || [],
              edges: useCase?.implementation?.architecture?.flow?.slice(0, -1).map((_, i) => ({
                id: `e${i}-${i+1}`,
                source: `${i}`,
                target: `${i+1}`,
                type: 'smoothstep',
                style: { stroke: '#6366f1' },
                animated: true,
              })) || []
            }
          },
          {
            title: "Processing Steps",
            content: useCase?.implementation?.architecture?.flow?.map(step => ({
              name: step.step,
              description: step.description,
              details: step.details ? [step.details] : [],
              technologies: step.technologies?.map(tech => ({
                name: tech,
                icon: useCase?.technologies?.find(t => t.name === tech)?.icon || '⚡'
              })) || []
            })) || []
          },
          {
            title: "Benefits & Metrics",
            content: useCase?.metrics?.map(metric => ({
              name: metric.name,
              description: metric.description,
              value: metric.value,
              icon: metric.icon || '📊'
            })) || []
          }
        ]
      },
      {
        icon: "🔍",
        title: "SYSTEM OVERVIEW",
        description: useCase?.implementation?.overview || "Comprehensive system analysis",
        subsections: [
          {
            title: "System Architecture",
            content: stringifyComponent(useCase?.implementation?.architecture)
          },
          {
            title: "Core Components",
            content: ensureArray(useCase?.implementation?.architecture?.components).map(comp => ({
              name: comp?.name || "Component",
              description: comp?.description || "",
              details: ensureArray(comp?.details),
              technologies: comp?.technologies || []
            }))
          }
        ]
      },
      {
        icon: "💡",
        title: "CAPABILITIES",
        description: "System capabilities and specifications",
        subsections: [
          {
            title: "Key Features",
            content: ensureArray(useCase?.implementation?.capabilities).map(cap => ({
              name: cap?.name || "",
              description: cap?.description || "",
              details: ensureArray(cap?.details)
            }))
          },
          {
            title: "Technical Details",
            content: ensureArray(useCase?.technologies).map(tech => ({
              name: tech?.name || "",
              description: tech?.description || "",
              icon: tech?.icon || "",
              details: tech?.stack ? [`Technologies: ${tech.stack.join(', ')}`] : []
            }))
          }
        ]
      }
    ],
    footer: {
      metrics: {
        confidence: useCase?.metrics?.confidence || "95%",
        dataPoints: useCase?.metrics?.dataPoints || "1M+",
        processingTime: useCase?.metrics?.processingTime || "<100ms"
      },
      certifications: useCase?.capabilities || []
    }
  };
};

export const openAIService = {
  async generateResponse(useCase, query) {
    try {
      console.log('Generating response for:', { useCase, query });
      
      // Add loading delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return getMockResponse(useCase, query);
    } catch (error) {
      console.error("Industry AI Service Error:", error);
      throw error;
    }
  }
}; 

