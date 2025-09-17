/**
 * JEDI Implementation Card - Reusable component for displaying client implementations
 * 
 * This component can display any JEDI implementation with results, business impact,
 * and technical details in a consistent format.
 */

import React from 'react';
import { motion } from 'framer-motion';

const JediImplementationCard = ({ 
  implementation, 
  variant = 'default', // 'default', 'compact', 'detailed'
  showTechnicalDetails = true,
  showBusinessImpact = true,
  showScalability = true,
  className = ''
}) => {
  if (!implementation) return null;

  const { 
    client, 
    industry, 
    problem, 
    solution, 
    results, 
    technicalDetails, 
    businessImpact, 
    scalability,
    technologies = []
  } = implementation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {client}
          </h3>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
            {industry}
          </span>
        </div>
      </div>

      {/* Problem & Solution */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              The Problem
            </h4>
            <p className="text-red-700 dark:text-red-300 text-sm">
              {problem}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Our Solution
            </h4>
            <p className="text-green-700 dark:text-green-300 text-sm">
              {solution}
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Results
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {value}
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technologies */}
      {technologies.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Technologies Used
          </h4>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Technical Details */}
      {showTechnicalDetails && technicalDetails && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            How It Works
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {technicalDetails}
            </p>
          </div>
        </div>
      )}

      {/* Business Impact */}
      {showBusinessImpact && businessImpact && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Business Impact
          </h4>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-700 dark:text-green-300 text-sm">
              {businessImpact}
            </p>
          </div>
        </div>
      )}

      {/* Scalability */}
      {showScalability && scalability && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Scalability
          </h4>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              {scalability}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default JediImplementationCard;
