import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import Section from '@/components/Section';
import { hygraphClient } from '@/lib/hygraph';
import UseCaseCard from '@/components/UseCaseCard';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const GET_TECHNOLOGY_DETAILS = `
  query GetTechnologyDetails($slug: String!) {
    technology(where: { slug: $slug }) {
      id
      name
      description
      icon {
        url
      }
      category
      subcategories
      services
      primaryUses
      metrics
      deployment
      compatibleWith
      apis
      documentation
      github
      website
      useCases {
        id
        title
        description
        queries
        capabilities
        architecture {
          description
          components {
            name
            description
            details
            explanation
          }
          flow {
            step
            description
            details
          }
        }
        implementation
        technologies {
          name
          slug
          icon
        }
      }
    }
  }
`;

const createWorkflowDiagram = (flow) => {
  if (!flow || flow.length === 0) return { nodes: [], edges: [] };

  return {
    nodes: flow.map((step, index) => ({
      id: `${index}`,
      data: { 
        label: (
          <div className="bg-transparent p-4 rounded-lg text-sm text-n-3 border border-dashed border-n-6 min-w-[200px]">
            <div className="font-medium mb-2">{step.step}</div>
            {step.description}
          </div>
        )
      },
      position: { 
        x: 300 * (index % 3),
        y: Math.floor(index / 3) * 200
      },
      type: 'default',
      style: { 
        background: 'transparent', 
        border: 'none',
        width: 250,
      },
    })),
    edges: flow.slice(0, -1).map((_, i) => ({
      id: `e${i}-${i+1}`,
      source: `${i}`,
      target: `${i+1}`,
      type: 'smoothstep',
      style: { stroke: '#6366f1' },
      animated: true,
    })),
  };
};

