import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  FiCheckCircle, FiClock, FiArrowRight, FiChevronDown, 
  FiChevronUp, FiPlay, FiPause, FiRefreshCw 
} from 'react-icons/fi';

const JediImplementationTimeline = ({ 
  phases = [],
  variant = 'default',
  interactive = true,
  className = "",
  onPhaseComplete = null
}) => {
  const { isDarkMode } = useTheme();
  const [expandedPhases, setExpandedPhases] = useState(new Set());
  const [completedPhases, setCompletedPhases] = useState(new Set());
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePhase = (phaseIndex) => {
    if (!interactive) return;
    
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseIndex)) {
      newExpanded.delete(phaseIndex);
    } else {
      newExpanded.add(phaseIndex);
    }
    setExpandedPhases(newExpanded);
  };

  const completePhase = (phaseIndex) => {
    if (!interactive) return;
    
    const newCompleted = new Set(completedPhases);
    newCompleted.add(phaseIndex);
    setCompletedPhases(newCompleted);
    
    if (onPhaseComplete) {
      onPhaseComplete(phases[phaseIndex], phaseIndex);
    }
  };

  const startTimeline = () => {
    setIsPlaying(true);
    setCurrentPhase(0);
    setCompletedPhases(new Set());
  };

  const pauseTimeline = () => {
    setIsPlaying(false);
  };

  const resetTimeline = () => {
    setIsPlaying(false);
    setCurrentPhase(0);
    setCompletedPhases(new Set());
    setExpandedPhases(new Set());
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          container: 'space-y-2',
          phase: 'p-3 rounded-lg',
          connector: 'h-4'
        };
      case 'detailed':
        return {
          container: 'space-y-6',
          phase: 'p-6 rounded-xl',
          connector: 'h-8'
        };
      case 'card':
        return {
          container: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
          phase: 'p-4 rounded-lg border',
          connector: 'hidden'
        };
      default:
        return {
          container: 'space-y-4',
          phase: 'p-4 rounded-lg',
          connector: 'h-6'
        };
    }
  };

  const styles = getVariantStyles();

  if (variant === 'card') {
    return (
      <div className={`${styles.container} ${className}`}>
        {phases.map((phase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${styles.phase} ${
              isDarkMode 
                ? 'bg-n-7 border-n-6 hover:border-primary-1/50' 
                : 'bg-n-1 border-n-3 hover:border-primary-1/50'
            } transition-all hover:shadow-lg`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                completedPhases.has(index)
                  ? 'bg-green-500 text-white'
                  : currentPhase === index
                  ? 'bg-primary-1 text-white'
                  : isDarkMode
                  ? 'bg-n-6 text-n-3'
                  : 'bg-n-2 text-n-6'
              }`}>
                {completedPhases.has(index) ? (
                  <FiCheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                  {phase.title}
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                  {phase.duration}
                </p>
              </div>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
              {phase.description}
            </p>
            {phase.deliverables && (
              <div className="mt-3">
                <h5 className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                  Deliverables:
                </h5>
                <ul className="space-y-1">
                  {phase.deliverables.map((deliverable, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary-1 rounded-full"></div>
                      <span className={`text-xs ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                        {deliverable}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Timeline Controls */}
      {interactive && (
        <div className={`flex items-center gap-3 mb-6 p-4 rounded-lg ${
          isDarkMode ? 'bg-n-7 border border-n-6' : 'bg-n-1 border border-n-3'
        }`}>
          <button
            onClick={isPlaying ? pauseTimeline : startTimeline}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-primary-1 text-white hover:bg-primary-2'
                : 'bg-primary-1 text-white hover:bg-primary-2'
            }`}
          >
            {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Start'} Timeline
          </button>
          <button
            onClick={resetTimeline}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-n-6 text-n-2 hover:bg-n-5'
                : 'bg-n-2 text-n-7 hover:bg-n-3'
            }`}
          >
            <FiRefreshCw className="w-4 h-4" />
            Reset
          </button>
          <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
            Phase {currentPhase + 1} of {phases.length}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className={`relative ${styles.container}`}>
        {phases.map((phase, index) => (
          <div key={index} className="relative">
            {/* Phase Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${styles.phase} ${
                isDarkMode 
                  ? 'bg-n-7 border border-n-6' 
                  : 'bg-n-1 border border-n-3'
              } transition-all hover:shadow-lg`}
            >
              <div 
                className="flex items-start gap-4 cursor-pointer"
                onClick={() => togglePhase(index)}
              >
                {/* Phase Number/Status */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                  completedPhases.has(index)
                    ? 'bg-green-500 text-white'
                    : currentPhase === index
                    ? 'bg-primary-1 text-white'
                    : isDarkMode
                    ? 'bg-n-6 text-n-3'
                    : 'bg-n-2 text-n-6'
                }`}>
                  {completedPhases.has(index) ? (
                    <FiCheckCircle className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Phase Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                      {phase.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                        {phase.duration}
                      </span>
                      {interactive && (
                        <button className="text-primary-1 hover:text-primary-2">
                          {expandedPhases.has(index) ? (
                            <FiChevronUp className="w-5 h-5" />
                          ) : (
                            <FiChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                    {phase.description}
                  </p>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedPhases.has(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-4"
                      >
                        {phase.deliverables && (
                          <div>
                            <h5 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                              Key Deliverables:
                            </h5>
                            <ul className="space-y-2">
                              {phase.deliverables.map((deliverable, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-primary-1 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                                    {deliverable}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {phase.technologies && (
                          <div>
                            <h5 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                              Technologies Used:
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {phase.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    isDarkMode
                                      ? 'bg-n-6 text-n-2'
                                      : 'bg-n-2 text-n-7'
                                  }`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {phase.successMetrics && (
                          <div>
                            <h5 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                              Success Metrics:
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                              {phase.successMetrics.map((metric, idx) => (
                                <div key={idx} className={`p-2 rounded ${
                                  isDarkMode ? 'bg-n-6' : 'bg-n-2'
                                }`}>
                                  <div className={`text-sm font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                    {metric.value}
                                  </div>
                                  <div className={`text-xs ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                                    {metric.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {interactive && !completedPhases.has(index) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              completePhase(index);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isDarkMode
                                ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            <FiCheckCircle className="w-4 h-4" />
                            Mark as Complete
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Connector Line */}
            {index < phases.length - 1 && (
              <div className={`${styles.connector} w-0.5 mx-6 ${
                isDarkMode ? 'bg-n-6' : 'bg-n-3'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Timeline Summary */}
      <div className={`mt-8 p-4 rounded-lg ${
        isDarkMode ? 'bg-n-7 border border-n-6' : 'bg-n-1 border border-n-3'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              Implementation Progress
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
              {completedPhases.size} of {phases.length} phases completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-32 h-2 rounded-full ${
              isDarkMode ? 'bg-n-6' : 'bg-n-3'
            }`}>
              <div 
                className="h-2 bg-primary-1 rounded-full transition-all duration-500"
                style={{ width: `${(completedPhases.size / phases.length) * 100}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
              {Math.round((completedPhases.size / phases.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JediImplementationTimeline;

