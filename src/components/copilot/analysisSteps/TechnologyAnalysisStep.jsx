import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FiCpu, FiCode, FiDatabase, FiCloud, FiCheckCircle } from 'react-icons/fi';
import ProgressiveReveal from '../ui/ProgressiveReveal';
import HighlightingCard from '../ui/HighlightingCard';

const TechnologyAnalysisStep = ({ 
  useCaseData, 
  isAnalyzing, 
  progress, 
  onComplete 
}) => {
  const { isDarkMode } = useTheme();
  const [revealedTechnologies, setRevealedTechnologies] = useState(new Set());
  const [currentTechnology, setCurrentTechnology] = useState(null);

  const technologies = useCaseData?.technologies || [];

  // Progressive reveal of technologies based on analysis progress
  useEffect(() => {
    if (!isAnalyzing || technologies.length === 0) return;

    const revealInterval = setInterval(() => {
      setRevealedTechnologies(prev => {
        const newRevealed = new Set(prev);
        const nextIndex = newRevealed.size;
        
        if (nextIndex < technologies.length) {
          newRevealed.add(nextIndex);
          setCurrentTechnology(technologies[nextIndex]);
          
          // Auto-clear current technology after 2 seconds
          setTimeout(() => setCurrentTechnology(null), 2000);
        } else {
          clearInterval(revealInterval);
          onComplete?.();
        }
        
        return newRevealed;
      });
    }, 600);

    return () => clearInterval(revealInterval);
  }, [isAnalyzing, technologies, onComplete]);

  const getTechnologyIcon = (techName) => {
    const name = techName.toLowerCase();
    if (name.includes('ai') || name.includes('ml') || name.includes('gpt') || name.includes('claude')) return FiCpu;
    if (name.includes('database') || name.includes('postgres') || name.includes('mongo')) return FiDatabase;
    if (name.includes('cloud') || name.includes('aws') || name.includes('azure')) return FiCloud;
    return FiCode;
  };

  const getTechnologyCategory = (techName) => {
    const name = techName.toLowerCase();
    if (name.includes('ai') || name.includes('ml') || name.includes('gpt') || name.includes('claude')) return 'AI/ML';
    if (name.includes('database') || name.includes('postgres') || name.includes('mongo')) return 'Database';
    if (name.includes('cloud') || name.includes('aws') || name.includes('azure')) return 'Cloud';
    if (name.includes('react') || name.includes('node') || name.includes('python')) return 'Development';
    return 'Infrastructure';
  };

  const getTechnologyStatus = (index) => {
    if (revealedTechnologies.has(index)) {
      if (currentTechnology === technologies[index]) return 'highlighted';
      return 'revealed';
    }
    return 'hidden';
  };

  if (technologies.length === 0) {
    return (
      <div className={`text-center py-8 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
        <FiCpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No technology data available for analysis.</p>
      </div>
    );
  }

  // Group technologies by category
  const groupedTechnologies = technologies.reduce((acc, tech, index) => {
    const category = getTechnologyCategory(tech.name);
    if (!acc[category]) acc[category] = [];
    acc[category].push({ ...tech, originalIndex: index });
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Technology Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <FiCpu className={`w-5 h-5 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`} />
          <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            Technology Stack Analysis
          </h4>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
          Evaluating {technologies.length} technologies across {Object.keys(groupedTechnologies).length} categories
        </p>
      </motion.div>

      {/* Technology Categories */}
      {Object.entries(groupedTechnologies).map(([category, techs]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h5 className={`font-medium text-sm ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
            {category} ({techs.filter(tech => revealedTechnologies.has(tech.originalIndex)).length}/{techs.length})
          </h5>
          
          <div className="grid grid-cols-1 gap-2">
            {techs.map((tech) => {
              const Icon = getTechnologyIcon(tech.name);
              const status = getTechnologyStatus(tech.originalIndex);
              
              return (
                <HighlightingCard
                  key={tech.id || tech.originalIndex}
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
                  <div className="flex items-center space-x-3">
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
                      <div className="flex items-center space-x-2">
                        <h6 className={`font-medium text-sm ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                          {tech.name}
                        </h6>
                        {status === 'revealed' && (
                          <FiCheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      
                      {tech.description && (
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                          {tech.description}
                        </p>
                      )}
                    </div>
                  </div>
                </HighlightingCard>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Technology Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <FiCheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            Analysis Complete
          </h4>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
          Successfully analyzed {technologies.length} technologies across {Object.keys(groupedTechnologies).length} categories. 
          Technology stack is optimized for scalability and performance.
        </p>
      </motion.div>
    </div>
  );
};

export default TechnologyAnalysisStep;

