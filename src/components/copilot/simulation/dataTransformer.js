// Data transformer for converting Hygraph data into simulation steps
export const generateSimulationSteps = (responseData) => {
  const steps = [];
  
  // Extract contextual information from real Hygraph data
  const useCase = responseData.useCase;
  const application = responseData.industryApplication;
  const industry = responseData.industry;
  const simulationData = responseData.simulationData;
  const isApplicationBased = responseData.isApplicationBased;
  
  // Determine the solution name and context using real data
  const solutionName = isApplicationBased ? 
    application?.applicationTitle || 'AI Solution' : 
    useCase?.title || 'AI Solution';
  
  const industryName = industry?.name || 'your industry';
  const simulationType = responseData.simulationType || 'general';
  
  // Step 1: Implementation Flow Activation
  steps.push({
    id: 'activation',
    title: '🚀 Implementation Flow Activated',
    subtitle: `Initializing ${solutionName} analysis...`,
    content: `Analyzing your ${solutionName} implementation requirements for ${industryName}. ${simulationType === 'general' ? 'Running comprehensive analysis across all aspects.' : `Focusing on ${simulationType} aspects.`}`,
    processingTime: 2000,
    type: 'activation',
    metrics: null,
    subSteps: [
      { id: 'init', title: 'Initializing Analysis Engine', duration: 1500 },
      { id: 'context', title: 'Loading Solution Context', duration: 1000 },
      { id: 'ready', title: 'Analysis Ready', duration: 500 }
    ]
  });

  // Step 2: Success Metrics Analysis (use real metrics from Hygraph)
  const actualMetrics = useCase?.metrics || responseData.metrics || [];
  if (actualMetrics.length > 0) {
    steps.push({
      id: 'metrics',
      title: '📊 Success Metrics Analysis',
      subtitle: `Processing ${solutionName} KPIs...`,
      content: `Evaluating success criteria and measurement frameworks for ${solutionName} in ${industryName}`,
      processingTime: 3000,
      type: 'metrics',
      metrics: actualMetrics.map(metric => ({
        name: metric,
        status: 'analyzing',
        description: getContextualMetricDescription(metric, solutionName, industryName)
      })),
      subSteps: actualMetrics.map((metric, index) => ({
        id: `metric-${index}`,
        title: `Analyzing ${metric}`,
        duration: 1200 + (index * 200)
      }))
    });
  }

  // Step 3: Technical Architecture Review (use real architecture from Hygraph)
  if (useCase?.architecture) {
    const components = useCase.architecture.components || [];
    steps.push({
      id: 'architecture',
      title: '🏗️ Architecture Review',
      subtitle: `Analyzing ${solutionName} technical components...`,
      content: `Reviewing system architecture and component integration for ${solutionName}. ${useCase.architecture.description || 'Analyzing technical infrastructure and data flow.'}`,
      processingTime: 2500,
      type: 'architecture',
      components: components.map(comp => ({
        name: comp.name,
        description: comp.description,
        details: comp.details,
        explanation: Array.isArray(comp.explanation) ? comp.explanation.join(', ') : comp.explanation,
        status: 'active'
      })),
      subSteps: [
        { id: 'overview', title: 'Architecture Overview Analysis', duration: 1000 },
        ...components.map((comp, index) => ({
          id: `component-${index}`,
          title: `Analyzing ${comp.name}`,
          duration: 1500 + (index * 300)
        })),
        { id: 'integration', title: 'Component Integration Review', duration: 1200 }
      ]
    });
  }

  // Step 4: Implementation Planning (use real implementation data from Hygraph)
  const implementationDetails = useCase?.implementation || [];
  const phases = generateContextualImplementationPhases(solutionName, industryName, useCase, implementationDetails);
  steps.push({
    id: 'planning',
    title: '📋 Implementation Planning',
    subtitle: `Generating ${solutionName} deployment strategy...`,
    content: `Creating customized implementation roadmap for ${solutionName} in ${industryName}`,
    processingTime: 3500,
    type: 'planning',
    phases: phases,
    subSteps: [
      { id: 'analysis', title: 'Requirements Analysis', duration: 1000 },
      ...phases.map((phase, index) => ({
        id: `phase-${index}`,
        title: `Planning ${phase.title}`,
        duration: 1200 + (index * 200)
      })),
      { id: 'timeline', title: 'Timeline Optimization', duration: 800 }
    ]
  });

  // Step 5: Workflow Analysis (use real flow data from Hygraph)
  if (useCase?.architecture?.flow && useCase.architecture.flow.length > 0) {
    const flowSteps = useCase.architecture.flow;
    steps.push({
      id: 'workflow',
      title: '🔄 Workflow Analysis',
      subtitle: `Analyzing ${solutionName} process flow...`,
      content: `Examining the operational workflow and process optimization for ${solutionName}`,
      processingTime: 2500,
      type: 'workflow',
      flowSteps: flowSteps.map(step => ({
        step: step.step,
        description: step.description,
        details: step.details,
        id: step.id
      })),
      subSteps: [
        { id: 'flow-init', title: 'Workflow Initialization', duration: 800 },
        ...flowSteps.map((step, index) => ({
          id: `flow-${index}`,
          title: `Analyzing Step: ${step.description}`,
          duration: 1000 + (index * 250)
        })),
        { id: 'optimization', title: 'Process Optimization', duration: 1000 }
      ]
    });
  }

  // Step 6: Technology Stack Review (use real technologies from Hygraph)
  if (useCase?.technologies && useCase.technologies.length > 0) {
    const technologies = useCase.technologies;
    steps.push({
      id: 'technology',
      title: '🔧 Technology Stack Review',
      subtitle: `Evaluating ${solutionName} technology components...`,
      content: `Analyzing the technology ecosystem and integration requirements for ${solutionName}`,
      processingTime: 2000,
      type: 'technology',
      technologies: technologies.map(tech => ({
        name: tech.name,
        description: tech.description,
        slug: tech.slug,
        id: tech.id
      })),
      subSteps: [
        { id: 'stack-analysis', title: 'Technology Stack Analysis', duration: 800 },
        ...technologies.map((tech, index) => ({
          id: `tech-${index}`,
          title: `Evaluating ${tech.name}`,
          duration: 1100 + (index * 200)
        })),
        { id: 'compatibility', title: 'Compatibility Assessment', duration: 900 }
      ]
    });
  }

  // Step 7: Capabilities Assessment (use real capabilities from Hygraph)
  if (useCase?.capabilities) {
    const capabilities = Array.isArray(useCase.capabilities) ? useCase.capabilities : [useCase.capabilities];
    steps.push({
      id: 'capabilities',
      title: '⚡ Capabilities Assessment',
      subtitle: `Evaluating ${solutionName} core capabilities...`,
      content: `Assessing the functional capabilities and performance characteristics of ${solutionName}`,
      processingTime: 2000,
      type: 'capabilities',
      capabilities: capabilities,
      subSteps: [
        { id: 'capability-init', title: 'Capability Framework Setup', duration: 700 },
        ...capabilities.map((capability, index) => ({
          id: `capability-${index}`,
          title: `Assessing ${capability}`,
          duration: 1000 + (index * 180)
        })),
        { id: 'performance', title: 'Performance Validation', duration: 800 }
      ]
    });
  }

  // Step 8: Risk Assessment (contextual to the real solution and industry)
  const risks = generateContextualRiskAssessment(solutionName, industryName, useCase, responseData);
  steps.push({
    id: 'risk',
    title: '⚠️ Risk Assessment',
    subtitle: `Evaluating ${solutionName} implementation challenges...`,
    content: `Identifying and mitigating implementation risks specific to ${solutionName} in ${industryName}`,
    processingTime: 2000,
    type: 'risk',
    risks: risks,
    subSteps: [
      { id: 'risk-scan', title: 'Risk Scanning & Identification', duration: 1000 },
      ...risks.map((risk, index) => ({
        id: `risk-${index}`,
        title: `Analyzing ${risk.risk}`,
        duration: 900 + (index * 200)
      })),
      { id: 'mitigation', title: 'Mitigation Strategy Development', duration: 1200 }
    ]
  });

  // Step 9: Final Recommendations (contextual to the real solution)
  const recommendations = generateContextualRecommendations(solutionName, industryName, useCase, responseData);
  steps.push({
    id: 'recommendations',
    title: '✅ Final Recommendations',
    subtitle: `Generating ${solutionName} action plan...`,
    content: `Compiling customized implementation strategy for ${solutionName} in ${industryName}`,
    processingTime: 2000,
    type: 'recommendations',
    recommendations: recommendations,
    subSteps: [
      { id: 'synthesis', title: 'Data Synthesis & Analysis', duration: 1000 },
      { id: 'strategy', title: 'Strategy Formulation', duration: 1200 },
      { id: 'prioritization', title: 'Priority Recommendations', duration: 800 },
      { id: 'finalization', title: 'Action Plan Finalization', duration: 600 }
    ]
  });

  return steps;
};

