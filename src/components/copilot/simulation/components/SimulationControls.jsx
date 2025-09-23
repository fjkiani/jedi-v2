import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../Button';
import { PlayIcon, PauseIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const SimulationControls = ({
  isRunning,
  showResults,
  currentStep,
  totalSteps,
  onStart,
  onPause,
  onResume,
  onCompleteStep,
  onSuggestedQuery,
  responseData
}) => {
  return (
    <div className="p-3 sm:p-4 border-b border-purple-500/20 bg-black/30">
      <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white mb-2 sm:mb-3">
        Simulation Controls
      </h3>
      <div className="flex lg:flex-col gap-2">
        {!isRunning && !showResults && (
          <Button 
            onClick={onStart}
            className="flex-1 lg:w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none shadow-lg text-xs sm:text-sm py-2 px-3"
          >
            <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Start Simulation</span>
            <span className="sm:hidden">Start</span>
          </Button>
        )}
        
        {isRunning && (
          <Button 
            onClick={onPause}
            className="flex-1 lg:w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none text-xs sm:text-sm py-2 px-3"
          >
            <PauseIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Pause</span>
            <span className="sm:hidden">Pause</span>
          </Button>
        )}
        
        {!isRunning && currentStep > 0 && !showResults && (
          <Button 
            onClick={onResume}
            className="flex-1 lg:w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none text-xs sm:text-sm py-2 px-3"
          >
            <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Resume</span>
            <span className="sm:hidden">Resume</span>
          </Button>
        )}

        {!isRunning && !showResults && (
          <Button
            onClick={onCompleteStep}
            className="flex-1 lg:w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-none shadow-lg text-xs sm:text-sm py-2 sm:py-3 px-4 sm:px-6"
          >
            <span className="hidden sm:inline">
              {currentStep === totalSteps - 1 ? 'Complete Simulation' : 'Approve & Continue'}
            </span>
            <span className="sm:hidden">
              {currentStep === totalSteps - 1 ? 'Complete' : 'Continue'}
            </span>
            <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
          </Button>
        )}

        {/* Consultation CTA - Show on final step or completion */}
        {(currentStep === totalSteps - 1 || showResults) && (
          <Button
            onClick={() => {
              // Trigger lead capture with consultation context
              if (onSuggestedQuery) {
                onSuggestedQuery('LEAD_CAPTURE:consultation', {
                  type: 'consultation',
                  context: `${responseData?.useCase?.title || 'AI Solution'} implementation consultation`,
                  solutions: [responseData?.useCase?.title || 'AI Solution'],
                  industry: responseData?.industry?.name || 'Technology',
                  leadSource: 'Interactive Simulation',
                  simulationCompleted: true
                });
              }
            }}
            className="flex-1 lg:w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none shadow-lg text-xs sm:text-sm py-2 sm:py-3 px-4 sm:px-6"
          >
            <span className="hidden sm:inline">
              📅 Schedule Free Consultation
            </span>
            <span className="sm:hidden">
              📅 Consult
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default SimulationControls;

