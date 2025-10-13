import React from 'react';
import { motion } from 'framer-motion';

const SimulationSidebar = ({
  steps,
  currentStep,
  completedSteps,
  isRunning,
  processingStatus,
  onGoToStep
}) => {
  return (
    <div className="w-full lg:w-72 bg-black/20 rounded-lg sm:rounded-xl border border-purple-500/20 flex flex-col">
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
        
        {/* Real-time Processing Status */}
        {isRunning && processingStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-400/30"
          >
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <motion.div 
                  className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div 
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
                <motion.div 
                  className="w-1.5 h-1.5 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                />
              </div>
              <span className="text-xs text-white font-medium">
                {processingStatus}
              </span>
            </div>
          </motion.div>
        )}
        
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
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
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
                  onClick={() => onGoToStep(index)}
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
                onClick={() => onGoToStep(index)}
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
  );
};

export default SimulationSidebar;



