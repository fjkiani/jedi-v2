import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import Section from "./Section";
import Heading from "./Heading";
import { Gradient } from "./design/Services";
import { RichText } from '@graphcms/rich-text-react-renderer';
import { useTheme } from '@/context/ThemeContext';
import { Icon } from '@/components/Icon';
import { Link } from 'react-router-dom';

// Query to fetch data for tabbed display
const GetHomepageFeaturedApplications = gql`
  query GetHomepageFeaturedApplications {
    # Fetch first 3-4 applications for the tabs
    industryApplications(stage: PUBLISHED, first: 4, orderBy: applicationTitle_ASC) {
      id
      applicationTitle # Tab Title & Content Heading
      tagline          # Content Subtitle
      keyCapabilities  # Content List
      jediApproach {   # Added Jedi Approach (using text for summary)
        text
      }
      industry {       # For Link
        name
        slug
      }
      jediComponent(first: 3) { # Key components involved
        id
        name
        slug
        icon { url }
      }
    }
  }
`;

// Simple mapping for icons based on industry slug (adjust as needed)
const industryIconMap = {
  'healthcare': 'heart',
  'financial-services': 'dollar-sign',
  'energy': 'zap', // Example
  'default': 'layers' // Default icon
};

// Helper function to render lists (can be reused or simplified)
const renderCompactList = (items, iconName = 'check-circle', itemClassName = '', iconClassName = 'text-primary-1') => {
  const { isDarkMode } = useTheme();
  if (!items || items.length === 0) {
    return <p className={`text-sm italic ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>N/A</p>;
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item, index) => (
        <li key={index} className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'} ${itemClassName}`}>
          <Icon name={iconName} className={`w-4 h-4 ${iconClassName} flex-shrink-0`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

const Services = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAppIndex, setActiveAppIndex] = useState(0); // State for active tab
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hygraphClient.request(GetHomepageFeaturedApplications);
        console.log("[Services Tab] Fetched data:", data);
        setApplications(data.industryApplications || []);
      } catch (err) {
        console.error("Error fetching homepage services data:", err);
        setError("Failed to load featured applications.");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const activeApplication = applications[activeAppIndex];

  return (
    <Section id="services-featured-apps">
      <div className="container">
        <Heading title="Featured AI Applications" text="Explore examples of how our platform delivers value." />

        {loading && <div className="text-center text-n-4 p-8">Loading applications...</div>}
        {error && <div className="text-center text-red-500 p-8">Error: {error}</div>}

        {!loading && !error && applications.length > 0 && (
          <div className={`rounded-2xl border ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'} shadow-xl overflow-hidden`}>
            {/* Tab Triggers */}
            <div className={`flex flex-wrap border-b ${isDarkMode ? 'border-n-6' : 'border-n-3'} ${isDarkMode ? 'bg-n-7' : 'bg-n-2/50'}`}>
              {applications.map((app, index) => (
                <button
                  key={app.id}
                  onClick={() => setActiveAppIndex(index)}
                  className={`flex-1 sm:flex-none px-4 py-4 text-sm font-medium text-center transition-colors duration-200 relative group ${
                    activeAppIndex === index
                      ? isDarkMode ? 'text-n-1' : 'text-n-8'
                      : isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'
                  }`}
                >
                  {/* Use Industry Name or fallback to App Title for Tab Label */}
                  <span>{app.industry?.name || app.applicationTitle}</span>
                  {/* Active Indicator */}
                  {activeAppIndex === index && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-1"
                      layoutId="active-service-indicator" // Animate underline
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-10 min-h-[350px] relative"> {/* Ensure min height */}
              <AnimatePresence mode="wait">
                {activeApplication && (
                  <motion.div
                    key={activeApplication.id} // Key change triggers animation
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-6"
                  >
                    {/* Title and Tagline */}
                    <div>
                      <h3 className={`h3 mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{activeApplication.applicationTitle}</h3>
                      {activeApplication.tagline && <p className="text-lg text-color-1 font-semibold">{activeApplication.tagline}</p>}
                    </div>

                    {/* Jedi Approach Description - Added Section */}
                    {activeApplication.jediApproach?.text && (
                       <div className="pt-4">
                         <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'} flex items-center gap-2`}>
                            <Icon name="lightbulb" className="w-5 h-5 text-yellow-400"/> Our Approach
                         </h5>
                         <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                           {activeApplication.jediApproach.text}
                         </p>
                       </div>
                    )}

                    {/* Capabilities and Components Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4">
                      {/* Key Capabilities */}
                      {activeApplication.keyCapabilities && activeApplication.keyCapabilities.length > 0 && (
                        <div>
                          <h5 className={`font-semibold mb-3 ${isDarkMode ? 'text-n-2' : 'text-n-7'} flex items-center gap-2`}>
                            <Icon name="check-square" className="w-5 h-5 text-primary-1"/> Key Capabilities
                          </h5>
                           {renderCompactList(activeApplication.keyCapabilities, 'check-circle', '', 'text-green-500')}
                        </div>
                      )}

                      {/* Jedi Components */}
                      {activeApplication.jediComponent && activeApplication.jediComponent.length > 0 && (
                        <div>
                          <h5 className={`font-semibold mb-3 ${isDarkMode ? 'text-n-2' : 'text-n-7'} flex items-center gap-2`}>
                             <Icon name="puzzle" className="w-5 h-5 text-blue-400"/> Core Components
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {activeApplication.jediComponent.map(comp => (
                              <Link
                                key={comp.id}
                                to={`/technology/${comp.slug}`}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                                  isDarkMode ? 'bg-n-6 border-n-5 text-n-3 hover:text-n-1 hover:border-n-4' : 'bg-n-2 border-n-3 text-n-5 hover:text-n-7 hover:border-n-4'
                                } transition-colors`}
                                title={comp.name}
                              >
                                {comp.icon?.url ? (
                                  <img src={comp.icon.url} alt="" className="w-3.5 h-3.5" />
                                ) : (
                                   <Icon name="cpu" className="w-3.5 h-3.5" />
                                )}
                                <span>{comp.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Learn More Link */}
                    {activeApplication.industry?.slug && (
                      <div className="mt-8 pt-6 border-t border-n-6/30">
                        <a
                          href={`/industries/${activeApplication.industry.slug}`}
                          className="button button-sm button-secondary inline-flex items-center gap-2 group/link"
                        >
                          <span>Explore All {activeApplication.industry.name || 'Industry'} Solutions</span>
                           <Icon name="arrow-right" className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Fallback if no applications */}
        {!loading && !error && applications.length === 0 && (
           <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-n-7' : 'bg-n-1'}`}>
             <p className={`${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>No featured applications available at the moment.</p>
           </div>
        )}
      </div>
    </Section>
  );
};

export default Services;