import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Button';
import InteractiveArchitecture from './InteractiveArchitecture';
import InteractiveSimulation from './InteractiveSimulation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const ProgressiveDisclosure = ({ responseData, expandedSections, onToggleSection, onSuggestedQuery }) => {
  const [showSimulation, setShowSimulation] = useState(false);
  
  if (!responseData) return null;

  // Check if this is an application-based response
  const isApplicationBased = responseData.isApplicationBased;
  const application = responseData.industryApplication;
  const industry = responseData.industry;

  // Create sections based on response type
  const sections = isApplicationBased ? [
    {
      id: 'challenge',
      title: '🎯 Industry Challenge',
      icon: '🎯',
      content: extractRichTextContent(application?.industryChallenge) || 'Industry-specific challenges addressed',
      priority: 1
    },
    {
      id: 'solution',
      title: '⚡ JEDI Solution',
      icon: '⚡',
      content: extractRichTextContent(application?.jediApproach) || responseData.implementation,
      priority: 2,
      hasComponents: responseData.jediComponents?.length > 0
    },
    {
      id: 'capabilities',
      title: '💡 Key Capabilities',
      icon: '💡',
      content: responseData.capabilities,
      priority: 3
    },
    {
      id: 'results',
      title: '📊 Expected Results',
      icon: '📊',
      content: responseData.metrics,
      priority: 4
    },
    {
      id: 'nextSteps',
      title: '🚀 Next Steps',
      icon: '🚀',
      content: responseData.nextSteps || generateNextSteps(responseData),
      priority: 5,
      isLeadCapture: true
    }
  ] : [
    {
      id: 'overview',
      title: '🎯 Solution Overview',
      icon: '🎯',
      content: responseData.overview || responseData.summary,
      priority: 1
    },
    {
      id: 'implementation',
      title: '🔧 Implementation Flow',
      icon: '🔧',
      content: responseData.implementation,
      hasArchitecture: responseData.architecture,
      priority: 2
    },
    {
      id: 'capabilities',
      title: '💡 Key Capabilities',
      icon: '💡',
      content: responseData.capabilities,
      priority: 3
    },
    {
      id: 'metrics',
      title: '📊 Expected Outcomes',
      icon: '📊',
      content: responseData.metrics,
      priority: 4
    },
    {
      id: 'nextSteps',
      title: '🚀 Next Steps',
      icon: '🚀',
      content: responseData.nextSteps || generateNextSteps(responseData),
      priority: 5
    }
  ];

  // Filter sections with content
  const validSections = sections.filter(section => section.content);

  // Helper function to extract rich text content
  function extractRichTextContent(richTextObj) {
    if (!richTextObj || !richTextObj.raw) return '';
    try {
      const content = richTextObj.raw.children
        .map(child => child.children?.map(grandchild => grandchild.text).join('') || '')
        .join('\n');
      return content;
    } catch (e) {
      return '';
    }
  }

  const generateNextSteps = (data) => {
    const steps = [];
    
    if (data.useCase) {
      steps.push(`Explore the ${data.useCase.title} use case in detail`);
    }
    
    if (data.architecture) {
      steps.push("Review the technical architecture requirements");
    }
    
    if (data.implementation) {
      steps.push("Assess implementation complexity for your environment");
    }
    
    steps.push("Schedule a consultation to discuss your specific needs");
    
    return steps;
  };

  const renderContent = (section) => {
    if (!section.content) return null;

    // Handle different content types
    if (Array.isArray(section.content)) {
      return (
        <ul className="space-y-2">
          {section.content.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {typeof item === 'string' ? item : item.name || item.title || JSON.stringify(item)}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    // Handle JSON objects with proper formatting
    if (typeof section.content === 'object' && section.content !== null) {
      return (
        <div className="space-y-4">
          {Object.entries(section.content).map(([key, value]) => (
            <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 capitalize">
                {key.replace(/_/g, ' ')}
              </h5>
              {Array.isArray(value) ? (
                <ul className="space-y-1">
                  {value.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 text-lg">▸</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {typeof item === 'string' ? item : JSON.stringify(item)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {section.content}
      </div>
    );
  };

  const renderJediComponents = () => {
    if (!responseData.jediComponents || responseData.jediComponents.length === 0) return null;

    return (
      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
        <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2">
          <span>⚙️</span>
          JEDI Components Used
        </h4>
        <div className="space-y-2">
          {responseData.jediComponents.map((component, index) => (
            <div key={component.id || index} className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <span className="font-medium text-sm text-purple-800 dark:text-purple-200">
                  {typeof component.name === 'string' ? component.name : JSON.stringify(component.name)}
                </span>
                {component.tagline && (
                  <p className="text-lg text-purple-600 dark:text-purple-300">
                    {typeof component.tagline === 'string' ? component.tagline : JSON.stringify(component.tagline)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLeadCaptureActions = () => {
    if (!isApplicationBased) return null;

    return (
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
          <span>🎯</span>
          Ready to Transform Your {industry?.name} Operations?
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button 
            size="sm" 
            className="text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:consultation', {
              type: 'consultation',
              context: `${application?.applicationTitle} for ${industry?.name}`,
              solutions: [application?.applicationTitle],
              industry: industry?.name
            })}
          >
            📞 Schedule Consultation
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-lg border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-800 dark:hover:text-purple-200 hover:border-purple-400 dark:hover:border-purple-500"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:roi_analysis', {
              type: 'roi_analysis',
              context: `ROI analysis for ${application?.applicationTitle}`,
              solutions: [application?.applicationTitle],
              industry: industry?.name
            })}
          >
            📊 Request ROI Analysis
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-lg border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-800 dark:hover:text-purple-200 hover:border-purple-400 dark:hover:border-purple-500"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:case_study', {
              type: 'case_study',
              context: `Case study request for ${application?.applicationTitle}`,
              solutions: [application?.applicationTitle],
              industry: industry?.name
            })}
          >
            📋 Download Case Study
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-lg border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-800 dark:hover:text-purple-200 hover:border-purple-400 dark:hover:border-purple-500"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:custom_quote', {
              type: 'custom_quote',
              context: `Custom quote for ${application?.applicationTitle}`,
              solutions: [application?.applicationTitle],
              industry: industry?.name
            })}
          >
            💡 Get Custom Quote
          </Button>
        </div>
      </div>
    );
  };

  // Add general contact section for all responses
  const renderGeneralContactActions = () => {
    const useCaseTitle = responseData.useCase?.title || 'AI Solution';
    const industryName = responseData.useCase?.industry?.name || responseData.industry?.name || 'Your Industry';
    
    return (
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
          <span>🚀</span>
          Interested in Implementing This Solution?
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
          Let's discuss how we can customize this AI solution for your specific needs and requirements.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            className="text-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:general_inquiry', {
              type: 'general_inquiry',
              context: `Interest in ${useCaseTitle} for ${industryName}`,
              solutions: [useCaseTitle],
              industry: industryName
            })}
          >
            💬 Contact Our Team
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-lg border-blue-300 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:text-blue-800 dark:hover:text-blue-200 hover:border-blue-400 dark:hover:border-blue-500"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:demo_request', {
              type: 'demo_request',
              context: `Demo request for ${useCaseTitle}`,
              solutions: [useCaseTitle],
              industry: industryName
            })}
          >
            🎥 Request Demo
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-lg border-blue-300 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:text-blue-800 dark:hover:text-blue-200 hover:border-blue-400 dark:hover:border-blue-500"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:assessment', {
              type: 'assessment',
              context: `Free assessment for ${useCaseTitle} implementation`,
              solutions: [useCaseTitle],
              industry: industryName
            })}
          >
            📋 Free Assessment
          </Button>
        </div>
      </div>
    );
  };

  // Simulation header for interactive experience
  const renderSimulationHeader = () => {
    if (!responseData.isSimulation || !responseData.simulationData) return null;

    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-200">
                Interactive Implementation Simulation
              </h4>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                {responseData.simulationData.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-600 dark:text-purple-400">
              Focus: {responseData.simulationData.focusArea}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              Duration: {responseData.simulationData.totalDuration}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={() => setShowSimulation(!showSimulation)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            {showSimulation ? 'Hide Simulation' : '🚀 Run Interactive Simulation'}
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Confidence: {responseData.simulationData.confidence}</span>
          </div>
        </div>

        {/* Interactive Simulation Component */}
        <AnimatePresence>
          {showSimulation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <InteractiveSimulation
                responseData={responseData}
                onSuggestedQuery={onSuggestedQuery}
                onComplete={() => {
                  setShowSimulation(false);
                  // You could trigger lead capture here
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Interactive Simulation Header */}
      {renderSimulationHeader()}

      {validSections.map((section, index) => {
        const isExpanded = expandedSections.has ? expandedSections.has(section.id) : expandedSections.includes(section.id);
        
        return (
          <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => onToggleSection(section.id)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {section.title}
                </span>
                {section.hasComponents && (
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-lg rounded-full">
                    Components Available
                  </span>
                )}
                {section.isLeadCapture && (
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-lg rounded-full">
                    Action Required
                  </span>
                )}
              </div>
              <ChevronDownIcon 
                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {isExpanded && (
              <div className="px-4 py-4 bg-white dark:bg-gray-900">
                {renderContent(section)}
                
                {/* Show JEDI Components for solution section */}
                {section.id === 'solution' && section.hasComponents && renderJediComponents()}
                
                {/* Show lead capture actions for next steps section */}
                {section.id === 'nextSteps' && section.isLeadCapture && renderLeadCaptureActions()}
                
                {/* Show architecture for implementation section */}
                {section.hasArchitecture && section.id === 'implementation' && responseData.architecture && (
                  <div className="mt-4">
                    <InteractiveArchitecture architecture={responseData.architecture} />
                  </div>
                )}

                {/* Suggested Queries Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {section.suggestedQueries?.map((query, index) => (
                    <motion.button
                      key={index}
                      onClick={() => onSuggestedQuery(query)}
                      className="p-2 sm:p-3 text-left text-xs sm:text-sm text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-purple-200/50 dark:border-purple-700/50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {query}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Show alternative matches if available */}
      {responseData.alternativeMatches && responseData.alternativeMatches.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
            <span>💡</span>
            You might also be interested in:
          </h4>
          <div className="space-y-2">
            {responseData.alternativeMatches.map((match, index) => {
              const title = isApplicationBased ? 
                match.application?.applicationTitle : 
                match.useCase?.title;
              const industry = isApplicationBased ? 
                match.industry?.name : 
                match.useCase?.industry?.name;
              
              const query = isApplicationBased ?
                `Tell me about ${title}` :
                `How does ${title} work?`;
              
              return (
                <button
                  key={index}
                  onClick={() => onSuggestedQuery && onSuggestedQuery(query)}
                  className="w-full text-left p-3 rounded-lg bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200">
                        {title}
                      </span>
                      {industry && (
                        <span className="text-blue-600 dark:text-blue-400 text-sm ml-2">
                          • {industry}
                        </span>
                      )}
                    </div>
                    <span className="text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Show general contact actions */}
      {renderGeneralContactActions()}

    </div>
  );
};

export default ProgressiveDisclosure; 