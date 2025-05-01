import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  TabPanel
} from '@/components/ui/Tabs';
import { hygraphClient } from '@/lib/hygraph';
import UseCaseCard from '@/components/UseCaseCard';
import { FiCheckCircle, FiServer, FiList, FiTerminal, FiCpu, FiArrowRight, FiChevronDown, FiChevronUp, FiCopy, FiCheck, FiTarget, FiDatabase, FiGitBranch, FiZap, FiClock, FiTrendingUp, FiMessageSquare, FiStar } from 'react-icons/fi';
import Heading from '@/components/Heading';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { gql } from 'graphql-request';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism as lightStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jediLabsLogo from '@/assets/logo/logo.png';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/Button';

const GET_USE_CASES = gql`
  query GetUseCases {
    useCaseS(
      orderBy: publishedAt_DESC 
      stage: PUBLISHED
    ) {
      id
      title
      slug
      description
      industry {
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
        id
        name
        slug
        icon
      }
      publishedAt
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
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[SolutionPage] Fetching ALL use cases...');
        const data = await hygraphClient.request(GET_USE_CASES);
        console.log('[SolutionPage] Hygraph ALL use case response:', data);
        const fetchedUseCases = data.useCases || data.useCaseS || [];
        setUseCases(fetchedUseCases);
      } catch (err) {
        console.error('[SolutionPage] Error fetching ALL use cases:', err);
        setError('Error loading use cases');
      } finally {
        setLoading(false);
      }
    };

    fetchUseCases();
  }, []);

  const handleUseCaseClick = (useCase) => {
    console.log('Use case clicked, navigating to page:', useCase);
    if (useCase?.industry?.slug && useCase.slug) {
      navigate(`/industries/${useCase.industry.slug}/${useCase.slug}`);
    } else {
      console.warn('Missing industry slug or use case slug for navigation:', useCase);
    }
  };

  const handleQueryClick = (useCase) => {
    console.log('Query clicked, navigating to use case page (Architecture tab):', useCase);
    if (useCase?.industry?.slug && useCase.slug) {
      navigate(`/industries/${useCase.industry.slug}/${useCase.slug}?tab=architecture`);
    } else {
       console.warn('Missing industry slug or use case slug for navigation from query:', useCase);
    }
  };

  const handleTechClick = (tech) => {
    console.log('Technology clicked:', tech);
    if (!tech.name) {
      console.error('No name available for technology:', tech);
      return;
    }
    
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
      localStorage.setItem('selectedTechnology', JSON.stringify(technologyData));
      console.log('Technology data saved successfully');
      
      const techSlug = tech.slug || tech.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      console.log('Navigating to:', `/technology/${techSlug}`); 
      navigate(`/technology/${techSlug}`);
    } catch (error) {
      console.error('Error in handleTechClick:', error);
    }
  };

  const renderTabContent = (tabId) => {
    switch (tabId) {
      case 'overview':
        return (
          <div className="space-y-10">
            {solution.businessValue && (
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Business Value</h3>
                  <ul className="space-y-3">
                    {solution.businessValue.metrics?.map((metric, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Icon name="check" className="w-6 h-6 text-primary-1 mt-1 flex-shrink-0" />
                        <span className={`${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Key Capabilities</h3>
                  <ul className="space-y-3">
                    {solution.businessValue.capabilities?.map((capability, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Icon name="check" className="w-6 h-6 text-primary-1 mt-1 flex-shrink-0" />
                        <span className={`${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div>
              <h3 className={`h4 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Common Use Cases</h3>
              {loading ? (
                <div className={`text-center ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>Loading use cases...</div>
              ) : error ? (
                <div className={`text-center text-red-500 p-4 border border-red-500/30 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                  {error}
                </div>
              ) : useCases.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {useCases.map((useCase) => (
                    <UseCaseCard 
                      key={useCase.id}
                      useCase={useCase} 
                      onQueryClick={() => handleQueryClick(useCase)} 
                      onClick={() => handleUseCaseClick(useCase)} 
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>No use cases found</div>
              )}
            </div>
          </div>
        );

      case 'architecture':
        return solution.architecture ? (
          <div className="space-y-8">
            <div>
              <h3 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{solution.architecture.title}</h3>
              <p className={`mb-8 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{solution.architecture.description}</p>
            </div>
            <div className="mb-8">
              <ArchitectureDiagram diagram={{
                nodes: solution.architecture.nodes,
                connections: solution.architecture.connections,
                layout: solution.architecture.layout
              }} />
            </div>
            {solution.architecture.components && (
              <div>
                <h4 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Key Components</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {solution.architecture.components.map((component, idx) => (
                    <div key={idx} className={`rounded-lg p-4 ${isDarkMode ? 'bg-n-7' : 'bg-n-1 border border-n-3'}`}>
                      <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{component.name}</h5>
                      <p className={`${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{component.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`text-center ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>Architecture details not available</div>
        );

      case 'techstack':
        return solution.techStack ? (
          <div className="space-y-10">
            {Object.entries(solution.techStack).map(([category, technologies]) => (
              <div key={category}>
                <h3 className={`h4 mb-6 capitalize ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(technologies).map(([name, tech]) => (
                    <div 
                      key={name}
                      onClick={() => handleTechClick({ name, ...tech })}
                      className={`rounded-xl p-6 border cursor-pointer transition-all duration-300 hover:shadow-lg flex flex-col 
                        ${isDarkMode 
                          ? 'bg-n-7 border-n-6 hover:border-primary-1' 
                          : 'bg-white border-n-3 hover:border-primary-1'}`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        {tech.icon && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img 
                              src={typeof tech.icon === 'string' ? tech.icon : tech.icon.url} 
                              alt={name}
                              className="w-8 h-8 object-contain"
                              onError={(e) => { e.target.src = 'https://cdn.simpleicons.org/dotenv'; }}
                            />
                          </div>
                        )}
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-n-8'}`}>{name}</h4>
                      </div>
                      <p className={`mb-4 flex-grow ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{tech.description}</p>
                      <div className={`flex items-center gap-2 text-sm text-primary-1 mt-auto pt-2 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}>
                        <span>View Details</span>
                        <Icon name="arrow-right" className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>Tech stack details not available</div>
        );

      default:
        return null;
    }
  };

  const TABS_CONFIG = [
    { id: 'overview', label: 'Overview', icon: 'info' },
    ...(solution.architecture ? [{ id: 'architecture', label: 'Architecture', icon: 'share-2' }] : []),
    { id: 'techstack', label: 'Tech Stack', icon: 'cpu' },
  ];

  if (!solution) {
    return (
      <Section className="text-center">
        <h2 className="h2">Solution not found</h2>
        <p className={`${isDarkMode ? 'text-n-3' : 'text-n-5'} mt-4`}>The solution "{slug}" could not be found.</p>
        <Link to="/solutions" className="button button-primary mt-4">
          Back to Solutions
        </Link>
      </Section>
    );
  }

  return (
    <>
      <SEO
        title={`${solution.title} | Jedi Labs Solutions`}
        description={solution.description || `Learn about Jedi Labs' ${solution.title} solution.`}
        ogUrl={`https://www.jedilabs.org/solutions/${slug}`}
      />

      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          <div className="relative z-10 mb-6">
            <button
              onClick={() => navigate('/solutions')}
              className={`flex items-center text-sm font-medium transition-colors ${isDarkMode ? 'text-n-3 hover:text-primary-1' : 'text-n-5 hover:text-primary-1'}`}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Solutions
            </button>
          </div>

          <Heading
            className="text-center md:text-left mb-2"
            title={solution.title}
          />
          <p className={`body-1 mb-8 text-center md:text-left max-w-3xl mx-auto md:mx-0 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
            {solution.description}
          </p>

          <TabsRoot value={activeTab} onValueChange={setActiveTab} className="mt-10 lg:mt-12">
            <TabsList className="flex justify-center flex-wrap gap-3 mb-8">
              {TABS_CONFIG.map((tab) => (
                <TabTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap flex items-center gap-2 
                    data-[state=active]:bg-primary-1 data-[state=active]:text-white data-[state=active]:shadow-md 
                    ${isDarkMode ? 'bg-n-7 text-n-3 hover:bg-n-6' : 'bg-n-2 text-n-5 hover:bg-n-3'} 
                    data-[state=inactive]:bg-opacity-100 data-[state=inactive]:hover:bg-opacity-90 
                  `}
                >
                  <Icon name={tab.icon} className="w-4 h-4 opacity-80"/> 
                  {tab.label}
                </TabTrigger>
              ))}
            </TabsList>

            <div className={`rounded-xl p-4 md:p-8 border min-h-[400px] ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-white border-n-3'}`}>
              <AnimatePresence mode="wait">
                {TABS_CONFIG.map((tab) => (
                  <TabPanel key={tab.id} value={tab.id} forceMount={true}> 
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderTabContent(tab.id)} 
                    </motion.div>
                  </TabPanel>
                ))}
              </AnimatePresence>
            </div>
          </TabsRoot>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 text-center"
          >
            <div className={`${isDarkMode ? 'bg-n-7' : 'bg-white'} rounded-2xl p-8 border ${isDarkMode ? 'border-n-6' : 'border-n-3'} max-w-3xl mx-auto`}>
              <h3 className={`h3 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Ready to Transform Your Business?</h3>
              <p className={`${isDarkMode ? 'text-n-3' : 'text-n-5'} mb-6`}>
                Let's discuss how our {solution.title.toLowerCase()} can help you achieve your goals.
              </p>
              <Link 
                to="/contact" 
                className="button button-primary"
              >
                Schedule a Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
};

export default SolutionPage;