const HygraphTechnologyDetail = () => {
  const { slug } = useParams();
  const [technology, setTechnology] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState(null);

  useEffect(() => {
    const fetchTechnologyDetails = async () => {
      try {
        setLoading(true);
        const { technology } = await hygraphClient.request(GET_TECHNOLOGY_DETAILS, { slug });
        console.log('Technology details:', technology);
        setTechnology(technology);
      } catch (err) {
        console.error('Error fetching technology details:', err);
        setError('Error loading technology details');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologyDetails();
  }, [slug]);

  const handleUseCaseClick = (useCase) => {
    setSelectedUseCase(useCase);
    setTimeout(() => {
      const element = document.getElementById('use-case-details');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  if (loading) {
    return (
      <Section className="text-center">
        <div className="animate-pulse">Loading technology details...</div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">{error}</p>
        </div>
      </Section>
    );
  }

  if (!technology) {
    return (
      <Section className="text-center">
        <h2 className="h2">Technology not found</h2>
        <p className="text-n-3 mt-4">The technology "{slug}" could not be found.</p>
        <Link to="/technologies" className="button button-gradient mt-4">
          View All Technologies
        </Link>
      </Section>
    );
  }

  return (
    <Section className="overflow-hidden">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-n-3 mb-4"
        >
          <Link to="/" className="hover:text-color-1">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/technologies" className="hover:text-color-1">Technologies</Link>
          <span className="mx-2">/</span>
          <span className="text-n-1">{technology.name}</span>
        </motion.div>

        {/* Technology Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-6 mb-6">
            {technology.icon?.url ? (
              <img 
                src={technology.icon.url} 
                alt={technology.name}
                className="w-16 h-16 object-contain"
              />
            ) : (
              <Icon name="code" className="w-16 h-16 text-primary-1" />
            )}
            <div>
              <h1 className="h1 mb-2">{technology.name}</h1>
              <p className="text-n-3">{technology.description}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-4">
            {technology.documentation && (
              <a 
                href={technology.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-small"
              >
                <Icon name="book" className="w-4 h-4 mr-2" />
                Documentation
              </a>
            )}
            {technology.github && (
              <a 
                href={technology.github}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-small"
              >
                <Icon name="github" className="w-4 h-4 mr-2" />
                GitHub
              </a>
            )}
            {technology.website && (
              <a 
                href={technology.website}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-small"
              >
                <Icon name="external-link" className="w-4 h-4 mr-2" />
                Website
              </a>
            )}
          </div>
        </motion.div>

        {/* Technology Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Primary Uses */}
          {technology.primaryUses && (
            <div className="bg-n-7 rounded-xl p-6 border border-n-6">
              <h3 className="h4 mb-4">Primary Uses</h3>
              <div className="flex flex-wrap gap-2">
                {technology.primaryUses.map((use, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-n-6 rounded-full text-sm text-n-1"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Compatible Technologies */}
          {technology.compatibleWith && (
            <div className="bg-n-7 rounded-xl p-6 border border-n-6">
              <h3 className="h4 mb-4">Compatible With</h3>
              <div className="flex flex-wrap gap-2">
                {technology.compatibleWith.map((tech, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-n-6 rounded-full text-sm text-n-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* APIs */}
          {technology.apis && (
            <div className="bg-n-7 rounded-xl p-6 border border-n-6">
              <h3 className="h4 mb-4">Available APIs</h3>
              <div className="flex flex-wrap gap-2">
                {technology.apis.map((api, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-n-6 rounded-full text-sm text-n-1"
                  >
                    {api}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {technology.services && (
            <div className="bg-n-7 rounded-xl p-6 border border-n-6">
              <h3 className="h4 mb-4">Services</h3>
              <div className="flex flex-wrap gap-2">
                {technology.services.map((service, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-n-6 rounded-full text-sm text-n-1"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Use Cases */}
        {technology.useCases && technology.useCases.length > 0 && (
          <div className="mb-12">
            <h2 className="h3 mb-6">Use Cases</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technology.useCases.map((useCase) => (
                <div 
                  key={useCase.id}
                  onClick={() => handleUseCaseClick(useCase)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <UseCaseCard useCase={useCase} />
                </div>
              ))}
            </div>

            {selectedUseCase && (
              <div 
                id="use-case-details" 
                className="mt-8 bg-n-8 rounded-xl p-6 border border-n-6 scroll-mt-8"
              >
                <h3 className="h4 mb-4">{selectedUseCase.title}</h3>
                <div className="space-y-6">
                  <p className="text-n-3">{selectedUseCase.description}</p>

                  {/* Architecture */}
                  {selectedUseCase.architecture && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Architecture</h4>
                      <p className="text-n-3 mb-4">{selectedUseCase.architecture.description}</p>
                      
                      {selectedUseCase.architecture.flow && (
                        <div className="h-[400px] bg-n-7 rounded-lg p-4 mb-6">
                          <ReactFlow 
                            nodes={createWorkflowDiagram(selectedUseCase.architecture.flow).nodes}
                            edges={createWorkflowDiagram(selectedUseCase.architecture.flow).edges}
                            fitView
                            className="react-flow-dark"
                          >
                            <Background color="#4b5563" gap={16} />
                            <Controls className="react-flow-controls" />
                            <MiniMap className="react-flow-minimap" />
                          </ReactFlow>
                        </div>
                      )}
                      
                      {selectedUseCase.architecture.components?.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {selectedUseCase.architecture.components.map((component, idx) => (
                            <div key={idx} className="bg-n-7 rounded-lg p-4">
                              <h5 className="font-medium mb-2">{component.name}</h5>
                              <p className="text-n-3 text-sm">{component.description}</p>
                              {component.details && (
                                <div className="mt-2 text-sm text-n-4">
                                  {component.details}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Implementation */}
                  {selectedUseCase.implementation && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Implementation</h4>
                      <div className="bg-n-7 rounded-lg p-4">
                        <p className="text-n-3 whitespace-pre-wrap">
                          {selectedUseCase.implementation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Capabilities */}
                  {selectedUseCase.capabilities && selectedUseCase.capabilities.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Capabilities</h4>
                      <div className="grid gap-3">
                        {selectedUseCase.capabilities.map((capability, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Icon name="check" className="w-6 h-6 text-primary-1 mt-1" />
                            <p className="text-n-3">{capability}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
};

export default HygraphTechnologyDetail; 