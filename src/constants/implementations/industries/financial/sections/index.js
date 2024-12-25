import { dataIntegrationDiagram } from './data-integration/diagram';
import { aiAnalysisDiagram } from './ai-analysis/diagram';
import { decisionEngineDiagram } from './decision-engine/diagram';

export const sectionDiagrams = {
  'data-integration': dataIntegrationDiagram,
  'ai-analysis': aiAnalysisDiagram,
  'decision-engine': decisionEngineDiagram
};

export const getSectionDiagram = (section) => {
  console.log('Getting diagram for section:', section);
  console.log('Available diagrams:', Object.keys(sectionDiagrams));
  return sectionDiagrams[section];
}; 