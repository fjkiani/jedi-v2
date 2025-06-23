import React, { useState, useEffect } from 'react';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import ChatInterface from './copilot/ChatInterface';
import { analyzeQuery, findMatchingUseCases, generateConversationalResponse } from '../services/copilotOrchestrator';
import { motion } from 'framer-motion';
import { logo } from '../assets';

// GraphQL query to fetch industries and use cases
const GET_INDUSTRIES_AND_USECASES = gql`
  query GetIndustriesAndUseCases {
    industries {
      id
      name
      slug
      description
      # Fetch IndustryApplications for contextual suggestions
      industryApplication {
        id
        applicationTitle
        tagline
        industryChallenge { raw }
        jediApproach { raw }
        keyCapabilities
        expectedResults
        jediComponent {
          id
          name
          tagline
          description { raw }
        }
        technology {
          id
          name
          slug
        }
      }
    }
    useCaseS(first: 20, stage: PUBLISHED) {
      id
      title
      slug
      description
      industry {
        id
        name
        slug
      }
      queries
      capabilities
      metrics
      implementation
      architecture {
        id
        description
        components {
          id
          name
          description
          details
          explanation
        }
        flow {
          id
          step
          description
          details
        }
      }
      technologies {
        id
        name
        slug
        description
      }
    }
  }
`;

const AiCoPilotDemo = () => {
  const [industries, setIndustries] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  // Fetch industries and use cases from Hygraph
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from Hygraph...');
        const data = await hygraphClient.request(GET_INDUSTRIES_AND_USECASES);
        console.log('Hygraph response:', data);
        
        setIndustries(data.industries || []);
        setUseCases(data.useCaseS || []);
        
        console.log('Industries set:', data.industries?.length || 0);
        console.log('Use cases set:', data.useCaseS?.length || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Failed to load AI solutions data. Please try again.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Handle query processing
  const handleQuerySubmit = async (query, industryContext) => {
    try {
      console.log('Processing query:', { query, industryContext });
      
      // Analyze the user query
      const analysis = analyzeQuery(query, industryContext);
      console.log('Query analysis:', analysis);

      // Find matching use cases
      const matches = findMatchingUseCases(query, useCases, analysis);
      console.log('Use case matches:', matches);

      // Generate conversational response (now with industries data for IndustryApplication fallback)
      const response = generateConversationalResponse(query, matches, analysis, industries);
      console.log('Generated response:', response);

      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      return response;
    } catch (error) {
      console.error('Error processing query:', error);
      throw new Error('Failed to process your query. Please try again.');
    }
  };

  const handleIndustryChange = (industrySlug) => {
    setSelectedIndustry(industrySlug);
  };

  if (loadingData) {
    return (
      <section className="relative py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              className="animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                Unable to Load AI Co-Pilot
              </h3>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-10 sm:py-16 lg:py-20 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(120,119,198,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.05),transparent_50%)]"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 dark:bg-purple-400/10 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0
            }}
            animate={{ 
              x: [
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
              ],
              y: [
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
              ],
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <img src={logo} alt="JEDI Labs Logo" className="w-full h-full" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-starjedi">
                  The Jedi ai Co-Pilot
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your intelligent assistant for exploring AI solutions and implementations
            </motion.p>
            
            {/* Enhanced Industry Selector */}
            <motion.div 
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 uppercase tracking-wider">
                Select Industry Focus
              </p>
              
              {/* Mobile: Horizontal Scrollable Slider */}
              <div className="block sm:hidden">
                <div className="flex gap-3 overflow-x-auto pb-2 px-4 -mx-4 scrollbar-hide">
                  <motion.button
                    onClick={() => handleIndustryChange('all')}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedIndustry === 'all'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 backdrop-blur-sm'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <span>🌐</span>
                      <span>All Industries</span>
                    </span>
                  </motion.button>
                  
                  {industries.map((industry, index) => (
                    <motion.button
                      key={industry.id}
                      onClick={() => handleIndustryChange(industry.slug)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedIndustry === industry.slug
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 backdrop-blur-sm'
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="whitespace-nowrap">{industry.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Desktop: Flex Wrap Layout */}
              <div className="hidden sm:flex flex-wrap justify-center gap-2 sm:gap-3 px-2 sm:px-0">
                <motion.button
                  onClick={() => handleIndustryChange('all')}
                  className={`relative px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedIndustry === 'all'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400 hover:shadow-md backdrop-blur-sm'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedIndustry === 'all' && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1 sm:gap-2">
                    <span className="text-sm sm:text-base">🌐</span>
                    <span className="hidden sm:inline">All Industries</span>
                    <span className="sm:hidden">All</span>
                  </span>
                </motion.button>
                
                {industries.map((industry, index) => (
                  <motion.button
                    key={industry.id}
                    onClick={() => handleIndustryChange(industry.slug)}
                    className={`relative px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedIndustry === industry.slug
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400 hover:shadow-md backdrop-blur-sm'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedIndustry === industry.slug && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <span className="relative">{industry.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Chat Interface Container */}
          <motion.div
            className="relative mx-2 sm:mx-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {/* Glow effect */}
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-60 dark:opacity-30"></div>
            
            {/* Chat Interface */}
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <ChatInterface
                industries={industries}
                useCases={useCases}
                selectedIndustry={selectedIndustry}
                onQuerySubmit={handleQuerySubmit}
                onIndustryChange={handleIndustryChange}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AiCoPilotDemo; 