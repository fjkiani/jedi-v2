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

// ─── Keyword extraction ───────────────────────────────────────────────────────
const STOP_WORDS = new Set(['how', 'does', 'what', 'when', 'where', 'which', 'who', 'why',
  'the', 'this', 'that', 'and', 'for', 'are', 'you', 'with', 'its', 'use',
  'can', 'will', 'do', 'it', 'is', 'in', 'to', 'a', 'an', 'of', 'on', 'at',
  'by', 'or', 'be', 'as', 'we', 'our', 'your', 'from', 'into', 'work', 'works']);

const extractKeywords = (text) => {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));
};

const scoreMatch = (text, keywords) => {
  if (!text || !keywords.length) return 0;
  const lower = text.toLowerCase();
  return keywords.reduce((score, kw) => score + (lower.includes(kw) ? 1 : 0), 0);
};

// ─── Query-specific response builder ─────────────────────────────────────────
const getQuerySpecificContent = (useCase, query) => {
  const keywords = extractKeywords(query);
  const components = useCase.architecture?.components || [];
  const flow = useCase.architecture?.flow || [];
  const capabilities = useCase.capabilities || [];
  const technologies = useCase.technologies || [];

  // Find most relevant components by keyword overlap
  const scoredComponents = components.map(c => ({
    ...c,
    score: scoreMatch(`${c.name} ${c.description} ${c.details || ''}`, keywords),
  })).sort((a, b) => b.score - a.score);

  const relevantComponents = scoredComponents.filter(c => c.score > 0).slice(0, 3);
  const fallbackComponents = components.slice(0, 3);
  const displayComponents = relevantComponents.length > 0 ? relevantComponents : fallbackComponents;

  // Find most relevant capabilities
  const scoredCaps = capabilities.map(cap => ({
    text: cap,
    score: scoreMatch(cap, keywords),
  })).sort((a, b) => b.score - a.score);

  const relevantCaps = scoredCaps.filter(c => c.score > 0).map(c => c.text);
  const displayCaps = relevantCaps.length > 0 ? relevantCaps.slice(0, 3) : capabilities.slice(0, 3);

  // Build a direct answer from capabilities + component descriptions
  let directAnswer = '';
  if (relevantCaps.length > 0) {
    directAnswer = relevantCaps.slice(0, 2).join(' — ');
  } else if (displayComponents.length > 0) {
    const comp = displayComponents[0];
    directAnswer = `${comp.name}: ${comp.description || 'Core system component handling this workflow.'}`;
  } else {
    directAnswer = `${useCase.title} handles this through its integrated AI pipeline.`;
  }

  // Build query-specific processing steps
  // Use actual flow steps if available, otherwise derive from query intent
  let querySteps;
  if (flow.length > 0) {
    // Score flow steps by keyword relevance, then show all (they're the actual system flow)
    const scoredFlow = flow.map(f => ({
      ...f,
      score: scoreMatch(`${f.step} ${f.description} ${f.details || ''}`, keywords),
    }));
    // Sort: relevant steps first, then rest in original order
    const relevant = scoredFlow.filter(f => f.score > 0);
    const rest = scoredFlow.filter(f => f.score === 0);
    querySteps = [...relevant, ...rest].map(f => ({
      name: f.step,
      description: f.description,
      highlighted: f.score > 0,
    }));
  } else {
    // Derive steps from query intent
    querySteps = deriveStepsFromQuery(query, useCase);
  }

  // Find relevant technologies
  const scoredTechs = technologies.map(t => ({
    ...t,
    score: scoreMatch(`${t.name} ${t.description || ''}`, keywords),
  })).sort((a, b) => b.score - a.score);
  const relevantTechs = scoredTechs.filter(t => t.score > 0).slice(0, 4);
  const displayTechs = relevantTechs.length > 0 ? relevantTechs : technologies.slice(0, 4);

  return {
    directAnswer,
    relevantComponents: displayComponents,
    querySteps,
    relevantCapabilities: displayCaps,
    relevantTechs: displayTechs,
  };
};

