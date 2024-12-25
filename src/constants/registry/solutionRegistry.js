import { fraudDetectionDocs } from '../implementations/industries/financial/documentation';
import { fraudDetectionImplementation } from '../implementations/industries/financial/implementation';
import { fraudDetectionDiagram } from '../implementations/industries/financial/diagrams';

import { patientRiskAnalysisDocs } from '../implementations/industries/healthcare/documentation';
import { patientRiskAnalysisImplementation } from '../implementations/industries/healthcare/implementation';
import { patientRiskAnalysisDiagram } from '../implementations/industries/healthcare/diagrams';

export const SOLUTION_REGISTRY = {
  financial: {
    'fraud-detection': {
      documentation: fraudDetectionDocs,
      implementation: fraudDetectionImplementation,
      diagrams: fraudDetectionDiagram
    }
  },
  healthcare: {
    'patient-risk-analysis': {
      documentation: patientRiskAnalysisDocs,
      implementation: patientRiskAnalysisImplementation,
      diagrams: patientRiskAnalysisDiagram
    }
  }
};

export const getSolutionConfig = (industryId, solutionId) => {
  return SOLUTION_REGISTRY[industryId]?.[solutionId] || null;
};

// Helper to get all solutions for an industry
export const getIndustrySolutions = (industryId) => {
  return Object.keys(SOLUTION_REGISTRY[industryId] || {}).map(solutionId => ({
    id: solutionId,
    ...SOLUTION_REGISTRY[industryId][solutionId]
  }));
}; 