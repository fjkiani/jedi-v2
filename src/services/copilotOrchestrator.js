/**
 * AI Co-Pilot Orchestrator
 * Processes user queries and generates conversational responses using Hygraph data
 */

export const analyzeQuery = (query, selectedIndustry = 'all') => {
  const queryLower = query.toLowerCase();
  
  // Extract key intent and context
  const analysis = {
    intent: determineIntent(queryLower),
    domain: extractDomain(queryLower),
    urgency: determineUrgency(queryLower),
    complexity: determineComplexity(queryLower),
    industry: selectedIndustry,
    keywords: extractKeywords(queryLower),
    isSimulation: detectSimulation(queryLower),
    simulationType: getSimulationType(queryLower)
  };

  return analysis;
};

const determineIntent = (query) => {
  const intents = {
    'implementation': ['how to', 'implement', 'build', 'create', 'develop', 'setup', 'install'],
    'optimization': ['optimize', 'improve', 'enhance', 'reduce', 'increase', 'efficiency', 'performance'],
    'comparison': ['compare', 'vs', 'versus', 'difference', 'which', 'better', 'best'],
    'exploration': ['what', 'show me', 'explore', 'learn', 'understand', 'explain'],
    'problem_solving': ['fix', 'solve', 'issue', 'problem', 'challenge', 'error', 'help'],
    'cost_analysis': ['cost', 'price', 'budget', 'roi', 'investment', 'savings', 'expensive']
  };

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      return intent;
    }
  }

  return 'exploration'; // default
};

const extractDomain = (query) => {
  const domains = {
    'manufacturing': ['manufacturing', 'production', 'factory', 'assembly', 'quality', 'defect'],
    'healthcare': ['healthcare', 'medical', 'patient', 'diagnosis', 'treatment', 'clinical'],
    'finance': ['finance', 'banking', 'trading', 'investment', 'fraud', 'risk'],
    'retail': ['retail', 'ecommerce', 'customer', 'inventory', 'sales', 'marketing'],
    'energy': ['energy', 'power', 'grid', 'renewable', 'consumption', 'efficiency'],
    'logistics': ['logistics', 'supply chain', 'shipping', 'delivery', 'warehouse'],
    'ai_ml': ['ai', 'machine learning', 'ml', 'neural', 'algorithm', 'model', 'prediction']
  };

  for (const [domain, keywords] of Object.entries(domains)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      return domain;
    }
  }

  return 'general';
};

const determineUrgency = (query) => {
  const urgentWords = ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'now'];
  return urgentWords.some(word => query.includes(word)) ? 'high' : 'normal';
};

const determineComplexity = (query) => {
  const complexWords = ['architecture', 'integration', 'enterprise', 'scalable', 'distributed'];
  const simpleWords = ['simple', 'basic', 'easy', 'quick', 'straightforward'];
  
  if (complexWords.some(word => query.includes(word))) return 'high';
  if (simpleWords.some(word => query.includes(word))) return 'low';
  return 'medium';
};

const extractKeywords = (query) => {
  // Remove common words and extract meaningful keywords
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'how', 'what', 'where', 'when', 'why', 'can', 'could', 'should', 'would', 'will', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
  
  return query
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .slice(0, 10); // Limit to 10 keywords
};

const detectSimulation = (query) => {
  const simulationTriggers = [
    'simulation', 'simulate', 'run', 'walk me through', 'step-by-step', 
    'implementation flow', 'process', 'deployment', 'analyze', 'show me',
    '🚀', '📊', '🏗️', '💰', '⚡'
  ];
  
  return simulationTriggers.some(trigger => query.includes(trigger));
};

const getSimulationType = (query) => {
  if (query.includes('implementation') || query.includes('🚀') || query.includes('deployment')) {
    return 'implementation';
  }
  if (query.includes('metrics') || query.includes('📊') || query.includes('success')) {
    return 'metrics';
  }
  if (query.includes('architecture') || query.includes('🏗️') || query.includes('technical')) {
    return 'architecture';
  }
  if (query.includes('cost') || query.includes('roi') || query.includes('💰') || query.includes('budget')) {
    return 'cost';
  }
  if (query.includes('process') || query.includes('⚡') || query.includes('complete')) {
    return 'process';
  }
  return 'general';
};

