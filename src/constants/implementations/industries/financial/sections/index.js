import { fraudDetectionDiagram } from './fraud-detection/diagram';
import { dataIntegrationDiagram } from './data-integration/diagram';
import { aiAnalysisDiagram } from './ai-analysis/diagram';
import { decisionEngineDiagram } from './decision-engine/diagram';

// Export all diagrams
export {
  fraudDetectionDiagram,
  dataIntegrationDiagram,
  aiAnalysisDiagram,
  decisionEngineDiagram
};

// Helper to get diagram by section
export const getSectionDiagram = (section) => {
  const diagrams = {
    fundamentals: fraudDetectionDiagram,
    'data-collection': dataIntegrationDiagram,
    'ai-analysis': aiAnalysisDiagram,
    'decision-engine': decisionEngineDiagram
  };
  return diagrams[section];
}; 