// Helper functions for generating contextual content
const getContextualMetricDescription = (metric, solutionName, industryName) => {
  // Use actual metric data if available, otherwise generate contextual description
  if (typeof metric === 'object' && metric.description) {
    return metric.description;
  }
  
  const descriptions = {
    'Accuracy': `Model accuracy for ${solutionName} in ${industryName} applications`,
    'Processing Speed': `Real-time processing capability for ${solutionName}`,
    'Cost Reduction': `Operational cost savings through ${solutionName} implementation`,
    'ROI': `Return on investment from ${solutionName} deployment`,
    'User Satisfaction': `End-user satisfaction with ${solutionName} performance`,
    'Compliance Score': `Regulatory compliance rating for ${industryName}`,
    'Uptime': `System availability and reliability metrics`,
    'Throughput': `Data processing throughput for ${solutionName}`
  };
  return descriptions[metric] || `${metric} measurement for ${solutionName}`;
};

const generateContextualImplementationPhases = (solutionName, industryName, useCase, implementationDetails) => {
  // Use real implementation data from Hygraph if available
  if (implementationDetails && Array.isArray(implementationDetails) && implementationDetails.length > 0) {
    return implementationDetails.map((item, index) => ({
      phase: `Phase ${index + 1}`,
      title: typeof item === 'string' ? item : item.title || `Implementation Step ${index + 1}`,
      duration: item.duration || '2-3 weeks',
      description: typeof item === 'string' ? `${item} for ${solutionName}` : 
                  item.description || `${solutionName} implementation phase`
    }));
  }

  // Use real architecture flow as implementation phases if available
  if (useCase?.architecture?.flow && useCase.architecture.flow.length > 0) {
    return useCase.architecture.flow.map((step, index) => ({
      phase: `Phase ${index + 1}`,
      title: step.description,
      duration: '2-3 weeks',
      description: step.details || `Step ${step.step}: ${step.description} for ${solutionName}`
    }));
  }

  // Fallback to contextual phases based on industry and solution
  const defaultPhases = [
    { phase: 'Phase 1', title: 'Data Preparation & Assessment', duration: '2-3 weeks', description: `Prepare and validate data sources for ${solutionName}` },
    { phase: 'Phase 2', title: 'Model Development & Training', duration: '3-4 weeks', description: `Develop and train AI models for ${solutionName}` },
    { phase: 'Phase 3', title: 'System Integration', duration: '2-3 weeks', description: `Integrate ${solutionName} with existing ${industryName} systems` },
    { phase: 'Phase 4', title: 'Testing & Validation', duration: '2-3 weeks', description: `Test and validate ${solutionName} performance` },
    { phase: 'Phase 5', title: 'Production Deployment', duration: '1-2 weeks', description: `Deploy ${solutionName} to production environment` },
    { phase: 'Phase 6', title: 'Monitoring & Optimization', duration: 'Ongoing', description: `Monitor and optimize ${solutionName} performance` }
  ];

  return defaultPhases;
};

