import { createDiagram } from '@/constants/implementations/base/diagram-template';

const clinicalDecisionDiagram = createDiagram({
  title: "Clinical Decision Support",
  description: "Evidence-based clinical decision support system",
  nodes: [
    {
      id: 'decision-support',
      label: 'Decision Support',
      x: 100,
      y: 100,
      description: 'Clinical Decision Support System',
      technologies: {
        main: {
          "OpenCDS": "Clinical rules engine",
          "SNOMED CT": "Clinical terminology"
        }
      }
    }
  ]
});

export { clinicalDecisionDiagram }; 