import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InteractiveSection = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className={`bg-n-8 rounded-lg p-4 ${
        isExpanded ? 'col-span-full' : ''
      }`}
      layoutId={`section-${section.id}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-primary-1 font-medium">{section.title}</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-n-3 hover:text-primary-1"
        >
          {isExpanded ? '↙️' : '↗️'}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            {/* Detailed content */}
          </motion.div>
        ) : (
          <motion.div className="mt-2 text-n-3">
            {/* Preview content */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveSection; 