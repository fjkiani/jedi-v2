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
import LeadCaptureModal from './copilot/LeadCaptureModal';
import { contactFormService } from '../services/contactFormService';

// Enhanced query to fetch data for co-pilot style display
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

// Helper function to render lists with enhanced styling
const renderCompactList = (items, iconName = 'check-circle', itemClassName = '', iconClassName = 'text-primary-1') => {
  if (!items || items.length === 0) {
    return <p className="text-sm italic text-n-4 dark:text-n-5">No items available</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <motion.li 
          key={index} 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-start gap-3 text-sm text-n-6 dark:text-n-3 ${itemClassName}`}
        >
          <Icon name={iconName} className={`w-4 h-4 ${iconClassName} flex-shrink-0 mt-0.5`} />
          <span className="leading-relaxed">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
};

const Services = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAppIndex, setActiveAppIndex] = useState(0);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadContext, setLeadContext] = useState({});
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hygraphClient.request(GetHomepageFeaturedApplications);
        console.log("[Services] Fetched applications:", data);
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

  const handleLearnMore = (application) => {
    setLeadContext({
      applicationTitle: application.applicationTitle,
      industry: application.industry?.name,
      leadSource: 'Services Section',
      context: `Interested in ${application.applicationTitle}`,
      captureType: 'services_inquiry'
    });
    setShowLeadModal(true);
  };

  const handleLeadSubmit = async (formData) => {
    try {
      const enrichedFormData = {
        ...formData,
        ...leadContext,
        discussedSolutions: [leadContext.applicationTitle]
      };

      await contactFormService.submitLead(enrichedFormData);
      setShowLeadModal(false);
      setLeadContext({});
    } catch (error) {
      console.error('Error submitting lead:', error);
      throw error;
    }
  };

  return (
    <Section id="services-featured-apps">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Heading 
            title="AI Solutions in Action" 
            text="Explore real-world applications of our JEDI platform across industries." 
          />
        </motion.div>

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-n-4 p-8"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-primary-1 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-primary-1 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-4 h-4 bg-primary-1 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="mt-2">Loading AI solutions...</p>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-red-500 p-8 bg-red-50 dark:bg-red-900/20 rounded-lg"
          >
            <Icon name="alert-circle" className="w-8 h-8 mx-auto mb-2" />
            <p>Error: {error}</p>
          </motion.div>
        )}

        {!loading && !error && applications.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-2xl border ${isDarkMode ? 'bg-n-8/80 border-n-6' : 'bg-white/80 border-n-3'} shadow-xl overflow-hidden backdrop-blur-sm`}
          >
            {/* Enhanced Tab Triggers - Using Application Titles */}
            <div className={`flex flex-wrap border-b ${isDarkMode ? 'border-n-6' : 'border-n-3'} ${isDarkMode ? 'bg-n-7/80' : 'bg-n-2/50'} backdrop-blur-sm`}>
              {applications.map((app, index) => (
                <motion.button
                  key={app.id}
                  onClick={() => setActiveAppIndex(index)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium text-center transition-all duration-300 relative group ${
                    activeAppIndex === index
                      ? isDarkMode ? 'text-n-1' : 'text-n-8'
                      : isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'
                  }`}
                >
                  {/* Use Application Title instead of Industry */}
                  <span className="relative z-10">{app.applicationTitle}</span>
                  
                  {/* Enhanced Active Indicator */}
                  {activeAppIndex === index && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-1/10 to-primary-2/10 rounded-t-lg"
                      layoutId="active-service-bg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {activeAppIndex === index && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-1 to-primary-2"
                      layoutId="active-service-indicator"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Enhanced Tab Content with Co-pilot Feel */}
            <div className="p-8 md:p-12 min-h-[450px] relative">
              <AnimatePresence mode="wait">
                {activeApplication && (
                  <motion.div
                    key={activeApplication.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="space-y-8"
                  >
                    {/* Header with Industry Context */}
                    <div className="text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-1/10 rounded-full text-sm text-primary-1 font-medium mb-4"
                      >
                        <Icon name="target" className="w-4 h-4" />
                        {activeApplication.industry?.name || 'Industry Solution'}
                      </motion.div>
                      
                      <h3 className={`h3 mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                        {activeApplication.applicationTitle}
                      </h3>
                      
                      {activeApplication.tagline && (
                        <p className="text-lg text-primary-1 font-semibold mb-6">
                          {activeApplication.tagline}
                        </p>
                      )}
                    </div>

                    {/* Challenge & Solution Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* The Challenge */}
                      {activeApplication.industryChallenge && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-red-900/20 border-red-700/50' : 'bg-red-50 border-red-200'}`}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                              <Icon name="alert-triangle" className="w-5 h-5 text-white" />
                            </div>
                            <h5 className="font-bold text-red-600 dark:text-red-400">The Challenge</h5>
                          </div>
                          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
                            {activeApplication.industryChallenge}
                          </p>
                        </motion.div>
                      )}

                      {/* Our Solution */}
                      {activeApplication.jediApproach?.text && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-green-900/20 border-green-700/50' : 'bg-green-50 border-green-200'}`}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <Icon name="check-circle" className="w-5 h-5 text-white" />
                            </div>
                            <h5 className="font-bold text-green-600 dark:text-green-400">Our Solution</h5>
                          </div>
                          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                            {activeApplication.jediApproach.text}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Capabilities and Components */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Key Capabilities */}
                      {activeApplication.keyCapabilities && activeApplication.keyCapabilities.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <Icon name="zap" className="w-6 h-6 text-yellow-500" />
                            <h5 className={`font-bold ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Key Capabilities</h5>
                          </div>
                          {renderCompactList(activeApplication.keyCapabilities, 'check-circle', '', 'text-green-500')}
                        </motion.div>
                      )}

                      {/* Core Components */}
                      {activeApplication.jediComponent && activeApplication.jediComponent.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <Icon name="cpu" className="w-6 h-6 text-blue-500" />
                            <h5 className={`font-bold ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Core Components</h5>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {activeApplication.jediComponent.map((comp, index) => (
                              <motion.div
                                key={comp.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                                  isDarkMode ? 'bg-n-6/50 border-n-5 text-n-3 hover:text-n-1 hover:border-n-4' : 'bg-n-2/50 border-n-3 text-n-6 hover:text-n-8 hover:border-n-4'
                                } transition-all duration-200 hover:scale-105`}
                              >
                                {comp.icon?.url ? (
                                  <img src={comp.icon.url} alt="" className="w-4 h-4" />
                                ) : (
                                  <Icon name="puzzle" className="w-4 h-4" />
                                )}
                                <span className="text-sm font-medium">{comp.name}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Call to Action */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-center pt-8 border-t border-n-6/30"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={() => handleLearnMore(activeApplication)}
                          className="px-8 py-3 bg-gradient-to-r from-primary-1 to-primary-2 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Icon name="message-circle" className="w-5 h-5" />
                          Discuss This Solution
                        </button>
                        
                        {activeApplication.industry?.slug && (
                          <Link
                            to={`/industries/${activeApplication.industry.slug}`}
                            className={`px-8 py-3 border rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 ${
                              isDarkMode 
                                ? 'border-n-5 text-n-3 hover:bg-n-7 hover:text-n-1' 
                                : 'border-n-3 text-n-6 hover:bg-n-2 hover:text-n-8'
                            }`}
                          >
                            <Icon name="arrow-right" className="w-5 h-5" />
                            Explore {activeApplication.industry.name}
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Fallback for no applications */}
        {!loading && !error && applications.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center p-12 rounded-2xl ${isDarkMode ? 'bg-n-7' : 'bg-n-1'} border border-n-6/30`}
          >
            <Icon name="search" className="w-12 h-12 mx-auto mb-4 text-n-4" />
            <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
              No AI Solutions Available
            </p>
            <p className={`${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              We're working on adding more featured applications. Check back soon!
            </p>
          </motion.div>
        )}
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => {
          setShowLeadModal(false);
          setLeadContext({});
        }}
        contextData={leadContext}
        onSubmit={handleLeadSubmit}
      />

      <Gradient />
    </Section>
  );
};

export default Services;