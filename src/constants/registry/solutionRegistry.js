import { fraudDetectionDocs } from '../implementations/industries/financial/documentation.js';
import { fraudDetectionImplementation } from '../implementations/industries/financial/implementation.js';
import { fraudDetectionDiagram } from '../implementations/industries/financial/diagrams.js';

import { patientRiskAnalysisDocs } from '../implementations/industries/healthcare/documentation.js';
import { patientRiskAnalysisImplementation } from '../implementations/industries/healthcare/implementation.js';
import { patientRiskAnalysisDiagram } from '../implementations/industries/healthcare/diagrams.js';

/**
 * Single source of truth for implementation content.
 * Used by: DocumentationTab, implementationDataService, extract/push migration scripts.
 *
 * hygraphUseCaseSlug: Target UseCase slug in Hygraph for push migration.
 * Add new solutions here; extract/push scripts discover them dynamically.
 *
 * @see DYNAMIC_IMPLEMENTATIONS_AND_SIMULATION_PLAN.md
 */
export const SOLUTION_REGISTRY = {
  financial: {
    'fraud-detection': {
      documentation: fraudDetectionDocs,
      implementation: fraudDetectionImplementation,
      diagrams: fraudDetectionDiagram,
      hygraphUseCaseSlug: 'advanced-fraud-detection-system',
    },
  },
  healthcare: {
    'patient-risk-analysis': {
      documentation: patientRiskAnalysisDocs,
      implementation: patientRiskAnalysisImplementation,
      diagrams: patientRiskAnalysisDiagram,
      hygraphUseCaseSlug: 'clinical-decision-support',
    },
  },
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