import { 
  fraudDetectionDiagram,
  dataIntegrationDiagram,
  aiAnalysisDiagram,
  decisionEngineDiagram 
} from '@/constants/implementations/industries/financial/sections';

import {
  fundamentalsDiagram as healthcareFundamentals,
  dataCollectionDiagram as healthcareDataCollection,
  riskAnalysisDiagram as healthcareRiskAnalysis,
  clinicalDecisionDiagram as healthcareClinicalDecision
} from '@/constants/implementations/industries/healthcare/sections';

// Map of all diagrams by industry and section
export const INDUSTRY_DIAGRAMS = {
  financial: {
    fundamentals: fraudDetectionDiagram,
    'data-collection': dataIntegrationDiagram,
    'analysis': aiAnalysisDiagram,
    'decision-engine': decisionEngineDiagram
  },
  healthcare: {
    fundamentals: healthcareFundamentals,
    'data-collection': healthcareDataCollection,
    'analysis': healthcareRiskAnalysis,
    'clinical-decision': healthcareClinicalDecision
  }
};

// Helper function to get diagram
export const getIndustryDiagram = (industryId, sectionId) => {
  return INDUSTRY_DIAGRAMS[industryId]?.[sectionId];
}; 