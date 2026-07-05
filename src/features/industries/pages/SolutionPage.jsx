import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import {
  FiCheckCircle, FiServer, FiList, FiTerminal, FiCpu, FiArrowRight,
  FiChevronDown, FiChevronUp, FiCopy, FiCheck, FiTarget, FiDatabase,
  FiGitBranch, FiZap, FiClock, FiTrendingUp, FiMessageSquare, FiStar,
  FiLayers, FiBox, FiUsers, FiBarChart, FiSettings, FiPlay, FiExternalLink, FiX
} from 'react-icons/fi';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import Heading from '@/components/Heading';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism as lightStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jediLabsLogo from '@/assets/logo/logo.png';
import { useTheme } from '@/context/ThemeContext';
import QueryResponse from '@/components/copilot/QueryResponse';
import { generateQueryResponse } from '@/services/queryResponseGenerator';
import CoPilotCore from '@/components/copilot/CoPilotCore';
import ZetaSimulation from '@/components/solutions/ZetaSimulation';

// Enhanced GraphQL query to fetch all interconnected data
const GetUseCaseDetail = gql`
  query GetUseCaseDetail($slug: String!) {
    useCase(where: { slug: $slug }, stage: PUBLISHED) {
      id
      title
      slug
      description
      capabilities
      queries
      metrics
      implementation
      industry {
        name
        slug
        description
      }
      technologies(first: 10) {
        id
        name
        slug
        description
        icon
      }
      category {
        id
        slug
        name
        technologies {
          id
          name
          slug
          description
        }
      }
      industryApplication {
        id
        applicationTitle
        relevantEngine
      }
      architecture {
        id
        description
        components(orderBy: name_ASC) {
          id
          name
          description
          details
          explanation
        }
        flow(orderBy: step_ASC) {
          id
          step
          description
          details
        }
      }
    }
  }
`;

