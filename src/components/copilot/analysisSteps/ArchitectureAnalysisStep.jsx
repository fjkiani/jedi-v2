import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FiServer, FiCpu, FiDatabase, FiGitBranch, FiCheckCircle } from 'react-icons/fi';
import ProgressiveReveal from '../ui/ProgressiveReveal';
import HighlightingCard from '../ui/HighlightingCard';

const ArchitectureAnalysisStep = ({ 
  useCaseData, 
  isAnalyzing, 
  progress, 
  onComplete 
}) => {
  const { isDarkMode } = useTheme();
  const [revealedComponents, setRevealedComponents] = useState(new Set());
  const [currentComponent, setCurrentComponent] = useState(null);

  const architecture = useCaseData?.architecture;
  const components = architecture?.components || [];
  const flow = architecture?.flow || [];

  // Progressive reveal of components based on analysis progress
  useEffect(() => {
    if (!isAnalyzing || components.length === 0) return;

    const revealInterval = setInterval(() => {
      setRevealedComponents(prev => {
        const newRevealed = new Set(prev);
        const nextIndex = newRevealed.size;
        
        if (nextIndex < components.length) {
          newRevealed.add(nextIndex);
          setCurrentComponent(components[nextIndex]);
          
          // Auto-clear current component after 2 seconds
          setTimeout(() => setCurrentComponent(null), 2000);
        } else {
          clearInterval(revealInterval);
          onComplete?.();
        }
        
        return newRevealed;
      });
    }, 800);

    return () => clearInterval(revealInterval);
  }, [isAnalyzing, components, onComplete]);

  const getComponentIcon = (componentName) => {
    const name = componentName.toLowerCase();
    if (name.includes('database') || name.includes('storage')) return FiDatabase;
    if (name.includes('api') || name.includes('service')) return FiServer;
    if (name.includes('ai') || name.includes('model') || name.includes('ml')) return FiCpu;
    if (name.includes('workflow') || name.includes('pipeline')) return FiGitBranch;
    return FiServer;
  };

  const getComponentStatus = (index) => {
    if (revealedComponents.has(index)) {
      if (currentComponent === components[index]) return 'highlighted';
      return 'revealed';
    }
    return 'hidden';
  };

  if (!architecture) {
    return (
      <div className={`text-center py-8 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
        <FiServer className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No architecture data available for analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Architecture Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <FiServer className={`w-5 h-5 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`} />
          <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            System Architecture
          </h4>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
          {architecture.description || 'Analyzing system components and their interactions...'}
        </p>
      </motion.div>

      {/* Components Analysis */}
      <div className="space-y-3">
        <h5 className={`font-medium text-sm ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
          Component Analysis ({revealedComponents.size}/{components.length})
        </h5>
        
        <ProgressiveReveal
          items={components}
          revealedCount={revealedComponents.size}
          renderItem={(component, index) => {
            const Icon = getComponentIcon(component.name);
            const status = getComponentStatus(index);
            
            return (
              <HighlightingCard
                key={component.id || index}
                isHighlighted={status === 'highlighted'}
                isRevealed={status === 'revealed'}
                className={`p-3 rounded-lg border transition-all duration-500 ${
                  status === 'hidden' 
                    ? 'opacity-0 transform translate-y-2' 
                    : status === 'highlighted'
                    ? `${isDarkMode ? 'bg-primary-1/10 border-primary-1/50' : 'bg-primary-1/5 border-primary-1/30'} shadow-lg scale-105`
                    : `${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
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
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h6 className={`font-medium text-sm ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                        {component.name}
                      </h6>
                      {status === 'revealed' && (
                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    
                    <p className={`text-xs ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                      {component.description}
                    </p>
                    
                    {component.details && (
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                        {component.details}
                      </p>
                    )}
                  </div>
                </div>
              </HighlightingCard>
            );
          }}
        />
      </div>

      {/* Flow Analysis */}
      {flow.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <FiGitBranch className={`w-5 h-5 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`} />
            <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              Implementation Flow
            </h4>
          </div>
          
          <div className="space-y-2">
            {flow.slice(0, Math.min(3, flow.length)).map((step, index) => (
              <div key={step.id || index} className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  isDarkMode ? 'bg-n-6 text-n-3' : 'bg-n-2 text-n-6'
                }`}>
                  {step.step || index + 1}
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                  {step.description}
                </p>
              </div>
            ))}
            {flow.length > 3 && (
              <p className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                +{flow.length - 3} more steps...
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ArchitectureAnalysisStep;

