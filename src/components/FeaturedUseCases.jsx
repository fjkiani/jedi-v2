import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import Section from "./Section";
import Heading from "./Heading";
import { Icon } from '@/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { Link } from 'react-router-dom';
import { RingLoader } from 'react-spinners';
import { RichText } from '@graphcms/rich-text-react-renderer'; // If needed by UseCaseDetailView
import UseCaseCard from './UseCaseCard'; // Import UseCaseCard
import UseCaseDetailView from './UseCaseDetailView'; // Import UseCaseDetailView
import Modal from './Modal'; // Re-use Modal component

// --- GraphQL Queries for Use Cases ---

// Query 1: Get ALL Industries (same as before, for tabs)
const GET_ALL_INDUSTRIES_FOR_TABS = gql`
  query GetAllIndustriesForTabs {
    industries(orderBy: name_ASC, stage: PUBLISHED) {
      id
      name
      slug
    }
  }
`;

// Function to generate the common fields needed for UseCaseDetailView
const USE_CASE_DETAIL_FIELDS = `
  id
  title
  slug # Needed if UseCaseCard links somewhere
  tagline
  description # Simple text description
  keyCapabilities
  expectedResults
  metrics
  queries
  industryChallenge { raw }
  jediApproach { raw }
  implementation { raw } # Assuming Rich Text
  technologies(first: 5) { # Example: limit technologies shown
    id
    name
    slug
    icon # Assuming icon is a string (name or URL)
  }
  jediComponent {
    id
    name
    slug
    icon # Assuming icon is a string (name or URL)
    tagline
    description { raw }
  }
  industry { # Needed for context or breadcrumbs
    id
    name
    slug
  }
  # Add any other fields needed by UseCaseDetailView
`;


// Query 2: Get Use Cases for a SPECIFIC industry slug
const GET_USE_CASES_FOR_INDUSTRY = gql`
  query GetUseCasesForIndustry($industrySlug: String!) {
    useCases(
      where: { industry: { slug: $industrySlug } }
      orderBy: title_ASC # Or publishedAt_DESC, etc.
      stage: PUBLISHED
      first: 6 # Limit results per tab initially
    ) {
      ${USE_CASE_DETAIL_FIELDS}
    }
  }
`;

// Query 3: Get ALL recent Use Cases
const GET_ALL_RECENT_USE_CASES = gql`
  query GetAllRecentUseCases {
    useCases(
      orderBy: title_ASC # Or publishedAt_DESC, etc.
      stage: PUBLISHED
      first: 6 # Limit results for "All" tab
    ) {
      ${USE_CASE_DETAIL_FIELDS}
    }
  }
`;

// --- Component Logic ---

