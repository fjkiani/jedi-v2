/**
 * Query Response Generator Service
 * Analyzes user queries and generates contextual AI-like responses
 * for the enhanced co-pilot experience
 */

// Enhanced query analysis with better keyword detection and intent scoring
const analyzeQuery = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Enhanced keyword patterns for better intent detection
  const intentPatterns = {
    analysis: {
      keywords: ['analyze', 'analysis', 'examine', 'evaluate', 'assess', 'review', 'study', 'understand', 'how does', 'what is', 'explain', 'break down'],
      weight: 1.0
    },
    implementation: {
      keywords: ['implement', 'deploy', 'build', 'create', 'develop', 'setup', 'install', 'configure', 'integrate', 'how to', 'steps', 'process', 'workflow'],
      weight: 1.0
    },
    cost: {
      keywords: ['cost', 'price', 'budget', 'investment', 'roi', 'return', 'expense', 'financial', 'money', 'affordable', 'pricing', 'value'],
      weight: 1.0
    },
    technical: {
      keywords: ['technical', 'architecture', 'technology', 'system', 'infrastructure', 'platform', 'framework', 'algorithm', 'model', 'data', 'api'],
      weight: 1.0
    },
    process: {
      keywords: ['process', 'workflow', 'procedure', 'methodology', 'approach', 'strategy', 'plan', 'roadmap', 'timeline', 'phases'],
      weight: 1.0
    },
    benefits: {
      keywords: ['benefit', 'advantage', 'value', 'impact', 'improvement', 'efficiency', 'performance', 'results', 'outcomes', 'why', 'worth'],
      weight: 1.0
    },
    simulation: {
      keywords: ['simulate', 'simulation', 'run', 'demo', 'test', 'try', 'preview', 'walk through', 'show me'],
      weight: 1.0
    }
  };

  // Calculate intent scores based on keyword matches
  const intentScores = {};
  let totalMatches = 0;

  Object.entries(intentPatterns).forEach(([intent, pattern]) => {
    let matches = 0;
    pattern.keywords.forEach(keyword => {
      if (lowerQuery.includes(keyword)) {
        matches++;
        totalMatches++;
      }
    });
    intentScores[intent] = matches * pattern.weight;
  });

  // Determine primary intent (highest scoring)
  const primaryIntent = Object.entries(intentScores)
    .sort(([,a], [,b]) => b - a)
    .filter(([,score]) => score > 0)[0]?.[0] || 'analysis';

  // Extract topic keywords for better context
  const topicKeywords = extractTopicKeywords(lowerQuery);

  // Calculate confidence based on keyword matches
  const confidence = Math.min(0.95, Math.max(0.3, totalMatches / 10));

  return {
    intent: primaryIntent,
    confidence,
    topicKeywords,
    rawScores: intentScores
  };
};

// Enhanced topic keyword extraction
const extractTopicKeywords = (query) => {
  const technicalTerms = [
    'machine learning', 'ai', 'artificial intelligence', 'deep learning', 'neural network',
    'classification', 'detection', 'prediction', 'automation', 'optimization',
    'image', 'medical', 'healthcare', 'diagnosis', 'clinical', 'patient',
    'manufacturing', 'maintenance', 'quality', 'production', 'efficiency',
    'finance', 'fraud', 'risk', 'trading', 'banking', 'investment',
    'retail', 'recommendation', 'customer', 'personalization', 'e-commerce',
    'data', 'analytics', 'insights', 'visualization', 'reporting',
    'cloud', 'scalability', 'performance', 'security', 'integration'
  ];

  const foundTerms = technicalTerms.filter(term => query.includes(term));
  return foundTerms.length > 0 ? foundTerms : ['general'];
};

