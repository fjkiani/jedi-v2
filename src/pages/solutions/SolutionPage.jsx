import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSolutionBySlug } from '@/constants/solutions';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import ArchitectureDiagram from '@/components/diagrams/ArchitectureDiagram';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import {
  TabsRoot,
  TabsList,
  TabTrigger,
  TabsContent,
  TabPanel
} from '@/components/ui/Tabs';
import { hygraphClient } from '@/lib/hygraph';
import AIResponse from '@/components/response/AIResponse';
import UseCaseCard from '@/components/UseCaseCard';

const GET_USE_CASES = `
  query GetUseCases {
    useCaseS {
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
      metrics
      implementation
      technologies {
        name
        slug
        icon
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

const SolutionPage = () => {
  const { slug } = useParams();
  const solution = getSolutionBySlug(slug);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState(null);

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        setLoading(true);
        const { useCaseS } = await hygraphClient.request(GET_USE_CASES);
        console.log('Hygraph response:', useCaseS);
        setUseCases(useCaseS || []);
      } catch (err) {
        console.error('Error fetching use cases:', err);
        setError('Error loading use cases');
      } finally {
        setLoading(false);
      }
    };

    fetchUseCases();
  }, []);

  const handleUseCaseClick = (useCase) => {
    console.log('Use case clicked:', useCase);
    setSelectedUseCase(useCase);
    
    setTimeout(() => {
      const detailsSection = document.getElementById('use-case-details');
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleQueryClick = (query) => {
    console.log('Query clicked:', query);
    
    setTimeout(() => {
      const element = document.getElementById('queries-section');
      if (element) {
        console.log('Found queries section, scrolling...');
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  if (!solution) {
    return (
      <Section className="text-center">
        <h2 className="h2">Solution not found</h2>
        <Link to="/solutions" className="button button-gradient mt-4">
          Back to Solutions
        </Link>
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

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'layout',
      content: (
        <div className="space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="h4 mb-4">Business Value</h3>
              <ul className="space-y-3">
                {solution.businessValue.metrics.map((metric, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Icon name="check" className="w-6 h-6 text-primary-1 mt-1" />
                    <span className="text-n-3">{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="h4 mb-4">Key Capabilities</h3>
              <ul className="space-y-3">
                {solution.businessValue.capabilities.map((capability, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Icon name="check" className="w-6 h-6 text-primary-1 mt-1" />
                    <span className="text-n-3">{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="h4 mb-6">Common Use Cases</h3>
            {loading ? (
              <div className="text-center text-n-3">Loading use cases...</div>
            ) : useCases.length > 0 ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {useCases.map((useCase) => (
                    <div 
                      key={useCase.id}
                      onClick={() => {
                        console.log('Clicking use case:', useCase);
                        handleUseCaseClick(useCase);
                      }}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <UseCaseCard 
                        useCase={useCase} 
                        onQueryClick={handleQueryClick}
                      />
                    </div>
                  ))}
                </div>
                
                {console.log('Selected use case:', selectedUseCase)}
                {selectedUseCase && (
                  <div 
                    id="use-case-details" 
                    className="mt-8 bg-n-8 rounded-xl p-6 border border-n-6 scroll-mt-8"
                  >
                    <h3 className="h4 mb-4">{selectedUseCase.title}</h3>
                    <div className="space-y-6">
                      {/* Implementation Flow */}
                      {selectedUseCase.architecture?.flow && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3">Implementation Flow</h4>
                          <div className="h-[400px] bg-n-7 rounded-lg p-4">
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
                        </div>
                      )}

                      {/* Architecture Section */}
                      {selectedUseCase.architecture && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3">Architecture</h4>
                          <p className="text-n-3 mb-4">{selectedUseCase.architecture.description}</p>
                          
                          {/* Components */}
                          {selectedUseCase.architecture.components?.length > 0 && (
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              {selectedUseCase.architecture.components.map((component, idx) => (
                                <div key={idx} className="bg-n-7 rounded-lg p-4">
                                  <h5 className="font-medium mb-2">{component.name}</h5>
                                  <p className="text-n-3 text-sm">{component.description}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Implementation Section */}
                      {selectedUseCase.implementation && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3">Implementation</h4>
                          <div className="space-y-4">
                            {typeof selectedUseCase.implementation === 'string' ? (
                              <div className="bg-n-7 rounded-lg p-4">
                                <p className="text-n-3 whitespace-pre-wrap">{selectedUseCase.implementation}</p>
                              </div>
                            ) : (
                              <>
                                {/* Requirements */}
                                {selectedUseCase.implementation.requirements && (
                                  <div className="bg-n-7 rounded-lg p-4">
                                    <h5 className="font-medium mb-2">Requirements</h5>
                                    <div className="text-n-3">
                                      {Array.isArray(selectedUseCase.implementation.requirements) ? (
                                        <ul className="list-disc list-inside space-y-2">
                                          {selectedUseCase.implementation.requirements.map((req, idx) => (
                                            <li key={idx}>{req}</li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <p>{selectedUseCase.implementation.requirements}</p>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Success Metrics */}
                                {selectedUseCase.implementation.success_metrics && (
                                  <div className="bg-n-7 rounded-lg p-4">
                                    <h5 className="font-medium mb-2">Success Metrics</h5>
                                    <div className="text-n-3">
                                      {Array.isArray(selectedUseCase.implementation.success_metrics) ? (
                                        <ul className="list-disc list-inside space-y-2">
                                          {selectedUseCase.implementation.success_metrics.map((metric, idx) => (
                                            <li key={idx}>{metric}</li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <p>{selectedUseCase.implementation.success_metrics}</p>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Integration Points */}
                                {selectedUseCase.implementation.integration_points && (
                                  <div className="bg-n-7 rounded-lg p-4">
                                    <h5 className="font-medium mb-2">Integration Points</h5>
                                    <div className="text-n-3">
                                      {Array.isArray(selectedUseCase.implementation.integration_points) ? (
                                        <ul className="list-disc list-inside space-y-2">
                                          {selectedUseCase.implementation.integration_points.map((point, idx) => (
                                            <li key={idx}>{point}</li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <p>{selectedUseCase.implementation.integration_points}</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Capabilities Section */}
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

                      {/* Sample Queries */}
                      {selectedUseCase.queries && selectedUseCase.queries.length > 0 && (
                        <div id="queries-section">
                          <h4 className="text-lg font-semibold mb-3">Sample Queries</h4>
                          <div className="grid gap-3">
                            {selectedUseCase.queries.map((query, idx) => (
                              <div key={idx} className="bg-n-7 rounded-lg p-4">
                                <p className="text-n-3">{query}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technologies */}
                      {selectedUseCase.technologies && selectedUseCase.technologies.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3">Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedUseCase.technologies.map((tech, idx) => (
                              <span key={idx} className="px-3 py-1 bg-n-7 rounded-full text-sm text-n-1">
                                {tech.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-n-3">No use cases found</div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'architecture',
      label: 'Architecture',
      icon: 'layout-grid',
      content: (
        <div>
          <h3 className="h4 mb-4">{solution.architecture.title}</h3>
          <p className="text-n-3 mb-8">{solution.architecture.description}</p>
          <ArchitectureDiagram domain={slug} />
        </div>
      )
    },
    {
      id: 'tech-stack',
      label: 'Tech Stack',
      icon: 'code',
      content: (
        <div className="space-y-10">
          {Object.entries(solution.techStack).map(([category, technologies]) => (
            <div key={category}>
              <h3 className="h4 mb-6 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(technologies).map(([name, tech]) => (
                  <div 
                    key={name}
                    onClick={() => handleTechClick(name)}
                    className="bg-n-7 rounded-xl p-6 border border-n-6 cursor-pointer 
                             transition-all duration-300 hover:border-primary-1 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={tech.icon} 
                        alt={name}
                        className="w-8 h-8"
                      />
                      <h4 className="font-semibold text-white">{name}</h4>
                    </div>
                    <p className="text-n-3 mb-4">{tech.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-primary-1">
                      <span>View Implementation Details</span>
                      <Icon name="arrow-right" className="w-4 h-4" />
                    </div>

                    {tech.useCases && (
                      <div className="mt-4 pt-4 border-t border-n-6">
                        <h5 className="text-sm font-medium text-n-3 mb-2">
                          Related Use Cases:
                        </h5>
                        <ul className="text-sm text-n-4">
                          {solution.businessValue.useCases
                            .filter(useCase => tech.useCases.includes(useCase))
                            .map((useCase, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-1"></span>
                                {useCase}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

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
          <Link to="/solutions" className="hover:text-color-1">Solutions</Link>
          <span className="mx-2">/</span>
          <span className="text-n-1">{solution.title}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="h1 mb-6">{solution.title}</h1>
          <p className="body-1 text-n-3 md:max-w-md lg:max-w-2xl">
            {solution.description}
          </p>
        </motion.div>

        <TabsRoot defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {tabs.map((tab) => (
              <TabTrigger key={tab.id} value={tab.id}>
                <span className="flex items-center gap-2">
                  <Icon name={tab.icon} className="w-4 h-4" />
                  {tab.label}
                </span>
              </TabTrigger>
            ))}
          </TabsList>

          <TabsContent>
            {tabs.map((tab) => (
              <TabPanel key={tab.id} value={tab.id}>
                {tab.content}
              </TabPanel>
            ))}
          </TabsContent>
        </TabsRoot>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-n-7 rounded-2xl p-8 border border-n-6 max-w-3xl mx-auto">
            <h3 className="h3 mb-4">Ready to Transform Your Business?</h3>
            <p className="text-n-3 mb-6">
              Let's discuss how our {solution.title.toLowerCase()} can help you achieve your goals.
            </p>
            <Link 
              to="/contact" 
              className="button button-gradient"
            >
              Schedule a Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default SolutionPage;
