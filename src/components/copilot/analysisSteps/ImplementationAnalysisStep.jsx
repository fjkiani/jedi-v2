import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FiSettings, FiClock, FiUsers, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import ProgressiveReveal from '../ui/ProgressiveReveal';
import HighlightingCard from '../ui/HighlightingCard';

const ImplementationAnalysisStep = ({ 
  useCaseData, 
  isAnalyzing, 
  progress, 
  onComplete 
}) => {
  const { isDarkMode } = useTheme();
  const [revealedSteps, setRevealedSteps] = useState(new Set());
  const [currentStep, setCurrentStep] = useState(null);

  const implementation = useCaseData?.implementation;
  const architecture = useCaseData?.architecture;
  const flow = architecture?.flow || [];

  // Progressive reveal of implementation steps based on analysis progress
  useEffect(() => {
    if (!isAnalyzing || flow.length === 0) return;

    const revealInterval = setInterval(() => {
      setRevealedSteps(prev => {
        const newRevealed = new Set(prev);
        const nextIndex = newRevealed.size;
        
        if (nextIndex < flow.length) {
          newRevealed.add(nextIndex);
          setCurrentStep(flow[nextIndex]);
          
          // Auto-clear current step after 2 seconds
          setTimeout(() => setCurrentStep(null), 2000);
        } else {
          clearInterval(revealInterval);
          onComplete?.();
        }
        
        return newRevealed;
      });
    }, 1200);

    return () => clearInterval(revealInterval);
  }, [isAnalyzing, flow, onComplete]);

  const getStepIcon = (stepDescription) => {
    const desc = stepDescription.toLowerCase();
    if (desc.includes('setup') || desc.includes('install') || desc.includes('configure')) return FiSettings;
    if (desc.includes('test') || desc.includes('validate') || desc.includes('verify')) return FiCheckCircle;
    if (desc.includes('deploy') || desc.includes('launch') || desc.includes('go-live')) return FiArrowRight;
    if (desc.includes('team') || desc.includes('user') || desc.includes('training')) return FiUsers;
    return FiClock;
  };

  const getStepStatus = (index) => {
    if (revealedSteps.has(index)) {
      if (currentStep === flow[index]) return 'highlighted';
      return 'revealed';
    }
    return 'hidden';
  };

  if (flow.length === 0) {
    return (
      <div className={`text-center py-8 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
        <FiSettings className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No implementation data available for analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Implementation Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <FiSettings className={`w-5 h-5 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`} />
          <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            Implementation Strategy
          </h4>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
          Analyzing {flow.length}-step implementation process for {useCaseData?.title || 'AI Solution'}
        </p>
      </motion.div>

      {/* Implementation Requirements */}
      {implementation?.requirements && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <FiUsers className={`w-5 h-5 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`} />
            <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              Key Requirements
            </h4>
          </div>
          <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
            {implementation.requirements.slice(0, 4).map((req, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-primary-1 mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
            {implementation.requirements.length > 4 && (
              <li className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                +{implementation.requirements.length - 4} more requirements...
              </li>
            )}
          </ul>
        </motion.div>
      )}

      {/* Implementation Flow Steps */}
      <div className="space-y-3">
        <h5 className={`font-medium text-sm ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
          Implementation Steps ({revealedSteps.size}/{flow.length})
        </h5>
        
        <div className="space-y-2">
          {flow.map((step, index) => {
            const Icon = getStepIcon(step.description);
            const status = getStepStatus(index);
            
            return (
              <HighlightingCard
                key={step.id || index}
                isHighlighted={status === 'highlighted'}
                isRevealed={status === 'revealed'}
                className={`p-4 rounded-lg border transition-all duration-500 ${
                  status === 'hidden' 
                    ? 'opacity-0 transform translate-y-2' 
                    : status === 'highlighted'
                    ? `${isDarkMode ? 'bg-primary-1/10 border-primary-1/50' : 'bg-primary-1/5 border-primary-1/30'} shadow-lg scale-105`
                    : `${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    status === 'highlighted' 
                      ? 'bg-primary-1/20 text-primary-1' 
                      : isDarkMode ? 'bg-n-6 text-n-3' : 'bg-n-2 text-n-6'
                  }`}>
                    {step.step || index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-1.5 rounded-lg ${
                        status === 'highlighted' 
                          ? 'bg-primary-1/20' 
                          : isDarkMode ? 'bg-n-6' : 'bg-n-2'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          status === 'highlighted' 
                            ? 'text-primary-1' 
                            : isDarkMode ? 'text-n-3' : 'text-n-5'
                        }`} />
                      </div>
                      
                      <h6 className={`font-medium text-sm ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                        {step.description}
                      </h6>
                      
                      {status === 'revealed' && (
                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    
                    {step.details && (
                      <p className={`text-xs ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                        {step.details}
                      </p>
                    )}
                  </div>
                </div>
              </HighlightingCard>
            );
          })}
        </div>
      </div>

      {/* Success Metrics */}
      {implementation?.success_metrics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <FiCheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`} />
            <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              Success Criteria
            </h4>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
            {implementation.success_metrics}
          </p>
        </motion.div>
      )}

      {/* Integration Points */}
      {implementation?.integration_points && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <FiArrowRight className={`w-5 h-5 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`} />
            <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              Integration Points
            </h4>
          </div>
          <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
            {implementation.integration_points.slice(0, 3).map((point, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-primary-1 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
            {implementation.integration_points.length > 3 && (
              <li className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                +{implementation.integration_points.length - 3} more integration points...
              </li>
            )}
          </ul>
        </motion.div>
      )}

      {/* Implementation Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <FiCheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            Implementation Analysis Complete
          </h4>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
          Successfully analyzed {flow.length}-step implementation process. 
          All requirements, integration points, and success criteria have been validated for {useCaseData?.title || 'AI Solution'}.
        </p>
      </motion.div>
    </div>
  );
};

export default ImplementationAnalysisStep;

