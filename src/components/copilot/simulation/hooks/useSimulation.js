import { useState, useEffect, useCallback } from 'react';

export const useSimulation = (steps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [completedSubSteps, setCompletedSubSteps] = useState(new Set());
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [revealedComponents, setRevealedComponents] = useState(new Set());

  // Enhanced auto-advance simulation with sub-step processing
  useEffect(() => {
    if (isRunning) {
      const currentStepData = steps[currentStep];
      if (!currentStepData) return;

      const subSteps = currentStepData.subSteps || [];
      
      if (currentSubStep < subSteps.length) {
        // Processing sub-steps within current step
        const currentSubStepData = subSteps[currentSubStep];
        setProcessingStatus(currentSubStepData.title);
        
        const timer = setTimeout(() => {
          setCompletedSubSteps(prev => new Set([...prev, `${currentStep}-${currentSubStep}`]));
          
          // Reveal components based on sub-step
          revealComponentsForSubStep(currentStepData, currentSubStep);
          
          setCurrentSubStep(prev => prev + 1);
        }, currentSubStepData.duration);

        return () => clearTimeout(timer);
      } else {
        // Sub-steps completed, move to next main step or complete
        const timer = setTimeout(() => {
          setCompletedSteps(prev => new Set([...prev, currentStep]));
          setProcessingStatus('');
          setCurrentSubStep(0);
          setRevealedComponents(new Set());
          
          if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
          } else {
            setIsRunning(false);
            setShowResults(true);
          }
        }, 800);

        return () => clearTimeout(timer);
      }
    }
  }, [isRunning, currentStep, currentSubStep, steps]);

  // Helper function to reveal components based on sub-step
  const revealComponentsForSubStep = useCallback((stepData, subStepIndex) => {
    if (stepData.type === 'architecture' && subStepIndex > 0 && subStepIndex <= stepData.components?.length) {
      setRevealedComponents(prev => new Set([...prev, `component-${subStepIndex - 1}`]));
    } else if (stepData.type === 'metrics' && subStepIndex < stepData.metrics?.length) {
      setRevealedComponents(prev => new Set([...prev, `metric-${subStepIndex}`]));
    } else if (stepData.type === 'planning' && subStepIndex > 0 && subStepIndex <= stepData.phases?.length) {
      setRevealedComponents(prev => new Set([...prev, `phase-${subStepIndex - 1}`]));
    } else if (stepData.type === 'workflow' && subStepIndex > 0 && subStepIndex <= stepData.flowSteps?.length) {
      setRevealedComponents(prev => new Set([...prev, `flow-${subStepIndex - 1}`]));
    } else if (stepData.type === 'technology' && subStepIndex > 0 && subStepIndex <= stepData.technologies?.length) {
      setRevealedComponents(prev => new Set([...prev, `tech-${subStepIndex - 1}`]));
    } else if (stepData.type === 'capabilities' && subStepIndex > 0 && subStepIndex <= stepData.capabilities?.length) {
      setRevealedComponents(prev => new Set([...prev, `capability-${subStepIndex - 1}`]));
    } else if (stepData.type === 'risk' && subStepIndex > 0 && subStepIndex <= stepData.risks?.length) {
      setRevealedComponents(prev => new Set([...prev, `risk-${subStepIndex - 1}`]));
    }
  }, []);

  // Helper function to reveal all components for a completed step
  const revealAllComponentsForStep = useCallback((stepData) => {
    const newComponents = new Set();
    
    if (stepData.type === 'architecture' && stepData.components) {
      stepData.components.forEach((_, index) => {
        newComponents.add(`component-${index}`);
      });
    } else if (stepData.type === 'metrics' && stepData.metrics) {
      stepData.metrics.forEach((_, index) => {
        newComponents.add(`metric-${index}`);
      });
    } else if (stepData.type === 'planning' && stepData.phases) {
      stepData.phases.forEach((_, index) => {
        newComponents.add(`phase-${index}`);
      });
    } else if (stepData.type === 'workflow' && stepData.flowSteps) {
      stepData.flowSteps.forEach((_, index) => {
        newComponents.add(`flow-${index}`);
      });
    } else if (stepData.type === 'technology' && stepData.technologies) {
      stepData.technologies.forEach((_, index) => {
        newComponents.add(`tech-${index}`);
      });
    } else if (stepData.type === 'capabilities' && stepData.capabilities) {
      stepData.capabilities.forEach((_, index) => {
        newComponents.add(`capability-${index}`);
      });
    } else if (stepData.type === 'risk' && stepData.risks) {
      stepData.risks.forEach((_, index) => {
        newComponents.add(`risk-${index}`);
      });
    }
    
    setRevealedComponents(prev => new Set([...prev, ...newComponents]));
  }, []);

  // Simulation control functions
  const startSimulation = useCallback(() => {
    setIsRunning(true);
    setCurrentStep(0);
    setCurrentSubStep(0);
    setCompletedSteps(new Set());
    setCompletedSubSteps(new Set());
    setRevealedComponents(new Set());
    setShowResults(false);
    setProcessingStatus('');
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeSimulation = useCallback(() => {
    setIsRunning(true);
  }, []);

  const goToStep = useCallback((stepIndex) => {
    setCurrentStep(stepIndex);
    setCurrentSubStep(0);
    setRevealedComponents(new Set());
    setIsRunning(false);
    setProcessingStatus('');
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setCurrentSubStep(0);
      setRevealedComponents(new Set());
    } else {
      setShowResults(true);
    }
  }, [currentStep, steps.length]);

  const completeCurrentStep = useCallback(() => {
    // Reveal all components for current step when manually advancing
    revealAllComponentsForStep(steps[currentStep]);
    
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    // Move to next step or complete
    nextStep();
  }, [currentStep, steps, revealAllComponentsForStep, nextStep]);

  const resetSimulation = useCallback(() => {
    setCurrentStep(0);
    setCurrentSubStep(0);
    setIsRunning(false);
    setCompletedSteps(new Set());
    setCompletedSubSteps(new Set());
    setRevealedComponents(new Set());
    setShowResults(false);
    setProcessingStatus('');
  }, []);

  return {
    // State
    currentStep,
    currentSubStep,
    isRunning,
    completedSteps,
    completedSubSteps,
    showResults,
    isFullScreen,
    processingStatus,
    revealedComponents,
    
    // Actions
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    goToStep,
    nextStep,
    completeCurrentStep,
    resetSimulation,
    setIsFullScreen,
    setIsAutoPlay,
    
    // Helpers
    revealComponentsForSubStep,
    revealAllComponentsForStep
  };
};

