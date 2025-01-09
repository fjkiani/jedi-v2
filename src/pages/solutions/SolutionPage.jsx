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
import { openAIService } from '@/services/openAIService';

const GET_USE_CASES = `
  query GetUseCases($category: String!) {
    useCaseS(where: { OR: [
      { category: { slug_contains: $category } },
      { category: { name_contains: $category } }
    ]}) {
      id
      title
      description
      category {
        name
        slug
      }
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
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        setLoading(true);
        const categorySlug = slug.replace('-solutions', '');
        console.log('Fetching use cases for category:', categorySlug);
        const { useCaseS } = await hygraphClient.request(GET_USE_CASES, { category: categorySlug });
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
  }, [slug]);

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

  const handleQueryClick = async (query) => {
    console.log('Query clicked:', query);
    
    if (!selectedUseCase) {
      console.warn('No use case selected');
      return;
    }

    setLoading(true);
    try {
      // Transform the use case data to match the expected format
      const formattedUseCase = {
        title: selectedUseCase.title,
        implementation: {
          overview: selectedUseCase.description,
          architecture: selectedUseCase.architecture,
          queries: selectedUseCase.queries,
          capabilities: selectedUseCase.capabilities,
          metrics: selectedUseCase.metrics
        },
        technologies: selectedUseCase.technologies
      };

      console.log('Sending formatted use case:', formattedUseCase);
      const response = await openAIService.generateResponse(formattedUseCase, query);
      console.log('OpenAI response:', response);
      setResponse(response);
    } catch (error) {
      console.error('Error generating response:', error);
      setError('Failed to generate response');
    } finally {
      setLoading(false);
    }
    
    // Scroll to response section
    setTimeout(() => {
      const responseSection = document.getElementById('response-section');
      if (responseSection) {
        responseSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleTechClick = (tech) => {
    console.log('Technology clicked:', tech);
    if (!tech.name) {
      console.error('No name available for technology:', tech);
      return;
    }
    
    // Create a standardized technology object
    const technologyData = {
      name: tech.name,
      icon: tech.icon || `https://cdn.simpleicons.org/${tech.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
      description: tech.description || `Details about ${tech.name}`,
      category: tech.category || 'Technology',
      useCases: tech.useCases || [],
      features: tech.features || null,
      priority: tech.priority || null
    };
    
    console.log('Saving technology data:', technologyData);
    
    try {
      // Save to localStorage
      localStorage.setItem('selectedTechnology', JSON.stringify(technologyData));
      console.log('Technology data saved successfully');
      
      // Create the slug and navigate
      const slug = tech.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      console.log('Navigating to:', `/technology/${slug}`); // Note: Updated path
      navigate(`/technology/${slug}`);
    } catch (error) {
      console.error('Error in handleTechClick:', error);
    }
  };

  if (!solution) {
    return (
      <Section className="text-center">
        <h2 className="h2">Solution not found</h2>
        <p className="text-n-3 mt-4">The solution "{slug}" could not be found.</p>
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
          {solution.businessValue && (
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="h4 mb-4">Business Value</h3>
                <ul className="space-y-3">
                  {solution.businessValue.metrics?.map((metric, index) => (
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
                  {solution.businessValue.capabilities?.map((capability, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Icon name="check" className="w-6 h-6 text-primary-1 mt-1" />
                      <span className="text-n-3">{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

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
                      onClick={() => handleUseCaseClick(useCase)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <UseCaseCard 
                        useCase={useCase} 
                        onQueryClick={handleQueryClick}
                      />
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
                            {/* Overview */}
                            <div className="bg-n-7 rounded-lg p-4">
                              <h5 className="font-medium mb-2">Overview</h5>
                              <p className="text-n-3">{selectedUseCase.description}</p>
                            </div>

                            {/* Sample Queries */}
                            <div id="queries-section">
                              <h5 className="font-medium mb-2">Sample Queries</h5>
                              <div className="grid gap-3">
                                {selectedUseCase.queries?.map((query, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleQueryClick(query)}
                                    className="w-full text-left bg-n-7 rounded-lg p-4 hover:bg-n-6 transition-colors duration-200"
                                  >
                                    <p className="text-n-3">{query}</p>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Loading State */}
                            {loading && (
                              <div className="mt-4 text-center text-n-3">
                                <p>Processing query...</p>
                              </div>
                            )}

                            {/* AI Response */}
                            {response && (
                              <div id="response-section" className="mt-6">
                                <AIResponse response={response} />
                              </div>
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

                      {/* Technologies */}
                      {selectedUseCase.technologies && selectedUseCase.technologies.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3">Core Technologies</h4>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedUseCase.technologies.map((tech, idx) => (
                              <div 
                                key={idx} 
                                className="bg-n-7 rounded-xl p-4 border border-n-6 cursor-pointer hover:border-primary-1 transition-all duration-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTechClick(tech);
                                }}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  {tech.icon && (
                                    <div className="w-8 h-8 flex items-center justify-center">
                                      <img 
                                        src={typeof tech.icon === 'string' ? tech.icon : tech.icon.url} 
                                        alt={tech.name} 
                                        className="w-8 h-8"
                                        onError={(e) => {
                                          e.target.src = 'https://cdn.simpleicons.org/dotenv';
                                        }}
                                      />
                                    </div>
                                  )}
                                  <h5 className="font-semibold text-white">{tech.name}</h5>
                                </div>
                                {tech.description && (
                                  <p className="text-n-3 text-sm">{tech.description}</p>
                                )}
                              </div>
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
      content: solution.architectureDiagram ? (
        <div>
          <h3 className="h4 mb-4">Architecture Overview</h3>
          <div className="mb-8">
            <ArchitectureDiagram diagram={solution.architectureDiagram} />
          </div>
          {selectedUseCase?.architecture?.flow && (
            <div className="mt-10">
              <h3 className="h4 mb-4">Implementation Flow</h3>
              <div className="h-[400px] bg-n-7 rounded-lg p-4">
                <ReactFlow 
                  nodes={createWorkflowDiagram(selectedUseCase.architecture.flow).nodes}
                  edges={createWorkflowDiagram(selectedUseCase.architecture.flow).edges}
                  fitView
                  className="react-flow-dark"
                >
                  <Background color="#4b5563" gap={16} />
                  <Controls className="react-flow-controls" />
                </ReactFlow>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-n-3">Architecture details not available</div>
      )
    },
    {
      id: 'tech-stack',
      label: 'Tech Stack',
      icon: 'code',
      content: solution.techStack ? (
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
                    onClick={() => handleTechClick({ name, ...tech })}
                    className="bg-n-7 rounded-xl p-6 border border-n-6 cursor-pointer 
                             transition-all duration-300 hover:border-primary-1 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {tech.icon && (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <img 
                            src={typeof tech.icon === 'string' ? tech.icon : tech.icon.url} 
                            alt={name}
                            className="w-8 h-8"
                            onError={(e) => {
                              e.target.src = 'https://cdn.simpleicons.org/dotenv';
                            }}
                          />
                        </div>
                      )}
                      <h4 className="font-semibold text-white">{name}</h4>
                    </div>
                    <p className="text-n-3 mb-4">{tech.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-primary-1">
                      <span>View Details</span>
                      <Icon name="arrow-right" className="w-4 h-4" />
                    </div>

                    {tech.useCases && tech.useCases.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-n-6">
                        <h5 className="text-sm font-medium text-n-3 mb-2">
                          Related Use Cases:
                        </h5>
                        <ul className="text-sm text-n-4">
                          {tech.useCases.map((useCase, index) => (
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
      ) : (
        <div className="text-center text-n-3">Tech stack details not available</div>
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