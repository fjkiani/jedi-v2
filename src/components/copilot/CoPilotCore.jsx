import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import IntelligentAnalysisStep from './analysisSteps/IntelligentAnalysisStep';
import ModularSimulation from './simulation/ModularSimulation';
import { FiTerminal, FiZap, FiCheckCircle, FiPlay } from 'react-icons/fi';

const CoPilotCore = ({ 
  useCaseData, 
  selectedQuery, 
  onAnalysisComplete,
  onSuggestedQuery 
}) => {
  const { isDarkMode } = useTheme();
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [revealedSections, setRevealedSections] = useState(new Set());
  const [showFullSimulation, setShowFullSimulation] = useState(false);

  // Determine analysis type based on query content
  const getAnalysisType = (query) => {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('architecture') || queryLower.includes('technical') || queryLower.includes('system')) {
      return 'architecture';
    } else if (queryLower.includes('technology') || queryLower.includes('tech stack') || queryLower.includes('tools')) {
      return 'technology';
    } else if (queryLower.includes('metrics') || queryLower.includes('success') || queryLower.includes('kpi') || queryLower.includes('performance')) {
      return 'metrics';
    } else if (queryLower.includes('implementation') || queryLower.includes('deploy') || queryLower.includes('process')) {
      return 'implementation';
    }
    
    // Default to architecture for general queries
    return 'architecture';
  };

  // Start analysis when query is selected
  useEffect(() => {
    if (selectedQuery && useCaseData) {
      const analysisType = getAnalysisType(selectedQuery);
      startAnalysis(analysisType);
    }
  }, [selectedQuery, useCaseData]);

  const startAnalysis = (analysisType) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentAnalysis({
      type: analysisType,
      query: selectedQuery,
      startTime: Date.now()
    });

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          setRevealedSections(prev => new Set([...prev, analysisType]));
          onAnalysisComplete?.(analysisType);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const getAnalysisStepComponent = () => {
    if (!currentAnalysis || !useCaseData) return null;

    return (
      <IntelligentAnalysisStep
        useCaseData={useCaseData}
        isAnalyzing={isAnalyzing}
        progress={analysisProgress}
        analysisType={currentAnalysis.type}
        onComplete={() => {
          setIsAnalyzing(false);
          onAnalysisComplete?.(currentAnalysis.type);
        }}
      />
    );
  };

  const getStatusMessage = () => {
    if (!currentAnalysis) return '';
    
    const progress = Math.round(analysisProgress);
    
    if (progress < 20) {
      return 'Initializing analysis engine...';
    } else if (progress < 40) {
      return 'Loading solution context and requirements...';
    } else if (progress < 60) {
      return 'Processing data and identifying patterns...';
    } else if (progress < 80) {
      return 'Generating insights and recommendations...';
    } else if (progress < 100) {
      return 'Finalizing analysis and preparing results...';
    } else {
      return 'Analysis complete - presenting findings...';
    }
  };

  if (!selectedQuery || !useCaseData) {
    return null;
  }

  return (
    <>
      {/* Co-pilot Panel */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed bottom-6 right-6 z-50 max-w-md ${
        isDarkMode ? 'bg-n-8 border-n-6' : 'bg-white border-n-3'
      } border rounded-xl shadow-2xl`}
    >
      {/* Co-pilot Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-primary-1/20' : 'bg-primary-1/10'}`}
              animate={{ 
                scale: isAnalyzing ? [1, 1.1, 1] : 1,
                rotate: isAnalyzing ? [0, 5, -5, 0] : 0
              }}
              transition={{ 
                duration: 2, 
                repeat: isAnalyzing ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <FiTerminal className={`w-5 h-5 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`} />
            </motion.div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                JEDI Co-Pilot
              </h3>
              <motion.p 
                className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}
                key={getStatusMessage()}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {getStatusMessage()}
              </motion.p>
            </div>
          </div>
          
          {isAnalyzing && (
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-4 h-4 border-2 border-primary-1 border-t-transparent rounded-full animate-spin" />
              <span className={`text-xs font-medium ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                {Math.round(analysisProgress)}%
              </span>
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        {isAnalyzing && (
          <motion.div 
            className="mt-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className={`w-full h-1 rounded-full ${isDarkMode ? 'bg-n-7' : 'bg-n-2'}`}>
              <motion.div
                className="h-1 bg-gradient-to-r from-primary-1 to-primary-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Analysis Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {getAnalysisStepComponent()}
        </AnimatePresence>
      </div>

      {/* Launch Full Simulation Button */}
      {!isAnalyzing && currentAnalysis && (
        <div className="p-4 border-t border-n-6">
          <motion.button
            onClick={() => setShowFullSimulation(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiPlay className="w-4 h-4" />
            Launch Full Simulation
          </motion.button>
        </div>
      )}
    </motion.div>

    {/* Full Simulation Modal */}
    {showFullSimulation && (
      <FullSimulationModal
        useCaseData={useCaseData}
        onClose={() => setShowFullSimulation(false)}
        onSuggestedQuery={onSuggestedQuery}
      />
    )}
    </>
  );
};

// Full Simulation Modal
const FullSimulationModal = ({ useCaseData, onClose, onSuggestedQuery }) => {
  const { isDarkMode } = useTheme();
  
  // Transform useCaseData to responseData format for simulation
  const responseData = {
    useCase: useCaseData,
    industry: useCaseData?.industry,
    simulationData: {
      title: `${useCaseData?.title || 'AI Solution'} Implementation Simulation`,
      description: 'Interactive walkthrough of your AI solution implementation'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full h-full">
        <ModularSimulation
          responseData={responseData}
          onSuggestedQuery={onSuggestedQuery}
          onComplete={onClose}
        />
      </div>
    </motion.div>
  );
};

export default CoPilotCore;