// Enhanced response generation with more varied templates
const generateResponse = (analysis, context) => {
  const { intent, topicKeywords, confidence } = analysis;
  const { useCase, industry, technologies } = context;

  // Generate intent-specific responses with more variation
  const responseTemplates = {
    analysis: [
      `Based on your query about ${useCase?.title || 'this solution'}, I can provide a comprehensive analysis. This ${useCase?.category?.name || 'AI solution'} leverages advanced ${topicKeywords.includes('machine learning') ? 'machine learning algorithms' : 'AI technologies'} to deliver exceptional results in ${industry?.name || 'your industry'}.`,
      
      `Let me analyze ${useCase?.title || 'this solution'} for you. The system utilizes ${technologies?.length > 0 ? technologies.slice(0, 2).map(t => t.name).join(' and ') : 'cutting-edge technologies'} to address key challenges in ${industry?.name || 'the industry'}.`,
      
      `From an analytical perspective, ${useCase?.title || 'this solution'} represents a sophisticated approach to ${topicKeywords.includes('medical') ? 'healthcare innovation' : topicKeywords.includes('manufacturing') ? 'industrial optimization' : 'business transformation'}. The solution architecture is designed for ${industry?.name || 'enterprise'} environments.`
    ],
    
    implementation: [
      `For implementing ${useCase?.title || 'this solution'}, we follow a structured approach that ensures successful deployment in ${industry?.name || 'your organization'}. The implementation leverages ${technologies?.length > 0 ? technologies[0]?.name : 'proven technologies'} and industry best practices.`,
      
      `The implementation strategy for ${useCase?.title || 'this solution'} involves ${useCase?.architecture?.components?.length || 'multiple'} key components working together seamlessly. We prioritize ${topicKeywords.includes('security') ? 'security and compliance' : 'performance and scalability'} throughout the deployment process.`,
      
      `To successfully implement ${useCase?.title || 'this solution'}, we begin with a comprehensive assessment of your ${industry?.name || 'business'} requirements, followed by a phased deployment approach that minimizes disruption while maximizing value.`
    ],
    
    cost: [
      `From a financial perspective, ${useCase?.title || 'this solution'} offers compelling ROI through ${topicKeywords.includes('efficiency') ? 'operational efficiency gains' : 'cost reduction and revenue enhancement'}. The investment typically pays for itself within ${industry?.name === 'Healthcare' ? '12-18 months' : '8-15 months'}.`,
      
      `The cost structure for ${useCase?.title || 'this solution'} is designed to be scalable and predictable. Initial investment covers ${technologies?.length > 0 ? 'technology licensing, ' : ''}implementation services, and training, with ongoing operational costs that decrease as the system optimizes performance.`,
      
      `Investment in ${useCase?.title || 'this solution'} delivers measurable returns through ${topicKeywords.includes('automation') ? 'process automation' : 'enhanced decision-making capabilities'}. Our clients typically see ${industry?.name === 'Finance' ? '200-400%' : '150-300%'} ROI within the first year.`
    ],
    
    technical: [
      `The technical architecture of ${useCase?.title || 'this solution'} is built on ${technologies?.length > 0 ? technologies.slice(0, 3).map(t => t.name).join(', ') : 'modern, scalable technologies'}. The system design prioritizes ${topicKeywords.includes('performance') ? 'high performance' : 'reliability and maintainability'}.`,
      
      `From a technical standpoint, ${useCase?.title || 'this solution'} utilizes ${useCase?.category?.name || 'advanced AI'} methodologies integrated with ${industry?.name || 'enterprise'}-grade infrastructure. The architecture supports ${topicKeywords.includes('scalability') ? 'horizontal scaling' : 'enterprise workloads'}.`,
      
      `The technology stack for ${useCase?.title || 'this solution'} includes ${technologies?.length > 0 ? `${technologies[0]?.name} for core processing` : 'cutting-edge AI frameworks'}, ensuring ${topicKeywords.includes('real-time') ? 'real-time performance' : 'robust and reliable operation'}.`
    ],
    
    process: [
      `The process for deploying ${useCase?.title || 'this solution'} follows our proven methodology, starting with requirements analysis and proceeding through ${useCase?.architecture?.flow?.length || 'multiple'} distinct phases. Each phase is designed to deliver incremental value to your ${industry?.name || 'organization'}.`,
      
      `Our implementation process for ${useCase?.title || 'this solution'} emphasizes ${topicKeywords.includes('integration') ? 'seamless integration' : 'minimal disruption'} to existing workflows. The methodology includes comprehensive testing and validation at each stage.`,
      
      `The deployment process involves ${useCase?.architecture?.components?.length || 'several'} key stages, from initial data preparation through final optimization. We ensure ${industry?.name || 'industry'}-specific compliance and performance requirements are met throughout.`
    ],
    
    benefits: [
      `The key benefits of ${useCase?.title || 'this solution'} include ${topicKeywords.includes('efficiency') ? 'dramatic efficiency improvements' : 'enhanced operational capabilities'} and ${topicKeywords.includes('accuracy') ? 'superior accuracy' : 'better decision-making support'}. Organizations in ${industry?.name || 'your sector'} typically see immediate impact.`,
      
      `${useCase?.title || 'This solution'} delivers transformative value through ${topicKeywords.includes('automation') ? 'intelligent automation' : 'advanced analytics capabilities'}. The benefits extend beyond cost savings to include ${industry?.name === 'Healthcare' ? 'improved patient outcomes' : 'competitive advantages'}.`,
      
      `The value proposition of ${useCase?.title || 'this solution'} centers on ${topicKeywords.includes('prediction') ? 'predictive capabilities' : 'intelligent decision support'} that enables ${industry?.name || 'organizations'} to ${topicKeywords.includes('optimization') ? 'optimize operations' : 'achieve strategic objectives'} more effectively.`
    ],
    
    simulation: [
      `I can run an interactive simulation of ${useCase?.title || 'this solution'} to demonstrate the implementation process and expected outcomes. The simulation will show how the system processes ${topicKeywords.includes('data') ? 'your data' : 'real-world scenarios'} in ${industry?.name || 'your environment'}.`,
      
      `Let me simulate the ${useCase?.title || 'solution'} workflow for you. This will demonstrate the ${useCase?.architecture?.components?.length || 'key'} components working together and show the expected performance metrics for ${industry?.name || 'your use case'}.`,
      
      `The simulation will walk you through the complete ${useCase?.title || 'solution'} lifecycle, from data input through final results. You'll see how the ${technologies?.length > 0 ? technologies[0]?.name : 'AI system'} processes information and delivers insights.`
    ]
  };

  // Select a random template from the intent category
  const templates = responseTemplates[intent] || responseTemplates.analysis;
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];

  return selectedTemplate;
};

// Enhanced action generation based on intent
const generateActions = (analysis, context) => {
  const { intent, topicKeywords } = analysis;
  const baseActions = [];

  // Always start with a primary simulation action
  const primarySimulationAction = {
    type: 'simulation',
    simulationType: intent === 'cost' ? 'cost' : 
                   intent === 'technical' ? 'architecture' :
                   intent === 'process' ? 'process' :
                   intent === 'benefits' ? 'metrics' : 'implementation',
    label: intent === 'analysis' ? '🚀 Run Analysis Simulation' :
           intent === 'cost' ? '💰 Run Cost Analysis Simulation' :
           intent === 'technical' ? '⚡ Run Technical Simulation' :
           intent === 'process' ? '🔄 Run Process Simulation' :
           intent === 'benefits' ? '📊 Run Success Metrics Simulation' :
           intent === 'simulation' ? '🚀 Run Full Simulation' :
           '🚀 Run Implementation Simulation',
    description: intent === 'analysis' ? 'Deep dive analysis of solution components and capabilities' :
                intent === 'cost' ? 'Detailed ROI and cost-benefit analysis walkthrough' :
                intent === 'technical' ? 'Interactive technical architecture demonstration' :
                intent === 'process' ? 'Step-by-step implementation process walkthrough' :
                intent === 'benefits' ? 'Expected outcomes and success metrics simulation' :
                intent === 'simulation' ? 'Complete end-to-end solution simulation' :
                'Interactive deployment and implementation walkthrough'
  };

  baseActions.push(primarySimulationAction);

  // Intent-specific secondary actions
  switch (intent) {
    case 'analysis':
      baseActions.push(
        { type: 'scroll', target: 'architecture', label: '🏗️ Explore Architecture', description: 'View technical architecture details' },
        { type: 'scroll', target: 'technologies', label: '🔧 View Technologies', description: 'Explore technology stack' }
      );
      break;
      
    case 'implementation':
      baseActions.push(
        { type: 'scroll', target: 'implementation', label: '📋 View Implementation Plan', description: 'See detailed implementation requirements' },
        { type: 'scroll', target: 'architecture', label: '🏗️ Explore Architecture', description: 'View system architecture' }
      );
      break;
      
    case 'cost':
      baseActions.push(
        { type: 'lead-capture', context: 'cost-analysis', label: '📞 Get Custom Quote', description: 'Personalized pricing consultation' },
        { type: 'scroll', target: 'implementation', label: '📊 View ROI Details', description: 'Implementation costs and benefits' }
      );
      break;
      
    case 'technical':
      baseActions.push(
        { type: 'scroll', target: 'architecture', label: '🏗️ Explore Architecture', description: 'Technical architecture deep dive' },
        { type: 'scroll', target: 'technologies', label: '🔧 View Tech Stack', description: 'Technology components and integrations' }
      );
      break;
      
    case 'process':
      baseActions.push(
        { type: 'scroll', target: 'implementation', label: '📊 View Process Details', description: 'Implementation methodology' },
        { type: 'scroll', target: 'architecture', label: '🏗️ View Workflow', description: 'System workflow and processes' }
      );
      break;
      
    case 'benefits':
      baseActions.push(
        { type: 'scroll', target: 'implementation', label: '📈 View Success Metrics', description: 'Expected outcomes and KPIs' },
        { type: 'lead-capture', context: 'benefits-inquiry', label: '📞 Schedule Consultation', description: 'Discuss specific benefits for your use case' }
      );
      break;
      
    case 'simulation':
      // For simulation intent, provide multiple simulation options
      baseActions.push(
        { type: 'simulation', simulationType: 'metrics', label: '📊 Performance Simulation', description: 'Expected performance and success metrics' },
        { type: 'simulation', simulationType: 'cost', label: '💰 Cost Analysis Simulation', description: 'ROI and financial impact analysis' }
      );
      break;
      
    default:
      baseActions.push(
        { type: 'scroll', target: 'architecture', label: '🏗️ Explore Architecture', description: 'View technical details' },
        { type: 'scroll', target: 'technologies', label: '🔧 View Technologies', description: 'Explore technology ecosystem' }
      );
  }

  // Always ensure we have a consultation option if not already present
  if (!baseActions.find(a => a.type === 'lead-capture')) {
    baseActions.push({ 
      type: 'lead-capture', 
      context: `${intent}-inquiry`, 
      label: '📞 Schedule Consultation', 
      description: 'Expert consultation for your specific needs' 
    });
  }

  return baseActions.slice(0, 3); // Limit to 3 actions for better UX
};