const FeaturedUseCases = () => {
  const [industries, setIndustries] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [activeIndustrySlug, setActiveIndustrySlug] = useState("all"); // Default to "all"
  const [selectedUseCaseData, setSelectedUseCaseData] = useState(null); // NEW State

  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const [loadingUseCases, setLoadingUseCases] = useState(false);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  // Fetch Industries for Tabs
  useEffect(() => {
    const fetchIndustries = async () => {
      setLoadingIndustries(true);
      setError(null);
      try {
        const data = await hygraphClient.request(GET_ALL_INDUSTRIES_FOR_TABS);
        setIndustries(data.industries || []);
        console.log("[FeaturedUseCases] Fetched Industries:", data.industries);
      } catch (err) {
        console.error("[FeaturedUseCases] Error fetching industries:", err);
        setError("Failed to load industries.");
        setIndustries([]);
      } finally {
        setLoadingIndustries(false);
      }
    };
    fetchIndustries();
  }, []);

  // Fetch Use Cases based on Active Tab
  useEffect(() => {
    const fetchUseCases = async () => {
      setLoadingUseCases(true);
      setError(null);
      setUseCases([]);
      setSelectedUseCaseData(null); // Clear selection when tab changes

      const isAllTab = activeIndustrySlug === "all";
      const query = isAllTab ? GET_ALL_RECENT_USE_CASES : GET_USE_CASES_FOR_INDUSTRY;
      const variables = isAllTab ? {} : { industrySlug: activeIndustrySlug };
      const queryName = isAllTab ? 'All Industries' : activeIndustrySlug;

      console.log(`[FeaturedUseCases] Fetching use cases for: ${queryName}`);

      try {
        const data = await hygraphClient.request(query, variables);
        const fetchedCases = data.useCases || [];
        setUseCases(fetchedCases);
        console.log(`[FeaturedUseCases] Fetched ${fetchedCases.length} Use Cases for ${queryName}:`, fetchedCases);
      } catch (err) {
        console.error(`[FeaturedUseCases] Error fetching use cases for ${queryName}:`, err);
        setError(`Failed to load use cases for ${queryName}.`);
        setUseCases([]);
      } finally {
        setLoadingUseCases(false);
      }
    };

    // Only fetch if industries have loaded or if the "all" tab is initially selected
    if (!loadingIndustries || activeIndustrySlug === "all") {
      fetchUseCases();
    }
  }, [activeIndustrySlug, loadingIndustries]); // Re-run when slug changes or industries load

  const currentIndustry = useMemo(() => {
    if (activeIndustrySlug === "all") return null;
    return industries.find(ind => ind.slug === activeIndustrySlug);
  }, [industries, activeIndustrySlug]);

  const handleSelectUseCase = (useCase) => {
    console.log("[FeaturedUseCases] Selecting use case:", useCase);
    // Toggle: if clicking the same one, deselect; otherwise select
    setSelectedUseCaseData(prev => (prev && prev.id === useCase?.id ? null : useCase));
    // Scroll to the detail view if selecting a new one? Optional.
    if (useCase && (!selectedUseCaseData || selectedUseCaseData.id !== useCase.id)) {
      // Example: scrollIntoView - needs a target element ref
      // document.getElementById('use-case-detail-view')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // TODO: Re-use or adapt getButtonClasses from FeaturedApplications
  const getButtonClasses = (slug) => {
    const isActive = activeIndustrySlug === slug;
    let baseClasses = "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border ";
    if (isActive) {
      baseClasses += isDarkMode ? 'bg-primary-1/10 text-primary-1 border-primary-1' : 'bg-primary-1/5 text-primary-1 border-primary-1';
    } else {
      baseClasses += isDarkMode ? 'text-n-4 hover:text-n-1 border-n-6 bg-n-7' : 'text-n-5 hover:text-n-7 border-n-3 bg-n-1';
    }
    baseClasses += " flex-shrink-0"; // Adjust shrinking as needed
    return baseClasses;
  };

   // TODO: Get industryIconMap from constants or define here
   const industryIconMap = {
     'technology': 'chip',
     'healthcare': 'heart',
     'media-entertainment': 'film',
     'energy': 'zap',
     'financial-services': 'dollar-sign',
     'retail': 'shopping-cart',
     'manufacturing': 'cog',
     'default': 'grid'
   };

  return (
    <Section className="overflow-hidden" id="featured-use-cases">
      <div className="container">
        {/* TODO: Update Heading */}
        <Heading
          title="Explore Use Cases"
          text="Discover how our AI solutions tackle specific challenges across industries."
        />

        {/* Loading / Error / No Industries States */}
        {loadingIndustries && (
          <div className="flex justify-center items-center p-8">
            <RingLoader color={isDarkMode ? "#FFFFFF" : "#000000"} size={40} />
            <span className={`ml-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Loading filters...</span>
          </div>
        )}
        {error && !loadingIndustries && <div className="text-center text-red-500 p-8">Error: {error}</div>}
        {!loadingIndustries && !error && industries.length === 0 && (
           <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-n-7' : 'bg-n-1'}`}>
             <p className={`${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>No industry filters found.</p>
           </div>
        )}

        {/* Tabs and Content Area */}
        {!loadingIndustries && !error && industries.length > 0 && (
          <div>
            {/* Industry Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
              {/* "All" Tab Button */}
              <button
                key="all-tab"
                onClick={() => setActiveIndustrySlug("all")}
                className={getButtonClasses("all")}
              >
                 <Icon name="grid" className={`w-4 h-4 ${activeIndustrySlug === "all" ? 'text-primary-1' : ''}`} />
                 <span>All Use Cases</span>
              </button>
              {/* Industry Specific Tabs */}
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setActiveIndustrySlug(industry.slug)}
                  className={getButtonClasses(industry.slug)}
                >
                  <Icon name={industryIconMap[industry.slug] || industryIconMap.default} className={`w-4 h-4 ${activeIndustrySlug === industry.slug ? 'text-primary-1' : ''}`} />
                  <span>{industry.name}</span>
                </button>
              ))}
            </div>

            {/* Use Case Grid Area */}
            <div className="mt-4">
              {loadingUseCases ? (
                 <div className="flex justify-center items-center p-8">
                   <RingLoader color={isDarkMode ? "#FFFFFF" : "#000000"} size={40} />
                   <span className={`ml-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Loading use cases...</span>
                 </div>
              ) : useCases.length === 0 ? (
                <p className={`text-center p-6 rounded-lg border ${isDarkMode ? 'border-n-6 bg-n-7 text-n-4' : 'border-n-3 bg-n-1 text-n-5'}`}>
                  No use cases found {activeIndustrySlug === "all" ? "" : `for ${currentIndustry?.name || 'this industry'}`} yet.
                </p>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {useCases.map((uc) => (
                      <UseCaseCard
                        key={uc.id}
                        useCase={uc} // Pass the full use case object
                        // Ensure UseCaseCard accepts and uses an onClick prop
                        onClick={() => handleSelectUseCase(uc)}
                      />
                   ))}
                </div>
              )}
            </div>
              {/* TODO: Maybe add a link to a full /usecases page? */}
          </div>
        )}
      </div>

      {/* Modal for Use Case Detail */}
      {selectedUseCaseData && (
        <UseCaseDetailView useCase={selectedUseCaseData} onClose={() => setSelectedUseCaseData(null)} />
      )}
    </Section>
  );
};

export default FeaturedUseCases; 