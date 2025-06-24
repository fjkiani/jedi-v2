import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Button';
import InteractiveArchitecture from './InteractiveArchitecture';
import InteractiveSimulation from './InteractiveSimulation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const ProgressiveDisclosure = ({ responseData, expandedSections, onToggleSection, onSuggestedQuery }) => {
  const [showSimulation, setShowSimulation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  if (!responseData) return null;

  // Check if this is an application-based response
  const isApplicationBased = responseData.isApplicationBased;
  const application = responseData.industryApplication;
  const industry = responseData.industry;

  // Mobile-first section configuration
  const createMobileSections = () => {
    if (isApplicationBased) {
      return [
        {
          id: 'challenge',
          title: isMobile ? '🎯 Challenge' : '🎯 Industry Challenge',
          icon: '🎯',
          content: extractRichTextContent(application?.industryChallenge) || 'Industry-specific challenges addressed',
          priority: 1,
          collapseOnMobile: true
        },
        {
          id: 'solution',
          title: isMobile ? '⚡ Solution' : '⚡ JEDI Solution',
          icon: '⚡',
          content: extractRichTextContent(application?.jediApproach) || responseData.implementation,
          priority: 2,
          hasComponents: responseData.jediComponents?.length > 0,
          collapseOnMobile: true
        },
        {
          id: 'capabilities',
          title: isMobile ? '💡 Features' : '💡 Key Capabilities',
          icon: '💡',
          content: responseData.capabilities,
          priority: 3,
          collapseOnMobile: true
        },
        {
          id: 'results',
          title: isMobile ? '📊 Results' : '📊 Expected Results',
          icon: '📊',
          content: responseData.metrics,
          priority: 4,
          collapseOnMobile: true
        },
        {
          id: 'nextSteps',
          title: isMobile ? '🚀 Action' : '🚀 Next Steps',
          icon: '🚀',
          content: responseData.nextSteps || generateNextSteps(responseData),
          priority: 5,
          isLeadCapture: true,
          collapseOnMobile: false // Keep this expanded for CTA
        }
      ];
    } else {
      return [
        {
          id: 'overview',
          title: isMobile ? '🎯 Overview' : '🎯 Solution Overview',
          icon: '🎯',
          content: responseData.overview || responseData.summary,
          priority: 1,
          collapseOnMobile: true
        },
        {
          id: 'implementation',
          title: isMobile ? '🔧 Process' : '🔧 Implementation Flow',
          icon: '🔧',
          content: responseData.implementation,
          hasArchitecture: responseData.architecture,
          priority: 2,
          collapseOnMobile: true
        },
        {
          id: 'capabilities',
          title: isMobile ? '💡 Features' : '💡 Key Capabilities',
          icon: '💡',
          content: responseData.capabilities,
          priority: 3,
          collapseOnMobile: true
        },
        {
          id: 'metrics',
          title: isMobile ? '📊 Results' : '📊 Expected Outcomes',
          icon: '📊',
          content: responseData.metrics,
          priority: 4,
          collapseOnMobile: true
        },
        {
          id: 'nextSteps',
          title: isMobile ? '🚀 Action' : '🚀 Next Steps',
          icon: '🚀',
          content: responseData.nextSteps || generateNextSteps(responseData),
          priority: 5,
          collapseOnMobile: false
        }
      ];
    }
  };

  // Create sections based on response type and mobile state
  const sections = createMobileSections();

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

  // Mobile-optimized simulation header
  const renderSimulationHeader = () => {
    if (!responseData.isSimulation || !responseData.simulationData) return null;

    return (
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'} mb-3`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">🚀</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-semibold text-purple-900 dark:text-purple-200">
                {isMobile ? 'Interactive Simulation' : 'Interactive Implementation Simulation'}
              </h4>
              <p className="text-purple-700 dark:text-purple-300 text-xs sm:text-sm">
                {responseData.simulationData.description}
              </p>
            </div>
          </div>
          
          {!isMobile && (
            <div className="text-right">
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Focus: {responseData.simulationData.focusArea}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Duration: {responseData.simulationData.totalDuration}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={() => setShowSimulation(!showSimulation)}
            className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white ${
              isMobile ? 'px-6 py-3 text-base' : 'px-4 py-2'
            } rounded-lg transition-all duration-200`}
          >
            {showSimulation ? 
              (isMobile ? '🚀 Hide Simulation' : 'Hide Simulation') : 
              (isMobile ? '🚀 Run Simulation' : '🚀 Run Interactive Simulation')
            }
          </Button>
          
          <div className={`flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 ${
            isMobile ? 'justify-center' : ''
          }`}>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Confidence: {responseData.simulationData.confidence}</span>
            {isMobile && (
              <span className="ml-2">⏱️ {responseData.simulationData.totalDuration}</span>
            )}
          </div>
        </div>

        {/* Interactive Simulation Component */}
        <AnimatePresence>
          {showSimulation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <InteractiveSimulation 
                responseData={responseData}
                onSuggestedQuery={(query, context) => onSuggestedQuery(query, context)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Mobile-optimized lead capture actions
  const renderLeadCaptureActions = () => {
    if (!isApplicationBased) return null;

    return (
      <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2 text-sm sm:text-base">
          <span>🎯</span>
          {isMobile ? 
            `Transform ${industry?.name} Operations?` :
            `Ready to Transform Your ${industry?.name} Operations?`
          }
        </h4>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-1 sm:grid-cols-2 gap-2'}`}>
          <Button 
            size={isMobile ? "md" : "sm"}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-sm sm:text-base"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:consultation', {
              type: 'consultation',
              context: `${application?.applicationTitle} for ${industry?.name}`,
              solutions: [application?.applicationTitle],
              industry: industry?.name
            })}
          >
            {isMobile ? '📞 Consult' : '📞 Schedule Consultation'}
          </Button>
          <Button 
            size={isMobile ? "md" : "sm"}
            variant="outline" 
            className="border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-800 dark:hover:text-purple-200 hover:border-purple-400 dark:hover:border-purple-500 text-sm sm:text-base"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:roi_analysis', {
              type: 'roi_analysis',
              context: `ROI analysis for ${application?.applicationTitle}`,
              solutions: [application?.applicationTitle],
              industry: industry?.name
            })}
          >
            {isMobile ? '📊 ROI' : '📊 Request ROI Analysis'}
          </Button>
          {!isMobile && (
            <>
              <Button 
                size="sm"
                variant="outline" 
                className="border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-800 dark:hover:text-purple-200 hover:border-purple-400 dark:hover:border-purple-500 text-sm"
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
                className="border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-800 dark:hover:text-purple-200 hover:border-purple-400 dark:hover:border-purple-500 text-sm"
                onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:custom_quote', {
                  type: 'custom_quote',
                  context: `Custom quote for ${application?.applicationTitle}`,
                  solutions: [application?.applicationTitle],
                  industry: industry?.name
                })}
              >
                💡 Get Custom Quote
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Mobile-optimized general contact actions
  const renderGeneralContactActions = () => {
    const useCaseTitle = responseData.useCase?.title || 'AI Solution';
    const industryName = responseData.useCase?.industry?.name || responseData.industry?.name || 'Your Industry';
    
    return (
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2 text-sm sm:text-base">
          <span>🚀</span>
          {isMobile ? 'Implement This Solution?' : 'Interested in Implementing This Solution?'}
        </h4>
        <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-3 sm:mb-4">
          {isMobile ? 
            "Let's customize this AI solution for you." :
            "Let's discuss how we can customize this AI solution for your specific needs and requirements."
          }
        </p>
        <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-wrap gap-2'}`}>
          <Button 
            size={isMobile ? "md" : "sm"}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-sm sm:text-base"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:general_inquiry', {
              type: 'general_inquiry',
              context: `Interest in ${useCaseTitle} for ${industryName}`,
              solutions: [useCaseTitle],
              industry: industryName
            })}
          >
            {isMobile ? '💬 Contact Team' : '💬 Contact Our Team'}
          </Button>
          <Button 
            size={isMobile ? "md" : "sm"}
            variant="outline" 
            className="border-blue-300 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:text-blue-800 dark:hover:text-blue-200 hover:border-blue-400 dark:hover:border-blue-500 text-sm sm:text-base"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:demo_request', {
              type: 'demo_request',
              context: `Demo request for ${useCaseTitle}`,
              solutions: [useCaseTitle],
              industry: industryName
            })}
          >
            {isMobile ? '🎥 Demo' : '🎥 Request Demo'}
          </Button>
          <Button 
            size={isMobile ? "md" : "sm"}
            variant="outline" 
            className="border-blue-300 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:text-blue-800 dark:hover:text-blue-200 hover:border-blue-400 dark:hover:border-blue-500 text-sm sm:text-base"
            onClick={() => onSuggestedQuery && onSuggestedQuery('LEAD_CAPTURE:assessment', {
              type: 'assessment',
              context: `Free assessment for ${useCaseTitle} implementation`,
              solutions: [useCaseTitle],
              industry: industryName
            })}
          >
            {isMobile ? '📋 Assessment' : '📋 Free Assessment'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Interactive Simulation Header */}
      {renderSimulationHeader()}

      {validSections.map((section, index) => {
        const isExpanded = expandedSections.has ? expandedSections.has(section.id) : expandedSections.includes(section.id);
        // On mobile, collapse sections by default unless explicitly set to not collapse
        const shouldBeCollapsed = isMobile && section.collapseOnMobile && !isExpanded;
        
        return (
          <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => onToggleSection(section.id)}
              className={`w-full ${isMobile ? 'px-3 py-2' : 'px-4 py-3'} bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between text-left`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={`${isMobile ? 'text-base' : 'text-lg'}`}>{section.icon}</span>
                <span className={`font-medium text-gray-900 dark:text-gray-100 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {section.title}
                </span>
                {section.hasComponents && !isMobile && (
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs sm:text-sm rounded-full">
                    Components Available
                  </span>
                )}
                {section.isLeadCapture && (
                  <span className={`px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 ${isMobile ? 'text-xs' : 'text-sm'} rounded-full`}>
                    {isMobile ? 'Action' : 'Action Required'}
                  </span>
                )}
              </div>
              <ChevronDownIcon 
                className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {isExpanded && (
              <div className={`${isMobile ? 'px-3 py-3' : 'px-4 py-4'} bg-white dark:bg-gray-900`}>
                {renderContent(section)}
                
                {/* Show JEDI Components for solution section */}
                {section.id === 'solution' && section.hasComponents && renderJediComponents()}
                
                {/* Show lead capture actions for next steps section */}
                {section.id === 'nextSteps' && section.isLeadCapture && renderLeadCaptureActions()}
                
                {/* Show architecture for implementation section */}
                {section.hasArchitecture && section.id === 'implementation' && responseData.architecture && (
                  <div className="mt-3 sm:mt-4">
                    <InteractiveArchitecture architecture={responseData.architecture} />
                  </div>
                )}

                {/* Suggested Queries Grid - Mobile Optimized */}
                {section.suggestedQueries && section.suggestedQueries.length > 0 && (
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'} mt-3 sm:mt-4`}>
                    {section.suggestedQueries?.map((query, index) => (
                      <motion.button
                        key={index}
                        onClick={() => onSuggestedQuery(query)}
                        className={`${isMobile ? 'p-2 text-xs' : 'p-2 sm:p-3 text-xs sm:text-sm'} text-left text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-purple-200/50 dark:border-purple-700/50`}
                        whileHover={{ scale: isMobile ? 1.01 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {query}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Show alternative matches if available */}
      {responseData.alternativeMatches && responseData.alternativeMatches.length > 0 && (
        <div className={`mt-4 sm:mt-6 ${isMobile ? 'p-3' : 'p-4'} bg-blue-50 dark:bg-blue-900/10 rounded-lg`}>
          <h4 className={`font-medium text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
            <span>💡</span>
            {isMobile ? 'Also Consider:' : 'You might also be interested in:'}
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
                  className={`w-full text-left ${isMobile ? 'p-2' : 'p-3'} rounded-lg bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`font-medium text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {title}
                      </span>
                      {industry && (
                        <span className={`text-blue-600 dark:text-blue-400 ${isMobile ? 'text-xs' : 'text-sm'} ml-2`}>
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