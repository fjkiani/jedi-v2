/**
 * JEDI Comparison Table - Reusable component for comparing JEDI components
 * 
 * This component can display a comparison of multiple JEDI components
 * with their capabilities, features, and benefits.
 */

import React from 'react';
import { motion } from 'framer-motion';

const JediComparisonTable = ({ 
  components = [], 
  comparisonFields = ['name', 'tagline', 'capabilities', 'userExperience'],
  className = ''
}) => {
  if (!components || components.length === 0) return null;

  const getFieldValue = (component, field) => {
    switch (field) {
      case 'name':
        return component.name;
      case 'tagline':
        return component.tagline;
      case 'description':
        return component.description;
      case 'capabilities':
        return component.capabilities?.primary?.length || 0;
      case 'userExperience':
        return Object.keys(component.userExperience || {}).length;
      case 'problem':
        return component.problem?.title || '';
      default:
        return component[field] || '';
    }
  };

  const getFieldLabel = (field) => {
    const labels = {
      name: 'Component',
      tagline: 'Tagline',
      description: 'Description',
      capabilities: 'Key Capabilities',
      userExperience: 'User Experience Features',
      problem: 'Problem Solved'
    };
    return labels[field] || field;
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Feature
            </th>
            {components.map((component, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {component.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {comparisonFields.map((field, fieldIndex) => (
            <motion.tr
              key={field}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: fieldIndex * 0.1 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {getFieldLabel(field)}
              </td>
              {components.map((component, componentIndex) => (
                <td key={componentIndex} className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {field === 'capabilities' ? (
                    <div className="flex items-center">
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                        {getFieldValue(component, field)} features
                      </span>
                    </div>
                  ) : field === 'userExperience' ? (
                    <div className="flex items-center">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                        {getFieldValue(component, field)} aspects
                      </span>
                    </div>
                  ) : (
                    <div className="max-w-xs">
                      {getFieldValue(component, field)}
                    </div>
                  )}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JediComparisonTable;
