import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { aiMlSolution } from '@/constants/solutions/ai-ml';

const ArchitectureComponentDetail = () => {
  const { componentId } = useParams();
  
  // Find the component in the architecture nodes
  const component = aiMlSolution.architecture.nodes.find(
    node => node.id === componentId
  );

  if (!component) {
    return (
      <Section className="text-center">
        <h2 className="h2">Component not found</h2>
        <p className="text-n-3 mt-4">The component "{componentId}" could not be found.</p>
        <Link to="/solutions/ai-ml-solutions" className="button button-gradient mt-4">
          Back to AI/ML Solutions
        </Link>
      </Section>
    );
  }

  return (
    <Section className="overflow-hidden">
      <div className="container">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-n-3 mb-4"
        >
          <Link to="/" className="hover:text-color-1">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/solutions/ai-ml-solutions" className="hover:text-color-1">AI/ML Solutions</Link>
          <span className="mx-2">/</span>
          <Link to="/solutions/ai-ml-solutions#architecture" className="hover:text-color-1">Architecture</Link>
          <span className="mx-2">/</span>
          <span className="text-n-1">{component.label}</span>
        </motion.div>

        {/* Component Header */}
        <div className="mb-8">
          <h1 className="h2 mb-4">{component.label}</h1>
          <p className="text-n-3 text-lg">{component.description}</p>
        </div>

        {/* Technologies Section */}
        <div className="space-y-8">
          {component.technologies && Object.entries(component.technologies).map(([category, techs]) => (
            <div key={category} className="bg-n-7 rounded-xl p-6 border border-n-6">
              <h3 className="h4 mb-6 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(techs) ? (
                  // Handle array of technologies
                  techs.map((tech, index) => (
                    <div key={index} className="bg-n-8 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Icon name="check" className="w-5 h-5 text-primary-1" />
                        <span className="text-n-1">{tech}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  // Handle object of technologies with descriptions
                  Object.entries(techs).map(([name, description], index) => (
                    <div key={index} className="bg-n-8 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="check" className="w-5 h-5 text-primary-1" />
                        <span className="text-n-1">{name}</span>
                      </div>
                      {typeof description === 'string' && (
                        <p className="text-n-3 text-sm">{description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Related Components Section */}
        <div className="mt-12">
          <h3 className="h4 mb-6">Connected Components</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiMlSolution.architecture.connections
              .filter(conn => conn.from === componentId || conn.to === componentId)
              .map((connection, index) => {
                const relatedComponentId = connection.from === componentId ? connection.to : connection.from;
                const relatedComponent = aiMlSolution.architecture.nodes.find(
                  node => node.id === relatedComponentId
                );
                const isSource = connection.from === componentId;

                return (
                  <Link
                    key={index}
                    to={`/architecture/${relatedComponentId}`}
                    className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-primary-1 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Icon 
                        name={isSource ? "arrow-right" : "arrow-left"} 
                        className="w-5 h-5 text-primary-1" 
                      />
                      <h4 className="font-semibold">{relatedComponent?.label}</h4>
                    </div>
                    <p className="text-n-3 text-sm mb-2">{relatedComponent?.description}</p>
                    <div className="flex items-center gap-2 text-sm text-primary-1">
                      <span>{connection.label}</span>
                      <Icon name="arrow-right" className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ArchitectureComponentDetail; 