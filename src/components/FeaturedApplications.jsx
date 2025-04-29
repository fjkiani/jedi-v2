import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import Section from "./Section";
import Heading from "./Heading";
import { Icon } from '@/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { Link } from 'react-router-dom';
import ApplicationDisplay from '../features/industries/components/ApplicationDisplay';
import { RingLoader } from 'react-spinners';
import { RichText } from '@graphcms/rich-text-react-renderer';

// --- Concise Application View for Modal ---
const ConciseApplicationView = ({ application }) => {
  const { isDarkMode } = useTheme();
  const [selectedComponent, setSelectedComponent] = useState(null);

  if (!application) return null;

  const {
    applicationTitle,
    tagline,
    keyCapabilities,
    jediComponent = [],
    industry,
    technology
  } = application;

  const handleComponentClick = (component) => {
    setSelectedComponent(prev => (prev && prev.id === component.id ? null : component));
  };

  return (
    <div>
      <h3 className={`h4 mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
        {applicationTitle}
      </h3>
      {tagline && (
        <p className={`body-2 mb-6 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`}>
          {tagline}
        </p>
      )}

      {/* {keyCapabilities && keyCapabilities.length > 0 && (
        <div className="mb-6">
          <h5 className={`h5 mb-3 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>Key Capabilities</h5>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {keyCapabilities.map((cap, index) => (
              <li key={index} className={`${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{cap}</li>
            ))}
          </ul>
        </div>
      )} */}

      {/* Combined Section for Technology Icon and Components */}
      <div className="mb-8">
         <div className="flex items-center justify-between mb-3">
            <h5 className={`h5 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>Featured Components</h5>
            {technology?.icon?.url && (
              <img src={technology.icon.url} alt="Technology icon" className="w-6 h-6 opacity-75" />
            )}
         </div>

         {/* Jedi Components List (MAKE CLICKABLE AGAIN) */}
         {jediComponent && jediComponent.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {jediComponent.map(comp => (
                 <button 
                   key={comp.id} 
                   onClick={() => handleComponentClick(comp)}
                   className={`text-xs px-3 py-1 rounded-full border transition-colors duration-200 ${
                     selectedComponent?.id === comp.id 
                       ? (isDarkMode ? 'border-primary-1 bg-primary-1/20 text-primary-1' : 'border-primary-1 bg-primary-1/10 text-primary-1')
                       : (isDarkMode ? 'border-n-5 bg-n-6 text-n-2 hover:border-n-4' : 'border-n-3 bg-n-2 text-n-5 hover:border-n-4')
                   }`}
                 >
                    {comp.name}
                 </button>
              ))}
            </div>
         )}

         {/* RE-ADD Conditionally Rendered Component Details */}
         {selectedComponent && (
           <motion.div 
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
             className={`mt-4 p-4 rounded-lg border overflow-hidden ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'}`}
           >
             <h6 className={`h6 mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{selectedComponent.name}</h6>
             {selectedComponent.tagline && (
               <p className={`text-sm italic mb-3 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{selectedComponent.tagline}</p>
             )}
             <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert text-n-3' : 'text-n-6'}`}>
               {selectedComponent.description?.raw ? (
                 <RichText content={selectedComponent.description.raw} />
               ) : (
                 <p>No description available.</p>
               )}
             </div>
             <button 
                onClick={() => setSelectedComponent(null)}
                className={`text-xs mt-3 ${isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-7'}`}
             >
                Close Details
             </button>
           </motion.div>
         )}
      </div>

      {/* REVERTED Learn More Link - Points back to Industry slug */}
      {application.industry?.slug && ( // Check if industry slug exists on the application
        <div className="text-center mt-6"> 
          <Link
            to={`/industries/${application.industry.slug}`} // Use industry slug from application data
            className="button button-primary flex items-center gap-2 mx-auto"
          >
            <span>Learn More About {application.industry.name || 'This Industry'}</span> {/* Optional: Make text more specific */}
            <Icon name="arrow-right" className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
// --- End Concise Application View ---

// --- Basic Modal Component ---
const Modal = ({ isOpen, onClose, children }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-n-7 border border-n-6' : 'bg-white border border-n-3'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
              isDarkMode ? 'text-n-4 hover:bg-n-6' : 'text-n-5 hover:bg-n-2'
            }`}
            aria-label="Close modal"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
          <div className="p-6 pt-12 sm:p-8 sm:pt-14">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
// --- End Modal Component ---

// Query 1: Get ALL Industries
const GET_INDUSTRIES_WITH_APPLICATIONS = gql`
  query GetIndustriesWithApplications {
    industries(
      orderBy: name_ASC
      stage: PUBLISHED
    ) {
      id
      name
      slug
    }
  }
`;

// Query 2: Get applications for a SPECIFIC industry slug, newest first
const GET_APPLICATIONS_FOR_INDUSTRY = gql`
  query GetApplicationsForIndustry($industrySlug: String!) {
    industryApplications(
      where: { industry: { slug: $industrySlug } }
      orderBy: publishedAt_DESC
      first: 6 # Fetch top 6 newest
      stage: PUBLISHED
    ) {
      id
      applicationTitle
      tagline
      industryChallenge { raw }
      jediApproach { raw }
      keyCapabilities
      expectedResults
      publishedAt
      technology { # Fetch technology icon here
        icon { url } 
      }
      jediComponent { # Fetch component details including GENERIC description
        id
        name
        tagline
        description { raw } # ADDED BACK generic description
      }
      industry { # Fetch industry slug for the modal's Learn More link
        slug
      }
    }
  }
`;

// Query 3: Get applications across ALL industries, newest first
const GET_RECENT_APPLICATIONS_ALL_INDUSTRIES = gql`
  query GetRecentApplicationsAllIndustries {
    industryApplications(
      orderBy: publishedAt_DESC
      first: 6 # Fetch top 6 newest across all industries
      stage: PUBLISHED
    ) {
      id
      applicationTitle
      tagline
      industryChallenge { raw }
      jediApproach { raw }
      keyCapabilities
      expectedResults
      publishedAt
      jediComponent { # Fetch component details including GENERIC description
        id
        name
        tagline
        description { raw } # ADDED BACK generic description
      }
      industry { # Fetch associated industry for the 'All' tab cards
        id
        name
        slug
      }
    }
  }
`;

// Icon mapping for industry tabs
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

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// ApplicationCard component for compact display in the list
const ApplicationCard = ({ application, industryName, onClick }) => {
  const { isDarkMode } = useTheme();
  
  if (!application) return null;
  
  const {
    applicationTitle,
    tagline,
    publishedAt,
    jediComponent = [],
    technology
  } = application;

  // Determine industry name: Use passed prop directly if available (from 'All' query or parent)
  const displayIndustryName = industryName || application.industry?.name;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-5 rounded-xl border cursor-pointer transition-colors h-full flex flex-col justify-between ${
        isDarkMode 
          ? 'bg-n-7 border-n-6 hover:border-primary-1' 
          : 'bg-n-1 border-n-3 hover:border-primary-1'
      }`}
      onClick={onClick}
    >
      <div>
        {/* Top part: Date, Industry */}
        <div className="flex gap-3 items-start mb-3">
          <div className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs ${
            isDarkMode ? 'bg-n-6 text-n-3' : 'bg-n-2 text-n-5'
          }`}>
            {formatDate(publishedAt)}
          </div>
          {displayIndustryName && (
            <div className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs ${
              isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-1'
            }`}>
              {displayIndustryName}
            </div>
          )}
        </div>
        
        {/* Main Content: Title, Tagline */}
        <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
          {applicationTitle}
        </h4>
        {tagline && (
          <p className="text-sm text-primary-1 mb-3">{tagline}</p>
        )}
      </div>

      {/* Bottom section: Keep minimal, maybe just the technology icon if needed */}
      <div className="flex items-end justify-end mt-auto pt-3"> {/* Only show icon if available */}
         {/* Technology Icon (bottom right) */}
         {technology?.icon?.url && (
           <img 
             src={technology.icon.url} 
             alt="Technology icon" 
             className="w-5 h-5 ml-2 opacity-60 flex-shrink-0" 
           />
         )}
      </div>
    </motion.div>
  );
};

const FeaturedApplications = () => {
  const [industries, setIndustries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeIndustrySlug, setActiveIndustrySlug] = useState("all"); // Default to "all"
  const [modalApplicationData, setModalApplicationData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchIndustries = async () => {
      setLoadingIndustries(true);
      setError(null);
      try {
        const data = await hygraphClient.request(GET_INDUSTRIES_WITH_APPLICATIONS);
        const fetchedIndustries = data.industries || [];
        setIndustries(fetchedIndustries);
        console.log("[FeaturedApplications] Fetched Industries:", fetchedIndustries);
      } catch (err) {
        console.error("Error fetching industries:", err);
        setError("Failed to load industries.");
        setIndustries([]);
      } finally {
        setLoadingIndustries(false);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoadingApplications(true);
      setError(null);
      setApplications([]);
      setModalApplicationData(null); // Close modal if open
      setIsModalOpen(false);
      
      const isAllTab = activeIndustrySlug === "all";
      const query = isAllTab ? GET_RECENT_APPLICATIONS_ALL_INDUSTRIES : GET_APPLICATIONS_FOR_INDUSTRY;
      const variables = isAllTab ? {} : { industrySlug: activeIndustrySlug };
      const queryName = isAllTab ? 'All Industries' : activeIndustrySlug;

      console.log(`[FeaturedApplications] Fetching applications for: ${queryName}`);

      try {
        const data = await hygraphClient.request(query, variables);
        const fetchedApps = data.industryApplications || [];
        setApplications(fetchedApps);
        console.log(`[FeaturedApplications] Fetched ${fetchedApps.length} Applications for ${queryName}:`, fetchedApps);
      } catch (err) {
        console.error(`Error fetching applications for ${queryName}:`, err);
        setError(`Failed to load applications for ${queryName}.`);
        setApplications([]);
      } finally {
        setLoadingApplications(false);
      }
    };

    // Only fetch if industries have loaded or if the "all" tab is initially selected
    if (!loadingIndustries || activeIndustrySlug === "all") {
      fetchApplications();
    }
  }, [activeIndustrySlug, loadingIndustries]); // Re-run when slug changes or industries load

  const currentIndustry = useMemo(() => {
    if (activeIndustrySlug === "all") return null;
    return industries.find(ind => ind.slug === activeIndustrySlug);
  }, [industries, activeIndustrySlug]);

  const handleOpenModal = (application) => {
    setModalApplicationData(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalApplicationData(null);
  };

  // Common button class generation function
  const getButtonClasses = (slug) => {
    const isActive = activeIndustrySlug === slug;
    let baseClasses = "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border ";
    if (isActive) {
      baseClasses += isDarkMode 
        ? 'bg-primary-1/10 text-primary-1 border-primary-1' 
        : 'bg-primary-1/5 text-primary-1 border-primary-1';
    } else {
      baseClasses += isDarkMode 
        ? 'text-n-4 hover:text-n-1 border-n-6 bg-n-7' 
        : 'text-n-5 hover:text-n-7 border-n-3 bg-n-1';
    }
    // Add flex-shrink for horizontal scrolling behavior if needed
    if (slug !== "all") { 
      baseClasses += " flex-shrink-0 lg:flex-shrink";
    } else {
       baseClasses += " flex-shrink-0"; // Ensure "All" tab also shrinks if needed
    }
    return baseClasses;
  };

  return (
    <Section className="overflow-hidden" id="featured-applications">
      <div className="container">
        <Heading 
          title="Featured AI Applications" 
          text="Explore examples of how our platform delivers value."
        />

        {loadingIndustries && (
          <div className="flex justify-center items-center p-8">
            <RingLoader color={isDarkMode ? "#FFFFFF" : "#000000"} size={40} />
            <span className={`ml-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Loading industries...</span>
          </div>
        )}
        {error && <div className="text-center text-red-500 p-8">Error: {error}</div>}

        {!loadingIndustries && !error && industries.length === 0 && (
           <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-n-7' : 'bg-n-1'}`}>
             <p className={`${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>No industries found.</p>
           </div>
        )}

        {!loadingIndustries && !error && industries.length > 0 && (
          <div>
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
              {/* "All" Tab Button */}
              <button
                key="all-tab"
                onClick={() => setActiveIndustrySlug("all")}
                className={getButtonClasses("all")}
              >
                 <Icon 
                    name="grid" // Default grid icon for "All"
                    className={`w-4 h-4 ${activeIndustrySlug === "all" ? 'text-primary-1' : ''}`} 
                  />
                 <span>All Recent</span>
              </button>

              {/* Industry Specific Tabs */}
              {!loadingIndustries && industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setActiveIndustrySlug(industry.slug)}
                  className={getButtonClasses(industry.slug)} 
                >
                  <Icon 
                    name={industryIconMap[industry.slug] || industryIconMap.default} 
                    className={`w-4 h-4 ${activeIndustrySlug === industry.slug ? 'text-primary-1' : ''}`} 
                  />
                  <span>{industry.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              {loadingApplications ? (
                 <div className="flex justify-center items-center p-8">
                   <RingLoader color={isDarkMode ? "#FFFFFF" : "#000000"} size={40} />
                   <span className={`ml-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Loading applications...</span>
                 </div>
              ) : applications.length === 0 ? (
                <p className={`text-center p-6 rounded-lg border ${
                  isDarkMode ? 'border-n-6 bg-n-7 text-n-4' : 'border-n-3 bg-n-1 text-n-5'
                }`}>
                  No featured applications found {activeIndustrySlug === "all" ? "recently" : `for ${currentIndustry?.name || 'this industry'}`} yet.
                </p>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
                   {applications.map((app) => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        // Pass industry name explicitly for the 'All' tab, otherwise use currentIndustry
                        industryName={activeIndustrySlug === 'all' ? app.industry?.name : currentIndustry?.name}
                        onClick={() => handleOpenModal(app)}
                      />
                   ))}
                </div>
              )}
            </div>

             {/* Optional: Link to full industry page (Hide when "All" is active) */}
             {currentIndustry && activeIndustrySlug !== "all" && applications.length > 0 && (
               <div className="mt-10 text-center">
                 <Link
                   to={`/industries/${currentIndustry.slug}`}
                   className="button button-secondary flex items-center gap-2 mx-auto"
                 >
                   <span>Explore All {currentIndustry.name} Solutions</span>
                   <Icon name="arrow-right" className="w-4 h-4" />
                 </Link>
               </div>
             )}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalApplicationData && (
          <ConciseApplicationView application={modalApplicationData} />
        )}
      </Modal>
    </Section>
  );
};

export default FeaturedApplications; 