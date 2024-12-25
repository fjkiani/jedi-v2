import React from 'react';
import ArchitectureDiagram from '@/components/diagrams/ArchitectureDiagram';

const ArchitectureTab = ({ solution, domain }) => {
  return (
    <div>
      <h3 className="h4 mb-4">{solution.architecture.title}</h3>
      <p className="text-n-3 mb-8">{solution.architecture.description}</p>
      <ArchitectureDiagram domain={domain} />
    </div>
  );
};

export default ArchitectureTab; 