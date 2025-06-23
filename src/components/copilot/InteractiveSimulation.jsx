import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Button';
import { CheckCircleIcon, PlayIcon, PauseIcon, ArrowRightIcon, XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

const InteractiveSimulation = ({ responseData, onSuggestedQuery, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Generate simulation steps based on response data
  const generateSimulationSteps = (data) => {
    const steps = [];
    
    // Extract contextual information from real Hygraph data
    const useCase = data.useCase;
    const application = data.industryApplication;
    const industry = data.industry;
    const simulationData = data.simulationData;
    const isApplicationBased = data.isApplicationBased;
    
    // Determine the solution name and context using real data
    const solutionName = isApplicationBased ? 
      application?.applicationTitle || 'AI Solution' : 
      useCase?.title || 'AI Solution';
    
    const industryName = industry?.name || 'your industry';
    const simulationType = data.simulationType || 'general';
    
    // Step 1: Implementation Flow Activation
    steps.push({
      id: 'activation',
      title: '🚀 Implementation Flow Activated',
      subtitle: `Initializing ${solutionName} analysis...`,
      content: `Analyzing your ${solutionName} implementation requirements for ${industryName}. ${simulationType === 'general' ? 'Running comprehensive analysis across all aspects.' : `Focusing on ${simulationType} aspects.`}`,
      processingTime: 2000,
      type: 'activation',
      metrics: null
    });

    // Step 2: Success Metrics Analysis (use real metrics from Hygraph)
    const actualMetrics = useCase?.metrics || data.metrics || [];
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
        }))
      });
    }

    // Step 3: Technical Architecture Review (use real architecture from Hygraph)
    if (useCase?.architecture) {
      steps.push({
        id: 'architecture',
        title: '🏗️ Architecture Review',
        subtitle: `Analyzing ${solutionName} technical components...`,
        content: `Reviewing system architecture and component integration for ${solutionName}. ${useCase.architecture.description || 'Analyzing technical infrastructure and data flow.'}`,
        processingTime: 2500,
        type: 'architecture',
        components: useCase.architecture.components?.map(comp => ({
          name: comp.name,
          description: comp.description,
          details: comp.details,
          explanation: Array.isArray(comp.explanation) ? comp.explanation.join(', ') : comp.explanation,
          status: 'active'
        })) || []
      });
    }

    // Step 4: Implementation Planning (use real implementation data from Hygraph)
    const implementationDetails = useCase?.implementation || [];
    steps.push({
      id: 'planning',
      title: '📋 Implementation Planning',
      subtitle: `Generating ${solutionName} deployment strategy...`,
      content: `Creating customized implementation roadmap for ${solutionName} in ${industryName}`,
      processingTime: 3500,
      type: 'planning',
      phases: generateContextualImplementationPhases(solutionName, industryName, useCase, implementationDetails)
    });

    // Step 5: Workflow Analysis (use real flow data from Hygraph)
    if (useCase?.architecture?.flow && useCase.architecture.flow.length > 0) {
      steps.push({
        id: 'workflow',
        title: '🔄 Workflow Analysis',
        subtitle: `Analyzing ${solutionName} process flow...`,
        content: `Examining the operational workflow and process optimization for ${solutionName}`,
        processingTime: 2500,
        type: 'workflow',
        flowSteps: useCase.architecture.flow.map(step => ({
          step: step.step,
          description: step.description,
          details: step.details,
          id: step.id
        }))
      });
    }

    // Step 6: Technology Stack Review (use real technologies from Hygraph)
    if (useCase?.technologies && useCase.technologies.length > 0) {
      steps.push({
        id: 'technology',
        title: '🔧 Technology Stack Review',
        subtitle: `Evaluating ${solutionName} technology components...`,
        content: `Analyzing the technology ecosystem and integration requirements for ${solutionName}`,
        processingTime: 2000,
        type: 'technology',
        technologies: useCase.technologies.map(tech => ({
          name: tech.name,
          description: tech.description,
          slug: tech.slug,
          id: tech.id
        }))
      });
    }

    // Step 7: Capabilities Assessment (use real capabilities from Hygraph)
    if (useCase?.capabilities) {
      steps.push({
        id: 'capabilities',
        title: '⚡ Capabilities Assessment',
        subtitle: `Evaluating ${solutionName} core capabilities...`,
        content: `Assessing the functional capabilities and performance characteristics of ${solutionName}`,
        processingTime: 2000,
        type: 'capabilities',
        capabilities: Array.isArray(useCase.capabilities) ? useCase.capabilities : [useCase.capabilities]
      });
    }

    // Step 8: Risk Assessment (contextual to the real solution and industry)
    steps.push({
      id: 'risk',
      title: '⚠️ Risk Assessment',
      subtitle: `Evaluating ${solutionName} implementation challenges...`,
      content: `Identifying and mitigating implementation risks specific to ${solutionName} in ${industryName}`,
      processingTime: 2000,
      type: 'risk',
      risks: generateContextualRiskAssessment(solutionName, industryName, useCase)
    });

    // Step 9: Final Recommendations (contextual to the real solution)
    steps.push({
      id: 'recommendations',
      title: '✅ Final Recommendations',
      subtitle: `Generating ${solutionName} action plan...`,
      content: `Compiling customized implementation strategy for ${solutionName} in ${industryName}`,
      processingTime: 2000,
      type: 'recommendations',
      recommendations: generateContextualRecommendations(solutionName, industryName, useCase)
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

  const generateContextualRiskAssessment = (solutionName, industryName, useCase) => {
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

  const generateContextualRecommendations = (solutionName, industryName, useCase) => {
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

  const steps = generateSimulationSteps(responseData);

  // Auto-advance simulation when running
  useEffect(() => {
    if (isRunning && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setCurrentStep(prev => prev + 1);
      }, steps[currentStep]?.processingTime || 2000);

      return () => clearTimeout(timer);
    } else if (isRunning && currentStep === steps.length - 1) {
      // Complete the simulation
      setTimeout(() => {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setIsRunning(false);
        setShowResults(true);
      }, steps[currentStep]?.processingTime || 2000);
    }
  }, [isRunning, currentStep, steps]);

  const startSimulation = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setShowResults(false);
  };

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const resumeSimulation = () => {
    setIsRunning(true);
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    setIsRunning(false);
  };

  const renderStepContent = (step) => {
    switch (step.type) {
      case 'activation':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed">
              {step.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-400/30">
                <div className="text-lg mb-2">🎯</div>
                <div className="text-base font-bold text-white mb-2">Solution Analysis</div>
                <div className="text-purple-200 text-sm">
                  {responseData.useCase?.capabilities ? 
                    `Analyzing ${Array.isArray(responseData.useCase.capabilities) ? responseData.useCase.capabilities[0] : responseData.useCase.capabilities} capabilities` :
                    'Identifying optimal implementation approach'
                  }
                </div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
                <div className="text-lg mb-2">📊</div>
                <div className="text-base font-bold text-white mb-2">Data Assessment</div>
                <div className="text-blue-200 text-sm">
                  {responseData.useCase?.architecture?.components?.length ? 
                    `Evaluating ${responseData.useCase.architecture.components.length} system components` :
                    'Evaluating data readiness and quality'
                  }
                </div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                <div className="text-lg mb-2">⚡</div>
                <div className="text-base font-bold text-white mb-2">Resource Planning</div>
                <div className="text-green-200 text-sm">
                  {responseData.useCase?.technologies?.length ? 
                    `Planning integration of ${responseData.useCase.technologies.length} technologies` :
                    'Calculating required resources and timeline'
                  }
                </div>
              </div>
            </div>
          </div>
        );

      case 'metrics':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {step.metrics?.map((metric, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-400/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-base font-bold text-white">{metric.name}</div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-blue-200 text-sm">{metric.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'architecture':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {step.components?.map((component, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-gray-800/50 to-purple-800/30 rounded-lg p-4 border border-purple-400/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-base font-bold text-white">{component.name}</div>
                    <div className={`w-2 h-2 rounded-full ${
                      component.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                    } animate-pulse`}></div>
                  </div>
                  <div className="text-purple-200 text-sm">{component.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'planning':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="space-y-3">
              {step.phases?.map((phase, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-800/50 to-blue-800/30 rounded-lg border border-blue-400/30"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-base">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold text-white mb-1">{phase.title}</div>
                    <div className="text-blue-200 text-sm">{phase.description}</div>
                  </div>
                  <div className="text-purple-300 font-medium text-sm">{phase.duration}</div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'risk':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="space-y-3">
              {step.risks?.map((risk, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-lg border border-red-400/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-base font-bold text-white">{risk.risk}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      risk.level === 'High' ? 'bg-red-500/30 text-red-200' :
                      risk.level === 'Medium' ? 'bg-yellow-500/30 text-yellow-200' :
                      'bg-green-500/30 text-green-200'
                    }`}>
                      {risk.level} Risk
                    </div>
                  </div>
                  <div className="text-gray-300 text-sm">
                    <span className="font-medium text-green-300">Mitigation:</span> {risk.mitigation}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {step.recommendations?.map((rec, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-400/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-green-200 text-sm font-medium">{rec}</span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'workflow':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="space-y-3">
              {step.flowSteps?.map((flowStep, index) => (
                <motion.div
                  key={flowStep.id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-800/30 to-purple-800/30 rounded-lg border border-blue-400/30"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-base">
                    {flowStep.step}
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold text-white mb-1">{flowStep.description}</div>
                    {flowStep.details && (
                      <div className="text-blue-200 text-sm">{flowStep.details}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'technology':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {step.technologies?.map((tech, index) => (
                <motion.div
                  key={tech.id}
                  className="p-4 bg-gradient-to-br from-gray-800/50 to-blue-800/30 rounded-lg border border-blue-400/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-base font-bold text-white">{tech.name}</div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-blue-200 text-sm">{tech.description || `${tech.name} integration component`}</div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'capabilities':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {step.capabilities?.map((capability, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-400/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">⚡</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold text-white">{capability}</div>
                    <div className="text-purple-200 text-sm">Core system capability</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-base text-white font-medium leading-relaxed">
            {step.content}
          </div>
        );
    }
  };

  return (
    <>
      {/* Compact View - Shows in Chat */}
      {!isFullScreen && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          {/* Simulation Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>🤖</span>
                {responseData.simulationData?.title || 'AI Implementation Simulator'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {responseData.simulationData?.description || 'Interactive walkthrough of your AI solution implementation'}
              </p>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setIsFullScreen(true)}
                variant="outline" 
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none hover:from-purple-600 hover:to-blue-600"
              >
                <ArrowsPointingOutIcon className="w-4 h-4" />
                Launch Immersive Mode
              </Button>
            </div>
          </div>

          {/* Compact Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Ready to Experience Implementation
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Launch immersive mode for a full simulation experience with step-by-step guidance, 
              real-time metrics, and interactive components.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>🎯 {steps.length} Implementation Steps</span>
              <span>⏱️ ~{Math.round(steps.reduce((acc, step) => acc + (step.processingTime || 2000), 0) / 1000 / 60)} min experience</span>
              <span>📊 Interactive Analysis</span>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && setIsFullScreen(false)}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-spin-slow"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-500/10 to-transparent rounded-full animate-pulse"></div>
        </div>

        {/* Modal Content */}
        <div className="relative w-full h-full max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 flex flex-col">
          {/* Header */}
          <div className="relative z-20 mb-3 sm:mb-4 lg:mb-6 flex-shrink-0">
            <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 bg-black/50 backdrop-blur-md rounded-lg sm:rounded-xl border border-purple-500/30">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <ArrowsPointingOutIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white truncate">
                    {responseData.simulationData?.title || 'AI Implementation Simulator'}
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-200 truncate">
                    {responseData.simulationData?.description || 'Interactive simulation experience'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Status Indicator */}
                <div className="hidden sm:flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-medium text-xs sm:text-sm">Simulation Active</span>
                </div>

                {/* Close Button */}
                <motion.button
                  onClick={() => setIsFullScreen(false)}
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/30 flex items-center justify-center text-red-300 hover:text-red-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Main Content Area - Mobile-First Design */}
          <div className="relative z-10 flex-1 flex flex-col lg:flex-row min-h-0 gap-3 sm:gap-4">
            
            {/* Mobile: Top Controls Bar / Desktop: Left Sidebar */}
            <div className="w-full lg:w-72 bg-black/20 rounded-lg sm:rounded-xl border border-purple-500/20 flex flex-col">
              
              {/* Controls Section */}
              <div className="p-3 sm:p-4 border-b border-purple-500/20 bg-black/30">
                <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white mb-2 sm:mb-3">Simulation Controls</h3>
                <div className="flex lg:flex-col gap-2">
                  <Button 
                    onClick={startSimulation}
                    className="flex-1 lg:w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none shadow-lg text-xs sm:text-sm py-2 px-3"
                    disabled={isRunning}
                  >
                    <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{isRunning ? "Running..." : "Start Simulation"}</span>
                    <span className="sm:hidden">{isRunning ? "Running..." : "Start"}</span>
                  </Button>
                  
                  {isRunning && (
                    <Button 
                      onClick={pauseSimulation}
                      className="flex-1 lg:w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none text-xs sm:text-sm py-2 px-3"
                    >
                      <PauseIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Pause</span>
                      <span className="sm:hidden">Pause</span>
                    </Button>
                  )}
                  
                  {!isRunning && currentStep > 0 && !showResults && (
                    <Button 
                      onClick={resumeSimulation}
                      className="flex-1 lg:w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none text-xs sm:text-sm py-2 px-3"
                    >
                      <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Resume</span>
                      <span className="sm:hidden">Resume</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress Section - Enhanced for Mobile */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white">
                    Implementation Progress
                  </h3>
                  <div className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                    {currentStep + 1}/{steps.length}
                  </div>
                </div>
                
                {/* Mobile: Horizontal Scroll / Desktop: Vertical List */}
                <div className="lg:space-y-2">
                  {/* Mobile Progress Bar */}
                  <div className="lg:hidden mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${((completedSteps.size + (isRunning ? 0.5 : 0)) / steps.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-xs font-medium">
                        {Math.round(((completedSteps.size + (isRunning ? 0.5 : 0)) / steps.length) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Mobile: Horizontal Scrollable Steps */}
                  <div className="lg:hidden">
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'thin' }}>
                      {steps.map((step, index) => (
                        <motion.button
                          key={step.id}
                          className={`flex-shrink-0 w-20 sm:w-24 p-2 rounded-lg border transition-all duration-300 ${
                            index === currentStep
                              ? 'bg-purple-500/30 border-purple-400/70 shadow-lg'
                              : completedSteps.has(index)
                              ? 'bg-green-500/20 border-green-400/50'
                              : 'bg-gray-800/40 border-gray-600/40'
                          }`}
                          onClick={() => goToStep(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === currentStep
                                ? 'bg-purple-500 text-white'
                                : completedSteps.has(index)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-600 text-gray-300'
                            }`}>
                              {completedSteps.has(index) ? '✓' : index + 1}
                            </div>
                            <div className="text-xs text-white font-medium text-center leading-tight">
                              {step.title.replace(/^[^\s]+\s/, '').split(' ').slice(0, 2).join(' ')}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Desktop: Vertical List */}
                  <div className="hidden lg:block space-y-2">
                    {steps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                          index === currentStep
                            ? 'bg-purple-500/20 border-purple-400/50 shadow-lg'
                            : completedSteps.has(index)
                            ? 'bg-green-500/10 border-green-400/30'
                            : 'bg-gray-800/30 border-gray-600/30 hover:border-gray-500/50'
                        }`}
                        onClick={() => goToStep(index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === currentStep
                              ? 'bg-purple-500 text-white'
                              : completedSteps.has(index)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-600 text-gray-300'
                          }`}>
                            {completedSteps.has(index) ? '✓' : index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">
                              {step.title.replace(/^[^\s]+\s/, '')}
                            </div>
                            <div className="text-gray-400 text-xs truncate">
                              {step.subtitle}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Desktop Progress Summary */}
                    <div className="mt-4 p-3 bg-black/30 rounded-lg border border-purple-500/20">
                      <div className="text-xs text-gray-400 mb-2">Progress Overview</div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${((completedSteps.size + (isRunning ? 0.5 : 0)) / steps.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-white text-xs font-medium">
                          {Math.round(((completedSteps.size + (isRunning ? 0.5 : 0)) / steps.length) * 100)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {completedSteps.size} of {steps.length} steps completed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area - Improved Mobile Scrolling */}
            <div className="flex-1 flex flex-col min-h-0 bg-black/10 rounded-lg sm:rounded-xl border border-purple-500/20">
              <div className="flex-1 overflow-y-auto">
                <div className="p-3 sm:p-4 lg:p-6 min-h-full flex flex-col">
                  {/* Current Step Display */}
                  <AnimatePresence mode="wait">
                    {steps[currentStep] && (
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 flex flex-col"
                      >
                        {/* Step Header - More Compact on Mobile */}
                        <div className="mb-3 sm:mb-4 lg:mb-6">
                          <motion.div 
                            className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-xl flex items-center justify-center text-sm sm:text-base lg:text-lg shadow-lg ${
                              isRunning && !completedSteps.has(currentStep)
                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse'
                                : completedSteps.has(currentStep)
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-gray-600 to-gray-700'
                            }`}>
                              {completedSteps.has(currentStep) ? (
                                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white" />
                              ) : (
                                <span className="text-white text-xs sm:text-sm lg:text-base">
                                  {steps[currentStep].title.split(' ')[0]}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white mb-1">
                                {steps[currentStep].title}
                              </h2>
                              <p className="text-xs sm:text-sm lg:text-base text-purple-200">
                                {steps[currentStep].subtitle}
                              </p>
                            </div>
                          </motion.div>

                          {/* Processing Animation */}
                          {isRunning && !completedSteps.has(currentStep) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30"
                            >
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex space-x-1">
                                  <motion.div 
                                    className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full"
                                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                                  />
                                  <motion.div 
                                    className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full"
                                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                                  />
                                  <motion.div 
                                    className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"
                                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                                  />
                                </div>
                                <span className="text-xs sm:text-sm text-white font-medium">
                                  Processing {steps[currentStep].title.toLowerCase()}...
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Step Content - Better Mobile Formatting */}
                        <div className="flex-1 overflow-y-auto">
                          <div className="text-xs sm:text-sm lg:text-base text-gray-300 mb-3 sm:mb-4 lg:mb-6 leading-relaxed">
                            {steps[currentStep].content}
                          </div>
                          
                          {renderStepContent(steps[currentStep])}
                        </div>

                        {/* Step Actions - Fixed at Bottom */}
                        <div className="mt-auto pt-3 sm:pt-4 lg:pt-6 border-t border-purple-500/20 bg-black/20 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex-shrink-0">
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between items-center">
                            <div className="text-xs sm:text-sm text-gray-400 order-2 sm:order-1">
                              Step {currentStep + 1} of {steps.length}
                            </div>
                            
                            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
                              {!isRunning && !showResults && (
                                <Button
                                  onClick={() => {
                                    setCompletedSteps(prev => new Set([...prev, currentStep]));
                                    if (currentStep < steps.length - 1) {
                                      setCurrentStep(currentStep + 1);
                                    } else {
                                      setShowResults(true);
                                    }
                                  }}
                                  className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-none shadow-lg text-xs sm:text-sm py-2 sm:py-3 px-4 sm:px-6"
                                >
                                  <span className="hidden sm:inline">
                                    {currentStep === steps.length - 1 ? 'Complete Simulation' : 'Approve & Continue'}
                                  </span>
                                  <span className="sm:hidden">
                                    {currentStep === steps.length - 1 ? 'Complete' : 'Continue'}
                                  </span>
                                  <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                                </Button>
                              )}

                              {/* Consultation CTA - Show on final step or completion */}
                              {(currentStep === steps.length - 1 || showResults) && (
                                <Button
                                  onClick={() => {
                                    // Trigger lead capture with consultation context
                                    if (onSuggestedQuery) {
                                      onSuggestedQuery(`LEAD_CAPTURE:consultation:${responseData.useCase?.title || 'AI Solution'} implementation consultation`);
                                    }
                                  }}
                                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none shadow-lg text-xs sm:text-sm py-2 sm:py-3 px-4 sm:px-6"
                                >
                                  <span className="hidden sm:inline">📅 Book Implementation Consultation</span>
                                  <span className="sm:hidden">📅 Book Consultation</span>
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Simulation Complete State */}
                          {showResults && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-400/30"
                            >
                              <div className="text-center">
                                <div className="text-2xl mb-2">🎉</div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                  {responseData.useCase?.title || 'AI Solution'} Simulation Complete!
                                </h3>
                                <p className="text-green-200 text-sm mb-4">
                                  Your implementation roadmap is ready. Take the next step with a personalized consultation.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                  <Button
                                    onClick={() => {
                                      if (onSuggestedQuery) {
                                        onSuggestedQuery(`LEAD_CAPTURE:consultation:${responseData.useCase?.title || 'AI Solution'} implementation consultation - simulation completed`);
                                      }
                                    }}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none shadow-lg"
                                  >
                                    📅 Schedule Free Implementation Consultation
                                  </Button>
                                  
                                  <Button
                                    onClick={() => {
                                      if (onSuggestedQuery) {
                                        onSuggestedQuery(`LEAD_CAPTURE:roi_analysis:${responseData.useCase?.title || 'AI Solution'} ROI analysis based on simulation results`);
                                      }
                                    }}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none shadow-lg"
                                  >
                                    💰 Get Custom ROI Analysis
                                  </Button>
                                </div>

                                <div className="mt-4 text-xs text-gray-400">
                                  Based on your {responseData.useCase?.title || 'AI solution'} simulation results
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default InteractiveSimulation; 