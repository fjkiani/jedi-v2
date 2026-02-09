/**
 * JEDI Component Card - Reusable component for displaying JEDI components
 * 
 * This component can display any JEDI component (Ensemble, Rules, Automate) with
 * all their capabilities, problems, and user experience information.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const JediComponentCard = ({
  component,
  variant = 'default', // 'default', 'compact', 'detailed'
  showCapabilities = true,
  showProblem = true,
  showUserExperience = true,
  className = ''
}) => {
  if (!component) return null;

  const { name, tagline, description, problem, capabilities, userExperience } = component;

  const CardContent = () => (
    <>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-3">
          {tagline}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>

      {/* Problem Section */}
      {showProblem && problem && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Problem We Solve
          </h4>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
              {problem.title}
            </h5>
            <p className="text-red-700 dark:text-red-300 text-sm mb-3">
              {problem.description}
            </p>
            <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
              {problem.painPoints?.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Capabilities Section */}
      {showCapabilities && capabilities && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            What It Does For You
          </h4>
          <div className="grid gap-4">
            {capabilities.primary?.map((capability, index) => (
              <div key={index} className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  {capability.name}
                </h5>
                <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                  {capability.description}
                </p>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                  {capability.userBenefit}
                </p>
                {capability.businessValue && (
                  <p className="text-green-500 dark:text-green-400 text-xs mt-1">
                    💰 {capability.businessValue}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Experience Section */}
      {showUserExperience && userExperience && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            What You Experience
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(userExperience).map(([key, value]) => (
              <div key={key} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h5>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interaction Hint */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center group-hover:translate-x-1 transition-transform">
          View System Details →
        </span>
      </div>
    </>
  );

  const slug = component.slug || component.id?.toLowerCase().replace(/\s+/g, '-');
  const targetLink = `/technology/${slug}`; // Default to technology detail pages

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 group cursor-pointer hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <Link to={targetLink} className="block h-full">
        <CardContent />
      </Link>
    </motion.div>
  );
};

export default JediComponentCard;
