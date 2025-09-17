/**
 * JEDI Detailed Showcase - Comprehensive JEDI Components Display
 * 
 * This component provides a detailed showcase of JEDI components with
 * implementations, capabilities, and results. Perfect for dedicated pages.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { 
  JediComponentShowcase,
  JediImplementationCard
} from './jedi';
import { 
  ALL_JEDI_COMPONENTS,
  getAllJediImplementations
} from '../../constants/jedi';

const JediDetailedShowcase = () => {
  const [selectedComponent, setSelectedComponent] = useState(ALL_JEDI_COMPONENTS[0]);
  const allImplementations = getAllJediImplementations();

  return (
    <Section
      className="py-20 theme-bg-secondary"
      crosses
      id="jedi-detailed-showcase"
    >
      <div className="container">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="h2 mb-6 theme-text-primary"
          >
            JEDI AI Components
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="body-1 theme-text-secondary"
          >
            Three powerful AI components that work together to solve any business problem. 
            Each component is designed to work out-of-the-box with no technical expertise required.
          </motion.p>
        </div>

        {/* Component Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
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
        </motion.div>

        {/* Selected Component Showcase */}
        <motion.div
          key={selectedComponent.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <JediComponentShowcase
            component={selectedComponent}
            implementations={allImplementations.filter(impl => 
              impl.componentId === selectedComponent.id
            )}
          />
        </motion.div>

        {/* All Implementations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="h3 text-center theme-text-primary mb-12">
            Real Success Stories
          </h3>
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
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center bg-gradient-to-r from-primary-1 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h3 className="h3 mb-6">
            Ready to Transform Your Business?
          </h3>
          <p className="body-1 mb-8 max-w-2xl mx-auto opacity-90">
            See how our JEDI components can solve your specific business challenges 
            with real, measurable results. No technical expertise required.
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
              Learn More
            </motion.a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default JediDetailedShowcase;
