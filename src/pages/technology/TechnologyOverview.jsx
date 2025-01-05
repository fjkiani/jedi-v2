import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { hygraphClient } from '@/lib/hygraph';
import logo from '@/assets/logo/logo.png';

const GET_TECHNOLOGY_DETAILS = `
  query GetTechnologyDetails($slug: String!) {
    technologyS(where: { slug: $slug }, first: 1) {
      id
      name
      description
      icon
      features
      additonalDetails
      priority
      businessMetrics
      category {
        id
        name
        slug
      }
      subcategories {
        id
        name
        slug
      }
      useCases {
        id
        title
        description
        implementation
        capabilities
      }
      integratedBy {
        id
        name
        slug
      }
      integrations {
        id
        name
        slug
      }
    }
  }
`;

const TechnologyOverview = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [technology, setTechnology] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await hygraphClient.request(GET_TECHNOLOGY_DETAILS, { slug });
        console.log('Technology data:', result);
        
        if (result.technologyS?.[0]) {
          setTechnology(result.technologyS[0]);
        } else {
          setError('Technology not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error loading details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) return <Section className="text-center"><div className="animate-pulse">Loading technology details...</div></Section>;
  if (error) return <Section className="text-center"><div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"><p className="text-red-500">{error}</p></div></Section>;
  if (!technology) return <Section className="text-center"><div className="bg-n-6 rounded-lg p-4"><p className="text-n-3">Technology not found</p></div></Section>;

  return (
    <Section className="overflow-hidden">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-n-3 mb-4"
        >
          <Link to="/technology" className="hover:text-color-1">Technologies</Link>
          <span className="mx-2">/</span>
          <span className="text-n-1">{technology.name}</span>
        </motion.div>

        <div className="space-y-12">
          {/* Technology Header with JediLabs Context */}
          <div className="bg-n-8 rounded-xl p-8 border border-n-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-4">
                {technology.icon && (
                  <div className="w-20 h-20 rounded-2xl bg-n-7 flex items-center justify-center p-4">
                    <img 
                      src={technology.icon}
                      alt={technology.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="w-px h-12 bg-n-6"></div>
                <div className="w-20 h-20 rounded-2xl bg-n-7 flex items-center justify-center p-4">
                  <img 
                    src={logo}
                    alt="JediLabs"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="h1">{technology.name}</h1>
                  <span className="text-n-3">at</span>
                  <span className="text-primary-1 font-bold">JediLabs</span>
                </div>
                <p className="text-n-3 text-lg">{technology.description}</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-4">
              {technology.documentation && (
                <a 
                  href={technology.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors"
                >
                  <span className="text-primary-1">Documentation</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
              {technology.github && (
                <a 
                  href={technology.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors"
                >
                  <span className="text-primary-1">GitHub</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
              {technology.website && (
                <a 
                  href={technology.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors"
                >
                  <span className="text-primary-1">Website</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* JediLabs Implementation Overview */}
          <div className="bg-n-7 rounded-xl p-8 border border-n-6">
            <h2 className="text-2xl font-bold mb-6">JediLabs Implementation</h2>
            <div className="grid gap-8">
              {/* Categories */}
              {technology.category?.technologies?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {technology.category.technologies.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/technology?category=${category.slug}`}
                        className="flex items-center gap-2 px-4 py-2 bg-n-8 rounded-lg hover:bg-n-6 transition-colors"
                      >
                        {category.icon && (
                          <img 
                            src={category.icon}
                            alt={category.name}
                            className="w-5 h-5 object-contain"
                          />
                        )}
                        <span className="text-n-1">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Subcategories */}
              {technology.subcategories?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Subcategories</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {technology.subcategories.map((subcategory) => (
                      <div key={subcategory.slug} className="bg-n-8 rounded-lg p-4">
                        <h4 className="font-medium mb-2">{subcategory.name}</h4>
                        {subcategory.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {subcategory.technologies.map((tech) => (
                              <Link
                                key={tech.slug}
                                to={`/technology/${tech.slug}`}
                                className="text-sm px-3 py-1 bg-n-7 rounded-full hover:bg-n-6 transition-colors"
                              >
                                {tech.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Technologies */}
              {technology.relatedTechnologies?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Related Technologies</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {technology.relatedTechnologies.map((tech) => (
                      <Link
                        key={tech.slug}
                        to={`/technology/${tech.slug}`}
                        className="flex items-center gap-3 p-3 bg-n-8 rounded-lg hover:bg-n-6 transition-colors"
                      >
                        {tech.icon && (
                          <img 
                            src={tech.icon}
                            alt={tech.name}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                        <span className="text-n-1">{tech.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex space-x-4 border-b border-n-6">
            {['overview', 'features', 'use-cases', 'integration'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'text-primary-1 border-primary-1'
                    : 'text-n-3 border-transparent hover:text-n-1'
                }`}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Description */}
                <div className="bg-n-7 rounded-xl p-8 border border-n-6">
                  <h2 className="text-2xl font-bold mb-6">Overview</h2>
                  <p className="text-n-3">{technology.description}</p>
                  {technology.additonalDetails && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
                      <p className="text-n-3">{technology.additonalDetails}</p>
                    </div>
                  )}
                </div>

                {/* Business Metrics */}
                {technology.businessMetrics && (
                  <div className="bg-n-7 rounded-xl p-8 border border-n-6">
                    <h2 className="text-2xl font-bold mb-6">Business Metrics</h2>
                    <p className="text-n-3">{technology.businessMetrics}</p>
                  </div>
                )}

                {/* Categories and Subcategories */}
                <div className="bg-n-7 rounded-xl p-8 border border-n-6">
                  <h2 className="text-2xl font-bold mb-6">Categories & Subcategories</h2>
                  <div className="grid gap-8">
                    {/* Categories */}
                    {technology.category?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Categories</h3>
                        <div className="flex flex-wrap gap-3">
                          {technology.category.map((cat) => (
                            <Link
                              key={cat.slug}
                              to={`/technology?category=${cat.slug}`}
                              className="flex items-center gap-2 px-4 py-2 bg-n-8 rounded-lg hover:bg-n-6 transition-colors"
                            >
                              <span className="text-n-1">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subcategories */}
                    {technology.subcategories?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Subcategories</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {technology.subcategories.map((subcat) => (
                            <div key={subcat.slug} className="bg-n-8 rounded-lg p-4">
                              <h4 className="font-medium">{subcat.name}</h4>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="bg-n-7 rounded-xl p-8 border border-n-6">
                <h2 className="text-2xl font-bold mb-6">Features</h2>
                {technology.features ? (
                  <div className="grid gap-6">
                    <p className="text-n-3">{technology.features}</p>
                  </div>
                ) : (
                  <p className="text-n-3">No features available.</p>
                )}
              </div>
            )}

            {activeTab === 'use-cases' && (
              <div className="space-y-6">
                {technology.useCases?.map((useCase, index) => (
                  <div key={useCase.id || index} className="bg-n-7 rounded-xl p-8 border border-n-6">
                    <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                    <p className="text-n-3 mb-6">{useCase.description}</p>
                    
                    {useCase.implementation && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-3">Implementation</h4>
                        <pre className="bg-n-8 rounded-lg p-4 overflow-x-auto">
                          <code className="text-n-1">
                            {JSON.stringify(useCase.implementation, null, 2)}
                          </code>
                        </pre>
                      </div>
                    )}
                    
                    {useCase.capabilities?.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-3">Capabilities</h4>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {useCase.capabilities.map((capability, capIndex) => (
                            <li key={capIndex} className="flex items-center gap-2 text-n-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-1"></div>
                              {capability}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link
                      to={`/technology/${slug}/use-case/${useCase.id}`}
                      className="inline-flex items-center gap-2 text-primary-1 hover:text-primary-2 transition-colors"
                    >
                      View Implementation Details
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'integration' && (
              <div className="space-y-8">
                {/* Integrated By */}
                {technology.integratedBy?.length > 0 && (
                  <div className="bg-n-7 rounded-xl p-8 border border-n-6">
                    <h2 className="text-2xl font-bold mb-6">Integrated By</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {technology.integratedBy.map((tech) => (
                        <Link
                          key={tech.slug}
                          to={`/technology/${tech.slug}`}
                          className="flex items-center gap-3 p-3 bg-n-8 rounded-lg hover:bg-n-6 transition-colors"
                        >
                          <span className="text-n-1">{tech.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Integrations */}
                {technology.integrations?.length > 0 && (
                  <div className="bg-n-7 rounded-xl p-8 border border-n-6">
                    <h2 className="text-2xl font-bold mb-6">Integrations</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {technology.integrations.map((tech) => (
                        <Link
                          key={tech.slug}
                          to={`/technology/${tech.slug}`}
                          className="flex items-center gap-3 p-3 bg-n-8 rounded-lg hover:bg-n-6 transition-colors"
                        >
                          <span className="text-n-1">{tech.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default TechnologyOverview;