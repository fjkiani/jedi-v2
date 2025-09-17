/**
 * JEDI Page - Dedicated page showcasing all JEDI components
 * 
 * This page reuses components from the homepage to showcase:
 * - All JEDI components overview
 * - Interactive component selection
 * - Real implementations and success stories
 * - Routes to individual JEDI component pages
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import { 
  JediComponentCard,
  JediComparisonTable,
  JediImplementationCard,
  ALL_JEDI_COMPONENTS,
  getAllJediImplementations
} from '../components/jedi';
import { Helmet } from 'react-helmet-async';

const JediPage = () => {
  const [selectedComponent, setSelectedComponent] = useState(ALL_JEDI_COMPONENTS[0]);
  const allImplementations = getAllJediImplementations();
  const componentImplementations = allImplementations.filter(impl => 
    impl.componentId === selectedComponent?.id
  );

  return (
    <>
      <Helmet>
        <title>JEDI AI Components - Smart AI Solutions | JEDI Labs</title>
        <meta name="description" content="Explore JEDI's three powerful AI components: Ensemble, Rules, and Automate. See how they solve real business problems with measurable results." />
        <meta name="keywords" content="JEDI, AI components, Ensemble, Rules, Automate, business automation, AI solutions" />
      </Helmet>

      <div className="min-h-screen theme-bg-primary">
        {/* Hero Section */}
        <Section className="pt-32 pb-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="h1 mb-6 theme-text-primary">
                JEDI AI Components
              </h1>
              <p className="h3 mb-4 theme-text-secondary">
                Three powerful AI components that work together to solve any business problem
              </p>
              <p className="body-1 theme-text-secondary mb-8">
                No technical expertise required - just tell us what you need and we handle the rest. 
                See how our JEDI components have helped businesses achieve real, measurable results.
              </p>
            </motion.div>
          </div>
        </Section>

        {/* JEDI Components Overview */}
        <Section className="py-20 theme-bg-secondary">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="h2 theme-text-primary mb-6">
                Our JEDI Components
              </h2>
              <p className="body-1 theme-text-secondary max-w-3xl mx-auto">
                Each component is designed to work out-of-the-box with no technical expertise required. 
                They work together seamlessly to solve complex business challenges.
              </p>
            </motion.div>

            {/* Component Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {ALL_JEDI_COMPONENTS.map((component, index) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="h-full"
                >
                  <JediComponentCard
                    component={component}
                    variant="compact"
                    showCapabilities={true}
                    showProblem={true}
                    showUserExperience={false}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>

            {/* Component Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              <h3 className="h3 text-center theme-text-primary mb-8">
                Compare Our Components
              </h3>
              <JediComparisonTable
                components={ALL_JEDI_COMPONENTS}
                comparisonFields={['name', 'tagline', 'capabilities']}
              />
            </motion.div>
          </div>
        </Section>

        {/* Interactive Component Showcase */}
        <Section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="h2 theme-text-primary mb-6">
                Explore Each Component
              </h2>
              <p className="body-1 theme-text-secondary max-w-3xl mx-auto">
                Click on any component to see its capabilities, real implementations, and success stories.
              </p>
            </motion.div>

            {/* Component Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {ALL_JEDI_COMPONENTS.map((component) => (
                <button
                  key={component.id}
                  onClick={() => setSelectedComponent(component)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    selectedComponent.id === component.id
                      ? 'bg-primary-1 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {component.name}
                </button>
              ))}
            </div>

            {/* Selected Component Details */}
            <motion.div
              key={selectedComponent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12"
            >
              <div className="text-center mb-8">
                <h3 className="h3 theme-text-primary mb-4">
                  {selectedComponent.name}
                </h3>
                <p className="h4 theme-text-secondary mb-4">
                  {selectedComponent.tagline}
                </p>
                <p className="body-1 theme-text-secondary max-w-3xl mx-auto">
                  {selectedComponent.description}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Key Capabilities */}
                <div>
                  <h4 className="h4 theme-text-primary mb-6">
                    Key Capabilities
                  </h4>
                  <div className="space-y-4">
                    {selectedComponent.capabilities.primary.map((capability, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary-1 flex items-center justify-center text-white text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium theme-text-primary">
                            {capability.name}
                          </p>
                          <p className="text-sm theme-text-secondary">
                            {capability.userBenefit}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Success Stories Preview */}
                <div>
                  <h4 className="h4 theme-text-primary mb-6">
                    Success Stories
                  </h4>
                  <div className="space-y-4">
                    {componentImplementations.slice(0, 3).map((implementation, index) => (
                      <motion.div
                        key={implementation.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center text-white font-bold text-sm">
                            {implementation.client?.charAt(0) || 'C'}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold theme-text-primary mb-1">
                              {implementation.client}
                            </h5>
                            <p className="text-sm theme-text-secondary mb-2">
                              {implementation.industry}
                            </p>
                            <p className="text-sm theme-text-secondary">
                              {implementation.problem}
                            </p>
                            <div className="mt-2 flex items-center gap-4 text-xs">
                              <span className="text-green-500 font-medium">
                                ✓ {implementation.results?.responseTime || '80% faster'}
                              </span>
                              <span className="text-blue-500 font-medium">
                                ✓ {implementation.results?.customerSatisfaction || '60% improvement'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <Link
                  to={`/technology/${selectedComponent.id}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Learn More About {selectedComponent.name}
                </Link>
                <Link
                  to="/contact"
                  className="btn-secondary flex items-center gap-2"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* All Success Stories */}
        <Section className="py-20 theme-bg-secondary">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="h2 theme-text-primary mb-6">
                Real Success Stories
              </h2>
              <p className="body-1 theme-text-secondary max-w-3xl mx-auto">
                See how our JEDI components have helped businesses across industries achieve real, measurable results.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {allImplementations.slice(0, 6).map((implementation, index) => (
                <motion.div
                  key={implementation.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <JediImplementationCard
                    implementation={implementation}
                    variant="compact"
                    showTechnicalDetails={false}
                    showBusinessImpact={true}
                    showScalability={false}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Call to Action */}
        <Section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center bg-gradient-to-r from-primary-1 to-purple-600 rounded-2xl p-12 text-white"
            >
              <h2 className="h2 mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="body-1 mb-8 max-w-2xl mx-auto opacity-90">
                See how our JEDI components can solve your specific business challenges 
                with real, measurable results. No technical expertise required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-white text-primary-1 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/solutions"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-1 transition-colors"
                >
                  View All Solutions
                </Link>
              </div>
            </motion.div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default JediPage;
