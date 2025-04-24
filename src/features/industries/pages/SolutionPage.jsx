import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { FiCheckCircle, FiServer, FiList, FiTerminal, FiCpu, FiArrowRight, FiChevronDown, FiChevronUp, FiCopy, FiCheck, FiTarget, FiDatabase, FiGitBranch, FiZap, FiClock, FiTrendingUp, FiMessageSquare, FiStar } from 'react-icons/fi';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { TabsRoot, TabsList, TabTrigger, TabsContent, TabPanel } from '@/components/ui/Tabs';
import Heading from '@/components/Heading';
// import Breadcrumbs from '@/components/Breadcrumbs'; // Comment out missing component import
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jediLabsLogo from '@/assets/logo/logo.png'; // Adjust path relative to src if needed


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
      }
      technologies(first: 10) {
        id
        name
        slug
        icon 
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

const createWorkflowDiagram = (flowData) => {
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
        <div className="p-2 rounded bg-n-7 border border-n-6 text-n-2 text-xs w-[180px] break-words shadow-sm">
          <strong className="block mb-1">Step {step.step}:</strong>
          <span className="block">{step.description}</span>
          {step.details && <p className="text-xs text-n-4 mt-1 italic">{step.details}</p>}
        </div>
      )
    },
    position: { x: index * 230, y: 50 },
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
    style: { stroke: '#A78BFA', strokeWidth: 1.5 },
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
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedComponentId, setExpandedComponentId] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});

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
        setError("Failed to load solution details. Please check the console.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [solutionId]);

  if (loading) {
    return (
      <Section className="pt-12">
        <div className="container mx-auto text-center">Loading solution details...</div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="pt-12">
        <div className="container mx-auto text-center text-red-500">
          Error: {error}
          <button onClick={() => navigate('/industries')} className="mt-4 btn">
            Go back to Industries
          </button>
        </div>
      </Section>
    );
  }

  if (!useCaseData) {
    if (!loading && !error) {
      console.log("[SolutionPage] Render: Use case not found (after load/error check).");
      return (
        <Section className="pt-12">
          <div className="container mx-auto text-center">
            Solution not found.
            <button onClick={() => navigate('/industries')} className="mt-4 btn">
              Go back to Industries
            </button>
          </div>
        </Section>
      );
    }
    return null;
  }

  const flowDiagram = useCaseData.architecture?.flow
    ? createWorkflowDiagram(useCaseData.architecture.flow)
    : { nodes: [], edges: [] };

  // Helper to render list items consistently
  const renderListItem = (item, index, icon) => (
    <li key={index} className="flex items-start p-3 bg-n-7 rounded-lg border border-n-6 transition-shadow hover:shadow-md">
      {icon && React.createElement(icon, { className: "w-5 h-5 text-primary-1 mr-3 mt-0.5 flex-shrink-0" })}
      <span className="text-n-3 body-2">{item}</span>
    </li>
  );

  // Toggle function for component details
  const toggleComponentDetails = (componentId) => {
    setExpandedComponentId(currentId => (currentId === componentId ? null : componentId));
  };

  // Handle copy confirmation
  const handleCopy = (key) => {
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 1500); // Reset after 1.5 seconds
  };

  // --- Updated Function to render Implementation Details ---
  const renderImplementationDetails = (implementationData) => {
    console.log("[renderImplementationDetails] Received data:", implementationData);

    if (!implementationData || typeof implementationData !== 'object' || Object.keys(implementationData).length === 0) {
      console.log("[renderImplementationDetails] Data is null, not an object, or empty.");
      return <p className="text-n-4 italic p-4 bg-n-7 rounded-lg border border-n-6">No structured implementation details available.</p>;
    }

    const codeLang = implementationData.language?.toLowerCase() || 'javascript';
    const renderedKeys = new Set();

    // Helper for standard list sections
    const renderListSection = (key, title, icon = FiList) => {
      if (implementationData[key] && Array.isArray(implementationData[key]) && implementationData[key].length > 0) {
        renderedKeys.add(key);
        return (
          <div>
            <h5 className="h6 mb-3 text-n-2 flex items-center"><icon className="mr-2 text-primary-1/80" size={16}/>{title}</h5>
            <div className="p-4 bg-n-7 rounded-lg border border-n-6 text-sm text-n-3">
              <ul className="list-disc list-inside space-y-1.5">
                {implementationData[key].map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      }
      return null;
    };

    // Helper for code/config sections
    const renderCodeSection = (key, title, lang, isConfig = false) => {
      if (implementationData[key]) {
        renderedKeys.add(key);
        if (isConfig) renderedKeys.add('language'); // Mark language if it's the main code snippet
        const content = typeof implementationData[key] === 'object'
          ? JSON.stringify(implementationData[key], null, 2)
          : String(implementationData[key]);
        return (
          <div>
            <h5 className="h6 mb-2 text-n-2">{title}</h5>
            <div className="relative bg-n-9 rounded-lg border border-n-6 group text-sm">
              <SyntaxHighlighter language={lang} style={vscDarkPlus} customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.875rem' }} wrapLongLines={true}>
                {content}
              </SyntaxHighlighter>
              <CopyToClipboard text={content} onCopy={() => handleCopy(key)}>
                <button className="absolute top-2 right-2 p-1.5 bg-n-7 rounded text-n-4 hover:text-primary-1 opacity-50 group-hover:opacity-100 transition-opacity">
                  {copiedStates[key] ? <FiCheck size={14} className="text-green-400"/> : <FiCopy size={14} />}
                </button>
              </CopyToClipboard>
            </div>
          </div>
        );
      }
      return null;
    };


    return (
      <div className="space-y-8">

        {/* --- Standard Sections --- */}
        {renderCodeSection('codeSnippet', 'Example Code Snippet', codeLang, true)}
        {/* Setup Instructions */}
        {implementationData.setupInstructions && (() => {
          renderedKeys.add('setupInstructions');
          return (
            <div>
              <h5 className="h6 mb-2 text-n-2">Setup Instructions</h5>
              <div className="p-4 bg-n-7 rounded-lg border border-n-6 text-sm text-n-3">
                {Array.isArray(implementationData.setupInstructions) ? (
                  <ol className="list-decimal list-inside space-y-1">
                    {implementationData.setupInstructions.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  // Treat as single block of text if not an array
                  <p className="whitespace-pre-wrap">{String(implementationData.setupInstructions)}</p>
                )}
              </div>
            </div>
          );
        })()}
        {renderListSection('dependencies', 'Dependencies', FiGitBranch)}
        {renderCodeSection('configuration', 'Configuration', 'json')}
        {renderListSection('apiEndpoints', 'API Endpoints', FiZap)}
        {renderListSection('requirements', 'Requirements', FiCheckCircle)}

        {/* --- Jedi Labs Role Section --- */}
        <div className="p-6 bg-gradient-to-br from-n-7 to-n-8 rounded-lg border border-n-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-4">
            {/* Use the imported logo variable */}
            <img src={jediLabsLogo} alt="Jedi Labs Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain flex-shrink-0 bg-n-1/10 rounded-full p-2" />
            <h5 className="h5 text-n-1 text-center md:text-left">Jedi Labs: Your End-to-End Automation Partner</h5>
          </div>
          <p className="body-2 text-n-3 mb-5">
            Jedi Labs bridges the gap between requirements and results. Our agentic automation platform seamlessly orchestrates the entire workflow, connecting diverse systems and data sources identified in the Integration Points. We handle the complexities, from initial setup to continuous optimization, ensuring you achieve your Success Metrics efficiently and reliably.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
             <li className="flex items-start">
               <FiStar className="w-4 h-4 text-primary-1 mr-2 mt-0.5 flex-shrink-0"/>
               <span className="text-n-3">Agentic Workflow Design: Intelligent automation tailored to your specific use case.</span>
             </li>
             <li className="flex items-start">
               <FiStar className="w-4 h-4 text-primary-1 mr-2 mt-0.5 flex-shrink-0"/>
               <span className="text-n-3">Seamless Integration: Connects disparate systems and APIs effortlessly.</span>
             </li>
             <li className="flex items-start">
               <FiStar className="w-4 h-4 text-primary-1 mr-2 mt-0.5 flex-shrink-0"/>
               <span className="text-n-3">Scalable Deployment: Built for growth and evolving needs.</span>
             </li>
             <li className="flex items-start">
               <FiStar className="w-4 h-4 text-primary-1 mr-2 mt-0.5 flex-shrink-0"/>
               <span className="text-n-3">Continuous Monitoring & Optimization: Ensuring peak performance and reliability.</span>
             </li>
           </ul>
        </div>


        {/* --- Custom Visualizations --- */}

        {/* Integration Points (Diagram - Modified) */}
        {implementationData.integration_points && Array.isArray(implementationData.integration_points) && implementationData.integration_points.length > 0 && (() => {
          renderedKeys.add('integration_points');
          return (
            <div>
              <h5 className="h6 mb-4 text-n-2 flex items-center"><FiDatabase className="mr-2 text-primary-1/80" size={16}/>Integration Points (Orchestrated by Jedi Labs)</h5>
              <div className="flex flex-col items-center p-4 bg-n-7 rounded-lg border border-n-6">
                {/* Central Box - Jedi Labs */}
                <div className="relative p-3 px-4 bg-primary-1/20 border border-primary-1/50 rounded text-primary-1 text-sm font-medium mb-6 shadow-sm flex items-center">
                   {/* Use the imported logo variable */}
                   <img src={jediLabsLogo} alt="Jedi Labs" className="w-5 h-5 mr-2 filter invert brightness-0 saturate-100 hue-rotate-[200deg] contrast-[1.2]" /> {/* Adjust filter for visibility */}
                   Jedi Labs Automation
                </div>
                {/* Connecting Lines & Point Boxes */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6 w-full justify-items-center">
                  {implementationData.integration_points.map((point, index) => (
                    <div key={index} className="relative flex flex-col items-center text-center">
                      {/* Line */}
                      <div className="absolute bottom-full left-1/2 w-px h-6 bg-n-5 mb-[-1px]"></div>
                      {/* Point Box */}
                      <div className="p-2 px-3 bg-n-8 border border-n-6 rounded text-n-3 text-xs shadow-sm min-w-[100px]">
                        {point}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Success Metrics (Cards/Badges) */}
        {implementationData.success_metrics && Array.isArray(implementationData.success_metrics) && implementationData.success_metrics.length > 0 && (() => {
          renderedKeys.add('success_metrics');
          const getMetricIcon = (metric) => {
            if (metric.includes('Increase')) return FiTrendingUp;
            if (metric.includes('Efficiency')) return FiClock;
            if (metric.includes('Accuracy')) return FiCheckCircle;
            if (metric.includes('Satisfaction')) return FiMessageSquare;
            return FiStar;
          };
          return (
            <div>
              <h5 className="h6 mb-4 text-n-2 flex items-center"><FiTarget className="mr-2 text-primary-1/80" size={16}/>Success Metrics (Achieved via Automation)</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {implementationData.success_metrics.map((metric, index) => {
                  const Icon = getMetricIcon(metric);
                  return (
                    <div key={index} className="flex items-center p-3 bg-n-7 rounded-lg border border-n-6 transition-all hover:shadow-lg hover:border-primary-1/50">
                      <Icon className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 opacity-80" />
                      <span className="text-n-3 text-sm">{metric}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}


        {/* --- Fallback for Other Keys --- */}
        {Object.entries(implementationData)
          .filter(([key]) => !renderedKeys.has(key))
          .map(([key, value]) => (
             renderListSection(key, key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
        ))}

        {/* --- Call to Action --- */}
        <div className="mt-10 pt-6 border-t border-n-6 text-center">
           <h5 className="h5 mb-4 text-n-1">Ready to Automate with Jedi Labs?</h5> {/* Updated CTA Title */}
           <p className="body-2 text-n-4 mb-6 max-w-md mx-auto">
             Let our experts tailor this solution and implement our powerful automation platform for your specific needs.
           </p>
           <button
             onClick={() => navigate('/contact')}
             className="btn btn-primary"
           >
             Partner with Us
             <FiArrowRight className="ml-2" size={16}/>
           </button>
         </div>

      </div>
    );
  };

  return (
    <>
      <SEO
        title={`${useCaseData.title} - ${useCaseData.industry?.name || 'Industry'} | Jedi Labs`}
        description={useCaseData.description || `Learn about ${useCaseData.title} solutions for the ${useCaseData.industry?.name || 'relevant'} industry.`}
        ogUrl={`https://www.jedilabs.org/industries/${useCaseData.industry?.slug}/${useCaseData.slug}`}
      />

      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          <div className="relative z-10 mb-6">
            <button
              onClick={() => navigate(`/industries/${industryId || useCaseData.industry?.slug}`)}
              className="flex items-center text-sm font-medium text-n-3 hover:text-primary-1 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to {useCaseData.industry?.name || 'Industry'}
            </button>
          </div>

          <Heading
            className="text-center md:text-left mb-2"
            title={useCaseData.title}
          />
          <p className="body-1 text-n-3 mb-8 text-center md:text-left max-w-3xl mx-auto md:mx-0">
            {useCaseData.description}
          </p>

          <div className="mt-10 lg:mt-12">
            <div className="flex justify-center flex-wrap gap-3 mb-8">
              {['overview', 'architecture', 'details', 'benefits'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-primary-1 text-white shadow-md'
                      : 'bg-n-7 text-n-3 hover:bg-n-6'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="bg-n-8 rounded-xl p-4 md:p-6 border border-n-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-6">
                        {useCaseData.capabilities && useCaseData.capabilities.length > 0 && (
                          <div>
                            <h4 className="h5 mb-4 text-n-1 flex items-center">
                              <FiList className="mr-2 text-primary-1"/> Capabilities
                            </h4>
                            <ul className="space-y-3">
                              {useCaseData.capabilities.map((item, index) => renderListItem(item, index, FiCheckCircle))}
                            </ul>
                          </div>
                        )}
                        {useCaseData.queries && useCaseData.queries.length > 0 && (
                           <div>
                             <h4 className="h5 mb-4 text-n-1 flex items-center">
                               <FiTerminal className="mr-2 text-primary-1"/> Key Queries / Prompts
                             </h4>
                             <ul className="space-y-3">
                               {useCaseData.queries.map((query, index) => (
                                 <li key={index}>
                                   <button
                                     onClick={() => setActiveTab('architecture')}
                                     className="w-full flex items-center justify-between text-left p-3 bg-n-7 rounded-lg border border-n-6 transition-all hover:shadow-lg hover:border-primary-1/50 hover:bg-n-6 group"
                                   >
                                     <span className="text-n-3 body-2">{query}</span>
                                     <FiArrowRight className="w-4 h-4 text-n-4 group-hover:text-primary-1 transition-colors ml-2 flex-shrink-0" />
                                   </button>
                                 </li>
                               ))}
                             </ul>
                           </div>
                         )}
                      </div>

                      <div className="md:col-span-1">
                         {useCaseData.technologies && useCaseData.technologies.length > 0 && (
                           <div>
                             <h4 className="h5 mb-4 text-n-1 flex items-center">
                               <FiCpu className="mr-2 text-primary-1"/> Technologies Used
                             </h4>
                             <div className="space-y-3">
                               {useCaseData.technologies.map((tech) => (
                                 <Link
                                   key={tech.id}
                                   to={`/technology/${tech.slug}`}
                                   className="flex items-center p-3 bg-n-7 rounded-lg border border-n-6 transition-all hover:shadow-lg hover:border-primary-1/50"
                                 >
                                   {tech.icon && (
                                     <img src={tech.icon} alt={tech.name} className="w-6 h-6 mr-3 object-contain flex-shrink-0" />
                                   )}
                                   <span className="text-n-3 body-2 font-medium">{tech.name}</span>
                                 </Link>
                               ))}
                             </div>
                           </div>
                         )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'architecture' && (
                    <div className="space-y-6">
                      <h4 className="h5 text-n-1">Architecture</h4>

                      {useCaseData.architecture?.description && (
                        <div className="p-4 bg-n-7 rounded-lg border border-n-6">
                          <h5 className="h6 mb-2 text-n-2">Overview</h5>
                          <p className="body-2 text-n-3">{useCaseData.architecture.description}</p>
                        </div>
                      )}

                      <div>
                        <h5 className="h6 mb-3 text-n-2">Workflow</h5>
                        {useCaseData.architecture?.flow && flowDiagram.nodes.length > 0 ? (
                          <ReactFlowProvider>
                            <div className="h-[350px] md:h-[450px] w-full bg-n-9 rounded-lg border border-n-6 relative overflow-hidden">
                              <ReactFlow
                                nodes={flowDiagram.nodes}
                                edges={flowDiagram.edges}
                                fitView
                                nodesDraggable={false}
                                nodesConnectable={false}
                                className="react-flow-dark-themed"
                                panOnScroll={true}
                                zoomOnScroll={false}
                                preventScrolling={false}
                              >
                                <Background color="#374151" gap={16} variant="dots" />
                                <Controls showInteractive={false} className="react-flow-controls !bg-n-7 !border-n-6 !text-n-3" />
                                <MiniMap nodeColor="#A78BFA" className="react-flow-minimap !bg-n-10 !border-n-7" nodeBorderRadius={2} />
                              </ReactFlow>
                            </div>
                          </ReactFlowProvider>
                        ) : (
                          <p className="text-n-4 italic p-4 bg-n-7 rounded-lg border border-n-6">No architecture flow data available or data is invalid.</p>
                        )}
                      </div>

                      {useCaseData.architecture?.components && useCaseData.architecture.components.length > 0 && (
                        <div>
                          <h5 className="h6 mb-3 text-n-2">Key Components</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {useCaseData.architecture.components.map((comp) => {
                              const isExpanded = expandedComponentId === comp.id;
                              const hasDetails = comp.details || (comp.explanation && comp.explanation.length > 0);

                              return (
                                <div key={comp.id} className="bg-n-7 p-4 rounded-lg border border-n-6 transition-shadow hover:shadow-md flex flex-col">
                                  <div className="flex-grow">
                                    <h6 className="font-semibold text-n-1 mb-1 flex items-center">
                                      <FiServer size={14} className="mr-2 text-primary-1 opacity-80"/>
                                      {comp.name}
                                    </h6>
                                    <p className="text-sm text-n-3 mb-3">{comp.description}</p>
                                  </div>

                                  {hasDetails && (
                                    <>
                                      <button
                                        onClick={() => toggleComponentDetails(comp.id)}
                                        className="mt-auto text-xs font-medium text-primary-1 hover:text-primary-2 self-start flex items-center py-1"
                                      >
                                        {isExpanded ? 'Hide Details' : 'Show Details'}
                                        {isExpanded ? <FiChevronUp className="ml-1" size={14}/> : <FiChevronDown className="ml-1" size={14}/>}
                                      </button>

                                      <AnimatePresence>
                                        {isExpanded && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden mt-2 border-t border-n-6 pt-3"
                                          >
                                            {comp.details && (
                                              <div className="mb-2">
                                                <h6 className="text-xs font-semibold text-n-2 mb-1">Details:</h6>
                                                <p className="text-xs text-n-4 whitespace-pre-wrap">{comp.details}</p>
                                              </div>
                                            )}
                                            {comp.explanation && comp.explanation.length > 0 && (
                                              <div>
                                                <h6 className="text-xs font-semibold text-n-2 mb-1">Explanation:</h6>
                                                <ul className="list-disc list-inside space-y-1">
                                                  {comp.explanation.map((point, idx) => (
                                                    <li key={idx} className="text-xs text-n-4">{point}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div>
                      {renderImplementationDetails(useCaseData.implementation)}
                    </div>
                  )}

                  {activeTab === 'benefits' && (
                    <div>
                      <h4 className="h5 mb-4 text-n-1">Benefits / Metrics</h4>
                      {useCaseData.metrics && useCaseData.metrics.length > 0 ? (
                        <ul className="space-y-3">
                          {useCaseData.metrics.map((metric, index) => (
                            <li key={index} className="flex items-start p-3 bg-n-7 rounded-lg border border-n-6 transition-shadow hover:shadow-md">
                              <FiCheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-n-3 body-2">{metric}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-n-4 italic p-4 bg-n-7 rounded-lg border border-n-6">No benefits or metrics listed.</p>
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

export default SolutionPage;


