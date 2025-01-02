import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { techUseCaseMapper } from '@/constants/techUseCaseMapper';
import { aiMlTechStack } from '@/constants/techCategories/aiMlTechStack';
import { FiChevronDown, FiServer } from 'react-icons/fi';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { openAIService } from '@/services/openAIService.jsx';
import { technologyService } from '@/services/technologyService';
import AIResponse from '@/components/response/AIResponse';

const TechnologyDetail = () => {
  const { techId } = useParams();
  const [activeTab, setActiveTab] = useState('architecture');
  const [expandedSections, setExpandedSections] = useState({});
  const [useCaseStates, setUseCaseStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [technology, setTechnology] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        setLoading(true);
        const data = await technologyService.getTechnologyBySlug(techId);
        if (data) {
          setTechnology(data);
        } else {
          setError('No use cases found for this technology');
        }
      } catch (error) {
        console.error('Error fetching use cases:', error);
        setError('Error loading use cases');
      } finally {
        setLoading(false);
      }
    };

    if (techId) {
      fetchUseCases();
    }
  }, [techId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-1"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!technology) return null;

  const createWorkflowDiagram = (workflow) => {
    if (!workflow || workflow.length === 0) return { nodes: [], edges: [] };

    return {
      nodes: workflow.map((step, index) => ({
        id: `${index}`,
        data: { 
          label: (
            <div className="bg-transparent p-4 rounded-lg text-sm text-n-3 border border-dashed border-n-6 min-w-[200px]">
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
      edges: workflow.slice(0, -1).map((_, i) => ({
        id: `e${i}-${i+1}`,
        source: `${i}`,
        target: `${i+1}`,
        type: 'smoothstep',
        style: { stroke: '#6366f1' },
        animated: true,
      })),
    };
  };

  const getUseCaseState = (index) => {
    if (!useCaseStates[index]) {
      setUseCaseStates(prev => ({
        ...prev,
        [index]: {
          query: '',
          result: null,
          loading: false
        }
      }));
    }
    return useCaseStates[index] || { query: '', result: null, loading: false };
  };

  const runOpenAIDemo = async (index, model = 'gpt-4', sampleQuery) => {
    const currentState = getUseCaseState(index);
    const queryToUse = sampleQuery || currentState.query;
    
    if (!queryToUse.trim()) return;

    setUseCaseStates(prev => ({
      ...prev,
      [index]: { ...currentState, loading: true, result: null }
    }));

    try {
      const useCase = technology.relatedUseCases[index];
      console.log('Running demo with:', { useCase, queryToUse });
      
      const response = await openAIService.generateResponse(
        useCase,
        queryToUse,
        {
          category: technology.category,
          capabilities: useCase.implementation.capabilities,
          architecture: useCase.implementation.architecture
        }
      );
      
      console.log('Response received:', response);
      
      setUseCaseStates(prev => ({
        ...prev,
        [index]: { ...currentState, loading: false, result: response }
      }));
    } catch (error) {
      console.error("Error:", error);
      setUseCaseStates(prev => ({
        ...prev,
        [index]: { 
          ...currentState, 
          loading: false, 
          result: {
            header: {
              icon: "⚠️",
              title: "Error Processing Request",
              query: queryToUse
            },
            sections: [
              {
                icon: "❌",
                title: "ERROR",
                description: "An error occurred while processing your request.",
                content: error.message
              }
            ]
          }
        }
      }));
    }
  };

  const renderAIResponse = (currentState) => {
    if (!currentState.result) return null;

    return (
      <div className="bg-n-6 p-6 rounded-lg border border-n-5">
        <AIResponse response={currentState.result} />
      </div>
    );
  };

  return (
    <motion.div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{technology.name}</h1>
          <p className="text-n-3 text-lg">{technology.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {technology.technologies?.map((tech, index) => (
              <span key={index} className="px-3 py-1 bg-n-7 rounded-full text-sm text-n-1">
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      {technology.relatedUseCases.map((useCase, index) => (
        <div key={index} className="bg-n-8 rounded-xl p-6 border border-n-6">
          <h2 className="text-2xl font-bold mb-6">{useCase.title}</h2>
          <p className="text-n-3 mb-6">{useCase.implementation.overview}</p>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {['architecture', 'implementation', 'benefits'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-primary-1 text-white' 
                    : 'bg-n-7 text-n-3 hover:bg-n-6'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'architecture' && (
                <div className="space-y-6">
                  {/* Flow Diagram */}
                  <div className="h-[400px] bg-n-7 rounded-lg p-4">
                    <ReactFlow 
                      nodes={createWorkflowDiagram(useCase.implementation.architecture.flow).nodes}
                      edges={createWorkflowDiagram(useCase.implementation.architecture.flow).edges}
                      fitView
                      className="react-flow-dark"
                    >
                      <Background color="#4b5563" gap={16} />
                      <Controls className="react-flow-controls" />
                      <MiniMap className="react-flow-minimap" />
                    </ReactFlow>
                  </div>

                  {/* Components */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {useCase.implementation.architecture.components?.map((component, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="bg-n-7 rounded-lg p-4 cursor-pointer"
                      >
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <FiServer className="mr-2" />
                          {component.name}
                        </h4>
                        <p className="text-n-3 mb-2">{component.role || component.description}</p>
                          <div className="flex flex-wrap gap-2">
                          {(component.tech || component.technologies || []).map((tech, techIdx) => (
                              <span key={techIdx} className="px-2 py-1 bg-n-6 rounded text-xs text-n-1">
                                {tech}
                              </span>
                            ))}
                          </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'implementation' && (
                <div className="space-y-6">
                  <div className="bg-n-7 rounded-lg p-4 space-y-4">
                    <h3 className="text-xl font-semibold text-white">Try the Use Case</h3>
                    <p className="text-n-3">Select a sample query to run:</p>
                    
                    {/* Sample Queries Grid */}
                    <div className="grid grid-cols-1 gap-3">
                      {useCase.implementation.queries?.map((sample, sampleIndex) => (
                        <button
                          key={sampleIndex}
                          onClick={() => {
                            console.log('Sample query clicked:', sample);
                            runOpenAIDemo(index, 'gpt-4', sample);
                          }}
                          className="text-left p-3 rounded-lg bg-n-8 border border-n-6 hover:border-primary-1 transition-colors duration-200 w-full"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary-1"></div>
                            <p className="text-n-1">{sample}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Loading State */}
                    {getUseCaseState(index).loading && (
                      <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-1"></div>
                        <p className="ml-3 text-n-3">Analyzing query...</p>
                      </div>
                    )}

                    {/* AI Response */}
                    {getUseCaseState(index).result && renderAIResponse(getUseCaseState(index))}
                  </div>

                  {/* Implementation steps */}
                  {useCase.implementation.steps && useCase.implementation.steps.length > 0 && (
                    <div className="bg-n-7 rounded-lg p-4">
                      <h3 className="text-xl font-semibold mb-4">Implementation Steps</h3>
                      <div className="space-y-4">
                        {useCase.implementation.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="bg-n-6 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </div>
                            <p className="text-n-3">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'benefits' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {useCase.implementation.benefits?.map((benefit, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="bg-n-7 rounded-lg p-4"
                      >
                        <div className="flex items-center space-x-2">
                          <FiServer className="text-primary-1" />
                          <p className="text-n-3">{benefit}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ))}

      {/* Deployment Options */}
      {technology.deploymentOptions && (
        <div className="bg-n-8 rounded-xl p-6 border border-n-6">
          <h2 className="text-2xl font-bold mb-6">Deployment Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Cloud Platforms</h3>
              <div className="space-y-2">
                {technology.deploymentOptions.cloud.map((platform, idx) => (
                  <div key={idx} className="text-n-3">{platform}</div>
                ))}
              </div>
            </div>
            <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Containerization</h3>
              <div className="space-y-2">
                {technology.deploymentOptions.containerization.map((container, idx) => (
                  <div key={idx} className="text-n-3">{container}</div>
                ))}
              </div>
            </div>
            <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Scaling</h3>
              <div className="space-y-2">
                {technology.deploymentOptions.scaling.map((scale, idx) => (
                  <div key={idx} className="text-n-3">{scale}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Details */}
      {technology.integrations && (
        <div className="bg-n-8 rounded-xl p-6 border border-n-6">
          <h2 className="text-2xl font-bold mb-6">Integrations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Primary Integrations</h3>
              <div className="space-y-2">
                {technology.integrations.primary.map((integration, idx) => (
                  <div key={idx} className="text-n-3">{integration}</div>
                ))}
              </div>
            </div>
            <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">APIs</h3>
              <div className="space-y-2">
                {technology.integrations.apis.map((api, idx) => (
                  <div key={idx} className="text-n-3">{api}</div>
                ))}
              </div>
            </div>
              <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Security Features</h3>
                <div className="space-y-2">
                {technology.integrations.security.map((feature, idx) => (
                  <div key={idx} className="text-n-3">{feature}</div>
                  ))}
                </div>
              </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TechnologyDetail;
