import React from 'react';
import { DiagramView } from './DiagramView';
import { 
  aiAnalysisDiagram,
  decisionEngineDiagram,
  dataIntegrationDiagram 
} from '@/constants/implementations/industries/financial/sections';

const industryDiagrams = {
  'ai-analysis': aiAnalysisDiagram,
  'decision-engine': decisionEngineDiagram,
  'data-integration': dataIntegrationDiagram
};

const IndustryDiagram = ({ section }) => {
  const diagram = industryDiagrams[section];
  
  console.log('IndustryDiagram:', {
    section,
    diagramFound: !!diagram
  });

  if (!diagram) {
    return (
      <div className="text-center text-n-3 py-8">
        <p>No diagram data available for section: {section}</p>
      </div>
    );
  }

  return <DiagramView diagram={diagram} />;
};

export default IndustryDiagram;