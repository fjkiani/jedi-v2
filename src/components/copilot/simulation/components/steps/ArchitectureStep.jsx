import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ArchitectureStep = ({ step, revealedComponents, responseData }) => {
  return (
    <div className="space-y-4">
      <div className="text-base text-white font-medium leading-relaxed mb-4">
        {step.content}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <AnimatePresence>
          {step.components?.map((component, index) => (
            revealedComponents.has(`component-${index}`) && (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-purple-800/30 rounded-lg p-4 border border-purple-400/30"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-bold text-white">{component.name}</div>
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="text-purple-200 text-sm">{component.description}</div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArchitectureStep;

