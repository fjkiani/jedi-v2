/**
 * JEDI Component Showcase - Main showcase component
 * 
 * This component combines all the other JEDI components to create a complete
 * showcase of a JEDI component with its implementations and capabilities.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import JediComponentCard from './JediComponentCard';
import JediImplementationCard from './JediImplementationCard';
import JediCapabilityList from './JediCapabilityList';
import JediResultsGrid from './JediResultsGrid';

const JediComponentShowcase = ({ 
  component, 
  implementations = [],
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!component) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'capabilities', label: 'Capabilities', icon: '⚡' },
    { id: 'implementations', label: 'Success Stories', icon: '🎯' },
    { id: 'results', label: 'Results', icon: '📊' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <JediComponentCard 
        component={component} 
        variant="detailed"
        showProblem={true}
        showCapabilities={false}
        showUserExperience={true}
      />
    </div>
  );

  const renderCapabilities = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What {component.name} Does For You
        </h3>
        <JediCapabilityList 
          capabilities={component.capabilities}
          variant="detailed"
          showSecondary={true}
        />
      </div>
    </div>
  );

  const renderImplementations = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Real Success Stories
        </h3>
        <div className="grid gap-6">
          {implementations.map((implementation, index) => (
            <JediImplementationCard
              key={implementation.id || index}
              implementation={implementation}
              variant="detailed"
              showTechnicalDetails={true}
              showBusinessImpact={true}
              showScalability={true}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    // Collect all results from implementations
    const allResults = implementations.reduce((acc, impl) => {
      if (impl.results) {
        Object.entries(impl.results).forEach(([key, value]) => {
          if (!acc[key]) acc[key] = [];
          acc[key].push(value);
        });
      }
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Proven Results
          </h3>
          <div className="grid gap-6">
            {implementations.map((implementation, index) => (
              <div key={implementation.id || index} className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {implementation.client} - {implementation.industry}
                </h4>
                {implementation.results && (
                  <JediResultsGrid 
                    results={implementation.results}
                    variant="default"
                    showLabels={true}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'capabilities':
        return renderCapabilities();
      case 'implementations':
        return renderImplementations();
      case 'results':
        return renderResults();
      default:
        return renderOverview();
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {component.name}
        </h2>
        <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">
          {component.tagline}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {component.description}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default JediComponentShowcase;



