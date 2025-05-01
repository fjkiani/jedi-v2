import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiServer, FiCheckCircle } from 'react-icons/fi';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { openAIService } from '@/services/openAIService.jsx';
import { technologyService } from '@/services/technologyService';
import AIResponse from '@/components/response/AIResponse';
import Section from '@/components/Section';
import { RootSEO } from '@/components/SEO/RootSEO';
import { useTheme } from '@/context/ThemeContext';
import { RingLoader } from 'react-spinners';

const TechnologyDetail = () => {
  const { slug, useCaseSlug } = useParams();
  const [activeTab, setActiveTab] = useState('architecture');
  const [expandedSections, setExpandedSections] = useState({});
  const [useCaseState, setUseCaseState] = useState({
    query: '',
    result: null,
    loading: false
  });
  const [loading, setLoading] = useState(true);
  const [useCase, setUseCase] = useState(null);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchUseCase = async () => {
      try {
        console.log('Fetching use case with slug:', useCaseSlug);
        setLoading(true);
        const data = await technologyService.getUseCaseBySlug(useCaseSlug);
        console.log('Received use case data:', data);
        if (data) {
          setUseCase(data);
        } else {
          setError('Use case not found');
        }
      } catch (error) {
        console.error('Error fetching use case:', error);
        setError('Error loading use case details');
      } finally {
        setLoading(false);
      }
    };

    if (useCaseSlug) {
      console.log('useCaseSlug is present:', useCaseSlug);
      fetchUseCase();
    } else {
      console.log('No useCaseSlug provided');
      setError('Use case identifier missing from URL.');
      setLoading(false);
    }
  }, [useCaseSlug]);

  if (loading) {
    return (
      <Section className="text-center flex justify-center items-center min-h-[60vh]">
        <RingLoader color={isDarkMode ? "#FFF" : "#000"} size={60} />
        <span className={`ml-4 text-lg ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Loading use case...</span>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="text-center">
        <div className={`border rounded-lg p-6 max-w-md mx-auto ${isDarkMode ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
          <p className="text-red-500 font-medium">Error Loading Details</p>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-red-300/80' : 'text-red-700/80'}`}>{error}</p>
          <Link to="/technology" className={`inline-block mt-4 px-4 py-2 rounded text-sm transition-colors ${isDarkMode ? 'bg-n-6 text-n-2 hover:bg-n-5' : 'bg-n-2 text-n-6 hover:bg-n-3'}`}>
            Back to Technologies
          </Link>
        </div>
      </Section>
    );
  }

  if (!useCase) {
    return (
      <Section className="text-center">
        <div className={`rounded-lg p-6 max-w-md mx-auto ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
          <p className={`font-medium ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Use Case Not Found</p>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
             The requested use case could not be found.
          </p>
          <Link to="/technology" className={`inline-block mt-4 px-4 py-2 rounded text-sm transition-colors ${isDarkMode ? 'bg-n-6 text-n-2 hover:bg-n-5' : 'bg-n-2 text-n-6 hover:bg-n-3'}`}>
            Back to Technologies
          </Link>
        </div>
      </Section>
    );
  }

  const createWorkflowDiagram = (workflow) => {
    if (!workflow || workflow.length === 0) return { nodes: [], edges: [] };

    return {
      nodes: workflow.map((step, index) => ({
        id: `${index}`,
        data: { 
          label: (
            <div className={`p-4 rounded-lg text-sm border min-w-[200px] shadow-sm ${isDarkMode ? 'bg-n-7 border-n-6 text-n-3' : 'bg-white border-n-3 text-n-6'}`}>
              <div className={`font-medium mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{step.step || `Step ${index + 1}`}</div>
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
        style: { stroke: isDarkMode ? '#8B5CF6' : '#6D28D9', strokeWidth: 1.5 }, 
        animated: true,
      })),
    };
  };

  const runOpenAIDemo = async (model = 'gpt-4', sampleQuery) => {
    const queryToUse = sampleQuery || useCaseState.query;
    
    if (!queryToUse.trim()) return;

    setUseCaseState(prev => ({
      ...prev,
      loading: true,
      result: null
    }));

    try {
      console.log('Running demo with:', { useCase, queryToUse });
      
      const response = await openAIService.generateResponse(
        useCase,
        queryToUse,
        {
          capabilities: useCase.implementation.capabilities,
          architecture: useCase.implementation.architecture
        }
      );
      
      console.log('Response received:', response);
      
      setUseCaseState(prev => ({
        ...prev,
        loading: false,
        result: response
      }));
    } catch (error) {
      console.error("Error:", error);
      setUseCaseState(prev => ({
        ...prev,
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
      }));
    }
  };

  const renderAIResponse = (currentState) => {
    if (!currentState.result) return null;

    return (
      <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
        <AIResponse response={currentState.result} />
      </div>
    );
  };

  return (
    <>
      <RootSEO slug={slug} type="technology" />
      <Section className="overflow-hidden pt-20">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm mb-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}
          >
            <Link to="/technology" className={`hover:text-primary-1 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>Technologies</Link>
            <span className="mx-2">/</span>
            <Link to={`/technology/${slug}`} className={`hover:text-primary-1 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{slug}</Link>
            <span className="mx-2">/</span>
            <span className={isDarkMode ? 'text-n-1' : 'text-n-8'}>{useCase.title}</span>
          </motion.div>

          <div className="space-y-12">
            <div className={`rounded-xl p-6 md:p-10 border ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-white border-n-3'} shadow-lg`}>
              <h2 className={`h2 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{useCase.title}</h2>
              <p className={`body-1 mb-8 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{useCase.implementation.overview}</p>

              <div className="flex flex-wrap gap-3 mb-8 border-b pb-6 border-n-6/30">
                {['architecture', 'implementation', 'benefits'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${ 
                      activeTab === tab 
                        ? (isDarkMode ? 'bg-primary-1 text-white shadow-md' : 'bg-primary-1 text-white shadow-md') 
                        : (isDarkMode ? 'bg-n-7 text-n-3 hover:bg-n-6' : 'bg-n-1 text-n-5 hover:bg-n-2')
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'architecture' && (
                    <div className="space-y-8">
                      <h3 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Architecture Overview</h3>
                      {useCase.implementation.architecture?.description && (
                        <p className={`mb-6 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{useCase.implementation.architecture.description}</p>
                      )}
                      
                      {useCase.implementation.architecture?.flow && (
                        <div>
                          <h4 className={`h5 mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Workflow</h4>
                          <div className={`h-[450px] rounded-lg border relative overflow-hidden ${isDarkMode ? 'bg-n-9 border-n-6' : 'bg-gray-50 border-gray-200'}`}>
                            <ReactFlow 
                              nodes={createWorkflowDiagram(useCase.implementation.architecture.flow).nodes}
                              edges={createWorkflowDiagram(useCase.implementation.architecture.flow).edges}
                              fitView
                              className={isDarkMode ? 'react-flow-dark-themed' : 'react-flow-light-themed'}
                            >
                              <Background color={isDarkMode ? '#374151' : '#e5e7eb'} gap={16} variant="dots" />
                              <Controls 
                                showInteractive={false} 
                                className={`react-flow-controls ${isDarkMode ? '!bg-n-7 !border-n-6 !text-n-3' : '!bg-white !border-gray-300 !text-gray-700'}`}
                              />
                              <MiniMap 
                                nodeColor={isDarkMode ? '#A78BFA' : '#8b5cf6'} 
                                className={`react-flow-minimap ${isDarkMode ? '!bg-n-10 !border-n-7' : '!bg-gray-100 !border-gray-300'}`} 
                                nodeBorderRadius={2}
                              />
                            </ReactFlow>
                          </div>
                        </div>
                      )}

                      {useCase.implementation.architecture?.components && (
                        <div>
                          <h4 className={`h5 mt-8 mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Key Components</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {useCase.implementation.architecture.components.map((comp, idx) => (
                              <div key={idx} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} shadow-sm`}>
                                <h5 className={`font-medium mb-2 flex items-center ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  <FiServer size={16} className="mr-2 text-primary-1 opacity-80"/>
                                  {comp.name}
                                </h5>
                                <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{comp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'implementation' && (
                    <div className="space-y-8">
                      <h3 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Implementation Details</h3>
                      {useCase.implementation?.capabilities && (
                        <div>
                          <h4 className={`h5 mb-3 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Capabilities</h4>
                          <ul className="space-y-2">
                            {useCase.implementation.capabilities.map((cap, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <FiCheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0"/>
                                <span className={isDarkMode ? 'text-n-3' : 'text-n-6'}>{cap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
                        <h4 className={`h5 mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Try it Live (Demo)</h4>
                        {useCase.implementation.queries?.length > 0 && (
                          <div className="mb-4">
                             <p className={`text-sm mb-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Select a sample query:</p>
                             <div className="flex flex-wrap gap-2">
                              {useCase.implementation.queries.map((q, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => runOpenAIDemo('gpt-4', q)} 
                                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${isDarkMode ? 'bg-n-6 border-n-5 text-n-3 hover:bg-n-5 hover:text-n-1' : 'bg-n-2 border-n-3 text-n-5 hover:bg-n-3 hover:text-n-7'}`}
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {useCaseState.loading ? (
                          <div className="flex justify-center items-center p-4">
                            <RingLoader color={isDarkMode ? "#FFF" : "#000"} size={30} />
                            <span className={`ml-3 text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Generating response...</span>
                          </div>
                        ) : renderAIResponse(useCaseState)}
                      </div>
                    </div>
                  )}

                  {activeTab === 'benefits' && (
                    <div className="space-y-6">
                       <h3 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Benefits & Metrics</h3>
                       
                       {/* Check if metrics exist AND have items */}
                       {useCase.implementation?.metrics && useCase.implementation.metrics.length > 0 ? (
                        // Render the list if metrics exist
                        <div>
                          <h4 className={`h5 mb-3 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Success Metrics</h4>
                          <ul className="space-y-2">
                            {useCase.implementation.metrics.map((metric, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <FiCheckCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                                <span className={isDarkMode ? 'text-n-3' : 'text-n-6'}>{metric}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                       ) : (
                         // Render the fallback message if no metrics
                         <p className={isDarkMode ? 'text-n-4' : 'text-n-5'}>
                           No specific benefits or metrics listed for this use case.
                         </p>
                       )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default TechnologyDetail;
