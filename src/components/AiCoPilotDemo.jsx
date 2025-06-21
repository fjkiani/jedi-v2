import React, { useState, useEffect } from 'react';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import ChatInterface from './copilot/ChatInterface';
import { analyzeQuery, findMatchingUseCases, generateConversationalResponse } from '../services/copilotOrchestrator';

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
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                Unable to Load AI Co-Pilot
              </h3>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-starjedi">
                Jedi co-pilot
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Your intelligent assistant for exploring AI solutions and implementations
            </p>
            
            {/* Industry Selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => handleIndustryChange('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedIndustry === 'all'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                }`}
              >
                All Industries
              </button>
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => handleIndustryChange(industry.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedIndustry === industry.slug
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                  }`}
                >
                  {industry.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <ChatInterface
              industries={industries}
              useCases={useCases}
              selectedIndustry={selectedIndustry}
              onIndustryChange={handleIndustryChange}
              onQuerySubmit={handleQuerySubmit}
            />
          </div>

          {/* Stats Footer */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {industries.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Industries
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {useCases.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Use Cases
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Available
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  AI
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Powered
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiCoPilotDemo; 