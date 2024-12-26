import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UseCaseView } from './views/UseCaseView';
import { DeploymentView } from './views/DeploymentView';
import { DiagramView } from './DiagramView';

const ArchitectureDiagram = ({ diagram }) => {
  const [view, setView] = useState('diagram');
  
  console.log('ArchitectureDiagram received:', diagram);

  if (!diagram) {
    return (
      <div className="text-center text-n-3 py-8">
        <p>No diagram data available</p>
      </div>
    );
  }

  const views = {
    useCase: {
      label: 'Use Case',
      component: <UseCaseView diagram={diagram} />
    },
    deployment: {
      label: 'Deployment',
      component: <DeploymentView diagram={diagram} />
    },
    diagram: {
      label: 'Diagram',
      component: <DiagramView diagram={diagram} />
    }
  };

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex space-x-4 justify-center">
        {Object.entries(views).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === key 
                ? 'bg-primary-1 text-white' 
                : 'bg-n-6 text-n-3 hover:bg-n-5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* View Content */}
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {views[view].component}
      </motion.div>
    </div>
  );
};

export default ArchitectureDiagram; 