import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiZap, FiLoader } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

/**
 * QueryResponse Component
 * Displays AI-like responses with typing animation and contextual actions
 */
const QueryResponse = ({ 
  response, 
  isLoading, 
  onActionClick,
  className = "" 
}) => {
  const { isDarkMode } = useTheme();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const typingIntervalRef = useRef(null);

  // Typing animation effect
  useEffect(() => {
    if (!response?.text || isLoading) {
      setDisplayedText('');
      setIsTyping(false);
      setShowActions(false);
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    setShowActions(false);

    const text = response.text;
    let currentIndex = 0;

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        setShowActions(true);
        clearInterval(typingIntervalRef.current);
      }
    }, 30); // Typing speed

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [response?.text, isLoading]);

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'} ${className}`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20' : 'bg-primary-1/10'}`}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FiLoader className="text-primary-1" size={16} />
            </motion.div>
          </div>
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm font-medium ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}
            >
              🤔 Analyzing your requirements...
            </motion.div>
            <div className="flex space-x-1 mt-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-n-4' : 'bg-n-5'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!response) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'} ${className}`}
    >
      {/* AI Response Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-primary-1/20' : 'bg-primary-1/10'}`}>
          <FiZap className="text-primary-1" size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
              AI Co-Pilot Analysis
            </span>
            {response.confidence && (
              <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                {Math.round(response.confidence * 100)}% confidence
              </span>
            )}
          </div>
          
          {/* Response Text with Typing Animation */}
          <div className={`text-sm leading-relaxed ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-primary-1 ml-1"
              />
            )}
          </div>

          {/* Intent and Topics Tags */}
          {response.intent && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-1'}`}>
                {response.intent.charAt(0).toUpperCase() + response.intent.slice(1)} Query
              </span>
              {response.topics?.slice(0, 2).map((topic, index) => (
                <span 
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-n-7 text-n-4' : 'bg-n-2 text-n-6'}`}
                >
                  {topic.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contextual Action Buttons */}
      <AnimatePresence>
        {showActions && response.actions && response.actions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-3"
          >
            <div className={`text-xs font-medium ${isDarkMode ? 'text-n-4' : 'text-n-5'} mb-2`}>
              Recommended next steps:
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {response.actions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleActionClick(action)}
                  className={`
                    group flex items-center p-3 rounded-lg border text-left transition-all
                    hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                    ${isDarkMode 
                      ? 'bg-n-8 border-n-6 hover:border-primary-1/50 hover:bg-n-7' 
                      : 'bg-n-1 border-n-3 hover:border-primary-1/50 hover:bg-white'
                    }
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                      {action.label}
                    </div>
                    {action.description && (
                      <div className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                        {action.description}
                      </div>
                    )}
                  </div>
                  <FiArrowRight 
                    className={`
                      w-4 h-4 transition-all group-hover:translate-x-1
                      ${isDarkMode ? 'text-n-4 group-hover:text-primary-1' : 'text-n-5 group-hover:text-primary-1'}
                    `} 
                  />
                </motion.button>
              ))}
              
              {/* Always show a "Run Full Simulation" option if not already present */}
              {!response.actions.some(action => action.label.includes('Full Simulation')) && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: response.actions.length * 0.1 }}
                  onClick={() => handleActionClick({
                    type: 'simulation',
                    simulationType: 'implementation',
                    label: '🚀 Run Full Simulation',
                    description: 'Complete end-to-end solution simulation and walkthrough'
                  })}
                  className={`
                    group flex items-center p-3 rounded-lg border text-left transition-all
                    hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                    ${isDarkMode 
                      ? 'bg-gradient-to-r from-primary-1/20 to-primary-2/20 border-primary-1/50 hover:from-primary-1/30 hover:to-primary-2/30' 
                      : 'bg-gradient-to-r from-primary-1/10 to-primary-2/10 border-primary-1/30 hover:from-primary-1/20 hover:to-primary-2/20'
                    }
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium mb-1 text-primary-1`}>
                      🚀 Run Full Simulation
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-primary-1/80' : 'text-primary-1/70'}`}>
                      Complete end-to-end solution simulation and walkthrough
                    </div>
                  </div>
                  <FiArrowRight 
                    className="w-4 h-4 transition-all group-hover:translate-x-1 text-primary-1" 
                  />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QueryResponse; 