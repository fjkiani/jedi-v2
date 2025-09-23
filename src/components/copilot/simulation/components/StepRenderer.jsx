import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import ArchitectureStep from './steps/ArchitectureStep';
import MetricsStep from './steps/MetricsStep';
import PlanningStep from './steps/PlanningStep';

const StepRenderer = ({ step, revealedComponents, responseData }) => {
  const renderStepContent = () => {
    switch (step.type) {
      case 'activation':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <AnimatePresence>
                {responseData.useCase?.capabilities && (
                  <motion.div
                    key="analysis"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-purple-500/20 rounded-lg p-4 border border-purple-400/30"
                  >
                    <div className="text-lg mb-2">🎯</div>
                    <div className="text-base font-bold text-white mb-2">Solution Analysis</div>
                    <div className="text-purple-200 text-sm">
                      {Array.isArray(responseData.useCase.capabilities) 
                        ? `Analyzing ${responseData.useCase.capabilities[0]} capabilities`
                        : `Analyzing ${responseData.useCase.capabilities} capabilities`
                      }
                    </div>
                  </motion.div>
                )}
                
                <motion.div
                  key="data"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30"
                >
                  <div className="text-lg mb-2">📊</div>
                  <div className="text-base font-bold text-white mb-2">Data Assessment</div>
                  <div className="text-blue-200 text-sm">
                    {responseData.useCase?.architecture?.components?.length ? 
                      `Evaluating ${responseData.useCase.architecture.components.length} system components` :
                      'Evaluating data readiness and quality'
                    }
                  </div>
                </motion.div>
                
                <motion.div
                  key="resource"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-green-500/20 rounded-lg p-4 border border-green-400/30"
                >
                  <div className="text-lg mb-2">⚡</div>
                  <div className="text-base font-bold text-white mb-2">Resource Planning</div>
                  <div className="text-green-200 text-sm">
                    {responseData.useCase?.technologies?.length ? 
                      `Planning integration of ${responseData.useCase.technologies.length} technologies` :
                      'Calculating required resources and timeline'
                    }
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        );

      case 'architecture':
        return <ArchitectureStep step={step} revealedComponents={revealedComponents} responseData={responseData} />;

      case 'metrics':
        return <MetricsStep step={step} revealedComponents={revealedComponents} />;

      case 'planning':
        return <PlanningStep step={step} revealedComponents={revealedComponents} />;

      case 'workflow':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {step.flowSteps?.map((flowStep, index) => (
                  revealedComponents.has(`flow-${index}`) && (
                    <motion.div
                      key={flowStep.id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-800/30 to-purple-800/30 rounded-lg border border-blue-400/30"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-base"
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {flowStep.step}
                      </motion.div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-white mb-1">{flowStep.description}</div>
                        {flowStep.details && (
                          <div className="text-blue-200 text-sm">{flowStep.details}</div>
                        )}
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'technology':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AnimatePresence>
                {step.technologies?.map((tech, index) => (
                  revealedComponents.has(`tech-${index}`) && (
                    <motion.div
                      key={tech.id}
                      className="p-4 bg-gradient-to-br from-gray-800/50 to-blue-800/30 rounded-lg border border-blue-400/30"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-base font-bold text-white">{tech.name}</div>
                        <motion.div 
                          className="w-2 h-2 bg-blue-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                      <div className="text-blue-200 text-sm">{tech.description || `${tech.name} integration component`}</div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'capabilities':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AnimatePresence>
                {step.capabilities?.map((capability, index) => (
                  revealedComponents.has(`capability-${index}`) && (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-400/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
                        initial={{ rotate: -180 }}
                        animate={{ rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <span className="text-white font-bold text-sm">⚡</span>
                      </motion.div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-white">{capability}</div>
                        <div className="text-purple-200 text-sm">Core system capability</div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'risk':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {step.risks?.map((risk, index) => (
                  revealedComponents.has(`risk-${index}`) && (
                    <motion.div
                      key={index}
                      className="p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-lg border border-red-400/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-base font-bold text-white">{risk.risk}</div>
                        <motion.div 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            risk.level === 'High' ? 'bg-red-500/30 text-red-200' :
                            risk.level === 'Medium' ? 'bg-yellow-500/30 text-yellow-200' :
                            'bg-green-500/30 text-green-200'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {risk.level} Risk
                        </motion.div>
                      </div>
                      <div className="text-gray-300 text-sm">
                        <span className="font-medium text-green-300">Mitigation:</span> {risk.mitigation}
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-4">
            <div className="text-base text-white font-medium leading-relaxed mb-4">
              {step.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AnimatePresence>
                {step.recommendations?.map((rec, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-400/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-green-200 text-sm font-medium">{rec}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-base text-white font-medium leading-relaxed">
            {step.content}
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 sm:p-4 lg:p-6 min-h-full flex flex-col">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default StepRenderer;

