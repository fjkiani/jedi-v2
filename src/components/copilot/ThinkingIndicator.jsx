import React from 'react';
import { motion } from 'framer-motion';

const ThinkingIndicator = () => {
  return (
    <div className="flex gap-3 mb-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">🤖</span>
        </div>
      </div>

      {/* Thinking Content */}
      <div className="flex-1 max-w-none">
        <div className="rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300 text-sm">
              Analyzing your query
            </span>
            
            {/* Animated dots */}
            <div className="flex gap-1">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Processing steps */}
          <div className="mt-2 space-y-1">
            {[
              "Understanding context...",
              "Matching solutions...",
              "Preparing response..."
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-lg text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5] }}
                transition={{
                  duration: 2,
                  delay: index * 0.8,
                  repeat: Infinity,
                }}
              >
                {step}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator; 