import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronDown, FiServer, FiBox, FiLayers, FiCode, FiBook, FiTool } from 'react-icons/fi';
import { technologyService } from '@/services/technologyService';
import { aiMlSolution } from '@/constants/solutions/ai-ml';
import { aiMlTechStack } from '@/constants/techCategories/aiMlTechStack';
import { aiAgentsSolution } from '@/constants/solutions/ai-agents';
import { dataEngineeringSolution } from '@/constants/solutions/data-engineering';
import { fullStackSolution } from '@/constants/solutions/full-stack';
import Section from '@/components/Section';
import { RootSEO } from '@/components/SEO';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-primary-1 text-n-1' 
        : 'text-n-3 hover:text-n-1 hover:bg-n-6'
    }`}
  >
    {children}
  </button>
);

const EnhancedTechnologyDetail = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [technology, setTechnology] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const tech = Object.entries(techs).find(([name, data]) => {
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
              ...(localData?.features || []),
              ...(hygraphData?.features || [])
            ],
            // Merge business metrics/value
            businessMetrics: [
              ...(localData?.businessValue || []),
              ...(hygraphData?.businessMetrics || [])
            ]
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiServer },
    { id: 'features', label: 'Features', icon: FiBox },
    { id: 'architecture', label: 'Architecture', icon: FiLayers },
    { id: 'integration', label: 'Integration', icon: FiCode },
    { id: 'useCases', label: 'Use Cases', icon: FiBook },
    { id: 'resources', label: 'Resources', icon: FiTool },
  ];

  return (
    <div>
      {technology && (
        <>
          <RootSEO 
            slug={slug} 
            type="technology" 
            prefetchedData={technology} 
          />
          {console.log('🎨 Rendering RootSEO with data:', { slug, type: 'technology', technology })}
        </>
      )}
      <Section className="py-12">
        <div className="container max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/technology" className="text-n-3 hover:text-color-1">Technologies</Link>
              <span className="text-n-3">/</span>
              {technology.category && typeof technology.category === 'string' && (
                <>
                  <Link to={`/technology#${technology.category.toLowerCase()}`} className="text-n-3 hover:text-color-1">
                    {technology.category}
                  </Link>
                  <span className="text-n-3">/</span>
                </>
              )}
              <span className="text-n-1">{technology.name}</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-n-8 rounded-xl p-8 border border-n-6 mb-8">
            <div className="flex items-center gap-6 mb-6">
              {technology.icon && (
                <div className="w-16 h-16 rounded-xl bg-n-7 flex items-center justify-center p-4">
                  <img src={technology.icon} alt={technology.name} className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2">{technology.name}</h1>
                {technology.category && typeof technology.category === 'string' && (
                  <div className="text-n-3">{technology.category}</div>
                )}
              </div>
            </div>
            {technology.description && (
              <p className="text-n-3 text-lg">{technology.description}</p>
            )}
          </div>

          {/* Tabs */}
          <div className="bg-n-8 rounded-xl border border-n-6 mb-8">
            <div className="border-b border-n-6 p-2">
              <div className="flex flex-wrap gap-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <TabButton
                    key={id}
                    active={activeTab === id}
                    onClick={() => setActiveTab(id)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {label}
                    </div>
                  </TabButton>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Overview</h2>
                  <p>{technology.description}</p>
                  
                  {technology.businessMetrics && technology.businessMetrics.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mt-8 mb-4">Business Impact</h3>
                      <ul className="list-disc pl-6">
                        {technology.businessMetrics.map((metric, index) => (
                          <li key={index} className="mb-2">{metric}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {technology.capabilities && technology.capabilities.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mt-8 mb-4">Key Capabilities</h3>
                      <ul className="list-disc pl-6">
                        {technology.capabilities.map((capability, index) => (
                          <li key={index} className="mb-2">{capability}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'features' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Features</h2>
                  {technology.features && technology.features.length > 0 ? (
                    <ul className="list-disc pl-6">
                      {technology.features.map((feature, index) => (
                        <li key={index} className="mb-2">{feature}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-n-3">No features available</p>
                  )}

                  {technology.primaryUses && technology.primaryUses.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mt-8 mb-4">Primary Uses</h3>
                      <ul className="list-disc pl-6">
                        {technology.primaryUses.map((use, index) => (
                          <li key={index} className="mb-2">{use}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'architecture' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Architecture & Implementation</h2>
                  
                  {technology.architecture && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Architecture Overview</h3>
                      <p>{technology.architecture}</p>
                    </div>
                  )}

                  {technology.deploymentOptions && technology.deploymentOptions.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-4">Deployment Options</h3>
                      <ul className="list-disc pl-6">
                        {technology.deploymentOptions.map((option, index) => (
                          <li key={index} className="mb-2">{option}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {technology.requirements && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4">System Requirements</h3>
                      <p>{technology.requirements}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'integration' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Integration Guide</h2>
                  
                  {technology.integrationSteps && technology.integrationSteps.length > 0 ? (
                    <div className="bg-n-7 rounded-lg p-6 border border-n-6">
                      <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
                      <ol className="list-decimal pl-6">
                        {technology.integrationSteps.map((step, index) => (
                          <li key={index} className="mb-4">{step}</li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <div className="bg-n-7 rounded-lg p-6 border border-n-6">
                      <p className="text-n-3">Integration guide coming soon...</p>
                    </div>
                  )}

                  {technology.codeExamples && (
                    <div className="mt-8 bg-n-7 rounded-lg p-6 border border-n-6">
                      <h3 className="text-xl font-semibold mb-4">Code Examples</h3>
                      <pre className="bg-n-8 p-4 rounded-lg overflow-x-auto">
                        <code>{technology.codeExamples}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'useCases' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Use Cases</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {technology.relatedUseCases && technology.relatedUseCases.length > 0 ? (
                      technology.relatedUseCases.map((useCase) => (
                        <div key={useCase.id} className="bg-n-7 rounded-lg p-6 border border-n-6">
                          <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                          {useCase.implementation?.overview && (
                            <p className="text-n-3 mb-4">{useCase.implementation.overview}</p>
                          )}
                          <Link
                            to={`/technology/${slug}/use-case/${useCase.title.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-primary-1 hover:text-primary-2 transition-colors inline-flex items-center gap-2"
                          >
                            View Details 
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </Link>
                        </div>
                      ))
                    ) : technology.useCases && technology.useCases.length > 0 ? (
                      <div className="col-span-2">
                        <ul className="list-disc pl-6">
                          {technology.useCases.map((useCase, index) => (
                            <li key={index} className="mb-2">{useCase}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="col-span-2 text-center text-n-3">
                        No use cases available
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Resources</h2>
                  
                  {technology.documentation && (
                    <div className="bg-n-7 rounded-lg p-6 border border-n-6 mb-6">
                      <h3 className="text-xl font-semibold mb-4">Documentation</h3>
                      <div className="flex flex-col gap-3">
                        {Object.entries(technology.documentation).map(([title, url]) => (
                          <a
                            key={title}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-1 hover:text-primary-2 transition-colors flex items-center gap-2"
                          >
                            {title}
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {technology.tutorials && technology.tutorials.length > 0 && (
                    <div className="bg-n-7 rounded-lg p-6 border border-n-6">
                      <h3 className="text-xl font-semibold mb-4">Tutorials & Guides</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {technology.tutorials.map((tutorial, index) => (
                          <a
                            key={index}
                            href={tutorial.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-n-8 p-4 rounded-lg hover:bg-n-6 transition-colors"
                          >
                            <h4 className="font-medium mb-2">{tutorial.title}</h4>
                            {tutorial.description && (
                              <p className="text-sm text-n-3">{tutorial.description}</p>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!technology.documentation && (!technology.tutorials || technology.tutorials.length === 0)) && (
                    <div className="text-center text-n-3">
                      Resources coming soon...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default EnhancedTechnologyDetail; 