export const findMatchingUseCases = (query, useCases, analysis) => {
  const queryKeywords = analysis.keywords;
  const matches = [];

  useCases.forEach(useCase => {
    let score = 0;
    const matchReasons = [];

    // Industry match
    if (analysis.industry !== 'all' && useCase.industry?.slug === analysis.industry) {
      score += 20;
      matchReasons.push('Industry alignment');
    }

    // Query keywords match
    if (useCase.queries && Array.isArray(useCase.queries)) {
      useCase.queries.forEach(useCaseQuery => {
        const queryLower = useCaseQuery.toLowerCase();
        const matchingKeywords = queryKeywords.filter(keyword => 
          queryLower.includes(keyword)
        );
        if (matchingKeywords.length > 0) {
          score += matchingKeywords.length * 10;
          matchReasons.push(`Query similarity (${matchingKeywords.join(', ')})`);
        }
      });
    }

    // Title and description match
    const titleMatch = queryKeywords.filter(keyword => 
      useCase.title.toLowerCase().includes(keyword)
    ).length;
    if (titleMatch > 0) {
      score += titleMatch * 15;
      matchReasons.push('Title relevance');
    }

    const descriptionMatch = queryKeywords.filter(keyword => 
      useCase.description?.toLowerCase().includes(keyword)
    ).length;
    if (descriptionMatch > 0) {
      score += descriptionMatch * 5;
      matchReasons.push('Description relevance');
    }

    // Capabilities match
    if (useCase.capabilities && Array.isArray(useCase.capabilities)) {
      const capabilityMatches = useCase.capabilities.filter(capability =>
        queryKeywords.some(keyword => capability.toLowerCase().includes(keyword))
      ).length;
      if (capabilityMatches > 0) {
        score += capabilityMatches * 8;
        matchReasons.push('Capability alignment');
      }
    }

    // Domain-specific scoring
    if (analysis.domain !== 'general') {
      const domainKeywords = getDomainKeywords(analysis.domain);
      const domainMatches = domainKeywords.filter(keyword =>
        useCase.title.toLowerCase().includes(keyword) ||
        useCase.description?.toLowerCase().includes(keyword)
      ).length;
      if (domainMatches > 0) {
        score += domainMatches * 12;
        matchReasons.push('Domain expertise');
      }
    }

    if (score > 0) {
      matches.push({
        useCase,
        score,
        matchReasons,
        relevance: calculateRelevance(score)
      });
    }
  });

  // Sort by score and return top matches
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Top 5 matches
};

const getDomainKeywords = (domain) => {
  const domainMap = {
    'manufacturing': ['production', 'quality', 'efficiency', 'automation', 'process'],
    'healthcare': ['patient', 'medical', 'clinical', 'diagnosis', 'treatment'],
    'finance': ['risk', 'fraud', 'trading', 'investment', 'compliance'],
    'retail': ['customer', 'inventory', 'sales', 'recommendation', 'personalization'],
    'energy': ['consumption', 'optimization', 'grid', 'renewable', 'efficiency'],
    'logistics': ['supply', 'delivery', 'warehouse', 'optimization', 'tracking']
  };
  
  return domainMap[domain] || [];
};

const calculateRelevance = (score) => {
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
};

