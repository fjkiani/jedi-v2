import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import { check, logo } from '@/assets';
import { technologyService } from '../services/technologyService';
import { useCaseService } from '../services/useCaseService';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/Button';
import Section from '@/components/Section';
import { LeftCurve, RightCurve } from "./design/Collaboration";
import LeadCaptureModal from './copilot/LeadCaptureModal';
import InteractiveSimulation from './copilot/InteractiveSimulation';

// GraphQL query to get CrisPRO use case data
const GET_CRISPRO_USE_CASE = gql`
  query GetCrisPROUseCase {
    useCaseS(where: { title_contains: "CrisPRO" }, first: 1) {
      id
      title
      description
      capabilities
      queries
      metrics
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
      technologies {
        id
        name
        slug
        icon
      }
      industry {
        name
        slug
      }
    }
  }
`;

// GraphQL query to fetch industries for Real-World Applications
const GET_INDUSTRIES = gql`
  query GetIndustries {
    industries(stage: PUBLISHED, orderBy: name_ASC, first: 6) {
      id
      name
      slug
      description
    }
  }
`;

const Collaboration = () => {
  const { isDarkMode } = useTheme();
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [expandedComponent, setExpandedComponent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const [loadingUseCases, setLoadingUseCases] = useState(true);
  const [crisproPilot, setCrisproPilot] = useState(null);
  const [loadingCrisproPilot, setLoadingCrisproPilot] = useState(true);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showMoreTechs, setShowMoreTechs] = useState({});
  const [selectedUseCaseTab, setSelectedUseCaseTab] = useState('all');
  const navigate = useNavigate();

  // Fetch categories and technologies from Hygraph
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await technologyService.getAllCategories();
        console.log('📊 Fetched categories from Hygraph:', categoriesData);
        setCategories(categoriesData);
        
        // Set first category as default selected layer
        if (categoriesData.length > 0) {
          setSelectedLayer(categoriesData[0].slug);
        }
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        // Fallback to show at least something
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch industries for Real-World Applications
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoadingIndustries(true);
        const { industries } = await hygraphClient.request(GET_INDUSTRIES);
        console.log('🏭 Fetched industries from Hygraph:', industries);
        setIndustries(industries || []);
      } catch (error) {
        console.error('❌ Error fetching industries:', error);
        setIndustries([]);
      } finally {
        setLoadingIndustries(false);
      }
    };

    fetchIndustries();
  }, []);

  // Fetch CrisPRO use case data
  useEffect(() => {
    const fetchCrisPROData = async () => {
      try {
        setLoadingCrisproPilot(true);
        const { useCaseS } = await hygraphClient.request(GET_CRISPRO_USE_CASE);
        if (useCaseS && useCaseS.length > 0) {
          setCrisproPilot(useCaseS[0]);
          console.log('🚀 Fetched CrisPRO data:', useCaseS[0]);
        }
      } catch (error) {
        console.error('❌ Error fetching CrisPRO data:', error);
      } finally {
        setLoadingCrisproPilot(false);
      }
    };

    fetchCrisPROData();
  }, []);

  // Add new useEffect for fetching use cases
  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        setLoadingUseCases(true);
        await useCaseService.initialize();
        const allIndustries = await useCaseService.getIndustries();
        const allUseCases = [];
        
        // Fetch use cases from all industries
        for (const industry of allIndustries) {
          const industryUseCases = await useCaseService.getUseCasesByIndustry(industry.slug);
          if (industryUseCases && industryUseCases.length > 0) {
            allUseCases.push(...industryUseCases);
          }
        }
        
        console.log('🎯 Fetched all use cases:', allUseCases);
        console.log('🔍 Sample use case structure:', allUseCases[0]);
        setUseCases(allUseCases);
      } catch (error) {
        console.error('❌ Error fetching use cases:', error);
        setUseCases([]);
      } finally {
        setLoadingUseCases(false);
      }
    };

    fetchUseCases();
  }, []);

  // Get technology data for icons and routing
  const getTechnologyData = (techName) => {
    // Search across all categories for the technology
    for (const category of categories) {
      // Check direct technologies in category
      const directTech = category.technologies?.find(tech => 
        tech.name.toLowerCase().includes(techName.toLowerCase()) ||
        techName.toLowerCase().includes(tech.name.toLowerCase())
      );
      if (directTech) return directTech;

      // Check technologies in subcategories
      for (const subcategory of category.technologySubcategory || []) {
        const subTech = subcategory.technology?.find(tech =>
          tech.name.toLowerCase().includes(techName.toLowerCase()) ||
          techName.toLowerCase().includes(tech.name.toLowerCase())
        );
        if (subTech) return subTech;
      }
    }
    return null;
  };

  const getTechnologyIcon = (techName) => {
    const tech = getTechnologyData(techName);
    return tech?.icon || null;
  };

  const getTechnologySlug = (techName) => {
    const tech = getTechnologyData(techName);
    return tech?.slug || null;
  };

  // Handle simulation functionality
  const handleStartJourney = () => {
    setShowLeadCapture(true);
  };

  const handleRunSimulation = () => {
    if (crisproPilot) {
      setShowSimulation(true);
    } else {
      // Fallback to navigation if no simulation data
      navigate('/industries/healthcare/solutions/crispro-oncology-copilot');
    }
  };

  const getSimulationData = () => {
    if (!crisproPilot) {
      return {
        title: "CrisPRO Oncology Co-Pilot",
        industry: "Healthcare",
        technologies: ["OpenAI", "Weaviate", "React", "Python"],
        queries: ["Analyze patient data for treatment recommendations"],
        capabilities: ["Clinical Decision Support", "Treatment Planning"],
        architecture: {
          description: "AI-powered oncology decision support system",
          components: [],
          flow: []
        }
      };
    }

    return {
      title: crisproPilot.title,
      industry: crisproPilot.industry?.name || "Healthcare",
      technologies: crisproPilot.technologies?.map(tech => tech.name) || [],
      queries: crisproPilot.queries || [],
      capabilities: crisproPilot.capabilities || [],
      architecture: crisproPilot.architecture || { description: "", components: [], flow: [] }
    };
  };

  // Get selected category data
  const selectedCategory = categories.find(cat => cat.slug === selectedLayer);

  // Helper function to get limited technologies
  const getLimitedTechnologies = (technologies, categorySlug, limit = 6) => {
    if (!technologies) return [];
    const showMore = showMoreTechs[categorySlug];
    return showMore ? technologies : technologies.slice(0, limit);
  };

  // Helper function to toggle show more
  const toggleShowMore = (categorySlug) => {
    setShowMoreTechs(prev => ({
      ...prev,
      [categorySlug]: !prev[categorySlug]
    }));
  };

  // Fix the getCoreTechnologies function
  const getCoreTechnologies = () => {
    if (!categories || categories.length === 0) return [];
    
    console.log('🔧 Debug: Available categories:', categories.map(cat => ({ name: cat.name, slug: cat.slug })));
    
    // Expand core technology matching to include more relevant categories
    const coreTypes = [
      'machine-learning', 'ml', 'ai', 'artificial-intelligence',
      'nlp', 'nlu', 'natural-language', 'language-processing',
      'ai-agents', 'agents', 'automation', 'intelligent-automation',
      'data-engineering', 'data-processing', 'data-science',
      'system-integration', 'integration', 'apis',
      'vector-databases', 'databases', 'search',
      'frameworks', 'development', 'tools'
    ];
    
    const coreTechnologies = [];
    
    categories.forEach(category => {
      console.log(`🔍 Checking category: ${category.name} (${category.slug})`);
      
      // More flexible matching - check if any core type is contained in the category slug or name
      const isCore = coreTypes.some(type => 
        category.slug.toLowerCase().includes(type) || 
        category.name.toLowerCase().includes(type.replace('-', ' ')) ||
        type.includes(category.slug.toLowerCase())
      );
      
      if (isCore) {
        console.log(`✅ Category "${category.name}" matches core types`);
        
        // Add technologies from this category
        if (category.technologies && category.technologies.length > 0) {
          console.log(`📦 Adding ${category.technologies.length} technologies from ${category.name}`);
          coreTechnologies.push(...category.technologies.slice(0, 3)); // Take top 3 from each core category
        }
        
        // Also check subcategories
        if (category.technologySubcategory) {
          category.technologySubcategory.forEach(subcat => {
            if (subcat.technology && subcat.technology.length > 0) {
              console.log(`📦 Adding ${subcat.technology.length} technologies from subcategory ${subcat.name}`);
              coreTechnologies.push(...subcat.technology.slice(0, 2)); // Take top 2 from each subcategory
            }
          });
        }
      } else {
        console.log(`❌ Category "${category.name}" does not match core types`);
      }
    });
    
    // Remove duplicates and limit to 8 for better display
    const uniqueTechnologies = coreTechnologies.filter((tech, index, self) => 
      index === self.findIndex(t => t.id === tech.id)
    );
    
    console.log('🚀 Final core technologies:', uniqueTechnologies.map(tech => tech.name));
    return uniqueTechnologies.slice(0, 8);
  };

  // Get use cases by industry for the new tab
  const getUseCasesByIndustry = (industrySlug) => {
    if (industrySlug === 'all') return useCases;
    return useCases.filter(useCase => useCase.industry?.slug === industrySlug);
  };

  // Get unique industries from use cases
  const getUseCaseIndustries = () => {
    const industryMap = new Map();
    useCases.forEach(useCase => {
      if (useCase.industry) {
        industryMap.set(useCase.industry.slug, useCase.industry);
      }
    });
    return Array.from(industryMap.values());
  };

  // Helper function to generate proper use case URL
  const getUseCaseUrl = (useCase) => {
    if (!useCase || !useCase.industry?.slug) {
      console.warn('⚠️ Invalid use case data for URL generation:', useCase);
      return '#';
    }

    // Create a slug from the title if slug is not available
    const slug = useCase.slug || useCase.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const url = `/industries/${useCase.industry.slug}/${slug || useCase.id}`;
    console.log('🔗 Generated URL for', useCase.title, ':', url);
    return url;
  };

  return (
    <Section crosses>
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className={`h2 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            AI Co-Pilot Architecture
          </h2>
          <p className={`body-1 max-w-3xl mx-auto ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            Explore the technology layers that power modern AI co-pilots and experience our flagship healthcare solution
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="lg:flex lg:gap-12 items-start">
          {/* Left Side - Simulation CTA & Education */}
          <div className="lg:w-1/2 space-y-6 mb-8 lg:mb-0">
            {/* Simulation CTA Card */}
            <div className={`bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Experience Our Co-Pilot</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>Interactive healthcare AI simulation</p>
                </div>
              </div>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                Build your own co-pilot. Inquire about your own use case.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleStartJourney} className="flex-1 sm:flex-none">
                  🚀 Build Your Co-Pilot
                </Button>
              </div>
            </div>

            {/* Co-Pilot Education Cards */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Understanding AI Co-Pilots</h3>
              
              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>What is an AI Co-Pilot?</h4>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                      Intelligent assistants that work alongside humans to enhance decision-making and automate complex workflows.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {['Context-Aware', 'Adaptive Learning', 'Human-in-Loop'].map(tag => (
                        <span key={tag} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-n-6 text-n-2' : 'bg-n-2 text-n-6'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">🧠</span>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Core Technologies</h4>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                      Built on foundation models, vector databases, and sophisticated reasoning systems for intelligent automation.
                    </p>
                    {loadingCategories ? (
                      <div className="flex flex-wrap gap-1">
                        <div className={`animate-pulse rounded h-6 w-16 ${isDarkMode ? 'bg-n-6' : 'bg-n-3'}`}></div>
                        <div className={`animate-pulse rounded h-6 w-20 ${isDarkMode ? 'bg-n-6' : 'bg-n-3'}`}></div>
                        <div className={`animate-pulse rounded h-6 w-18 ${isDarkMode ? 'bg-n-6' : 'bg-n-3'}`}></div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {getCoreTechnologies().map(tech => (
                          <Link
                            key={tech.id}
                            to={`/technology/${tech.slug}`}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                              isDarkMode 
                                ? 'bg-n-6 text-n-2 hover:bg-color-1 hover:text-white' 
                                : 'bg-n-2 text-n-6 hover:bg-color-1 hover:text-white'
                            }`}
                          >
                            {tech.icon && (
                              <img 
                                src={tech.icon} 
                                alt={tech.name}
                                className="w-3 h-3 object-contain flex-shrink-0"
                              />
                            )}
                            <span className="truncate">{tech.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">⚡</span>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Real-World Applications</h4>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                      From healthcare diagnosis to financial analysis, co-pilots are transforming professional workflows across industries.
                    </p>
                    {loadingIndustries ? (
                      <div className="flex flex-wrap gap-1">
                        <div className={`animate-pulse rounded h-6 w-20 ${isDarkMode ? 'bg-n-6' : 'bg-n-3'}`}></div>
                        <div className={`animate-pulse rounded h-6 w-16 ${isDarkMode ? 'bg-n-6' : 'bg-n-3'}`}></div>
                        <div className={`animate-pulse rounded h-6 w-24 ${isDarkMode ? 'bg-n-6' : 'bg-n-3'}`}></div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {industries.slice(0, 3).map(industry => (
                          <Link
                            key={industry.id}
                            to={`/industries/${industry.slug}`}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              isDarkMode 
                                ? 'bg-n-6 text-n-2 hover:bg-color-1 hover:text-white' 
                                : 'bg-n-2 text-n-6 hover:bg-color-1 hover:text-white'
                            }`}
                          >
                            {industry.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Use Cases Tab */}
              <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">🎯</span>
                  </div>
                  <div className="w-full">
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Use Cases</h4>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                      Explore real-world implementations across different industries and domains.
                    </p>
                    
                    {loadingUseCases ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className={`animate-pulse rounded h-6 w-12 ${isDarkMode ? 'bg-n-6' : 'bg-n-3'}`}></div>
                          <div className={`animate-pulse rounded h-6 w-16 ${isDarkMode ? 'bg-n-6' : 'bg-n-3'}`}></div>
                          <div className={`animate-pulse rounded h-6 w-20 ${isDarkMode ? 'bg-n-6' : 'bg-n-3'}`}></div>
                        </div>
                        <div className={`animate-pulse rounded h-20 w-full ${isDarkMode ? 'bg-n-6' : 'bg-n-3'}`}></div>
                      </div>
                    ) : useCases.length === 0 ? (
                      <div className={`text-xs py-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                        No use cases available
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Industry Filter Tabs */}
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => setSelectedUseCaseTab('all')}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              selectedUseCaseTab === 'all'
                                ? 'bg-color-1 text-white'
                                : isDarkMode 
                                  ? 'bg-n-6 text-n-3 hover:bg-n-5 hover:text-n-1'
                                  : 'bg-n-2 text-n-5 hover:bg-n-3 hover:text-n-7'
                            }`}
                          >
                            All ({useCases.length})
                          </button>
                          {getUseCaseIndustries().map(industry => {
                            const industryUseCases = getUseCasesByIndustry(industry.slug);
                            return (
                              <button
                                key={industry.slug}
                                onClick={() => setSelectedUseCaseTab(industry.slug)}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                  selectedUseCaseTab === industry.slug
                                    ? 'bg-color-1 text-white'
                                    : isDarkMode 
                                      ? 'bg-n-6 text-n-3 hover:bg-n-5 hover:text-n-1'
                                      : 'bg-n-2 text-n-5 hover:bg-n-3 hover:text-n-7'
                                }`}
                              >
                                {industry.name} ({industryUseCases.length})
                              </button>
                            );
                          })}
                        </div>

                        {/* Use Cases List */}
                        <div className="max-h-32 overflow-y-auto pr-1">
                          <div className="grid grid-cols-1 gap-1">
                            {getUseCasesByIndustry(selectedUseCaseTab).slice(0, 6).map(useCase => (
                              <Link
                                key={useCase.id}
                                to={getUseCaseUrl(useCase)}
                                className={`flex items-center justify-between p-2 rounded transition-all group border border-transparent ${
                                  isDarkMode 
                                    ? 'bg-n-6 hover:bg-color-1/20 hover:border-color-1/50' 
                                    : 'bg-n-2 hover:bg-color-1/10 hover:border-color-1/30'
                                }`}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="w-2 h-2 bg-color-1 rounded-full flex-shrink-0"></div>
                                  <span className={`text-xs truncate group-hover:text-color-1 transition-colors ${
                                    isDarkMode ? 'text-n-2' : 'text-n-6'
                                  }`}>
                                    {useCase.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {useCase.industry && (
                                    <span className={`text-xs px-1 rounded ${
                                      isDarkMode ? 'text-n-4 bg-n-7' : 'text-n-5 bg-n-1'
                                    }`}>
                                      {useCase.industry.name}
                                    </span>
                                  )}
                                  <span className={`text-xs group-hover:text-color-1 transition-colors ${
                                    isDarkMode ? 'text-n-4' : 'text-n-5'
                                  }`}>→</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                          
                          {/* Show More Indicator */}
                          {getUseCasesByIndustry(selectedUseCaseTab).length > 6 && (
                            <div className="text-center pt-2">
                              <span className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                                +{getUseCasesByIndustry(selectedUseCaseTab).length - 6} more use cases
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Interactive Architecture Stack */}
          <div className="lg:w-1/2 ">
            <div className={`rounded-xl p-6 border max-h-[600px] overflow-hidden ${
              isDarkMode ? 'bg-n-8 border-n-6' : 'bg-white border-n-3'
            }`}>
              <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Technology Architecture</h3>
              
              {loadingCategories ? (
                <div className="text-center py-8">
                  <div className={`animate-pulse ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>Loading architecture layers...</div>
                </div>
              ) : categories.length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                  No architecture data available
                </div>
              ) : (
                <>
                  {/* Layer Navigation */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => {
                          setSelectedLayer(category.slug);
                          setExpandedComponent(null);
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                          selectedLayer === category.slug
                            ? 'bg-color-1 text-white shadow-lg'
                            : isDarkMode
                              ? 'bg-n-6 text-n-3 hover:bg-n-5 hover:text-n-1'
                              : 'bg-n-2 text-n-5 hover:bg-n-3 hover:text-n-7'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>

                  {/* Selected Layer Content */}
                  <div className="overflow-y-auto max-h-[420px] pr-2">
                    <AnimatePresence mode="wait">
                      {selectedCategory && (
                        <motion.div
                          key={selectedLayer}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          {/* Category Description */}
                          {selectedCategory.description && (
                            <div className={`rounded-lg p-3 border ${
                              isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
                            }`}>
                              <p className={`text-xs ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{selectedCategory.description}</p>
                            </div>
                          )}

                          {/* Technologies Compact Grid */}
                          <div className="space-y-4">
                            {/* Direct technologies in category */}
                            {selectedCategory.technologies?.length > 0 && (
                              <div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  {getLimitedTechnologies(selectedCategory.technologies, selectedCategory.slug).map((tech) => (
                                    <div
                                      key={tech.id}
                                      className={`rounded-lg p-3 border hover:border-color-1 transition-colors cursor-pointer group ${
                                        isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
                                      }`}
                                      onClick={() => setExpandedComponent(expandedComponent === tech.id ? null : tech.id)}
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        {tech.icon && (
                                          <img 
                                            src={tech.icon} 
                                            alt={tech.name}
                                            className="w-4 h-4 object-contain flex-shrink-0"
                                          />
                                        )}
                                        <h4 className={`font-medium text-xs truncate ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{tech.name}</h4>
                                      </div>
                                      <p className={`text-xs line-clamp-2 mb-2 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                        {tech.description?.substring(0, 80)}...
                                      </p>
                                      <div className="flex items-center justify-between">
                                        {tech.slug && (
                                          <Link
                                            to={`/technology/${tech.slug}`}
                                            className="text-color-1 hover:text-color-2 transition-colors text-xs"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            View →
                                          </Link>
                                        )}
                                        <span className={`text-xs group-hover:text-color-1 transition-colors ${
                                          isDarkMode ? 'text-n-4' : 'text-n-5'
                                        }`}>
                                          {expandedComponent === tech.id ? '−' : '+'}
                                        </span>
                                      </div>

                                      {/* Compact Expanded Details */}
                                      <AnimatePresence>
                                        {expandedComponent === tech.id && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}
                                          >
                                            {tech.useCases && tech.useCases.length > 0 && (
                                              <div className="mb-2">
                                                <h5 className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-n-2' : 'text-n-6'}`}>Use Cases:</h5>
                                                <div className="flex flex-wrap gap-1">
                                                  {tech.useCases.slice(0, 2).map((useCase, index) => (
                                                    <span 
                                                      key={index}
                                                      className={`px-2 py-1 rounded text-xs ${
                                                        isDarkMode ? 'bg-n-6 text-n-2' : 'bg-n-2 text-n-6'
                                                      }`}
                                                    >
                                                      {useCase.title}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  ))}
                                </div>

                                {/* Show More Button for Direct Technologies */}
                                {selectedCategory.technologies.length > 6 && (
                                  <button
                                    onClick={() => toggleShowMore(selectedCategory.slug)}
                                    className="w-full py-2 text-xs text-color-1 hover:text-color-2 transition-colors border border-color-1/30 rounded-lg hover:border-color-1/50"
                                  >
                                    {showMoreTechs[selectedCategory.slug] 
                                      ? `Show Less (${selectedCategory.technologies.length - 6} hidden)` 
                                      : `Show ${selectedCategory.technologies.length - 6} More Technologies`
                                    }
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Compact Subcategories */}
                            {selectedCategory.technologySubcategory?.map((subcategory) => (
                              subcategory.technology?.length > 0 && (
                                <div key={subcategory.id} className="border-l-2 border-color-1/30 pl-3">
                                  <h4 className="text-xs font-medium text-color-1 mb-2">{subcategory.name}</h4>
                                  <div className="grid grid-cols-1 gap-2">
                                    {getLimitedTechnologies(subcategory.technology, `${selectedCategory.slug}-${subcategory.id}`, 4).map((tech) => (
                                      <div
                                        key={tech.id}
                                        className={`rounded-lg p-2 border hover:border-color-1 transition-colors cursor-pointer group ${
                                          isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
                                        }`}
                                        onClick={() => setExpandedComponent(expandedComponent === tech.id ? null : tech.id)}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2 flex-1 min-w-0">
                                            {tech.icon && (
                                              <img 
                                                src={tech.icon} 
                                                alt={tech.name}
                                                className="w-4 h-4 object-contain flex-shrink-0"
                                              />
                                            )}
                                            <div className="min-w-0 flex-1">
                                              <h5 className={`text-xs font-medium truncate ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{tech.name}</h5>
                                              <p className={`text-xs truncate ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{tech.description?.substring(0, 40)}...</p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-1 flex-shrink-0">
                                            {tech.slug && (
                                              <Link
                                                to={`/technology/${tech.slug}`}
                                                className="text-color-1 hover:text-color-2 transition-colors text-xs"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                →
                                              </Link>
                                            )}
                                            <span className={`text-xs group-hover:text-color-1 transition-colors ${
                                              isDarkMode ? 'text-n-4' : 'text-n-5'
                                            }`}>
                                              {expandedComponent === tech.id ? '−' : '+'}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Add Expanded Details for Subcategory Technologies */}
                                        <AnimatePresence>
                                          {expandedComponent === tech.id && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: 'auto' }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.2 }}
                                              className={`mt-2 pt-2 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}
                                            >
                                              {tech.useCases && tech.useCases.length > 0 && (
                                                <div className="mb-2">
                                                  <h5 className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-n-2' : 'text-n-6'}`}>Use Cases:</h5>
                                                  <div className="flex flex-wrap gap-1">
                                                    {tech.useCases.slice(0, 2).map((useCase, index) => (
                                                      <span 
                                                        key={index}
                                                        className={`px-1 py-0.5 rounded text-xs ${
                                                          isDarkMode ? 'bg-n-6 text-n-2' : 'bg-n-2 text-n-6'
                                                        }`}
                                                      >
                                                        {useCase.title}
                                                      </span>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                              {tech.description && (
                                                <p className={`text-xs ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                                  {tech.description}
                                                </p>
                                              )}
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Show More Button for Subcategories */}
                                  {subcategory.technology.length > 4 && (
                                    <button
                                      onClick={() => toggleShowMore(`${selectedCategory.slug}-${subcategory.id}`)}
                                      className="w-full mt-2 py-1 text-xs text-color-1 hover:text-color-2 transition-colors"
                                    >
                                      {showMoreTechs[`${selectedCategory.slug}-${subcategory.id}`] 
                                        ? `Show Less` 
                                        : `+${subcategory.technology.length - 4} more`
                                      }
                                    </button>
                                  )}
                                </div>
                              )
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showLeadCapture && (
          <LeadCaptureModal
            isOpen={showLeadCapture}
            onClose={() => setShowLeadCapture(false)}
            onSubmit={(data) => {
              console.log('Lead captured:', data);
              setShowLeadCapture(false);
              setShowSimulation(true);
            }}
          />
        )}

        {showSimulation && (
          <InteractiveSimulation
            isOpen={showSimulation}
            onClose={() => setShowSimulation(false)}
            useCase={getSimulationData()}
          />
        )}
      </div>

      <LeftCurve />
      <RightCurve />
    </Section>
  );
};

export default Collaboration;