const createWorkflowDiagram = (flowData, isDarkMode) => {
  if (!Array.isArray(flowData) || flowData.length === 0) {
    console.warn("[createWorkflowDiagram] Invalid or empty flow data received:", flowData);
    return { nodes: [], edges: [] };
  }
  const isValidFlowData = flowData.every(item =>
    typeof item === 'object' && item !== null && 'step' in item && 'description' in item && 'id' in item
  );
  if (!isValidFlowData) {
    console.warn("[createWorkflowDiagram] Flow data items have unexpected structure:", flowData);
    return { nodes: [], edges: [] };
  }

  const nodes = flowData.map((step, index) => ({
    id: step.id,
    data: {
      label: (
        <div className={`p-3 rounded-lg border text-sm w-[200px] break-words shadow-sm ${isDarkMode ? 'bg-n-7 border-n-6 text-n-2' : 'bg-white border-n-3 text-n-7'}`}>
          <strong className="block mb-1 text-primary-1">Step {step.step}:</strong>
          <span className="block font-medium">{step.description}</span>
          {step.details && <p className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'} mt-1 italic`}>{step.details}</p>}
        </div>
      )
    },
    position: { x: index * 250, y: 50 },
    type: 'default',
    style: { background: 'transparent', border: 'none', padding: 0, width: 'auto', height: 'auto' },
    draggable: false,
    connectable: false,
  }));

  const edges = flowData.slice(0, -1).map((step, i) => ({
    id: `e${step.id}-${flowData[i + 1].id}`,
    source: step.id,
    target: flowData[i + 1].id,
    type: 'smoothstep',
    style: { stroke: isDarkMode ? '#A78BFA' : '#8b5cf6', strokeWidth: 2 },
    animated: true,
  }));

  return { nodes, edges };
};

const SolutionPage = () => {
  const { industryId, solutionId } = useParams();
  const navigate = useNavigate();
  const [useCaseData, setUseCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showCoPilot, setShowCoPilot] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (!solutionId) {
        setError("Solution slug is missing from URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        console.log(`[SolutionPage] Fetching use case with slug: ${solutionId}`);
        const variables = { slug: solutionId };
        const data = await hygraphClient.request(GetUseCaseDetail, variables);
        console.log("[SolutionPage] Raw data received:", data);

        if (data && data.useCase) {
          console.log("[SolutionPage] Use case data set:", data.useCase);
          setUseCaseData(data.useCase);
        } else {
          console.warn(`[SolutionPage] Use case with slug "${solutionId}" not found.`);
          setError(`Solution "${solutionId}" not found.`);
          setUseCaseData(null);
        }
      } catch (err) {
        console.error("[SolutionPage] Error fetching solution details:", err);

        // Handle specific error types
        if (err.message?.includes('rate limit')) {
          setError("API rate limit exceeded. Please wait a moment and refresh the page.");
        } else if (err.response?.status === 429) {
          setError("Too many requests. Please wait a moment and refresh the page.");
        } else if (err.message?.includes('Network')) {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError("Failed to load solution details. Please refresh the page or try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [solutionId]);

  const flowDiagram = useMemo(() => {
    return useCaseData?.architecture?.flow
      ? createWorkflowDiagram(useCaseData.architecture.flow, isDarkMode)
      : { nodes: [], edges: [] };
  }, [useCaseData?.architecture?.flow, isDarkMode]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleQuerySelect = (query, index) => {
    setSelectedQuery(query);
    setShowCoPilot(true);

    // Determine target section and scroll
    let targetId = 'architecture'; // Default target
    if (query.toLowerCase().includes('capabilities')) {
      targetId = 'capabilities';
    } else if (query.toLowerCase().includes('technolog')) {
      targetId = 'technologies';
    } else if (query.toLowerCase().includes('implementation') || query.toLowerCase().includes('metrics')) {
      targetId = 'implementation';
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleQueryAction = (action) => {
    console.log('Query action clicked:', action);

    switch (action.type) {
      case 'scroll':
        // Smooth scroll to target section
        const targetElement = document.getElementById(action.target);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        break;

      case 'simulation':
        // Trigger simulation with proper data
        console.log('Triggering simulation:', action.simulationType);

        // Prepare simulation data based on current use case
        const simulationResponseData = {
          useCase: useCaseData,
          industry: useCaseData.industry,
          simulationType: action.simulationType || 'implementation',
          isApplicationBased: false,
          architecture: useCaseData.architecture,
          metrics: [
            'Accuracy',
            'Processing Speed',
            'Cost Reduction',
            'ROI',
            'User Satisfaction',
            'Compliance Score'
          ],
          simulationData: {
            title: `${useCaseData.title} Implementation Simulation`,
            description: `Interactive simulation for implementing ${useCaseData.title} in ${useCaseData.industry?.name || 'your industry'}`,
            focusArea: action.simulationType === 'cost' ? 'Cost Analysis' :
              action.simulationType === 'metrics' ? 'Success Metrics' :
                action.simulationType === 'architecture' ? 'Technical Architecture' :
                  'Implementation Process',
            successMetrics: [
              'Model Accuracy: 95%+',
              'Processing Speed: <100ms',
              'Cost Reduction: 30-50%',
              'ROI: 200-400%',
              'User Adoption: 90%+',
              'Compliance Score: 99%+'
            ],
            costAnalysis: {
              initialInvestment: '$150K - $300K',
              monthlyOperational: '$5K - $15K',
              expectedROI: '200-400%',
              paybackPeriod: '8-12 months',
              totalCostYear1: '$200K - $400K'
            },
            totalDuration: '12-16 weeks',
            confidence: '92%',
            recommendedApproach: 'Phased implementation with pilot program'
          }
        };

        // setSimulationData(simulationResponseData); // Removed state
        // setShowSimulation(true); // Removed state
        break;

      case 'lead-capture':
        // Trigger lead capture modal with context
        console.log('Triggering lead capture with context:', action.context);
        // This would integrate with your existing lead capture system
        // You can implement this based on your existing lead capture modal
        break;

      default:
        console.log('Unknown action type:', action.type);
    }
  };

  // Removed handleSimulationComplete

  const handleCopy = (key) => {
    // Removed state
    setTimeout(() => {
      // Removed state
    }, 2000);
  };

  const handleCoPilotComplete = (analysisType) => {
    console.log('Co-pilot analysis complete:', analysisType);
    // Optionally hide co-pilot after completion
    // setShowCoPilot(false);
  };

  const handleSuggestedQuery = (query, context) => {
    console.log('Suggested query:', query, context);
    // Handle suggested queries from co-pilot
  };

  const renderListItem = (item, index, icon) => (
    <motion.li
      key={index}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-start p-3 rounded-lg border transition-all hover:shadow-md ${isDarkMode ? 'bg-n-7 border-n-6 hover:border-primary-1/50' : 'bg-n-1 border-n-3 hover:border-primary-1/50'}`}
    >
      <Icon className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" Icon={icon} />
      <span className={`body-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{item}</span>
    </motion.li>
  );

  if (loading) {
    return (
      <Section className="pt-12">
        <div className={`container mx-auto text-center ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary-1 border-t-transparent rounded-full mx-auto mb-4"
          />
          Loading solution details...
        </div>
      </Section>
    );
  }

  if (error || !useCaseData) {
    return (
      <Section className="pt-12">
        <div className="container mx-auto text-center">
          <div className={`max-w-md mx-auto p-6 rounded-lg border ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-white border-n-3'}`}>
            <div className="mb-4">
              <FiZap className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className={`h5 mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                {error?.includes('rate limit') || error?.includes('Too many requests')
                  ? 'Rate Limit Exceeded'
                  : 'Unable to Load Solution'
                }
              </h3>
              <p className={`body-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                {error || "Solution not found"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                <FiArrowRight className="w-4 h-4 mr-2" />
                Retry
              </button>
              <button
                onClick={() => navigate('/industries')}
                className={`btn ${isDarkMode ? 'btn-secondary' : 'btn-outline'}`}
              >
                Go back to Industries
              </button>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <>
      <SEO
        title={useCaseData.title.length > 32 ? `${useCaseData.title} | Jedi Labs` : `${useCaseData.title} - ${useCaseData.industry?.name || 'Industry'} | Jedi Labs`}
        description={useCaseData.description || `Learn about ${useCaseData.title} solutions for the ${useCaseData.industry?.name || 'relevant'} industry.`}
        ogUrl={`https://www.jedilabs.org/industries/${useCaseData.industry?.slug}/${useCaseData.slug}`}
      />

      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mb-6"
          >
            <button
              onClick={() => navigate(`/industries/${industryId || useCaseData.industry?.slug}`)}
              className={`flex items-center text-sm font-medium transition-colors ${isDarkMode ? 'text-n-3 hover:text-primary-1' : 'text-n-5 hover:text-primary-1'}`}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to {useCaseData.industry?.name || 'Industry'}
            </button>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Heading
              className="mb-4"
              title={useCaseData.title}
              as="h1"
            />
            <p className={`body-1 max-w-4xl mx-auto mb-6 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
              {useCaseData.description}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-n-7 text-n-3' : 'bg-n-2 text-n-6'}`}>
                {useCaseData.industry?.name}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-1'}`}>
                {useCaseData.category?.name}
              </span>
            </div>
          </motion.div>

          {/* Simulation / Terminal Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <ZetaSimulation useCase={useCaseData} />
          </motion.div>

          {/* Capabilities Section */}
          <motion.div
            id="capabilities"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <FiZap className="text-primary-1 mr-3" size={24} />
              <h3 className={`h4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Core Capabilities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {useCaseData.capabilities?.map((capability, index) => (
                renderListItem(capability, index, FiCheckCircle)
              ))}
            </div>
          </motion.div>

          {/* Architecture Visualization */}
          <motion.div
            id="architecture"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <FiLayers className="text-primary-1 mr-3" size={24} />
              <h3 className={`h4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Solution Architecture</h3>
            </div>

            {useCaseData.architecture?.description && (
              <div className={`p-6 rounded-lg border mb-6 ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
                <p className={`body-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{useCaseData.architecture.description}</p>
              </div>
            )}

            {/* Workflow Diagram */}
            {useCaseData.architecture?.flow && flowDiagram.nodes.length > 0 && (
              <div className="mb-8">
                <h5 className={`h6 mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Implementation Flow</h5>
                <ReactFlowProvider>
                  <div className={`h-[400px] w-full rounded-lg border relative overflow-hidden ${isDarkMode ? 'bg-n-9 border-n-6' : 'bg-gray-50 border-gray-200'}`}>
                    <ReactFlow
                      nodes={flowDiagram.nodes}
                      edges={flowDiagram.edges}
                      fitView
                      nodesDraggable={false}
                      nodesConnectable={false}
                      panOnScroll={true}
                      zoomOnScroll={false}
                      preventScrolling={false}
                    >
                      <Background color={isDarkMode ? '#374151' : '#e5e7eb'} gap={16} variant="dots" />
                      <Controls showInteractive={false} className={`react-flow-controls ${isDarkMode ? '!bg-n-7 !border-n-6 !text-n-3' : '!bg-white !border-gray-300 !text-gray-700'}`} />
                      <MiniMap nodeColor={isDarkMode ? '#A78BFA' : '#8b5cf6'} className={`react-flow-minimap ${isDarkMode ? '!bg-n-10 !border-n-7' : '!bg-gray-100 !border-gray-300'}`} nodeBorderRadius={2} />
                    </ReactFlow>
                  </div>
                </ReactFlowProvider>
              </div>
            )}

            {/* Components Grid */}
            {useCaseData.architecture?.components && useCaseData.architecture.components.length > 0 && (
              <div>
                <h5 className={`h6 mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>System Components</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {useCaseData.architecture.components.map((comp, index) => (
                    <motion.div
                      key={comp.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border transition-all hover:shadow-lg cursor-pointer ${isDarkMode ? 'bg-n-7 border-n-6 hover:border-primary-1/50' : 'bg-n-1 border-n-3 hover:border-primary-1/50'}`}
                      onClick={() => toggleSection(`component-${comp.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <FiServer className="text-primary-1 mt-1" size={20} />
                        <button className="text-primary-1 hover:text-primary-2">
                          {expandedSections[`component-${comp.id}`] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                        </button>
                      </div>
                      <h6 className={`font-semibold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{comp.name}</h6>
                      <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{comp.description}</p>

                      <AnimatePresence>
                        {expandedSections[`component-${comp.id}`] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}
                          >
                            {comp.details && (
                              <div className="mb-3">
                                <h6 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Technical Details:</h6>
                                <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{comp.details}</p>
                              </div>
                            )}
                            {comp.explanation && comp.explanation.length > 0 && (
                              <div>
                                <h6 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Key Functions:</h6>
                                <ul className="list-disc list-inside space-y-1">
                                  {comp.explanation.map((point, idx) => (
                                    <li key={idx} className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Technology Ecosystem Explorer */}
          <motion.div
            id="technologies"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <FiCpu className="text-primary-1 mr-3" size={24} />
              <h3 className={`h4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Technology Ecosystem</h3>
            </div>

            {/* Direct Technologies */}
            {useCaseData.technologies && useCaseData.technologies.length > 0 && (
              <div className="mb-8">
                <h5 className={`h6 mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Primary Technologies</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {useCaseData.technologies.map((tech, index) => (
                    <motion.div
                      key={tech.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={`/technology/${tech.slug}`}
                        className={`block p-4 rounded-lg border transition-all hover:shadow-lg hover:scale-105 ${isDarkMode ? 'bg-n-7 border-n-6 hover:border-primary-1/50' : 'bg-n-1 border-n-3 hover:border-primary-1/50'}`}
                      >
                        <div className="flex items-center mb-3">
                          {tech.icon && (
                            <img src={tech.icon} alt={tech.name} className="w-8 h-8 mr-3 object-contain flex-shrink-0" />
                          )}
                          <h6 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{tech.name}</h6>
                          <FiExternalLink className={`ml-auto ${isDarkMode ? 'text-n-4' : 'text-n-5'}`} size={14} />
                        </div>
                        {tech.description && (
                          <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{tech.description}</p>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Technologies */}
            {useCaseData.category && (
              <div className="mb-8">
                <h5 className={`h6 mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                  Related {useCaseData.category.name} Technologies
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {useCaseData.category.technologies?.slice(0, 12).map((tech, index) => (
                    <motion.div
                      key={tech.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg border text-center transition-all hover:shadow-md hover:scale-105 ${isDarkMode ? 'bg-n-8 border-n-6 hover:border-primary-1/30' : 'bg-n-1 border-n-3 hover:border-primary-1/30'}`}
                    >
                      <Link to={`/technology/${tech.slug}`} className="block">
                        <h6 className={`text-xs font-medium ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{tech.name}</h6>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Subcategory Technologies */}
            {useCaseData.category?.technologySubcategory && useCaseData.category.technologySubcategory.length > 0 && (
              <div>
                <h5 className={`h6 mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Extended Technology Stack</h5>
                <div className="space-y-4">
                  {useCaseData.category.technologySubcategory.map((subcat, index) => (
                    <motion.div
                      key={subcat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'}`}
                    >
                      <h6 className={`font-semibold mb-3 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>{subcat.name}</h6>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {subcat.technologies?.map((tech) => (
                          <Link
                            key={tech.id}
                            to={`/technology/${tech.slug}`}
                            className={`p-2 rounded text-center text-xs transition-all hover:scale-105 ${isDarkMode ? 'bg-n-7 text-n-4 hover:bg-n-6' : 'bg-n-2 text-n-6 hover:bg-n-3'}`}
                          >
                            {tech.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Industry Context & Related Solutions */}
          {(useCaseData.industry?.relatedUseCases?.length > 0 || useCaseData.industryApplication?.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <FiUsers className="text-primary-1 mr-3" size={24} />
                <h3 className={`h4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Industry Context & Applications</h3>
              </div>

              {/* Industry Applications */}
              {useCaseData.industryApplication && useCaseData.industryApplication.length > 0 && (
                <div className="mb-8">
                  <h5 className={`h6 mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Jedi Labs Applications</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {useCaseData.industryApplication.map((app, index) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gradient-to-br from-n-7 to-n-8 border-n-6' : 'bg-gradient-to-br from-white to-n-1 border-n-3'}`}
                      >
                        <h6 className={`font-semibold mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{app.applicationTitle}</h6>
                        <div className="space-y-3">
                          <div>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>Engine: </span>
                            <span className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{app.relevantEngine}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Use Cases */}
              {useCaseData.industry?.relatedUseCases && useCaseData.industry.relatedUseCases.length > 0 && (
                <div>
                  <h5 className={`h6 mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                    Related {useCaseData.industry.name} Solutions
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {useCaseData.industry.relatedUseCases.map((useCase, index) => (
                      <motion.div
                        key={useCase.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={`/industries/${useCaseData.industry.slug}/${useCase.slug}`}
                          className={`block p-4 rounded-lg border transition-all hover:shadow-lg hover:scale-105 ${isDarkMode ? 'bg-n-7 border-n-6 hover:border-primary-1/50' : 'bg-n-1 border-n-3 hover:border-primary-1/50'}`}
                        >
                          <h6 className={`font-semibold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{useCase.title}</h6>
                          <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{useCase.description}</p>
                          <FiArrowRight className={`mt-3 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`} size={16} />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Implementation & Success Metrics */}
          {useCaseData.implementation && (
            <motion.div
              id="implementation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <FiTarget className="text-primary-1 mr-3" size={24} />
                <h3 className={`h4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Implementation & Success Metrics</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Requirements */}
                {useCaseData.implementation.requirements && (
                  <div>
                    <h5 className={`h6 mb-4 flex items-center ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                      <FiList className="mr-2 text-primary-1" size={16} />
                      Implementation Requirements
                    </h5>
                    <ul className="space-y-3">
                      {useCaseData.implementation.requirements.map((req, index) => (
                        renderListItem(req, index, FiCheckCircle)
                      ))}
                    </ul>
                  </div>
                )}

                {/* Success Metrics */}
                {useCaseData.implementation.success_metrics && (
                  <div>
                    <h5 className={`h6 mb-4 flex items-center ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                      <FiBarChart className="mr-2 text-primary-1" size={16} />
                      Success Metrics
                    </h5>
                    <div className="space-y-3">
                      {useCaseData.implementation.success_metrics.map((metric, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center p-3 rounded-lg border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}
                        >
                          <FiTrendingUp className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          <span className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{metric}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Integration Points */}
                {useCaseData.implementation.integration_points && (
                  <div className="lg:col-span-2">
                    <h5 className={`h6 mb-4 flex items-center ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                      <FiGitBranch className="mr-2 text-primary-1" size={16} />
                      System Integration Points
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {useCaseData.implementation.integration_points.map((point, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}
                        >
                          <div className="flex items-center">
                            <FiDatabase className="w-5 h-5 text-primary-1 mr-3 flex-shrink-0" />
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{point}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`text-center p-8 rounded-xl border ${isDarkMode ? 'bg-gradient-to-br from-n-8 to-n-7 border-n-6' : 'bg-gradient-to-br from-white to-n-1 border-n-3'}`}
          >
            <h4 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Ready to Implement This Solution?</h4>
            <p className={`body-2 mb-6 max-w-2xl mx-auto ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Let our experts help you implement {useCaseData.title} with our proven methodology and cutting-edge technology stack.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/contact')}
                className="btn btn-primary"
                aria-label={`Start implementing ${useCaseData.title}`}
              >
                Start implementing {useCaseData.title}
                <FiArrowRight className="ml-2" size={16} />
              </button>
              <button
                onClick={() => navigate('/industries')}
                className={`btn ${isDarkMode ? 'btn-secondary' : 'btn-outline'}`}
              >
                Explore More Solutions
              </button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Co-Pilot Integration */}
      {showCoPilot && useCaseData && (
        <CoPilotCore
          useCaseData={useCaseData}
          selectedQuery={selectedQuery}
          onAnalysisComplete={handleCoPilotComplete}
          onSuggestedQuery={handleSuggestedQuery}
        />
      )}
    </>
  );
};

export default SolutionPage;


