import { useState, useEffect, useCallback } from 'react';

export const useCoPilotAnalysis = (useCaseData, selectedQuery) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [revealedSections, setRevealedSections] = useState(new Set());

  // Determine analysis type based on query content
  const getAnalysisType = useCallback((query) => {
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
  }, []);

  // Start analysis when query is selected
  const startAnalysis = useCallback((analysisType) => {
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
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [selectedQuery]);

  // Auto-start analysis when query changes
  useEffect(() => {
    if (selectedQuery && useCaseData) {
      const analysisType = getAnalysisType(selectedQuery);
      startAnalysis(analysisType);
    }
  }, [selectedQuery, useCaseData, getAnalysisType, startAnalysis]);

  // Reset analysis when query changes
  useEffect(() => {
    setCurrentAnalysis(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  }, [selectedQuery]);

  return {
    currentAnalysis,
    isAnalyzing,
    analysisProgress,
    revealedSections,
    startAnalysis,
    getAnalysisType
  };
};

