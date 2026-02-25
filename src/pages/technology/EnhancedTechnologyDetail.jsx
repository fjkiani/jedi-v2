import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiServer, FiCheckCircle, FiZap, FiCpu, FiLayers, FiPackage, FiGitBranch, FiFileText, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { technologyService } from '@/services/technologyService';
import { openAIService } from '@/services/openAIService.jsx';
import { aiMlSolution } from '@/constants/solutions/ai-ml';
import { aiMlTechStack } from '@/constants/techCategories/aiMlTechStack';
import { aiAgentsSolution } from '@/constants/solutions/ai-agents';
import { dataEngineeringSolution } from '@/constants/solutions/data-engineering';
import { fullStackSolution } from '@/constants/solutions/full-stack';
import Section from '@/components/Section';
import { RootSEO } from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';
import AIResponse from '@/components/response/AIResponse';
import { RingLoader } from 'react-spinners';

const EnhancedTechnologyDetail = () => {
  const { isDarkMode } = useTheme();
  const { slug } = useParams();
  const [technology, setTechnology] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useCaseDemoState, setUseCaseDemoState] = useState({ query: '', result: null, loading: false });
  // Per-use-case active tab: 'architecture' | 'implementation'
  const [activeUseCaseTab, setActiveUseCaseTab] = useState({});
  // Use-case slider index (when multiple use cases)
  const [activeUseCaseIndex, setActiveUseCaseIndex] = useState(0);

  const createWorkflowDiagram = (workflow) => {
    if (!workflow || workflow.length === 0) return { nodes: [], edges: [] };
    return {
      nodes: workflow.map((step, index) => ({
        id: `${index}`,
        data: {
          label: (
            <div className={`p-4 rounded-lg text-sm border min-w-0 max-w-[200px] sm:min-w-[200px] shadow-sm ${isDarkMode ? 'bg-n-7 border-n-6 text-n-3' : 'bg-white border-n-3 text-n-6'}`}>
              <div className={`font-medium mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{step.step || `Step ${index + 1}`}</div>
              {step.description}
            </div>
          ),
        },
        position: { x: 300 * (index % 3), y: Math.floor(index / 3) * 200 },
        type: 'default',
        style: { background: 'transparent', border: 'none', width: 250 },
      })),
      edges: workflow.slice(0, -1).map((_, i) => ({
        id: `e${i}-${i + 1}`,
        source: `${i}`,
        target: `${i + 1}`,
        type: 'smoothstep',
        style: { stroke: isDarkMode ? '#8B5CF6' : '#6D28D9', strokeWidth: 1.5 },
        animated: true,
      })),
    };
  };

  const runOpenAIDemo = async (useCase, sampleQuery) => {
    if (!sampleQuery?.trim()) return;
    setUseCaseDemoState((prev) => ({ ...prev, loading: true, result: null }));
    try {
      const response = await openAIService.generateResponse(useCase, sampleQuery, {
        technologySlug: slug,
        capabilities: useCase.implementation?.capabilities,
        architecture: useCase.implementation?.architecture,
      });
      setUseCaseDemoState((prev) => ({ ...prev, loading: false, result: response }));
    } catch (err) {
      setUseCaseDemoState((prev) => ({
        ...prev,
        loading: false,
        result: {
          header: { icon: '⚠️', title: 'Error', query: sampleQuery },
          sections: [{ icon: '❌', title: 'ERROR', description: err.message, content: err.message }],
        },
      }));
    }
  };

  // Get additional data from local constants
  const findLocalTechData = () => {
    // First check aiMlTechStack
    if (aiMlTechStack[slug] || aiMlTechStack[slug.charAt(0).toUpperCase() + slug.slice(1)]) {
      const techData = aiMlTechStack[slug] || aiMlTechStack[slug.charAt(0).toUpperCase() + slug.slice(1)];
      console.log('Found tech in aiMlTechStack:', techData);
      return {
        ...techData,
        name: techData.name,
        category: techData.category,
        description: techData.description,
        features: techData.primaryUses,
        useCases: techData.useCases,
        deploymentOptions: techData.deploymentOptions
      };
    }

    // Array of all solution objects to search through
    const solutions = [
      aiMlSolution,
      aiAgentsSolution,
      dataEngineeringSolution,
      fullStackSolution
    ];

    // Search through all solutions
    for (const solution of solutions) {
      if (!solution.techStack) continue;
      
      for (const [category, techs] of Object.entries(solution.techStack)) {
        const tech = Object.entries(techs).find(([name]) => {
          const techSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return techSlug === slug;
        });
        
        if (tech) {
          console.log('Found tech in solution:', tech);
          return {
            ...tech[1],
            name: tech[0],
            category: tech[1].category || category
          };
        }
      }
    }
    
    return null;
  };

  useEffect(() => {
    const fetchTechnology = async () => {
      try {
        setLoading(true);
        // Fetch from Hygraph
        const hygraphData = await technologyService.getTechnologyBySlug(slug);
        console.log('🔍 Hygraph data:', hygraphData);
        
        // Get additional data from local constants
        const localData = findLocalTechData();
        console.log('📚 Local data:', localData);
        
        if (hygraphData || localData) {
          const mergedData = {
            ...localData,
            ...hygraphData,
            // Ensure we don't lose relatedUseCases from hygraphData
            relatedUseCases: hygraphData?.relatedUseCases || [],
            // Merge features from both sources if they exist
            features: [
              ...(Array.isArray(localData?.features) ? localData.features : []),
              ...(Array.isArray(hygraphData?.features) ? hygraphData.features : [])
            ],
            // Merge business metrics/value - handle string vs array properly
            businessMetrics: (() => {
              const localMetrics = localData?.businessValue || localData?.businessMetrics;
              const hygraphMetrics = hygraphData?.businessMetrics;
              
              const processMetrics = (data) => {
                if (!data) return [];
                if (Array.isArray(data)) return data;
                if (typeof data === 'string') {
                  if (data.includes(',')) {
                    return data.split(',').map(m => m.trim()).filter(m => m);
                  } else if (data.includes('\n')) {
                    return data.split('\n').map(m => m.trim()).filter(m => m);
                  } else {
                    return [data];
                  }
                }
                return [];
              };
              
              return [
                ...processMetrics(localMetrics),
                ...processMetrics(hygraphMetrics)
              ];
            })()
          };
          console.log('🔄 Merged data being passed to RootSEO:', mergedData);
          setTechnology(mergedData);
          setLoading(false);
        } else {
          console.error('❌ No data found for technology:', slug);
          setError('Technology not found');
        }
      } catch (err) {
        console.error('❌ Error loading technology:', err);
        setError('Error loading technology details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      console.log('🎯 Fetching data for slug:', slug);
      fetchTechnology();
    }
    setActiveUseCaseIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- findLocalTechData uses slug from closure
  }, [slug]);

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
        <div className="bg-n-6 rounded-lg p-4">
          <p className="text-n-3">Technology not found</p>
        </div>
      </Section>
    );
  }

  return (
    <div>
      {technology && (
        <>
          <RootSEO 
            slug={slug} 
            type="technology" 
            prefetchedData={technology} 
          />
        </>
      )}
      <Section className="py-12">
        <div className="container max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/technology" className={`${isDarkMode ? 'text-n-3 hover:text-color-1' : 'text-n-5 hover:text-color-1'}`}>Technologies</Link>
              <span className={isDarkMode ? 'text-n-3' : 'text-n-5'}>/</span>
              {technology.category && typeof technology.category === 'string' && (
                <>
                  <Link to={`/technology#${technology.category.toLowerCase()}`} className={`${isDarkMode ? 'text-n-3 hover:text-color-1' : 'text-n-5 hover:text-color-1'}`}>
                    {technology.category}
                  </Link>
                  <span className={isDarkMode ? 'text-n-3' : 'text-n-5'}>/</span>
                </>
              )}
              <span className={`${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{technology.name}</span>
            </div>
          </div>

          {/* Header */}
          <div className={`${isDarkMode ? 'bg-n-8' : 'bg-white'} rounded-xl p-8 border ${isDarkMode ? 'border-n-6' : 'border-n-3'} mb-8`}>
            <div className="flex items-center gap-6 mb-6">
              {technology.icon && (
                <div className={`w-16 h-16 rounded-xl ${isDarkMode ? 'bg-n-7' : 'bg-n-2'} flex items-center justify-center p-4`}>
                  <img src={technology.icon} alt={technology.name} className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{technology.name}</h1>
                {technology.category && typeof technology.category === 'string' && (
                  <div className={`${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{technology.category}</div>
                )}
              </div>
            </div>
            {technology.description && (
              <p className={`text-lg ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{technology.description}</p>
            )}
          </div>

          {/* Consolidated Overview - card-based layout (SolutionPage-style) */}
          <div className={`${isDarkMode ? 'bg-n-8' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-n-6' : 'border-n-3'} mb-8`}>
            <div className="p-8 space-y-12">
              {/* Features & Key Capabilities - two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {technology.features && technology.features.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="flex items-center mb-4">
                      <FiZap className="text-primary-1 mr-3" size={22} />
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Features</h3>
                    </div>
                    <div className="space-y-3">
                      {technology.features.map((f, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.04 }}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${isDarkMode ? 'bg-n-7/50 border-n-6 hover:border-n-5' : 'bg-n-1 border-n-3 hover:border-n-4'}`}
                        >
                          <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{f}</span>
                        </motion.div>
                      ))}
                </div>
                  </motion.div>
                )}
                {technology.capabilities && technology.capabilities.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <div className="flex items-center mb-4">
                      <FiCpu className="text-primary-1 mr-3" size={22} />
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Key Capabilities</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {technology.capabilities.map((c, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.25 + i * 0.03 }}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border ${isDarkMode ? 'bg-n-7 border-n-6 text-n-3' : 'bg-n-2 border-n-3 text-n-6'}`}
                        >
                          {c}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                  )}
                </div>

              {/* Architecture & Deployment - full width cards */}
              {(technology.architecture || (technology.deploymentOptions && technology.deploymentOptions.length > 0)) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="flex items-center mb-4">
                    <FiLayers className="text-primary-1 mr-3" size={22} />
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Architecture & Deployment</h3>
                  </div>
                  <div className={`rounded-xl border p-6 ${isDarkMode ? 'bg-n-7/50 border-n-6' : 'bg-n-1 border-n-3'}`}>
                    {technology.architecture && (
                      <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{technology.architecture}</p>
                    )}
                    {technology.deploymentOptions && technology.deploymentOptions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {technology.deploymentOptions.map((o, i) => (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${isDarkMode ? 'bg-n-6 text-n-2' : 'bg-n-2 text-n-6'}`}
                          >
                            <FiPackage size={14} className="opacity-70" />
                            {o}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
                </motion.div>
              )}

              {/* Integration - numbered steps */}
              {technology.integrationSteps && technology.integrationSteps.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <div className="flex items-center mb-4">
                    <FiGitBranch className="text-primary-1 mr-3" size={22} />
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Integration</h3>
                  </div>
                  <div className="space-y-3">
                    {technology.integrationSteps.map((s, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-4 p-4 rounded-lg border ${isDarkMode ? 'bg-n-7/50 border-n-6' : 'bg-n-1 border-n-3'}`}
                      >
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-1'}`}>
                          {i + 1}
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{s}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Resources - link pills */}
              {technology.documentation && Object.keys(technology.documentation).length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                  <div className="flex items-center mb-4">
                    <FiExternalLink className="text-primary-1 mr-3" size={22} />
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Resources</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                        {Object.entries(technology.documentation).map(([title, url]) => (
                          <a
                            key={title}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all hover:shadow-md ${isDarkMode ? 'bg-n-7 border-n-6 text-primary-1 hover:border-primary-1/50' : 'bg-n-1 border-n-3 text-primary-1 hover:border-primary-1/50'}`}
                          >
                        <FiExternalLink size={14} />
                            {title}
                          </a>
                        ))}
                      </div>
                </motion.div>
              )}

              {/* Use Case - slider when multiple, single view otherwise */}
              {technology.relatedUseCases && technology.relatedUseCases.length > 0 && (
                <div id="use-case" className="border-t pt-10" style={{ borderColor: isDarkMode ? 'var(--color-n-6)' : 'var(--color-n-3)' }}>
                  {(() => {
                    const useCases = technology.relatedUseCases;
                    const isSlider = useCases.length > 1;
                    const primaryUseCase = useCases[Math.min(activeUseCaseIndex, useCases.length - 1)];
                    const ucId = primaryUseCase.id || primaryUseCase.slug || primaryUseCase.title;
                    const tab = activeUseCaseTab[ucId] ?? 'architecture';
                    const setTab = (t) => setActiveUseCaseTab((prev) => ({ ...prev, [ucId]: t }));
                    return (
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-1'}`}>
                              Use Case
                            </span>
                            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{primaryUseCase.title}</h2>
                          </div>
                          {isSlider && (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setActiveUseCaseIndex((i) => (i <= 0 ? useCases.length - 1 : i - 1))}
                                className={`p-2 rounded-lg border transition-colors ${isDarkMode ? 'border-n-6 hover:bg-n-7 text-n-3' : 'border-n-3 hover:bg-n-2 text-n-6'}`}
                                aria-label="Previous use case"
                              >
                                <FiChevronLeft size={20} />
                              </button>
                              <div className="flex gap-1.5">
                                {useCases.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setActiveUseCaseIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === activeUseCaseIndex ? 'bg-primary-1' : isDarkMode ? 'bg-n-5 hover:bg-n-4' : 'bg-n-4 hover:bg-n-5'}`}
                                    aria-label={`Go to use case ${idx + 1}`}
                                  />
                                ))}
                              </div>
                              <button
                                onClick={() => setActiveUseCaseIndex((i) => (i >= useCases.length - 1 ? 0 : i + 1))}
                                className={`p-2 rounded-lg border transition-colors ${isDarkMode ? 'border-n-6 hover:bg-n-7 text-n-3' : 'border-n-3 hover:bg-n-2 text-n-6'}`}
                                aria-label="Next use case"
                              >
                                <FiChevronRight size={20} />
                              </button>
                    </div>
                  )}
                        </div>
                        {primaryUseCase.implementation?.overview && (
                          <p className={`${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{primaryUseCase.implementation.overview}</p>
                        )}

                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Side tabs */}
                          <div className={`flex md:flex-col gap-1 shrink-0 ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-2 border-n-3'} rounded-lg border p-1 w-full md:w-48`}>
                            <button
                              onClick={() => setTab('architecture')}
                              className={`px-4 py-2.5 rounded-md text-left text-sm font-medium transition-colors ${
                                tab === 'architecture'
                                  ? isDarkMode ? 'bg-primary-1 text-white' : 'bg-primary-1 text-white'
                                  : isDarkMode ? 'text-n-3 hover:bg-n-7 hover:text-n-1' : 'text-n-6 hover:bg-n-3 hover:text-n-8'
                              }`}
                            >
                              Architecture
                            </button>
                            <button
                              onClick={() => setTab('implementation')}
                              className={`px-4 py-2.5 rounded-md text-left text-sm font-medium transition-colors ${
                                tab === 'implementation'
                                  ? isDarkMode ? 'bg-primary-1 text-white' : 'bg-primary-1 text-white'
                                  : isDarkMode ? 'text-n-3 hover:bg-n-7 hover:text-n-1' : 'text-n-6 hover:bg-n-3 hover:text-n-8'
                              }`}
                            >
                              Implementation
                            </button>
                          </div>

                          {/* Content based on selected tab */}
                          <div className="flex-1 min-w-0">
                            {tab === 'architecture' && (
                              <div className="space-y-6">
                                {primaryUseCase.implementation?.architecture?.flow && primaryUseCase.implementation.architecture.flow.length > 0 && (
                                  <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Architecture Flow</h3>
                                    <div className={`h-[450px] rounded-lg border overflow-hidden ${isDarkMode ? 'bg-n-9 border-n-6' : 'bg-gray-50 border-gray-200'}`}>
                                      {(() => {
                                        const { nodes, edges } = createWorkflowDiagram(primaryUseCase.implementation.architecture.flow);
                                        return (
                                          <ReactFlow
                                            nodes={nodes}
                                            edges={edges}
                                            fitView
                                            className={isDarkMode ? 'react-flow-dark-themed' : 'react-flow-light-themed'}
                                          >
                                            <Background color={isDarkMode ? '#374151' : '#e5e7eb'} gap={16} variant="dots" />
                                            <Controls showInteractive={false} className={`react-flow-controls ${isDarkMode ? '!bg-n-7 !border-n-6 !text-n-3' : '!bg-white !border-gray-300 !text-gray-700'}`} />
                                            <MiniMap nodeColor={isDarkMode ? '#A78BFA' : '#8b5cf6'} className={`react-flow-minimap ${isDarkMode ? '!bg-n-10 !border-n-7' : '!bg-gray-100 !border-gray-300'}`} nodeBorderRadius={2} />
                                          </ReactFlow>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                )}
                                {primaryUseCase.implementation?.architecture?.components && primaryUseCase.implementation.architecture.components.length > 0 && (
                                  <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Key Components</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      {primaryUseCase.implementation.architecture.components.map((comp, idx) => (
                                        <div key={idx} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} shadow-sm`}>
                                          <h4 className={`font-medium mb-2 flex items-center ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                            <FiServer size={16} className="mr-2 text-primary-1 opacity-80" />
                                            {comp.name}
                                          </h4>
                                          <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{comp.description}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {(!primaryUseCase.implementation?.architecture?.flow?.length && !primaryUseCase.implementation?.architecture?.components?.length) && (
                                  <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>No architecture details available.</p>
                                )}
                              </div>
                            )}

                            {tab === 'implementation' && (
                              <div className="space-y-6">
                                {primaryUseCase.implementation?.capabilities && primaryUseCase.implementation.capabilities.length > 0 && (
                                  <ul className="space-y-2">
                                    {primaryUseCase.implementation.capabilities.map((cap, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <FiCheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className={isDarkMode ? 'text-n-3' : 'text-n-6'}>{cap}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
                                  <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Try it Live (Demo)</h4>
                                  {primaryUseCase.implementation?.queries?.length > 0 ? (
                                    <>
                                      <div className="mb-4">
                                        <p className={`text-sm mb-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Select a sample query:</p>
                                        <div className="flex flex-wrap gap-2">
                                          {primaryUseCase.implementation.queries.map((q, idx) => (
                                            <button
                                              key={idx}
                                              onClick={() => runOpenAIDemo(primaryUseCase, q)}
                                              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${isDarkMode ? 'bg-n-6 border-n-5 text-n-3 hover:bg-n-5 hover:text-n-1' : 'bg-n-2 border-n-3 text-n-5 hover:bg-n-3 hover:text-n-7'}`}
                                            >
                                              {q}
                                            </button>
                        ))}
                      </div>
                    </div>
                                      {useCaseDemoState.loading ? (
                                        <div className="flex justify-center items-center p-4">
                                          <RingLoader color={isDarkMode ? '#FFF' : '#000'} size={30} />
                                          <span className={`ml-3 text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Generating response...</span>
                                        </div>
                                      ) : useCaseDemoState.result ? (
                                        <AIResponse response={useCaseDemoState.result} />
                                      ) : null}
                                    </>
                                  ) : (
                                    <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>No demo queries configured.</p>
                                  )}
                                </div>
                    </div>
                  )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Related Applications - applications that use this technology */}
              {technology.relatedUseCases && technology.relatedUseCases.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="border-t pt-10" style={{ borderColor: isDarkMode ? 'var(--color-n-6)' : 'var(--color-n-3)' }}>
                  <div className="flex items-center mb-6">
                    <FiExternalLink className="text-primary-1 mr-3" size={22} />
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Related Applications</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {technology.relatedUseCases
                      .filter((uc) => uc.industry?.slug && uc.slug)
                      .map((uc) => (
                        <Link
                          key={uc.id}
                          to={`/industries/${uc.industry.slug}/${uc.slug}`}
                          className={`block p-5 rounded-xl border transition-all hover:shadow-lg hover:border-primary-1/50 ${isDarkMode ? 'bg-n-7 border-n-6 hover:bg-n-6' : 'bg-n-1 border-n-3 hover:bg-n-2'}`}
                        >
                          <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{uc.title}</h4>
                          {uc.industry?.name && (
                            <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{uc.industry.name}</p>
                          )}
                          <span className={`inline-flex items-center gap-1 mt-2 text-sm font-medium text-primary-1`}>
                            View application <FiExternalLink size={14} />
                          </span>
                        </Link>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default EnhancedTechnologyDetail; 