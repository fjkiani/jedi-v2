/**
 * Individual JEDI Component Page
 * 
 * This page displays a specific JEDI component with:
 * - Component overview and capabilities
 * - Real implementations and success stories
 * - Interactive demonstrations
 * - Call-to-action sections
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '../../components/Section';
import { 
  JediComponentShowcase,
  JediImplementationCard,
  JediComparisonTable
} from '../../components/jedi';
import { 
  getJediComponentById,
  getImplementationsByComponent,
  ALL_JEDI_COMPONENTS
} from '../../constants/jedi';
import { Helmet } from 'react-helmet-async';

const JediComponentPage = () => {
  const { componentSlug } = useParams();
  const [component, setComponent] = useState(null);
  const [implementations, setImplementations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true);
        
        // Find component by slug
        const foundComponent = ALL_JEDI_COMPONENTS.find(comp => 
          comp.id === componentSlug || comp.slug === componentSlug
        );
        
        if (foundComponent) {
          setComponent(foundComponent);
          const componentImplementations = getImplementationsByComponent(foundComponent.id);
          setImplementations(componentImplementations);
        } else {
          console.error(`Component not found: ${componentSlug}`);
        }
      } catch (error) {
        console.error('Error loading component:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, [componentSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-1 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-n-4">Loading JEDI component...</p>
        </div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="h1 mb-4">Component Not Found</h1>
          <p className="text-n-4 mb-8">The JEDI component you're looking for doesn't exist.</p>
          <Link to="/technology" className="btn-primary">
            Back to Technology
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{component.name} - JEDI AI Component | JEDI Labs</title>
        <meta name="description" content={component.description} />
        <meta name="keywords" content={`JEDI, AI, ${component.name}, ${component.tagline}, automation, business solutions`} />
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
                {component.name}
              </h1>
              <p className="h3 mb-4 theme-text-secondary">
                {component.tagline}
              </p>
              <p className="body-1 theme-text-secondary mb-8">
                {component.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="btn-primary">
                  Get Started
                </Link>
                <Link to="/solutions" className="btn-secondary">
                  View All Solutions
                </Link>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Component Showcase */}
        <Section className="py-20 theme-bg-secondary">
          <div className="container">
            <JediComponentShowcase
              component={component}
              implementations={implementations}
            />
          </div>
        </Section>

        {/* Success Stories */}
        {implementations.length > 0 && (
          <Section className="py-20">
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
                  See how {component.name} has helped businesses solve real problems 
                  and achieve measurable results.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {implementations.map((implementation, index) => (
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
            </div>
          </Section>
        )}

        {/* Component Comparison */}
        <Section className="py-20 theme-bg-secondary">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              <h2 className="h2 text-center theme-text-primary mb-8">
                Compare JEDI Components
              </h2>
              <JediComparisonTable
                components={ALL_JEDI_COMPONENTS}
                comparisonFields={['name', 'tagline', 'capabilities']}
              />
            </motion.div>
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
                See how {component.name} can solve your specific business challenges 
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

export default JediComponentPage;
