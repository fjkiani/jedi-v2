import React from 'react';
import { motion } from 'framer-motion';
import ArchitectureDiagram from '../../../components/diagrams/ArchitectureDiagram';
import { getSolutionBySlug } from '../../../constants/solutions';

const TechnicalTab = ({ solution }) => {
  // Get the full solution data using the slug
  const solutionData = getSolutionBySlug(solution?.slug);
  
  if (!solutionData) {
    return (
      <div className="text-center text-n-3 py-8">
        <p>Solution not found: {solution?.slug}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ArchitectureDiagram 
          domain={solution.slug}
          solution={solutionData} // Pass the full solution data
        />
      </motion.div>
    </div>
  );
};

export default TechnicalTab; 