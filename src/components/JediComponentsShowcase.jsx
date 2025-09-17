/**
 * JEDI Components Showcase - Home Page Section
 * 
 * This component showcases all three JEDI components on the home page
 * using the reusable component system we created.
 */

import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { 
  JediComponentCard, 
  JediComparisonTable
} from './jedi';
import { ALL_JEDI_COMPONENTS } from '../constants/jedi';

const JediComponentsShowcase = () => {
  return (
    <Section
      className="py-20 theme-bg-secondary"
      crosses
      id="jedi-components"
    >
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="h2 mb-6 theme-text-primary"
          >
            Our JEDI Components
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="body-1 theme-text-secondary"
          >
            Three powerful AI components that work together to solve any business problem. 
            No technical expertise required - just tell us what you need and we handle the rest.
          </motion.p>
        </div>

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

        {/* Comparison Table */}
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

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="h3 theme-text-primary mb-6">
            Ready to Transform Your Business?
          </h3>
          <p className="body-1 theme-text-secondary mb-8 max-w-2xl mx-auto">
            See how our JEDI components can solve your specific business challenges 
            with real, measurable results. No technical expertise required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/contact"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
            <motion.a
              href="/solutions"
              className="btn-secondary"
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

export default JediComponentsShowcase;