/**
 * Extracts key topics and focus areas from the query
 */
export function extractQueryTopics(query, useCaseData) {
  const queryLower = query.toLowerCase();
  const topics = [];

  // Extract technology mentions
  useCaseData.technologies?.forEach(tech => {
    if (queryLower.includes(tech.name.toLowerCase())) {
      topics.push({ type: 'technology', value: tech.name });
    }
  });

  // Extract capability mentions
  useCaseData.capabilities?.forEach(capability => {
    const capabilityWords = capability.toLowerCase().split(' ');
    if (capabilityWords.some(word => queryLower.includes(word))) {
      topics.push({ type: 'capability', value: capability });
    }
  });

  // Extract industry context
  if (useCaseData.industry?.name && queryLower.includes(useCaseData.industry.name.toLowerCase())) {
    topics.push({ type: 'industry', value: useCaseData.industry.name });
  }

  return topics;
}

/**
 * Generates contextual response data based on query and use case
 */
export function generateQueryResponse(query, useCaseData) {
  const intent = analyzeQuery(query);
  const topics = extractQueryTopics(query, useCaseData);
  const template = generateResponse(intent, { useCase: useCaseData, industry: useCaseData.industry, technologies: useCaseData.technologies });

  // Generate response sections
  const response = {
    intent: intent.intent,
    topics,
    text: template,
    actions: generateActions(intent, { useCase: useCaseData, industry: useCaseData.industry, technologies: useCaseData.technologies }),
    confidence: intent.confidence
  };

  return response;
}

