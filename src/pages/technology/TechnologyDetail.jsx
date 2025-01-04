import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiServer } from 'react-icons/fi';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { openAIService } from '@/services/openAIService.jsx';
import { technologyService } from '@/services/technologyService';
import AIResponse from '@/components/response/AIResponse';
import Section from '@/components/Section';

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
    }
  }, [useCaseSlug]);

  if (loading) {
    return (
      <Section className="text-center">
        <div className="animate-pulse">Loading use case details...</div>
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

  if (!useCase) {
    return (
      <Section className="text-center">
        <div className="bg-n-6 rounded-lg p-4">
          <p className="text-n-3">Use case not found</p>
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
      <div className="bg-n-6 p-6 rounded-lg border border-n-5">
        <AIResponse response={currentState.result} />
      </div>
    );
  };

  return (
    <Section className="overflow-hidden">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-n-3 mb-4"
        >
          <Link to="/technology" className="hover:text-color-1">Technologies</Link>
          <span className="mx-2">/</span>
          <Link to={`/technology/${slug}`} className="hover:text-color-1">{slug}</Link>
          <span className="mx-2">/</span>
          <span className="text-n-1">{useCase.title}</span>
        </motion.div>

        <div className="space-y-12">
          {/* Use Case Content */}
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
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
                    {useCase.implementation.architecture?.flow && (
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
                    )}

                    {/* Components */}
                    {useCase.implementation.architecture?.components && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {useCase.implementation.architecture.components.map((component, idx) => (
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
                          </motion.div>
                        ))}
                      </div>
                    )}
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
                              runOpenAIDemo('gpt-4', sample);
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
                      {useCaseState.loading && (
                        <div className="flex items-center justify-center p-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-1"></div>
                          <p className="ml-3 text-n-3">Analyzing query...</p>
                        </div>
                      )}

                      {/* AI Response */}
                      {useCaseState.result && renderAIResponse(useCaseState)}
                    </div>
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
        </div>
      </div>
    </Section>
  );
};

export default TechnologyDetail;
