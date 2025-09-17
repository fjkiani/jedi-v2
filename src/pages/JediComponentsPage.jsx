/**
 * JEDI Components Page - Demo Page
 * 
 * This page demonstrates how to use the JEDI components system
 * to create dynamic, data-driven content.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  JediComponentShowcase,
  JediComparisonTable,
  JediImplementationCard
} from '../components/jedi';
import { 
  ALL_JEDI_COMPONENTS,
  getAllJediImplementations
} from '../constants/jedi';

const JediComponentsPage = () => {
  const allImplementations = getAllJediImplementations();

  return (
    <div className="min-h-screen theme-bg-primary">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="h1 mb-6 theme-text-primary">
              JEDI Components System
            </h1>
            <p className="body-1 theme-text-secondary mb-8">
              A complete system of reusable components that display JEDI content dynamically. 
              No hard-coding required - all content comes from our data constants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Component Showcases */}
      <section className="py-20">
        <div className="container">
          <div className="space-y-20">
            {ALL_JEDI_COMPONENTS.map((component, index) => (
              <motion.div
                key={component.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <JediComponentShowcase
                  component={component}
                  implementations={allImplementations.filter(impl => 
                    impl.componentId === component.id
                  )}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 theme-bg-secondary">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
          >
            <h2 className="h2 text-center theme-text-primary mb-8">
              Component Comparison
            </h2>
            <JediComparisonTable
              components={ALL_JEDI_COMPONENTS}
              comparisonFields={['name', 'tagline', 'capabilities', 'userExperience']}
            />
          </motion.div>
        </div>
      </section>

      {/* All Implementations */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="h2 text-center theme-text-primary mb-12">
              All Success Stories
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {allImplementations.map((implementation, index) => (
                <motion.div
                  key={implementation.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <JediImplementationCard
                    implementation={implementation}
                    variant="detailed"
                    showTechnicalDetails={true}
                    showBusinessImpact={true}
                    showScalability={true}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 theme-bg-secondary">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-gradient-to-r from-primary-1 to-purple-600 rounded-2xl p-12 text-white"
          >
            <h2 className="h2 mb-6">
              Ready to Use These Components?
            </h2>
            <p className="body-1 mb-8 max-w-2xl mx-auto opacity-90">
              These components are designed to be reusable, maintainable, and scalable. 
              Use them throughout your application to display JEDI content dynamically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="bg-white text-primary-1 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.a>
              <motion.a
                href="/solutions"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-1 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Solutions
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default JediComponentsPage;