// Helper functions for response generation
function extractMainTopic(query) {
  const words = query.toLowerCase().split(' ');
  const importantWords = words.filter(word => 
    word.length > 3 && 
    !['the', 'and', 'for', 'with', 'this', 'that', 'from', 'they', 'will', 'have', 'been'].includes(word)
  );
  return importantWords.slice(0, 2).join(' ') || 'your requirements';
}

function extractFocus(query, intent) {
  const focusMap = {
    analysis: 'analytical insights and data-driven solutions',
    implementation: 'practical deployment and technical execution',
    cost: 'financial optimization and return on investment',
    technical: 'technical architecture and system design',
    process: 'workflow optimization and process improvement',
    benefits: 'measurable outcomes and business value'
  };
  return focusMap[intent] || 'comprehensive AI solutions';
}

function getArchitectureComponents(data) {
  return 'advanced AI components, data processing pipelines, and intelligent automation systems';
}

function getEstimatedTimeline(solution) {
  const timelineMap = {
    'Medical Image Classification': '8-12 week',
    'Predictive Maintenance': '10-14 week',
    'Fraud Detection': '6-10 week',
    'Recommendation Engine': '8-12 week'
  };
  return timelineMap[solution] || '8-16 week';
}

function getBenefitsList(data) {
  return `${data.capabilities.split(' and ')[0]}, improved accuracy, and enhanced operational efficiency`;
}

function getIndustryReason(industry) {
  const reasonMap = {
    'Healthcare': 'of strict regulatory requirements and the need for high accuracy',
    'Manufacturing': 'of complex operational processes and equipment criticality',
    'Financial Services': 'of real-time processing needs and regulatory compliance',
    'Retail': 'of dynamic customer behavior and inventory complexity',
    'Energy': 'of grid complexity and sustainability requirements',
    'Transportation': 'of safety requirements and operational efficiency needs'
  };
  return reasonMap[industry] || 'of its unique operational requirements and regulatory landscape';
}

function getSuccessMetrics(industry) {
  const metricsMap = {
    'Healthcare': '25-40%',
    'Manufacturing': '30-50%',
    'Financial Services': '20-35%',
    'Retail': '15-30%',
    'Energy': '20-40%',
    'Transportation': '25-45%'
  };
  return metricsMap[industry] || '20-40%';
}

function calculateConfidence(topics, useCaseData) {
  let confidence = 0.7; // Base confidence
  
  // Increase confidence based on topic matches
  confidence += topics.length * 0.05;
  
  // Increase confidence if we have rich data
  if (useCaseData.technologies?.length > 0) confidence += 0.1;
  if (useCaseData.capabilities?.length > 0) confidence += 0.1;
  if (useCaseData.architecture?.components?.length > 0) confidence += 0.1;
  
  return Math.min(confidence, 0.98); // Cap at 98%
} 