const deriveStepsFromQuery = (query, useCase) => {
  const q = query.toLowerCase();
  const title = useCase.title || 'System';

  if (q.includes('handle') || q.includes('process') || q.includes('detect')) {
    return [
      { name: 'Signal Detection', description: 'Incoming request classified and routed to appropriate handler', highlighted: true },
      { name: 'Context Loading', description: 'Relevant patient/user context retrieved from integrated systems', highlighted: false },
      { name: 'AI Processing', description: 'LLM agent analyzes request against domain knowledge base', highlighted: true },
      { name: 'Action Execution', description: 'Appropriate workflow triggered with full audit trail', highlighted: false },
      { name: 'Response Delivery', description: 'Structured response returned with confidence score', highlighted: false },
    ];
  }
  if (q.includes('fhir') || q.includes('ehr') || q.includes('integrat') || q.includes('connect')) {
    return [
      { name: 'API Authentication', description: 'OAuth2 token exchange with target system', highlighted: false },
      { name: 'Schema Mapping', description: 'Incoming data mapped to FHIR R4 / target schema', highlighted: true },
      { name: 'Resource Creation', description: 'Structured resources created and validated', highlighted: true },
      { name: 'Sync & Confirm', description: 'Bidirectional sync confirmed with checksum validation', highlighted: false },
    ];
  }
  if (q.includes('deploy') || q.includes('implement') || q.includes('setup') || q.includes('timeline')) {
    return [
      { name: 'Environment Audit', description: 'Existing systems and data sources catalogued', highlighted: false },
      { name: 'Integration Config', description: 'API connections and webhooks configured', highlighted: true },
      { name: 'Agent Training', description: 'Domain-specific prompts and knowledge base loaded', highlighted: true },
      { name: 'Validation Testing', description: 'End-to-end scenarios tested against acceptance criteria', highlighted: false },
      { name: 'Go Live', description: 'Gradual rollout with monitoring and fallback protocols', highlighted: false },
    ];
  }
  if (q.includes('mcp') || q.includes('server') || q.includes('coordinat') || q.includes('orchestrat')) {
    return [
      { name: 'MCP Discovery', description: 'Available MCP servers enumerated and capability-checked', highlighted: true },
      { name: 'Task Decomposition', description: 'LangGraph decomposes request into server-specific subtasks', highlighted: true },
      { name: 'Parallel Dispatch', description: 'Subtasks dispatched to relevant MCP servers concurrently', highlighted: false },
      { name: 'Result Aggregation', description: 'Responses merged and conflicts resolved by orchestrator', highlighted: false },
      { name: 'State Update', description: 'Conversation state and memory updated with outcomes', highlighted: false },
    ];
  }
  // Default
  return [
    { name: 'Request Analysis', description: `${title} receives and classifies the incoming request`, highlighted: false },
    { name: 'Context Retrieval', description: 'Relevant context loaded from integrated data sources', highlighted: false },
    { name: 'AI Reasoning', description: 'Multi-step reasoning applied using domain knowledge', highlighted: true },
    { name: 'Action & Response', description: 'Appropriate action taken and structured response returned', highlighted: false },
  ];
};

