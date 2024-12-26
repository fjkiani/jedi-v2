import { patientRiskDiagram } from './patient-risk/diagram';
import { dataCollectionDiagram } from './data-collection/diagram';
import { riskAnalysisDiagram } from './risk-analysis/diagram';
import { clinicalDecisionDiagram } from './clinical-decision/diagram';

// Export all diagrams
export {
  patientRiskDiagram as fundamentalsDiagram,
  dataCollectionDiagram,
  riskAnalysisDiagram,
  clinicalDecisionDiagram
};

// Helper to get diagram by section
export const getSectionDiagram = (section) => {
  const diagrams = {
    fundamentals: patientRiskDiagram,
    'data-collection': dataCollectionDiagram,
    'risk-analysis': riskAnalysisDiagram,
    'clinical-decision': clinicalDecisionDiagram
  };
  return diagrams[section];
}; 