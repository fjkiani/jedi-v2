// Dynamic icon URL: use Hygraph icon when available, else Simple Icons CDN from slug/name
export const getTechIconUrl = (tech) => {
  if (!tech) return null;
  const obj = typeof tech === 'string' ? { name: tech } : tech;
  const icon = obj.icon;
  if (typeof icon === 'string' && icon.startsWith('http')) return icon;
  if (icon?.url) return icon.url;
  const slug = obj.slug || (obj.name && String(obj.name).toLowerCase().replace(/[^a-z0-9]+/g, ''));
  return slug ? `https://cdn.simpleicons.org/${slug}` : null;
};

const getRandomMetric = (index) => {
  const metrics = [
    { label: "Accuracy", value: "99.4%" },
    { label: "Latency", value: "42ms" },
    { label: "Throughput", value: "12k req/s" },
    { label: "F1 Score", value: "0.98" },
    { label: "Uptime", value: "99.99%" },
    { label: "Cache Hit", value: "94%" }
  ];
  return metrics[index % metrics.length];
};

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

const getMockResponse = function (useCase, query) {
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

  // Dynamic Technology Mapping - use Hygraph technologies with icon URL when available
  const rawTechnologies = useCase?.technologies || [];
  const technologies = ensureArray(rawTechnologies).map(tech => {
    const techName = typeof tech === 'string' ? tech : tech.name;
    const techDesc = typeof tech === 'string' ? '' : tech.description;
    const iconUrl = getTechIconUrl(tech); // Hygraph icon or dynamic CDN from slug/name
    return {
      name: techName,
      description: techDesc,
      iconUrl: iconUrl || null
    };
  });

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
                id: `e${i}-${i + 1}`,
                source: `${i}`,
                target: `${i + 1}`,
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
                iconUrl: tech.iconUrl
              }))
            }))
          },
          {
            title: "Key Metrics",
            content: (() => {
              const raw = useCase?.metrics;
              const defaultMetrics = [
                { label: "Accuracy", value: "95%+" },
                { label: "Processing Speed", value: "<100ms" }
              ];
              const parseMetric = (m) => {
                if (typeof m === 'object' && m?.label && m?.value && m.value !== 'TBD') {
                  return { name: m.label, description: m.label, value: m.value, icon: '📊' };
                }
                const str = typeof m === 'string' ? m : (m?.value || m?.label || String(m));
                const match = str.match(/^(.+?):\s*(.+)$/);
                if (match) return { name: match[1].trim(), description: match[1].trim(), value: match[2].trim(), icon: '📊' };
                return null;
              };
              let metricsArray = ensureArray(raw);
              if (metricsArray.length === 1 && typeof metricsArray[0] === 'string' && metricsArray[0].includes('\n')) {
                metricsArray = metricsArray[0].split(/\n+/).map((s) => s.trim()).filter(Boolean);
              }
              const parsed = metricsArray.map(parseMetric).filter(Boolean);
              if (parsed.length > 0) return parsed;
              return defaultMetrics.map((m) => ({ ...m, name: m.label, description: m.label, icon: '📊' }));
            })()
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
            content: technologies // Use our processed technologies list with icons
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

