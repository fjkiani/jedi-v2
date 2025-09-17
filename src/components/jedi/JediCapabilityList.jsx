/**
 * JEDI Capability List - Reusable component for displaying capabilities
 * 
 * This component can display primary and secondary capabilities in different
 * layouts and formats based on the variant prop.
 */

import React from 'react';
import { motion } from 'framer-motion';

const JediCapabilityList = ({ 
  capabilities, 
  variant = 'default', // 'default', 'compact', 'detailed', 'grid'
  showSecondary = true,
  className = ''
}) => {
  if (!capabilities) return null;

  const { primary = [], secondary = [] } = capabilities;

  const renderCapability = (capability, index, isSecondary = false) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg ${
        isSecondary 
          ? 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600' 
          : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
      }`}
    >
      <div className="flex items-start">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
          isSecondary 
            ? 'bg-gray-200 dark:bg-gray-600' 
            : 'bg-green-200 dark:bg-green-800'
        }`}>
          <span className={`text-sm font-bold ${
            isSecondary 
              ? 'text-gray-600 dark:text-gray-300' 
              : 'text-green-600 dark:text-green-300'
          }`}>
            {index + 1}
          </span>
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold mb-2 ${
            isSecondary 
              ? 'text-gray-800 dark:text-gray-200' 
              : 'text-green-800 dark:text-green-200'
          }`}>
            {capability.name}
          </h4>
          <p className={`text-sm mb-2 ${
            isSecondary 
              ? 'text-gray-600 dark:text-gray-400' 
              : 'text-green-700 dark:text-green-300'
          }`}>
            {capability.description}
          </p>
          <p className={`text-sm font-medium ${
            isSecondary 
              ? 'text-gray-500 dark:text-gray-500' 
              : 'text-green-600 dark:text-green-400'
          }`}>
            {capability.userBenefit}
          </p>
          {capability.businessValue && (
            <p className={`text-xs mt-1 ${
              isSecondary 
                ? 'text-gray-400 dark:text-gray-500' 
                : 'text-green-500 dark:text-green-400'
            }`}>
              💰 {capability.businessValue}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {primary.map((capability, index) => renderCapability(capability, index))}
      {showSecondary && secondary.map((capability, index) => 
        renderCapability(capability, index + primary.length, true)
      )}
    </div>
  );

  const renderList = () => (
    <div className="space-y-4">
      {primary.map((capability, index) => renderCapability(capability, index))}
      {showSecondary && secondary.length > 0 && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Additional Benefits
            </h3>
            <div className="space-y-3">
              {secondary.map((capability, index) => 
                renderCapability(capability, index, true)
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderCompact = () => (
    <div className="space-y-3">
      {primary.map((capability, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-green-600 dark:text-green-300">
              {index + 1}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
              {capability.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              {capability.userBenefit}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={className}>
      {variant === 'grid' && renderGrid()}
      {variant === 'list' && renderList()}
      {variant === 'compact' && renderCompact()}
      {variant === 'default' && renderList()}
    </div>
  );
};

export default JediCapabilityList;
