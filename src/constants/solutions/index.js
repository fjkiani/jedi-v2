import { commonLayouts, defaultDiagram } from '../layouts';
import { aiMlSolution } from './ai-ml';
import { fullStackSolution } from './full-stack';
import { dataEngineeringSolution } from './data-engineering';
import { aiAgentsSolution } from './ai-agents';

// Create architectureDiagrams from solutions for backward compatibility
export const architectureDiagrams = {
  'ai-ml-solutions': {
    useCase: aiMlSolution?.businessValue || '',
    nodes: aiMlSolution?.architecture?.nodes || [],
    connections: aiMlSolution?.architecture?.connections || []
  },
  'full-stack-development': {
    useCase: fullStackSolution?.businessValue || '',
    nodes: fullStackSolution?.architecture?.nodes || [],
    connections: fullStackSolution?.architecture?.connections || []
  },
  'data-engineering': {
    useCase: dataEngineeringSolution?.businessValue || '',
    nodes: dataEngineeringSolution?.architecture?.nodes || [],
    connections: dataEngineeringSolution?.architecture?.connections || []
  },
  'ai-agents': {
    useCase: aiAgentsSolution?.businessValue || '',
    nodes: aiAgentsSolution?.architecture?.nodes || [],
    connections: aiAgentsSolution?.architecture?.connections || []
  }
};

// Export everything needed by existing components
export {
  commonLayouts,
  defaultDiagram
};

// New solution-based exports
export const solutions = {
  'ai-ml-solutions': aiMlSolution,
  'full-stack-development': fullStackSolution,
  'data-engineering': dataEngineeringSolution,
  'ai-agents': aiAgentsSolution
};

// Helper functions
export const getSolutionBySlug = (slug) => solutions[slug];
export const getDiagramBySlug = (slug) => {
  const diagram = architectureDiagrams[slug];
  if (!diagram) {
    console.warn(`No diagram found for slug: ${slug}, using default`);
    return defaultDiagram;
  }
  return diagram;
};
export const getLayoutByType = (type) => commonLayouts[type] || commonLayouts.horizontal;
export const getTechStackByDomain = (domain) => {
  return techStacks[domain] || {};
};
export const getAllSolutions = () => Object.values(solutions);
  

  