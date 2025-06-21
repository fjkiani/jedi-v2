import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const InteractiveArchitecture = ({ architecture }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedFlow, setSelectedFlow] = useState(null);

  if (!architecture) return null;

  const components = architecture.components || [];
  const flow = architecture.flow || [];

  const renderComponent = (component, index) => (
    <motion.div
      key={component.id || index}
      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        selectedComponent === component.id 
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-400'
      }`}
      onClick={() => setSelectedComponent(selectedComponent === component.id ? null : component.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        <h4 className="font-medium text-sm text-gray-900 dark:text-white">
          {component.name}
        </h4>
      </div>
      
      {component.description && (
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {component.description}
        </p>
      )}

      {selectedComponent === component.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600"
        >
          {component.details && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              <strong>Details:</strong> {component.details}
            </p>
          )}
          
          {component.explanation && Array.isArray(component.explanation) && (
            <div className="text-lg text-gray-700 dark:text-gray-300">
              <strong>Key Points:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {component.explanation.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  const renderFlowStep = (step, index) => (
    <motion.div
      key={step.id || index}
      className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        selectedFlow === step.id 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-400'
      }`}
      onClick={() => setSelectedFlow(selectedFlow === step.id ? null : step.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Step Number */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
        {index + 1}
      </div>

      <div className="ml-2">
        <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
          {step.step || `Step ${index + 1}`}
        </h4>
        
        {step.description && (
          <p className="text-lb text-gray-600 dark:text-gray-400">
            {step.description}
          </p>
        )}

        {selectedFlow === step.id && step.details && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>Details:</strong> {step.details}
            </p>
          </motion.div>
        )}
      </div>

      {/* Arrow to next step */}
      {index < flow.length - 1 && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Architecture Description */}
      {architecture.description && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="text-purple-500">🏗️</span>
            Architecture Overview
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {architecture.description}
          </p>
        </div>
      )}

      {/* Components Section */}
      {components.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-purple-500">⚙️</span>
            System Components
            <span className="text-lg text-gray-500 dark:text-gray-400">
              (Click to explore)
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {components.map(renderComponent)}
          </div>
        </div>
      )}

      {/* Flow Section */}
      {flow.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-blue-500">🔄</span>
            Implementation Flow
            <span className="text-lg text-gray-500 dark:text-gray-400">
              (Click steps for details)
            </span>
          </h3>
          <div className="space-y-6">
            {flow.map(renderFlowStep)}
          </div>
        </div>
      )}

      {/* Interactive Hints */}
      <div className="text-lg text-gray-500 dark:text-gray-400 text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
        💡 Click on components and flow steps to explore implementation details
      </div>
    </div>
  );
};

export default InteractiveArchitecture; 
 
 