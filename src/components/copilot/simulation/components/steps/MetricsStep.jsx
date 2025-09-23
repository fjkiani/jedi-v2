import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MetricsStep = ({ step, revealedComponents }) => {
  return (
    <div className="space-y-4">
      <div className="text-base text-white font-medium leading-relaxed mb-4">
        {step.content}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
          {step.metrics?.map((metric, index) => (
            revealedComponents.has(`metric-${index}`) && (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-400/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-bold text-white">{metric.name}</div>
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
                <div className="text-blue-200 text-sm">{metric.description}</div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MetricsStep;

