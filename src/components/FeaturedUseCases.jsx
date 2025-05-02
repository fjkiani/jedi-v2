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
import Button from '@/components/Button'; // Corrected import
// Remove Modal import if not used directly here for use cases
// import Modal from './Modal'; 

// Import Swiper React components & styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Reuse the swiper styles from FeaturedApplications
const swiperNavStyles = `
  .use-case-swiper .swiper-button-prev,
  .use-case-swiper .swiper-button-next {
    color: var(--swiper-navigation-color, inherit);
    width: 28px; height: 28px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    padding: 4px;
    transition: background-color 0.2s;
  }
  .use-case-swiper .swiper-button-prev:hover,
  .use-case-swiper .swiper-button-next:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .use-case-swiper .swiper-button-prev::after,
  .use-case-swiper .swiper-button-next::after {
    font-size: 12px; font-weight: bold;
  }
  .use-case-swiper .swiper-button-prev { left: 8px; }
  .use-case-swiper .swiper-button-next { right: 8px; }
  .use-case-swiper .swiper-pagination-bullet {
    background-color: var(--swiper-pagination-bullet-inactive-color, #ccc);
    opacity: 0.7;
  }
  .use-case-swiper .swiper-pagination-bullet-active {
    background-color: var(--swiper-pagination-color, #007aff);
    opacity: 1;
  }
`;

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

  // Add theme-aware colors to styles (reuse logic)
  const themeAwareSwiperNavStyles = swiperNavStyles.replace(
    'var(--swiper-navigation-color, inherit)',
    isDarkMode ? '#FFFFFF' : '#000000'
  ).replace(
    'var(--swiper-pagination-color, #007aff)',
    isDarkMode ? '#8E55EA' : '#6C2BD9' // Example primary colors
  ).replace(
    'var(--swiper-pagination-bullet-inactive-color, #ccc)',
    isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'
  );

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
       <style>{themeAwareSwiperNavStyles}</style> {/* Inject styles */}
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
          <div className={`rounded-2xl border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} p-4 sm:p-6 lg:p-8 shadow-lg`}>
            {/* Industry Tabs */}
             <div className="flex flex-wrap border-b mb-6 pb-3 -mx-2">
                 {/* "All" Tab Button */}
                <button
                    key="all-tab"
                    onClick={() => setActiveIndustrySlug("all")}
                    className={getButtonClasses("all")}
                >
                    <Icon name="grid" className={`w-4 h-4 ${activeIndustrySlug === "all" ? 'text-primary-1' : ''}`} />
                    <span>All Use Cases</span>
                </button>
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

            {/* Content Area: Use Cases Slider or Detail View */}
            <div className="mt-4 min-h-[300px]"> {/* Adjust min-height as needed */} 
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndustrySlug} // Animate when tab changes
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {loadingUseCases ? (
                    <div className="flex justify-center items-center p-8">
                      <RingLoader color={isDarkMode ? "#FFFFFF" : "#000000"} size={40} />
                      <span className={`ml-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Loading use cases...</span>
                    </div>
                  ) : useCases.length === 0 ? (
                    <p className={`text-center p-6 rounded-lg border ${ 
                      isDarkMode ? 'border-n-6 bg-n-8 text-n-4' : 'border-n-3 bg-n-2 text-n-5'
                    }`}>
                      No featured use cases found {activeIndustrySlug === "all" ? "recently" : `for ${currentIndustry?.name || 'this industry'}`} yet.
                    </p>
                  ) : (
                    // Use Case Slider
                    <Swiper
                      modules={[Navigation, Pagination]}
                      spaceBetween={30}
                      slidesPerView={1}
                      navigation // Enable navigation arrows
                      pagination={{ clickable: true }} // Enable pagination dots
                      breakpoints={{
                        640: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 30 },
                        1024: { slidesPerView: 3, spaceBetween: 30 },
                        // Add more breakpoints if needed (e.g., xl)
                         1280: { slidesPerView: 4, spaceBetween: 30 },
                      }}
                      className="use-case-swiper !pb-10" // Use specific class and add padding for pagination
                    >
                      {useCases.map((useCase) => (
                        <SwiperSlide key={useCase.id} className="h-auto flex">
                          <UseCaseCard 
                            useCase={useCase} 
                            // Pass industry context if needed by card
                            industryName={activeIndustrySlug === 'all' ? useCase.industry?.name : currentIndustry?.name}
                            // Keep the onClick handler to potentially show details elsewhere
                            onClick={() => handleSelectUseCase(useCase)} 
                            // Add isSelected prop if UseCaseCard needs styling for selection
                            isSelected={selectedUseCaseData?.id === useCase.id}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Optional: Display Selected Use Case Details Below Slider */}
             <AnimatePresence>
                {selectedUseCaseData && (
                    <motion.div 
                        id="use-case-detail-view" // Target for potential scroll
                        key="detail-view" // Ensure it animates distinctly
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="mt-10 border-t pt-8 overflow-hidden"
                    >
                        <UseCaseDetailView useCase={selectedUseCaseData} />
                         <button 
                            onClick={() => handleSelectUseCase(null)} // Deselect button
                            className="button button-secondary mt-6 mx-auto flex items-center gap-2"
                         > 
                            <Icon name="close" className="w-4 h-4"/>
                           Close Details
                         </button>
                    </motion.div>
                )}
            </AnimatePresence>
            
          </div>
        )}
      </div>

      {/* "Explore All Use Cases" Button - Added Below Slider/Details */}
      <div className="mt-12 text-center"> 
          <Button as={Link} href="/usecases" secondary>
             Explore All Use Cases
          </Button>
      </div>

    </Section>
  );
};

export default FeaturedUseCases; 