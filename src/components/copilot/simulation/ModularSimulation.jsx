import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowsPointingOutIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSimulation } from './hooks/useSimulation';
import { generateSimulationSteps } from './dataTransformer';
import SimulationControls from './components/SimulationControls';
import SimulationSidebar from './components/SimulationSidebar';
import StepRenderer from './components/StepRenderer';

const ModularSimulation = ({ responseData, onSuggestedQuery, onComplete }) => {
  const steps = generateSimulationSteps(responseData);
  
  const {
    currentStep,
    isRunning,
    completedSteps,
    showResults,
    isFullScreen,
    processingStatus,
    revealedComponents,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    goToStep,
    completeCurrentStep,
    setIsFullScreen
  } = useSimulation(steps);

  const handleCompleteStep = () => {
    completeCurrentStep();
  };

  return (
    <>
      {/* Compact View - Shows in Chat */}
      {!isFullScreen && (
        <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-blue-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-500/30 p-6 shadow-lg">
          {/* Simulation Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {responseData.simulationData?.title || responseData.useCase?.title + ' Implementation Simulation' || 'AI Implementation Simulator'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Interactive walkthrough of your AI solution implementation
            </p>
          </div>

          {/* Primary CTA Button */}
          <div className="text-center mb-6">
            <button 
              onClick={() => setIsFullScreen(true)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ArrowsPointingOutIcon className="w-6 h-6" />
              Launch Interactive Simulation
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{steps.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Implementation Steps</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(steps.reduce((acc, step) => acc + (step.processingTime || 2000), 0) / 1000 / 60)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Experience</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">92%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Modal */}
      {isFullScreen && (
        <AnimatePresence>
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
                <SimulationSidebar
                  steps={steps}
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  isRunning={isRunning}
                  processingStatus={processingStatus}
                  onGoToStep={goToStep}
                />

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
                                    <span className="text-white text-xs sm:text-sm lg:text-base">✓</span>
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
                            </div>

                            {/* Step Content - Better Mobile Formatting */}
                            <StepRenderer
                              step={steps[currentStep]}
                              revealedComponents={revealedComponents}
                              responseData={responseData}
                            />

                            {/* Step Actions - Fixed at Bottom */}
                            <div className="mt-auto pt-3 sm:pt-4 lg:pt-6 border-t border-purple-500/20 bg-black/20 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex-shrink-0">
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between items-center">
                                <div className="text-xs sm:text-sm text-gray-400 order-2 sm:order-1">
                                  Step {currentStep + 1} of {steps.length}
                                </div>
                                
                                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
                                  <SimulationControls
                                    isRunning={isRunning}
                                    showResults={showResults}
                                    currentStep={currentStep}
                                    totalSteps={steps.length}
                                    onStart={startSimulation}
                                    onPause={pauseSimulation}
                                    onResume={resumeSimulation}
                                    onCompleteStep={handleCompleteStep}
                                    onSuggestedQuery={onSuggestedQuery}
                                    responseData={responseData}
                                  />
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
        </AnimatePresence>
      )}
    </>
  );
};

export default ModularSimulation;