const generateContextualRiskAssessment = (solutionName, industryName, useCase, responseData) => {
  // Generate risks based on real use case characteristics
  const risks = [];

  // Use actual industry data if available
  const actualIndustry = responseData.industry;
  const industryContext = actualIndustry?.description || industryName;

  // Add technology-specific risks based on real technologies
  if (useCase?.technologies && useCase.technologies.length > 0) {
    risks.push({
      risk: 'Technology Integration Complexity',
      level: useCase.technologies.length > 3 ? 'High' : 'Medium',
      mitigation: `Ensure proper integration testing for ${useCase.technologies.map(t => t.name).join(', ')} components`
    });
  }

  // Add architecture-specific risks based on real architecture complexity
  if (useCase?.architecture?.components && useCase.architecture.components.length > 0) {
    const complexityLevel = useCase.architecture.components.length > 5 ? 'High' : 
                           useCase.architecture.components.length > 3 ? 'Medium' : 'Low';
    risks.push({
      risk: 'System Complexity Management',
      level: complexityLevel,
      mitigation: `Implement modular architecture with clear component boundaries and monitoring for ${useCase.architecture.components.length} components`
    });
  }

  // Add data-driven risks based on use case characteristics
  if (useCase?.capabilities) {
    const capabilities = Array.isArray(useCase.capabilities) ? useCase.capabilities : [useCase.capabilities];
    risks.push({
      risk: 'Performance & Accuracy Requirements',
      level: 'Medium',
      mitigation: `Establish clear success criteria and validation processes for ${capabilities.join(', ')} capabilities`
    });
  }

  // Add industry-specific risks only if we have specific industry context
  if (industryName === 'Healthcare' || actualIndustry?.name === 'Healthcare') {
    risks.push({
      risk: 'Regulatory Compliance',
      level: 'High',
      mitigation: 'Implement comprehensive compliance framework with regular audits'
    });
  } else if (industryName === 'Financial Services' || actualIndustry?.name === 'Financial Services') {
    risks.push({
      risk: 'Regulatory Compliance & Security',
      level: 'High',
      mitigation: 'Ensure full regulatory compliance with continuous security monitoring'
    });
  } else if (industryName === 'Manufacturing' || actualIndustry?.name === 'Manufacturing') {
    risks.push({
      risk: 'Production Impact & Integration',
      level: 'High',
      mitigation: 'Implement gradual rollout with comprehensive fallback systems'
    });
  }

  // Add implementation-specific risks based on real implementation data
  if (useCase?.implementation && Array.isArray(useCase.implementation) && useCase.implementation.length > 0) {
    risks.push({
      risk: 'Implementation Timeline Management',
      level: 'Medium',
      mitigation: `Manage ${useCase.implementation.length} implementation phases with regular milestone reviews`
    });
  }

  // Fallback risks if none specified (more generic and data-driven)
  if (risks.length === 0) {
    risks.push(
      { risk: 'Implementation Complexity', level: 'Medium', mitigation: 'Phased implementation approach with regular checkpoints' },
      { risk: 'User Adoption Challenges', level: 'Medium', mitigation: 'Comprehensive change management and training programs' },
      { risk: 'Technical Integration Issues', level: 'Medium', mitigation: 'Thorough system compatibility testing and validation' }
    );
  }

  return risks;
};

