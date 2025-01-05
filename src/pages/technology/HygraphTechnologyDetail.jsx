import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Icon from '@/components/Icon';
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
      category {
        id
        name
        slug
        technologies(where: { NOT: { slug: $slug } }) {
          id
          name
          slug
          description
          icon {
            url
          }
        }
      }
      subcategories {
        id
        name
        slug
        technologies {
          id
          name
          slug
          description
          icon {
            url
          }
        }
      }
      features {
        id
        title
        description
      }
      services {
        id
        name
        description
      }
      primaryUses {
        id
        name
        description
      }
      metrics {
        id
        name
        value
        description
      }
      deployment {
        id
        type
        details
      }
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
          id
          name
          slug
          icon {
            url
          }
          description
        }
        industry {
          id
          name
          slug
          description
        }
      }
    }
  }
`;

// Query to fetch related technologies
const GET_RELATED_TECHNOLOGIES = `
  query GetRelatedTechnologies($category: String!, $currentTechId: ID!) {
    technologyS(where: { category: $category, NOT: { id: $currentTechId } }) {
      id
      name
      slug
      description
      icon
      category
      primaryUses
    }
  }
`;

// Query to fetch technologies by subcategory
const GET_TECHNOLOGIES_BY_SUBCATEGORY = `
  query GetTechnologiesBySubcategory($subcategory: String!) {
    technologyS(where: { subcategories_contains_some: [$subcategory] }) {
      id
      name
      slug
      description
      icon
      category
      primaryUses
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
  console.log('Component mounted, slug from params:', useParams());
  const { slug } = useParams();
  const [technology, setTechnology] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchTechnologyData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching data for slug:', slug);
        const result = await hygraphClient.request(GET_TECHNOLOGY_DETAILS, { slug });
        console.log('Raw Hygraph response:', result);
        
        const { technology } = result;
        if (!technology) {
          throw new Error('Technology not found');
        }
        
        console.log('Technology data:', technology);
        console.log('Category:', technology.category);
        console.log('Subcategories:', technology.subcategories);
        console.log('Features:', technology.features);
        console.log('Services:', technology.services);
        
        setTechnology(technology);
        
      } catch (err) {
        console.error('Error fetching technology data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTechnologyData();
    }
  }, [slug]);

  const handleUseCaseClick = (useCase) => {
    setSelectedUseCase(useCase);
    // Scroll to use case details if on use-cases tab
    if (activeTab === 'use-cases') {
      document.getElementById('use-case-details')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('use-cases');
    }
  };

  const renderTechnologyCard = (tech) => (
    <Link 
      to={`/technology/${tech.slug}`}
      key={tech.id}
      className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors"
    >
      <div className="flex items-center gap-4 mb-4">
        {tech.icon?.url ? (
          <img 
            src={tech.icon.url} 
            alt={tech.name}
            className="w-12 h-12 object-contain"
          />
        ) : (
          <Icon name="code" className="w-12 h-12 text-primary-1" />
        )}
        <div>
          <h4 className="text-lg font-semibold mb-1">{tech.name}</h4>
          <p className="text-sm text-n-3 line-clamp-2">{tech.description}</p>
        </div>
      </div>
      {tech.primaryUses?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tech.primaryUses.slice(0, 3).map(use => (
            <span 
              key={use.id}
              className="px-2 py-1 bg-n-6 rounded-full text-xs text-n-1"
            >
              {use.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Technology Description */}
      <div className="bg-n-7 rounded-xl p-6 border border-n-6">
        <h3 className="h4 mb-4">About {technology.name}</h3>
        <p className="text-n-3">{technology.description}</p>
      </div>

      {/* Related Technologies from Same Category */}
      {technology.category?.technologies?.length > 0 && (
        <div>
          <h3 className="h4 mb-4">More from {technology.category.name}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technology.category.technologies.map(tech => renderTechnologyCard(tech))}
          </div>
        </div>
      )}

      {/* Technologies by Subcategory */}
      {technology.subcategories?.length > 0 && (
        <div>
          <h3 className="h4 mb-4">Technology Stack</h3>
          {technology.subcategories.map((subcategory) => (
            subcategory.technologies?.length > 0 && (
              <div key={subcategory.id} className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-color-1">{subcategory.name}</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subcategory.technologies.map(tech => renderTechnologyCard(tech))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Metrics and Deployment */}
      {(technology.metrics?.length > 0 || technology.deployment) && (
        <div className="grid md:grid-cols-2 gap-6">
          {technology.metrics?.length > 0 && (
            <div className="bg-n-7 rounded-xl p-6 border border-n-6">
              <h3 className="h4 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                {technology.metrics.map(metric => (
                  <div key={metric.id} className="border-b border-n-6 pb-4 last:border-0">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-lg font-medium">{metric.name}</h4>
                      <span className="text-color-1 font-mono">{metric.value}</span>
                    </div>
                    <p className="text-n-3 text-sm">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {technology.deployment && (
            <div className="bg-n-7 rounded-xl p-6 border border-n-6">
              <h3 className="h4 mb-4">Deployment Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-n-3">
                  <span className="font-medium">Type:</span>
                  <span>{technology.deployment.type}</span>
                </div>
                <p className="text-n-3 whitespace-pre-wrap">{technology.deployment.details}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-8">
      {/* Features */}
      {technology.features?.length > 0 && (
        <div className="bg-n-7 rounded-xl p-6 border border-n-6">
          <h3 className="h4 mb-6">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {technology.features.map(feature => (
              <div key={feature.id} className="bg-n-6 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-n-3">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Uses */}
      {technology.primaryUses?.length > 0 && (
        <div className="bg-n-7 rounded-xl p-6 border border-n-6">
          <h3 className="h4 mb-6">Primary Uses</h3>
          <div className="grid gap-4">
            {technology.primaryUses.map(use => (
              <div key={use.id} className="flex items-start gap-3">
                <Icon name="check-circle" className="w-6 h-6 text-color-1 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium mb-1">{use.name}</h4>
                  <p className="text-n-3 text-sm">{use.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      {technology.services?.length > 0 && (
        <div className="bg-n-7 rounded-xl p-6 border border-n-6">
          <h3 className="h4 mb-6">Available Services</h3>
          <div className="grid gap-4">
            {technology.services.map(service => (
              <div key={service.id} className="bg-n-6 rounded-lg p-4">
                <h4 className="font-medium mb-2">{service.name}</h4>
                <p className="text-n-3 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderIntegrationTab = () => (
    <div className="space-y-8">
      {/* APIs */}
      {technology.apis?.length > 0 && (
        <div className="bg-n-7 rounded-xl p-6 border border-n-6">
          <h3 className="h4 mb-6">Available APIs</h3>
          <div className="grid gap-6">
            {technology.apis.map(api => (
              <div key={api.id} className="bg-n-6 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{api.name}</h4>
                  {api.documentation && (
                    <a 
                      href={api.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-color-1 text-sm hover:underline"
                    >
                      Documentation
                    </a>
                  )}
                </div>
                <p className="text-n-3 text-sm mb-3">{api.description}</p>
                {api.endpoint && (
                  <div className="bg-n-7 rounded p-2 font-mono text-sm text-n-2">
                    {api.endpoint}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compatible Technologies */}
      {technology.compatibleWith?.length > 0 && (
        <div className="bg-n-7 rounded-xl p-6 border border-n-6">
          <h3 className="h4 mb-6">Compatible Technologies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technology.compatibleWith.map(tech => renderTechnologyCard(tech))}
          </div>
        </div>
      )}

      {/* Documentation Links */}
      <div className="bg-n-7 rounded-xl p-6 border border-n-6">
        <h3 className="h4 mb-6">Resources</h3>
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
              GitHub Repository
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
              Official Website
            </a>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'features':
        return renderFeaturesTab();
      case 'use-cases':
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technology.useCases?.map((useCase) => (
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
        );
      case 'integration':
        return renderIntegrationTab();
      default:
        return null;
    }
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
    <div className="container relative">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-n-3">Error loading technology details.</p>
        </div>
      ) : technology ? (
        <>
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            {technology.icon?.url && (
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={technology.icon.url}
                  alt={`${technology.name} icon`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="h2 mb-2">{technology.name}</h1>
              {technology.category && (
                <div className="flex items-center gap-2">
                  <span className="text-n-3">Category:</span>
                  <span className="px-3 py-1 bg-n-6 rounded-full text-sm">
                    {technology.category.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-n-6 mb-8">
            <button
              className={`px-6 py-3 text-base font-semibold ${
                activeTab === 'overview'
                  ? 'text-color-1 border-b-2 border-color-1'
                  : 'text-n-3 hover:text-n-1'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 text-base font-semibold ${
                activeTab === 'features'
                  ? 'text-color-1 border-b-2 border-color-1'
                  : 'text-n-3 hover:text-n-1'
              }`}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
            {technology.useCases?.length > 0 && (
              <button
                className={`px-6 py-3 text-base font-semibold ${
                  activeTab === 'use-cases'
                    ? 'text-color-1 border-b-2 border-color-1'
                    : 'text-n-3 hover:text-n-1'
                }`}
                onClick={() => setActiveTab('use-cases')}
              >
                Use Cases
              </button>
            )}
            <button
              className={`px-6 py-3 text-base font-semibold ${
                activeTab === 'integration'
                  ? 'text-color-1 border-b-2 border-color-1'
                  : 'text-n-3 hover:text-n-1'
              }`}
              onClick={() => setActiveTab('integration')}
            >
              Integration
            </button>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </>
      ) : null}
    </div>
  );
};

export default HygraphTechnologyDetail; 