export const findMatchingIndustryApplications = (query, industries, analysis) => {
  const queryKeywords = analysis.keywords;
  const matches = [];

  // Find the relevant industry
  const targetIndustry = analysis.industry !== 'all' ? 
    industries.find(ind => ind.slug === analysis.industry) : null;

  const industriesToSearch = targetIndustry ? [targetIndustry] : industries;

  industriesToSearch.forEach(industry => {
    if (!industry.industryApplication || !Array.isArray(industry.industryApplication)) {
      return;
    }

    industry.industryApplication.forEach(application => {
      let score = 0;
      const matchReasons = [];

      // Industry alignment
      if (analysis.industry !== 'all' && industry.slug === analysis.industry) {
        score += 25;
        matchReasons.push('Industry alignment');
      }

      // Application title match
      const titleMatch = queryKeywords.filter(keyword => 
        application.applicationTitle.toLowerCase().includes(keyword)
      ).length;
      if (titleMatch > 0) {
        score += titleMatch * 20;
        matchReasons.push('Solution relevance');
      }

      // Direct application title query (high priority)
      if (query.toLowerCase().includes('tell me about') && 
          query.toLowerCase().includes(application.applicationTitle.toLowerCase())) {
        score += 50;
        matchReasons.push('Direct application request');
      }

      // Capabilities match
      if (application.keyCapabilities && Array.isArray(application.keyCapabilities)) {
        const capabilityMatches = application.keyCapabilities.filter(capability =>
          queryKeywords.some(keyword => capability.toLowerCase().includes(keyword))
        ).length;
        if (capabilityMatches > 0) {
          score += capabilityMatches * 15;
          matchReasons.push('Capability alignment');
        }
      }

      // Technology match
      if (application.technology && Array.isArray(application.technology)) {
        const techMatches = application.technology.filter(tech =>
          queryKeywords.some(keyword => tech.name.toLowerCase().includes(keyword))
        ).length;
        if (techMatches > 0) {
          score += techMatches * 10;
          matchReasons.push('Technology alignment');
        }
      }

      if (score > 0) {
        matches.push({
          application,
          industry,
          score,
          matchReasons,
          relevance: calculateRelevance(score)
        });
      }
    });
  });

  // Sort by score and return top matches
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3 matches
};

export const generateConversationalResponse = (query, matches, analysis, industries = []) => {
  if (matches.length === 0) {
    // Try to find IndustryApplication matches when no use cases match
    const applicationMatches = findMatchingIndustryApplications(query, industries, analysis);
    
    if (applicationMatches.length > 0) {
      return generateApplicationBasedResponse(query, applicationMatches, analysis);
    }
    
    return generateNoMatchResponse(query, analysis);
  }

  const topMatch = matches[0];
  const useCase = topMatch.useCase;

  // Generate conversational summary
  const summary = generateSummary(query, useCase, analysis);
  
  // Get industry context - either from the use case's industry or from the analysis
  const industryContext = useCase.industry || 
    (analysis.industry !== 'all' ? { name: analysis.industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) } : null);
  
  // Structure the response for progressive disclosure
  const response = {
    summary,
    overview: generateOverview(useCase, analysis),
    implementation: useCase.implementation || generateImplementationGuidance(useCase),
    capabilities: useCase.capabilities || [],
    metrics: useCase.metrics || [],
    architecture: useCase.architecture,
    useCase: useCase,
    industry: industryContext, // Add industry context for simulation system
    matchScore: topMatch.score,
    matchReasons: topMatch.matchReasons,
    alternativeMatches: matches.slice(1, 3), // Include 2 alternatives
    nextSteps: generateNextSteps(useCase, analysis),
    followUpQueries: generateFollowUpQueries(useCase, analysis),
    isSimulation: analysis.isSimulation,
    simulationType: analysis.simulationType,
    simulationData: analysis.isSimulation ? generateSimulationData(useCase, analysis) : null
  };

  return response;
};