// ─── Main mock response generator ────────────────────────────────────────────
const getMockResponse = function (useCase, query) {
  const ensureArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return [value];
  };

  // Parse implementation JSON if it exists
  let implementationData = {};
  if (useCase?.implementation) {
    try {
      implementationData = typeof useCase.implementation === 'string'
        ? JSON.parse(useCase.implementation)
        : useCase.implementation;
    } catch (e) { /* ignore */ }
  }

  const architecture = useCase?.architecture || {};
  const capabilities = ensureArray(useCase?.capabilities);
  const queries = ensureArray(useCase?.queries);

  // Dynamic Technology Mapping
  const rawTechnologies = useCase?.technologies || [];
  const technologies = ensureArray(rawTechnologies).map(tech => {
    const techName = typeof tech === 'string' ? tech : tech.name;
    const techDesc = typeof tech === 'string' ? '' : tech.description;
    const iconUrl = getTechIconUrl(tech);
    return { name: techName, description: techDesc, iconUrl: iconUrl || null };
  });

  // ── Query-specific content ──
  const specific = getQuerySpecificContent(useCase, query);

  // Build query-specific processing steps for the flow section
  const flowContent = specific.querySteps.map(step => ({
    name: step.name,
    description: step.description,
    highlighted: step.highlighted,
    details: [],
    technologies: technologies.slice(0, 2).map(t => ({ name: t.name, iconUrl: t.iconUrl })),
  }));

  // Build components from relevant components
  const componentContent = specific.relevantComponents.map(comp => ({
    name: comp.name || 'Component',
    description: comp.description || '',
    details: comp.details ? [comp.details] : [],
    explanation: ensureArray(comp.explanation),
    technologies: technologies.slice(0, 2).map(t => t.name),
  }));

  // Metrics from use case
  const metricsContent = (() => {
    const raw = useCase?.metrics;
    const defaultMetrics = [
      { label: 'Response Time', value: '<500ms' },
      { label: 'Accuracy', value: '95%+' },
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
    let arr = ensureArray(raw);
    if (arr.length === 1 && typeof arr[0] === 'string' && arr[0].includes('\n')) {
      arr = arr[0].split(/\n+/).map(s => s.trim()).filter(Boolean);
    }
    const parsed = arr.map(parseMetric).filter(Boolean);
    return parsed.length > 0 ? parsed : defaultMetrics.map(m => ({ ...m, name: m.label, description: m.label, icon: '📊' }));
  })();

  return {
    header: {
      icon: '🤖',
      title: useCase?.title || 'AI Analysis',
      query,
    },
    // Direct answer to the specific query — shown prominently in HUD
    directAnswer: specific.directAnswer,
    relevantCapabilities: specific.relevantCapabilities,

    sections: [
      {
        icon: '🔄',
        title: 'IMPLEMENTATION FLOW',
        description: 'System Architecture and Flow',
        subsections: [
          {
            title: 'Architecture Diagram',
            type: 'reactflow',
            content: {
              nodes: (architecture.flow || []).map((step, index) => ({
                id: `${index}`,
                data: {
                  label: (
                    <div className="bg-transparent p-4 rounded-lg text-sm text-n-3 border border-dashed border-n-6 min-w-[200px]">
                      <div className="font-medium mb-2">{step.step}</div>
                      <div className="text-lg">{step.description}</div>
                    </div>
                  ),
                },
                position: { x: 300 * (index % 3), y: Math.floor(index / 3) * 200 },
                type: 'default',
                style: { background: 'transparent', border: 'none', width: 250 },
              })),
              edges: (architecture.flow || []).slice(0, -1).map((_, i) => ({
                id: `e${i}-${i + 1}`,
                source: `${i}`,
                target: `${i + 1}`,
                type: 'smoothstep',
                style: { stroke: '#6366f1' },
                animated: true,
              })),
            },
          },
          {
            title: 'Processing Steps',
            content: flowContent,
          },
          {
            title: 'Key Metrics',
            content: metricsContent,
          },
        ],
      },
      {
        icon: '🔍',
        title: 'SYSTEM OVERVIEW',
        description: architecture.description || 'Comprehensive system analysis',
        subsections: [
          {
            title: 'System Architecture',
            content: architecture.description || 'Advanced AI system architecture designed for optimal performance.',
          },
          {
            title: 'Core Components',
            content: componentContent,
          },
          {
            title: 'Technology Stack',
            content: technologies,
          },
        ],
      },
      {
        icon: '💡',
        title: 'CAPABILITIES',
        description: 'System capabilities and specifications',
        subsections: [
          {
            title: 'Key Features',
            content: capabilities.map(cap => ({
              name: 'Capability',
              description: cap,
              details: [],
            })),
          },
          {
            title: 'Sample Queries',
            content: queries.map(q => ({
              name: 'Query',
              description: q,
              details: [],
            })),
          },
          {
            title: 'Implementation Details',
            content: implementationData.features?.map(feature => ({
              name: feature.name || 'Feature',
              description: feature.description || '',
              details: ensureArray(feature.details),
            })) || [
              {
                name: 'Scalable Architecture',
                description: 'Built for enterprise-scale deployment',
                details: ['Microservices architecture', 'Auto-scaling capabilities', 'High availability design'],
              },
            ],
          },
        ],
      },
    ],
    footer: {
      metrics: {
        confidence: implementationData.confidence || '95%',
        dataPoints: implementationData.dataPoints || '1M+',
        processingTime: implementationData.processingTime || '<100ms',
      },
      certifications: capabilities.slice(0, 3).map(cap => `✓ ${cap}`),
    },
  };
};

export const openAIService = {
  async generateResponse(useCase, query) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return getMockResponse(useCase, query);
    } catch (error) {
      console.error('Industry AI Service Error:', error);
      throw error;
    }
  },
};
