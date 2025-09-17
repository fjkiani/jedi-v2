/**
 * JEDI Results Grid - Reusable component for displaying results/metrics
 * 
 * This component can display results in different formats: grid, list, or compact
 * with customizable styling and animations.
 */

import React from 'react';
import { motion } from 'framer-motion';

const JediResultsGrid = ({ 
  results, 
  variant = 'default', // 'default', 'compact', 'detailed', 'horizontal'
  showLabels = true,
  className = ''
}) => {
  if (!results || Object.keys(results).length === 0) return null;

  const resultEntries = Object.entries(results);

  const renderDefault = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {resultEntries.map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center border border-yellow-200 dark:border-yellow-800"
        >
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
            {value}
          </div>
          {showLabels && (
            <div className="text-sm text-yellow-700 dark:text-yellow-300 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderCompact = () => (
    <div className="flex flex-wrap gap-3">
      {resultEntries.map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-yellow-100 dark:bg-yellow-900/30 px-3 py-2 rounded-full"
        >
          <span className="text-yellow-800 dark:text-yellow-200 font-semibold text-sm">
            {value}
          </span>
          {showLabels && (
            <span className="text-yellow-600 dark:text-yellow-400 text-xs ml-2">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderDetailed = () => (
    <div className="space-y-4">
      {resultEntries.map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
            </div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {value}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderHorizontal = () => (
    <div className="flex flex-wrap gap-6">
      {resultEntries.map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
            {value}
          </div>
          {showLabels && (
            <div className="text-sm text-yellow-700 dark:text-yellow-300 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className={className}>
      {variant === 'default' && renderDefault()}
      {variant === 'compact' && renderCompact()}
      {variant === 'detailed' && renderDetailed()}
      {variant === 'horizontal' && renderHorizontal()}
    </div>
  );
};

export default JediResultsGrid;
