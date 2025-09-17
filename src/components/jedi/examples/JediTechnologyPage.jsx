/**
 * Example: JEDI Technology Page
 * 
 * This is an example of how to use the JEDI components to create
 * a complete technology page without hard-coding any content.
 */

import React, { useState, useEffect } from 'react';
import { 
  JediComponentShowcase, 
  JediComparisonTable, 
  JediImplementationCard
} from '@/components/jedi';
import { 
  getJediComponentById,
  getImplementationsByComponent,
  ALL_JEDI_COMPONENTS
} from '@/constants/jedi';

const JediTechnologyPage = ({ componentId, technologyName }) => {
  const [component, setComponent] = useState(null);
  const [implementations, setImplementations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load component data
    const jediComponent = getJediComponentById(componentId);
    if (jediComponent) {
      setComponent(jediComponent);
      
      // Load implementations for this component
      const componentImplementations = getImplementationsByComponent(componentId);
      setImplementations(componentImplementations);
    }
    setLoading(false);
  }, [componentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Component Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The requested JEDI component could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {component.name}
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-medium mb-2">
              {component.tagline}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {component.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Component Showcase */}
          <JediComponentShowcase 
            component={component}
            implementations={implementations}
          />

          {/* Success Stories Section */}
          {implementations.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Real Success Stories
              </h2>
              <div className="grid gap-8">
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
          )}

          {/* Comparison with Other Components */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Compare with Other JEDI Components
            </h2>
            <JediComparisonTable 
              components={ALL_JEDI_COMPONENTS}
              comparisonFields={['name', 'tagline', 'capabilities', 'userExperience']}
            />
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              See how {component.name} can solve your specific business challenges with real, measurable results.
            </p>
            <div className="space-x-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Get Started
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JediTechnologyPage;
