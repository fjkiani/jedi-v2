import React, { useState, useEffect, useMemo } from 'react';
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
import { vscDarkPlus, prism as lightStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jediLabsLogo from '@/assets/logo/logo.png'; // Adjust path relative to src if needed
import { useTheme } from '@/context/ThemeContext'; // Import useTheme


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
        <div className={`p-2 rounded border text-xs w-[180px] break-words shadow-sm ${isDarkMode ? 'bg-n-7 border-n-6 text-n-2' : 'bg-white border-n-3 text-n-7'}`}>
          <strong className="block mb-1">Step {step.step}:</strong>
          <span className="block">{step.description}</span>
          {step.details && <p className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'} mt-1 italic`}>{step.details}</p>}
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
    style: { stroke: isDarkMode ? '#A78BFA' : '#8b5cf6', strokeWidth: 1.5 },
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
  const { isDarkMode } = useTheme(); // Get theme context

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

  // Re-calculate diagram when theme changes
  const flowDiagram = useMemo(() => {
    return useCaseData?.architecture?.flow
      ? createWorkflowDiagram(useCaseData.architecture.flow, isDarkMode)
      : { nodes: [], edges: [] };
  }, [useCaseData?.architecture?.flow, isDarkMode]);

  if (loading) {
    // Theme for loading text
    return (
      <Section className="pt-12">
        <div className={`container mx-auto text-center ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Loading solution details...</div>
      </Section>
    );
  }

  if (error) {
    // Theme for error text and button
    return (
      <Section className="pt-12">
        <div className="container mx-auto text-center text-red-500">
          Error: {error}
          <button onClick={() => navigate('/industries')} className={`mt-4 btn ${isDarkMode ? 'btn-secondary' : 'btn-primary'}`}> {/* Adjust button style */}
            Go back to Industries
          </button>
        </div>
      </Section>
    );
  }

  if (!useCaseData) {
    if (!loading && !error) {
      console.log("[SolutionPage] Render: Use case not found (after load/error check).");
      // Theme for not found text and button
      return (
        <Section className="pt-12">
          <div className={`container mx-auto text-center ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            Solution not found.
            <button onClick={() => navigate('/industries')} className={`mt-4 btn ${isDarkMode ? 'btn-secondary' : 'btn-primary'}`}> {/* Adjust button style */}
              Go back to Industries
            </button>
          </div>
        </Section>
      );
    }
    return null;
  }

  // Helper to render list items consistently with theme
  const renderListItem = (item, index, icon) => (
    <li key={index} className={`flex items-start p-3 rounded-lg border transition-shadow hover:shadow-md ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
      {icon && React.createElement(icon, { className: "w-5 h-5 text-primary-1 mr-3 mt-0.5 flex-shrink-0" })}
      <span className={`body-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{item}</span>
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

  // --- Updated Function to render Implementation Details with Theme --- 
  const renderImplementationDetails = (implementationData) => {
    console.log("[renderImplementationDetails] Received data:", implementationData);

    if (!implementationData || typeof implementationData !== 'object' || Object.keys(implementationData).length === 0) {
      console.log("[renderImplementationDetails] Data is null, not an object, or empty.");
      return <p className={`italic p-4 rounded-lg border ${isDarkMode ? 'text-n-4 bg-n-7 border-n-6' : 'text-n-5 bg-n-1 border-n-3'}`}>No structured implementation details available.</p>;
    }

    const codeLang = implementationData.language?.toLowerCase() || 'javascript';
    const syntaxTheme = isDarkMode ? vscDarkPlus : lightStyle; // Choose syntax theme
    const renderedKeys = new Set();

    // Helper for standard list sections with theme
    const renderListSection = (key, title, icon = FiList) => {
      if (implementationData[key] && Array.isArray(implementationData[key]) && implementationData[key].length > 0) {
        renderedKeys.add(key);
        return (
          <div>
            <h5 className={`h6 mb-3 flex items-center ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}><icon className="mr-2 text-primary-1/80" size={16}/>{title}</h5>
            <div className={`p-4 rounded-lg border text-sm ${isDarkMode ? 'bg-n-7 border-n-6 text-n-3' : 'bg-n-1 border-n-3 text-n-6'}`}>
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

    // Helper for code/config sections with theme
    const renderCodeSection = (key, title, lang, isConfig = false) => {
      if (implementationData[key]) {
        renderedKeys.add(key);
        if (isConfig) renderedKeys.add('language'); 
        const content = typeof implementationData[key] === 'object'
          ? JSON.stringify(implementationData[key], null, 2)
          : String(implementationData[key]);
        return (
          <div>
            <h5 className={`h6 mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>{title}</h5>
            {/* Theme for code block container */}
            <div className={`relative rounded-lg border group text-sm ${isDarkMode ? 'bg-n-9 border-n-6' : 'bg-gray-50 border-gray-200'}`}>
              <SyntaxHighlighter language={lang} style={syntaxTheme} customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.875rem' }} wrapLongLines={true}>
                {content}
              </SyntaxHighlighter>
              {/* Theme for copy button */}
              <CopyToClipboard text={content} onCopy={() => handleCopy(key)}>
                <button className={`absolute top-2 right-2 p-1.5 rounded opacity-50 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'bg-n-7 text-n-4 hover:text-primary-1' : 'bg-gray-200 text-gray-600 hover:text-primary-1'}`}>
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
        {/* Setup Instructions with theme */}
        {implementationData.setupInstructions && (() => {
          renderedKeys.add('setupInstructions');
          return (
            <div>
              <h5 className={`h6 mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Setup Instructions</h5>
              <div className={`p-4 rounded-lg border text-sm ${isDarkMode ? 'bg-n-7 border-n-6 text-n-3' : 'bg-n-1 border-n-3 text-n-6'}`}>
                {Array.isArray(implementationData.setupInstructions) ? (
                  <ol className="list-decimal list-inside space-y-1">
                    {implementationData.setupInstructions.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                ) : (
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

        {/* --- Jedi Labs Role Section with theme --- */}
        <div className={`p-6 rounded-lg border shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-n-7 to-n-8 border-n-6' : 'bg-gradient-to-br from-n-1 to-n-2 border-n-3'}`}>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-4">
            <img src={jediLabsLogo} alt="Jedi Labs Logo" className={`w-16 h-16 md:w-20 md:h-20 object-contain flex-shrink-0 rounded-full p-2 ${isDarkMode ? 'bg-n-1/10' : 'bg-n-8/5'}`} />
            <h5 className={`h5 text-center md:text-left ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Jedi Labs: Your End-to-End Automation Partner</h5>
          </div>
          <p className={`body-2 mb-5 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
            Jedi Labs bridges the gap between requirements and results. Our agentic automation platform seamlessly orchestrates the entire workflow, connecting diverse systems and data sources identified in the Integration Points. We handle the complexities, from initial setup to continuous optimization, ensuring you achieve your Success Metrics efficiently and reliably.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
             {[ /* Use map for consistency */
               "Agentic Workflow Design: Intelligent automation tailored to your specific use case.",
               "Seamless Integration: Connects disparate systems and APIs effortlessly.",
               "Scalable Deployment: Built for growth and evolving needs.",
               "Continuous Monitoring & Optimization: Ensuring peak performance and reliability."
             ].map((item, index) => (
               <li key={index} className="flex items-start">
                 <FiStar className="w-4 h-4 text-primary-1 mr-2 mt-0.5 flex-shrink-0"/>
                 <span className={isDarkMode ? 'text-n-3' : 'text-n-5'}>{item}</span>
               </li>
             ))}
           </ul>
        </div>


        {/* --- Custom Visualizations with theme --- */}

        {/* Integration Points (Diagram - Modified) */}
        {implementationData.integration_points && Array.isArray(implementationData.integration_points) && implementationData.integration_points.length > 0 && (() => {
          renderedKeys.add('integration_points');
          return (
            <div>
              <h5 className={`h6 mb-4 flex items-center ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}><FiDatabase className="mr-2 text-primary-1/80" size={16}/>Integration Points (Orchestrated by Jedi Labs)</h5>
              <div className={`flex flex-col items-center p-4 rounded-lg border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
                {/* Central Box - Jedi Labs */}
                <div className={`relative p-3 px-4 border rounded text-sm font-medium mb-6 shadow-sm flex items-center ${isDarkMode ? 'bg-primary-1/20 border-primary-1/50 text-primary-1' : 'bg-primary-1/10 border-primary-1/30 text-primary-1'}`}>
                   <img src={jediLabsLogo} alt="Jedi Labs" className="w-5 h-5 mr-2 filter invert brightness-0 saturate-100 hue-rotate-[200deg] contrast-[1.2]" /> 
                   Jedi Labs Automation
                </div>
                {/* Connecting Lines & Point Boxes */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6 w-full justify-items-center">
                  {implementationData.integration_points.map((point, index) => (
                    <div key={index} className="relative flex flex-col items-center text-center">
                      {/* Line */}
                      <div className={`absolute bottom-full left-1/2 w-px h-6 mb-[-1px] ${isDarkMode ? 'bg-n-5' : 'bg-n-4'}`}></div>
                      {/* Point Box */}
                      <div className={`p-2 px-3 border rounded text-xs shadow-sm min-w-[100px] ${isDarkMode ? 'bg-n-8 border-n-6 text-n-3' : 'bg-white border-n-3 text-n-6'}`}>
                        {point}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Success Metrics (Cards/Badges) with theme */}
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
              <h5 className={`h6 mb-4 flex items-center ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}><FiTarget className="mr-2 text-primary-1/80" size={16}/>Success Metrics (Achieved via Automation)</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {implementationData.success_metrics.map((metric, index) => {
                  const Icon = getMetricIcon(metric);
                  return (
                    <div key={index} className={`flex items-center p-3 rounded-lg border transition-all hover:shadow-lg ${isDarkMode ? 'bg-n-7 border-n-6 hover:border-primary-1/50' : 'bg-n-1 border-n-3 hover:border-primary-1/50'}`}>
                      <Icon className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 opacity-80" />
                      <span className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{metric}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}


        {/* --- Fallback for Other Keys with theme --- */}
        {Object.entries(implementationData)
          .filter(([key]) => !renderedKeys.has(key))
          .map(([key, value]) => (
             renderListSection(key, key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
        ))}

        {/* --- Call to Action with theme --- */}
        <div className={`mt-10 pt-6 border-t text-center ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}>
           <h5 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Ready to Automate with Jedi Labs?</h5> 
           <p className={`body-2 mb-6 max-w-md mx-auto ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
             Let our experts tailor this solution and implement our powerful automation platform for your specific needs.
           </p>
           <button
             onClick={() => navigate('/contact')}
             // Use theme-aware button classes if Button component not used
             className={`btn btn-primary ${isDarkMode ? '' : 'text-white'}`} 
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
            {/* Theme for back button */}
            <button
              onClick={() => navigate(`/industries/${industryId || useCaseData.industry?.slug}`)}
              className={`flex items-center text-sm font-medium transition-colors ${isDarkMode ? 'text-n-3 hover:text-primary-1' : 'text-n-5 hover:text-primary-1'}`}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to {useCaseData.industry?.name || 'Industry'}
            </button>
          </div>

          {/* Theme for Heading */}
          <Heading
            className="text-center md:text-left mb-2"
            title={useCaseData.title}
            // Assuming Heading handles its own theme or pass isDarkMode if needed
          />
          {/* Theme for main description */}
          <p className={`body-1 text-n-3 mb-8 text-center md:text-left max-w-3xl mx-auto md:mx-0 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
            {useCaseData.description}
          </p>

          <div className="mt-10 lg:mt-12">
             {/* Theme for Tab buttons */}
            <div className="flex justify-center flex-wrap gap-3 mb-8">
              {['overview', 'architecture', 'details', 'benefits'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap ${ 
                    activeTab === tab
                      // Active state: Keep primary bg, conditional text color
                      ? (isDarkMode ? 'bg-primary-1 text-white shadow-md' : 'bg-primary-1 text-n-8 shadow-md') 
                      // Inactive state: Theme-aware
                      : (isDarkMode ? 'bg-n-7 text-n-3 hover:bg-n-6' : 'bg-n-2 text-n-5 hover:bg-n-3')
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Theme for Tab Content container */}
            <div className={`rounded-xl p-4 md:p-6 border min-h-[400px] ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-white border-n-3'}`}>
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
                            <h4 className={`h5 mb-4 flex items-center ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                              <FiList className="mr-2 text-primary-1"/> Capabilities
                            </h4>
                            <ul className="space-y-3">
                              {useCaseData.capabilities.map((item, index) => renderListItem(item, index, FiCheckCircle))}
                            </ul>
                          </div>
                        )}
                        {useCaseData.queries && useCaseData.queries.length > 0 && (
                           <div>
                             <h4 className={`h5 mb-4 flex items-center ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                               <FiTerminal className="mr-2 text-primary-1"/> Key Queries / Prompts
                             </h4>
                             <ul className="space-y-3">
                               {useCaseData.queries.map((query, index) => (
                                 <li key={index}>
                                   <button
                                     onClick={() => setActiveTab('architecture')} // Keep functionality
                                     // Theme for query buttons
                                     className={`w-full flex items-center justify-between text-left p-3 rounded-lg border transition-all hover:shadow-lg group ${isDarkMode ? 'bg-n-7 border-n-6 hover:border-primary-1/50 hover:bg-n-6' : 'bg-n-1 border-n-3 hover:border-primary-1/50 hover:bg-n-2'}`}
                                   >
                                     <span className={`body-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{query}</span>
                                     <FiArrowRight className={`w-4 h-4 transition-colors ml-2 flex-shrink-0 ${isDarkMode ? 'text-n-4 group-hover:text-primary-1' : 'text-n-5 group-hover:text-primary-1'}`} />
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
                             <h4 className={`h5 mb-4 flex items-center ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                               <FiCpu className="mr-2 text-primary-1"/> Technologies Used
                             </h4>
                             <div className="space-y-3">
                               {useCaseData.technologies.map((tech) => (
                                 <Link
                                   key={tech.id}
                                   to={`/technology/${tech.slug}`}
                                   // Theme for tech links
                                   className={`flex items-center p-3 rounded-lg border transition-all hover:shadow-lg ${isDarkMode ? 'bg-n-7 border-n-6 hover:border-primary-1/50' : 'bg-n-1 border-n-3 hover:border-primary-1/50'}`}
                                 >
                                   {tech.icon && (
                                     <img src={tech.icon} alt={tech.name} className="w-6 h-6 mr-3 object-contain flex-shrink-0" />
                                   )}
                                   <span className={`body-2 font-medium ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{tech.name}</span>
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
                      <h4 className={`h5 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Architecture</h4>

                      {useCaseData.architecture?.description && (
                        // Theme for architecture overview box
                        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
                          <h5 className={`h6 mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Overview</h5>
                          <p className={`body-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{useCaseData.architecture.description}</p>
                        </div>
                      )}

                      <div>
                        <h5 className={`h6 mb-3 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Workflow</h5>
                        {useCaseData.architecture?.flow && flowDiagram.nodes.length > 0 ? (
                          <ReactFlowProvider>
                            {/* Theme for React Flow container */}
                            <div className={`h-[350px] md:h-[450px] w-full rounded-lg border relative overflow-hidden ${isDarkMode ? 'bg-n-9 border-n-6 react-flow-dark-themed' : 'bg-gray-50 border-gray-200 react-flow-light-themed'}`}>
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
                                {/* Theme for Background */}
                                <Background color={isDarkMode ? '#374151' : '#e5e7eb'} gap={16} variant="dots" />
                                {/* Theme for Controls */}
                                <Controls showInteractive={false} className={`react-flow-controls ${isDarkMode ? '!bg-n-7 !border-n-6 !text-n-3' : '!bg-white !border-gray-300 !text-gray-700'}`} />
                                {/* Theme for MiniMap */}
                                <MiniMap nodeColor={isDarkMode ? '#A78BFA' : '#8b5cf6'} className={`react-flow-minimap ${isDarkMode ? '!bg-n-10 !border-n-7' : '!bg-gray-100 !border-gray-300'}`} nodeBorderRadius={2} />
                              </ReactFlow>
                            </div>
                          </ReactFlowProvider>
                        ) : (
                          <p className={`italic p-4 rounded-lg border ${isDarkMode ? 'text-n-4 bg-n-7 border-n-6' : 'text-n-5 bg-n-1 border-n-3'}`}>No architecture flow data available or data is invalid.</p>
                        )}
                      </div>

                      {useCaseData.architecture?.components && useCaseData.architecture.components.length > 0 && (
                        <div>
                          <h5 className={`h6 mb-3 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Key Components</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {useCaseData.architecture.components.map((comp) => {
                              const isExpanded = expandedComponentId === comp.id;
                              const hasDetails = comp.details || (comp.explanation && comp.explanation.length > 0);

                              return (
                                // Theme for component card
                                <div key={comp.id} className={`p-4 rounded-lg border transition-shadow hover:shadow-md flex flex-col ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
                                  <div className="flex-grow">
                                    <h6 className={`font-semibold mb-1 flex items-center ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                      <FiServer size={14} className="mr-2 text-primary-1 opacity-80"/>
                                      {comp.name}
                                    </h6>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{comp.description}</p>
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
                                            // Theme for expanded details border
                                            className={`overflow-hidden mt-2 border-t pt-3 ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}
                                          >
                                            {comp.details && (
                                              <div className="mb-2">
                                                <h6 className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Details:</h6>
                                                <p className={`text-xs whitespace-pre-wrap ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{comp.details}</p>
                                              </div>
                                            )}
                                            {comp.explanation && comp.explanation.length > 0 && (
                                              <div>
                                                <h6 className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Explanation:</h6>
                                                <ul className="list-disc list-inside space-y-1">
                                                  {comp.explanation.map((point, idx) => (
                                                    <li key={idx} className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{point}</li>
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
                      <h4 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Benefits / Metrics</h4>
                      {useCaseData.metrics && useCaseData.metrics.length > 0 ? (
                        <ul className="space-y-3">
                          {useCaseData.metrics.map((metric, index) => renderListItem(metric, index, FiCheckCircle))}
                        </ul>
                      ) : (
                        // Theme for no benefits text
                        <p className={`italic p-4 rounded-lg border ${isDarkMode ? 'text-n-4 bg-n-7 border-n-6' : 'text-n-5 bg-n-1 border-n-3'}`}>No benefits or metrics listed.</p>
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


