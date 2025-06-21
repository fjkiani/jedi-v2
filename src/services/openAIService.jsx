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
      result += `\n${comp.details}`;
    }
    if (comp.explanation && Array.isArray(comp.explanation)) {
      result += '\n' + comp.explanation.map(exp => `🔹 ${exp}`).join('\n');
    }
    return result;
  };

  // Parse implementation JSON if it exists
  let implementationData = {};
  if (useCase?.implementation) {
    try {
      implementationData = typeof useCase.implementation === 'string' 
        ? JSON.parse(useCase.implementation) 
        : useCase.implementation;
    } catch (e) {
      console.warn('Failed to parse implementation JSON:', e);
    }
  }

  // Use Hygraph architecture data directly
  const architecture = useCase?.architecture || {};
  const components = ensureArray(architecture.components);
  const flow = ensureArray(architecture.flow);
  const capabilities = ensureArray(useCase?.capabilities);
  const queries = ensureArray(useCase?.queries);
  const technologies = ensureArray(useCase?.technologies);

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
              nodes: flow.map((step, index) => ({
                id: `${index}`,
                data: { 
                  label: (
                    <div className="bg-transparent p-4 rounded-lg text-sm text-n-3 border border-dashed border-n-6 min-w-[200px]">
                      <div className="font-medium mb-2">{step.step}</div>
                      <div className="text-lg">{step.description}</div>
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
              })),
              edges: flow.slice(0, -1).map((_, i) => ({
                id: `e${i}-${i+1}`,
                source: `${i}`,
                target: `${i+1}`,
                type: 'smoothstep',
                style: { stroke: '#6366f1' },
                animated: true,
              }))
            }
          },
          {
            title: "Processing Steps",
            content: flow.map(step => ({
              name: step.step,
              description: step.description,
              details: step.details ? [step.details] : [],
              technologies: technologies.slice(0, 3).map(tech => ({
                name: tech.name,
                icon: tech.icon || '⚡'
              }))
            }))
          },
          {
            title: "Key Metrics",
            content: ensureArray(useCase?.metrics).map((metric, index) => ({
              name: `Metric ${index + 1}`,
              description: metric,
              value: implementationData.metrics?.[index]?.value || "TBD",
              icon: '📊'
            }))
          }
        ]
      },
      {
        icon: "🔍",
        title: "SYSTEM OVERVIEW",
        description: architecture.description || "Comprehensive system analysis",
        subsections: [
          {
            title: "System Architecture",
            content: architecture.description || "Advanced AI system architecture designed for optimal performance and scalability."
          },
          {
            title: "Core Components",
            content: components.map(comp => ({
              name: comp.name || "Component",
              description: comp.description || "",
              details: comp.details ? [comp.details] : [],
              explanation: ensureArray(comp.explanation),
              technologies: technologies.slice(0, 2).map(tech => tech.name)
            }))
          },
          {
            title: "Technology Stack",
            content: technologies.map(tech => ({
              name: tech.name,
              description: tech.description || "",
              icon: tech.icon || '⚙️'
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
            content: capabilities.map(cap => ({
              name: "Capability",
              description: cap,
              details: []
            }))
          },
          {
            title: "Sample Queries",
            content: queries.map(q => ({
              name: "Query",
              description: q,
              details: []
            }))
          },
          {
            title: "Implementation Details",
            content: implementationData.features?.map(feature => ({
              name: feature.name || "Feature",
              description: feature.description || "",
              details: ensureArray(feature.details)
            })) || [
              {
                name: "Scalable Architecture",
                description: "Built for enterprise-scale deployment",
                details: ["Microservices architecture", "Auto-scaling capabilities", "High availability design"]
              }
            ]
          }
        ]
      }
    ],
    footer: {
      metrics: {
        confidence: implementationData.confidence || "95%",
        dataPoints: implementationData.dataPoints || "1M+",
        processingTime: implementationData.processingTime || "<100ms"
      },
      certifications: capabilities.slice(0, 3).map(cap => `✓ ${cap}`)
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