const generateContextualRecommendations = (solutionName, industryName, useCase, responseData) => {
  const recommendations = [];

  // Use actual industry data if available
  const actualIndustry = responseData.industry;
  const industryContext = actualIndustry?.name || industryName;

  // Base recommendations using real solution name and industry
  recommendations.push(`Start with a pilot program for ${solutionName} in a controlled ${industryContext} environment`);

  // Add recommendations based on real capabilities
  if (useCase?.capabilities) {
    const capabilities = Array.isArray(useCase.capabilities) ? useCase.capabilities : [useCase.capabilities];
    recommendations.push(`Focus on ${capabilities[0]} as the primary success metric during initial deployment`);
    
    if (capabilities.length > 1) {
      recommendations.push(`Establish clear measurement frameworks for all ${capabilities.length} core capabilities`);
    }
  }

  // Add recommendations based on real technologies
  if (useCase?.technologies && useCase.technologies.length > 0) {
    const techCount = useCase.technologies.length;
    if (techCount <= 2) {
      recommendations.push(`Ensure your team is trained on ${useCase.technologies.map(t => t.name).join(' and ')} before deployment`);
    } else {
      recommendations.push(`Plan comprehensive training for the ${techCount} technology components, prioritizing ${useCase.technologies.slice(0, 2).map(t => t.name).join(' and ')}`);
    }
  }

  // Add recommendations based on architecture complexity
  if (useCase?.architecture?.components && useCase.architecture.components.length > 0) {
    const componentCount = useCase.architecture.components.length;
    recommendations.push(`Implement monitoring for all ${componentCount} system components from day one`);
    
    if (componentCount > 3) {
      recommendations.push(`Consider phased component deployment given the ${componentCount} component architecture complexity`);
    }
  }

  // Add recommendations based on real implementation phases
  if (useCase?.implementation && Array.isArray(useCase.implementation) && useCase.implementation.length > 0) {
    recommendations.push(`Follow the structured ${useCase.implementation.length}-phase implementation approach for optimal results`);
  }

  // Add recommendations based on real architecture flow
  if (useCase?.architecture?.flow && useCase.architecture.flow.length > 0) {
    recommendations.push(`Validate each of the ${useCase.architecture.flow.length} workflow steps during testing phases`);
  }

  // Add selective industry-specific recommendations based on actual industry data
  if (industryContext === 'Healthcare') {
    recommendations.push('Ensure all staff complete compliance training before system access');
  } else if (industryContext === 'Manufacturing') {
    recommendations.push('Plan maintenance windows that align with production schedules');
  } else if (industryContext === 'Financial Services') {
    recommendations.push('Implement comprehensive audit logging for regulatory compliance');
  }

  // Add data governance recommendation (universal)
  recommendations.push('Establish clear data quality and governance frameworks before implementation');

  // Add scaling recommendation using real industry context
  recommendations.push(`Plan for gradual scaling across your ${industryContext} operations based on pilot results`);

  // Add partnership recommendation
  recommendations.push('Consider partnering with JEDI Labs for ongoing support and optimization');

  return recommendations;
};