const generateSummary = (query, useCase, analysis) => {
  const intent = analysis.intent;
  const industry = analysis.industry === 'all' ? 'your industry' : analysis.industry.replace('-', ' ');
  
  // If this is a simulation query, make the response extremely concise and simulation-focused
  if (analysis.isSimulation) {
    return `🚀 **${useCase.title} Implementation Simulation Ready**

Launch the interactive simulation below to experience the complete implementation process.`;
  }
  
  const summaryTemplates = {
    'implementation': `I found a perfect solution for implementing ${useCase.title.toLowerCase()} in ${industry}. Let me walk you through the implementation approach and architecture.`,
    'optimization': `Great question! I can help you optimize your operations using ${useCase.title}. This solution has proven results in ${industry}.`,
    'exploration': `I'd be happy to explain ${useCase.title} and how it applies to ${industry}. This is one of our most effective solutions.`,
    'problem_solving': `I understand your challenge. ${useCase.title} is specifically designed to address similar issues in ${industry}. Here's how it works.`,
    'comparison': `Let me show you ${useCase.title} and how it compares to other approaches. This solution stands out in ${industry} for several reasons.`,
    'cost_analysis': `${useCase.title} offers excellent ROI for ${industry}. Let me break down the costs, benefits, and expected returns.`
  };

  return summaryTemplates[intent] || `I found ${useCase.title} as a relevant solution for your query. Let me explain how it works and its benefits.`;
};

const generateOverview = (useCase, analysis) => {
  let overview = useCase.description || '';
  
  // Add context based on analysis
  if (analysis.complexity === 'high') {
    overview += ' This is an enterprise-grade solution designed for complex environments.';
  } else if (analysis.complexity === 'low') {
    overview += ' This solution is designed to be straightforward to implement and use.';
  }

  if (analysis.urgency === 'high') {
    overview += ' Implementation can be expedited for urgent requirements.';
  }

  return overview;
};

const generateImplementationGuidance = (useCase) => {
  // Generate basic implementation guidance if not available
  return [
    'Assessment and planning phase',
    'Infrastructure preparation',
    'System integration and setup',
    'Testing and validation',
    'Deployment and go-live',
    'Monitoring and optimization'
  ];
};

const generateNextSteps = (useCase, analysis) => {
  const steps = [];
  
  if (analysis.complexity === 'high') {
    steps.push('Schedule a technical architecture review');
    steps.push('Assess current infrastructure compatibility');
  } else {
    steps.push('Review implementation requirements');
  }
  
  steps.push(`Explore ${useCase.title} in detail`);
  steps.push('Discuss specific use case requirements');
  steps.push('Schedule a consultation with our experts');
  
  return steps;
};

const generateFollowUpQueries = (useCase, analysis) => {
  const queries = [];
  
  // Add context-specific follow-up questions
  if (useCase.architecture) {
    queries.push('Show me the technical architecture details');
  }
  
  if (useCase.metrics && useCase.metrics.length > 0) {
    queries.push('What are the expected performance metrics?');
  }
  
  queries.push(`How does ${useCase.title} compare to other solutions?`);
  queries.push('What are the implementation timelines and costs?');
  
  return queries.slice(0, 3); // Limit to 3 follow-up queries
};

const generateNoMatchResponse = (query, analysis) => {
  return {
    summary: `I understand you're looking for solutions related to "${query}". While I don't have an exact match, I can help you explore our AI capabilities and find the best approach for your needs.`,
    overview: 'Our AI solutions span across multiple industries and use cases. Let me help you find the most relevant options.',
    implementation: null,
    capabilities: [],
    metrics: [],
    architecture: null,
    useCase: null,
    matchScore: 0,
    matchReasons: [],
    alternativeMatches: [],
    nextSteps: [
      'Refine your query with more specific requirements',
      'Explore our industry-specific solutions',
      'Schedule a consultation to discuss custom solutions'
    ],
    followUpQueries: [
      'What industries do you serve?',
      'Show me your most popular AI solutions',
      'How can AI help my specific business challenges?'
    ]
  };
};

