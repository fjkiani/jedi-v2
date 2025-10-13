import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PlanningStep = ({ step, revealedComponents }) => {
  return (
    <div className="space-y-4">
      <div className="text-base text-white font-medium leading-relaxed mb-4">
        {step.content}
      </div>
      <div className="space-y-3">
        <AnimatePresence>
          {step.phases?.map((phase, index) => (
            revealedComponents.has(`phase-${index}`) && (
              <motion.div
                key={index}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-800/50 to-blue-800/30 rounded-lg border border-blue-400/30"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-base"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  {index + 1}
                </motion.div>
                <div className="flex-1">
                  <div className="text-base font-bold text-white mb-1">{phase.title}</div>
                  <div className="text-blue-200 text-sm">{phase.description}</div>
                </div>
                <div className="text-purple-300 font-medium text-sm">{phase.duration}</div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlanningStep;