const generateApplicationBasedResponse = (query, applicationMatches, analysis) => {
  const topMatch = applicationMatches[0];
  const application = topMatch.application;
  const industry = topMatch.industry;

  // Generate conversational summary focused on the application
  let summary;
  if (analysis.isSimulation) {
    summary = `🚀 **${application.applicationTitle} Implementation Simulation Ready**

Launch the interactive simulation below to experience the complete implementation process.`;
  } else {
    summary = `Great question! I found "${application.applicationTitle}" as a perfect solution for ${industry.name}. This is one of our most effective implementations that addresses real industry challenges.`;
  }

  // Extract rich text content safely
  const extractRichTextContent = (richTextObj) => {
    if (!richTextObj || !richTextObj.raw) return '';
    try {
      const content = richTextObj.raw.children
        .map(child => child.children?.map(grandchild => grandchild.text).join('') || '')
        .join('\n');
      return content;
    } catch (e) {
      return '';
    }
  };

  const industryChallenge = extractRichTextContent(application.industryChallenge);
  const jediApproach = extractRichTextContent(application.jediApproach);

  // Structure response for progressive disclosure with lead-capturing focus
  const response = {
    summary,
    overview: `${application.applicationTitle} is specifically designed for ${industry.name} challenges. ${application.tagline || ''}`,
    implementation: jediApproach || 'Our implementation approach is tailored to your specific industry requirements.',
    capabilities: application.keyCapabilities || [],
    metrics: application.expectedResults || [],
    architecture: null, // Applications don't have architecture, but components might
    industryApplication: application, // Include the full application data
    industry: industry,
    jediComponents: application.jediComponent || [],
    technologies: application.technology || [],
    matchScore: topMatch.score,
    matchReasons: topMatch.matchReasons,
    alternativeMatches: applicationMatches.slice(1), // Include alternatives
    nextSteps: generateApplicationNextSteps(application, industry, analysis),
    followUpQueries: generateApplicationFollowUpQueries(application, industry, analysis),
    isApplicationBased: true, // Flag to help UI components render differently
    isSimulation: analysis.isSimulation,
    simulationType: analysis.simulationType,
    simulationData: analysis.isSimulation ? generateApplicationSimulationData(application, industry, analysis) : null
  };

  return response;
};

const generateApplicationNextSteps = (application, industry, analysis) => {
  const steps = [
    `Learn more about ${application.applicationTitle} implementation`,
    `Explore how other ${industry.name.toLowerCase()} companies have benefited`,
    'Schedule a consultation to discuss your specific requirements',
    'Request a detailed ROI analysis for your use case'
  ];

  if (application.jediComponent && application.jediComponent.length > 0) {
    steps.unshift(`Discover our ${application.jediComponent[0].name} technology stack`);
  }

  return steps;
};

const generateApplicationFollowUpQueries = (application, industry, analysis) => {
  const queries = [
    `What results have other ${industry.name.toLowerCase()} companies seen?`,
    `How long does ${application.applicationTitle} take to implement?`,
    'What are the costs and ROI expectations?'
  ];

  // Add component-specific queries
  if (application.jediComponent && application.jediComponent.length > 0) {
    queries.push(`Tell me more about ${application.jediComponent[0].name}`);
  }

  return queries.slice(0, 3);
};

const generateApplicationSimulationData = (application, industry, analysis) => {
  const simulationType = analysis.simulationType;
  
  const baseSteps = [
    {
      id: 'assessment',
      title: 'Initial Assessment',
      description: 'Analyzing current infrastructure and requirements',
      duration: '2-3 weeks',
      status: 'pending',
      details: [
        'Current system evaluation',
        'Data quality assessment',
        'Infrastructure compatibility check',
        'Stakeholder requirement gathering'
      ]
    },
    {
      id: 'planning',
      title: 'Solution Design',
      description: 'Creating customized implementation plan',
      duration: '1-2 weeks',
      status: 'pending',
      details: [
        'Architecture design',
        'Integration planning',
        'Resource allocation',
        'Timeline establishment'
      ]
    },
    {
      id: 'development',
      title: 'Development & Integration',
      description: 'Building and integrating the AI solution',
      duration: '4-6 weeks',
      status: 'pending',
      details: [
        'Model development/customization',
        'API integration',
        'Data pipeline setup',
        'Security implementation'
      ]
    },
    {
      id: 'testing',
      title: 'Testing & Validation',
      description: 'Comprehensive testing and performance validation',
      duration: '2-3 weeks',
      status: 'pending',
      details: [
        'Unit and integration testing',
        'Performance benchmarking',
        'User acceptance testing',
        'Security validation'
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment & Go-Live',
      description: 'Production deployment and launch',
      duration: '1-2 weeks',
      status: 'pending',
      details: [
        'Production environment setup',
        'Data migration',
        'User training',
        'Go-live support'
      ]
    },
    {
      id: 'optimization',
      title: 'Monitoring & Optimization',
      description: 'Ongoing monitoring and performance optimization',
      duration: 'Ongoing',
      status: 'pending',
      details: [
        'Performance monitoring',
        'Model retraining',
        'User feedback integration',
        'Continuous improvement'
      ]
    }
  ];

  const successMetrics = application.expectedResults && application.expectedResults.length > 0 ? application.expectedResults : [
    'Implementation success rate: 95%+',
    'Time to value: 3-6 months',
    'ROI achievement: 12-18 months',
    'User adoption rate: 85%+',
    'Performance improvement: 30-50%',
    'Cost reduction: 20-40%'
  ];

  const costAnalysis = {
    implementationCost: '$50K - $200K',
    ongoingCosts: '$10K - $30K/month',
    expectedROI: '200-400% over 2 years',
    paybackPeriod: '12-18 months',
    totalCostOfOwnership: '$150K - $500K over 3 years'
  };

  const riskFactors = [
    { risk: 'Data Quality Issues', mitigation: 'Comprehensive data audit and cleansing', probability: 'Medium' },
    { risk: 'Integration Complexity', mitigation: 'Phased integration approach', probability: 'Low' },
    { risk: 'User Adoption', mitigation: 'Extensive training and change management', probability: 'Low' },
    { risk: 'Performance Issues', mitigation: 'Thorough testing and optimization', probability: 'Low' }
  ];

  // Customize based on simulation type
  let simulationData = {
    title: `${application.applicationTitle} Implementation Simulation`,
    description: `Interactive simulation for implementing ${application.applicationTitle} in ${industry.name}`,
    steps: baseSteps,
    successMetrics,
    costAnalysis,
    riskFactors,
    totalDuration: '10-16 weeks',
    confidence: '92%',
    recommendedApproach: 'Phased implementation with continuous feedback'
  };

  // Customize based on simulation type
  switch (simulationType) {
    case 'implementation':
      simulationData.focusArea = 'Implementation Process';
      simulationData.primarySteps = baseSteps.slice(0, 5);
      break;
    case 'metrics':
      simulationData.focusArea = 'Success Metrics Analysis';
      simulationData.primarySteps = baseSteps.filter(step => 
        step.id === 'testing' || step.id === 'deployment' || step.id === 'optimization'
      );
      break;
    case 'architecture':
      simulationData.focusArea = 'Technical Architecture';
      simulationData.primarySteps = baseSteps.filter(step => 
        step.id === 'assessment' || step.id === 'planning' || step.id === 'development'
      );
      break;
    case 'cost':
      simulationData.focusArea = 'Cost & ROI Analysis';
      simulationData.primarySteps = baseSteps.slice(0, 3);
      break;
    case 'process':
      simulationData.focusArea = 'Complete Process Flow';
      simulationData.primarySteps = baseSteps;
      break;
    default:
      simulationData.focusArea = 'General Implementation';
      simulationData.primarySteps = baseSteps.slice(0, 4);
  }

  return simulationData;
};

const generateSimulationData = (useCase, analysis) => {
  const simulationType = analysis.simulationType;
  const industry = analysis.industry === 'all' ? 'your industry' : analysis.industry.replace('-', ' ');
  
  const baseSteps = [
    {
      id: 'assessment',
      title: 'Initial Assessment',
      description: 'Analyzing current infrastructure and requirements',
      duration: '2-3 weeks',
      status: 'pending',
      details: [
        'Current system evaluation',
        'Data quality assessment',
        'Infrastructure compatibility check',
        'Stakeholder requirement gathering'
      ]
    },
    {
      id: 'planning',
      title: 'Solution Design',
      description: 'Creating customized implementation plan',
      duration: '1-2 weeks',
      status: 'pending',
      details: [
        'Architecture design',
        'Integration planning',
        'Resource allocation',
        'Timeline establishment'
      ]
    },
    {
      id: 'development',
      title: 'Development & Integration',
      description: 'Building and integrating the AI solution',
      duration: '4-6 weeks',
      status: 'pending',
      details: [
        'Model development/customization',
        'API integration',
        'Data pipeline setup',
        'Security implementation'
      ]
    },
    {
      id: 'testing',
      title: 'Testing & Validation',
      description: 'Comprehensive testing and performance validation',
      duration: '2-3 weeks',
      status: 'pending',
      details: [
        'Unit and integration testing',
        'Performance benchmarking',
        'User acceptance testing',
        'Security validation'
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment & Go-Live',
      description: 'Production deployment and launch',
      duration: '1-2 weeks',
      status: 'pending',
      details: [
        'Production environment setup',
        'Data migration',
        'User training',
        'Go-live support'
      ]
    },
    {
      id: 'optimization',
      title: 'Monitoring & Optimization',
      description: 'Ongoing monitoring and performance optimization',
      duration: 'Ongoing',
      status: 'pending',
      details: [
        'Performance monitoring',
        'Model retraining',
        'User feedback integration',
        'Continuous improvement'
      ]
    }
  ];

  const successMetrics = useCase.metrics && useCase.metrics.length > 0 ? useCase.metrics : [
    'Implementation success rate: 95%+',
    'Time to value: 3-6 months',
    'ROI achievement: 12-18 months',
    'User adoption rate: 85%+',
    'Performance improvement: 30-50%',
    'Cost reduction: 20-40%'
  ];

  const costAnalysis = {
    implementationCost: '$50K - $200K',
    ongoingCosts: '$10K - $30K/month',
    expectedROI: '200-400% over 2 years',
    paybackPeriod: '12-18 months',
    totalCostOfOwnership: '$150K - $500K over 3 years'
  };

  const riskFactors = [
    { risk: 'Data Quality Issues', mitigation: 'Comprehensive data audit and cleansing', probability: 'Medium' },
    { risk: 'Integration Complexity', mitigation: 'Phased integration approach', probability: 'Low' },
    { risk: 'User Adoption', mitigation: 'Extensive training and change management', probability: 'Low' },
    { risk: 'Performance Issues', mitigation: 'Thorough testing and optimization', probability: 'Low' }
  ];

  // Customize based on simulation type
  let simulationData = {
    title: `${useCase.title} Implementation Simulation`,
    description: `Interactive simulation for implementing ${useCase.title} in ${industry}`,
    steps: baseSteps,
    successMetrics,
    costAnalysis,
    riskFactors,
    totalDuration: '10-16 weeks',
    confidence: '92%',
    recommendedApproach: 'Phased implementation with continuous feedback'
  };

  // Customize based on simulation type
  switch (simulationType) {
    case 'implementation':
      simulationData.focusArea = 'Implementation Process';
      simulationData.primarySteps = baseSteps.slice(0, 5);
      break;
    case 'metrics':
      simulationData.focusArea = 'Success Metrics Analysis';
      simulationData.primarySteps = baseSteps.filter(step => 
        step.id === 'testing' || step.id === 'deployment' || step.id === 'optimization'
      );
      break;
    case 'architecture':
      simulationData.focusArea = 'Technical Architecture';
      simulationData.primarySteps = baseSteps.filter(step => 
        step.id === 'assessment' || step.id === 'planning' || step.id === 'development'
      );
      break;
    case 'cost':
      simulationData.focusArea = 'Cost & ROI Analysis';
      simulationData.primarySteps = baseSteps.slice(0, 3);
      break;
    case 'process':
      simulationData.focusArea = 'Complete Process Flow';
      simulationData.primarySteps = baseSteps;
      break;
    default:
      simulationData.focusArea = 'General Implementation';
      simulationData.primarySteps = baseSteps.slice(0, 4);
  }

  return simulationData;
}; 