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
import { 
  ALL_JEDI_COMPONENTS,
  getAllJediImplementations
} from '../constants/jedi';

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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-start gap-3 ${itemClassName}`}
        >
          <Icon 
            name={iconName} 
            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconClassName}`}
          />
          <span className="text-sm">{item}</span>
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
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'jedi'
  const { isDarkMode } = useTheme();

  // JEDI data
  const allImplementations = getAllJediImplementations();
  const [activeComponentIndex, setActiveComponentIndex] = useState(0);
  const activeComponent = ALL_JEDI_COMPONENTS[activeComponentIndex];
  const componentImplementations = allImplementations.filter(impl => 
    impl.componentId === activeComponent?.id
  );

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

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-n-7/50 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'applications'
                  ? 'bg-primary-1 text-white shadow-lg'
                  : 'text-n-4 hover:text-n-1'
              }`}
            >
              Industry Applications
            </button>
            <button
              onClick={() => setActiveTab('jedi')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'jedi'
                  ? 'bg-primary-1 text-white shadow-lg'
                  : 'text-n-4 hover:text-n-1'
              }`}
            >
              JEDI Components
            </button>
          </div>
        </div>

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

        {!loading && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-2xl border ${isDarkMode ? 'bg-n-8/80 border-n-6' : 'bg-white/80 border-n-3'} shadow-xl overflow-hidden backdrop-blur-sm`}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'applications' && applications.length > 0 && (
                <motion.div
                  key="applications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Industry Applications Tabs */}
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
                        <span className="relative z-10">{app.applicationTitle}</span>
                        
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

                  {/* Industry Applications Content */}
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
                          {/* Application Header */}
                          <div className="text-center mb-8">
                            <h3 className="h3 theme-text-primary mb-4">
                              {activeApplication.applicationTitle}
                            </h3>
                            <p className="h4 theme-text-secondary mb-4">
                              {activeApplication.tagline}
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm theme-text-secondary">
                              <Icon name="building" className="w-4 h-4" />
                              <span>{activeApplication.industry?.name}</span>
                            </div>
                          </div>

                          {/* Application Details Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* JEDI Approach */}
                            <div>
                              <h4 className="h4 theme-text-primary mb-4 flex items-center gap-2">
                                <Icon name="lightbulb" className="w-5 h-5 text-primary-1" />
                                JEDI Approach
                              </h4>
                              <div className="prose prose-sm max-w-none theme-text-secondary">
                                <RichText content={activeApplication.jediApproach} />
                              </div>
                            </div>

                            {/* Key Capabilities */}
                            <div>
                              <h4 className="h4 theme-text-primary mb-4 flex items-center gap-2">
                                <Icon name="zap" className="w-5 h-5 text-primary-1" />
                                Key Capabilities
                              </h4>
                              {renderCompactList(activeApplication.keyCapabilities)}
                            </div>
                          </div>

                          {/* JEDI Components Used */}
                          {activeApplication.jediComponent && activeApplication.jediComponent.length > 0 && (
                            <div>
                              <h4 className="h4 theme-text-primary mb-4 flex items-center gap-2">
                                <Icon name="cog" className="w-5 h-5 text-primary-1" />
                                JEDI Components Used
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {activeApplication.jediComponent.map((component, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-primary-1/10 text-primary-1 rounded-full text-sm font-medium"
                                  >
                                    {component.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Call to Action */}
                          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-n-6">
                            <button
                              onClick={() => handleLearnMore(activeApplication)}
                              className="btn-primary flex items-center gap-2"
                            >
                              Learn More
                              <Icon name="arrow-right" className="w-4 h-4" />
                            </button>
                            <Link
                              to={`/industries/${activeApplication.industry?.slug}`}
                              className="btn-secondary flex items-center gap-2"
                            >
                              View Industry Solutions
                              <Icon name="arrow-right" className="w-4 h-4" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {activeTab === 'jedi' && (
                <motion.div
                  key="jedi"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* JEDI Component Tabs */}
                  <div className={`flex flex-wrap border-b ${isDarkMode ? 'border-n-6' : 'border-n-3'} ${isDarkMode ? 'bg-n-7/80' : 'bg-n-2/50'} backdrop-blur-sm`}>
                    {ALL_JEDI_COMPONENTS.map((component, index) => (
                      <motion.button
                        key={component.id}
                        onClick={() => setActiveComponentIndex(index)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium text-center transition-all duration-300 relative group ${
                          activeComponentIndex === index
                            ? isDarkMode ? 'text-n-1' : 'text-n-8'
                            : isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'
                        }`}
                      >
                        <span className="relative z-10">{component.name}</span>
                        
                        {activeComponentIndex === index && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary-1/10 to-primary-2/10 rounded-t-lg"
                            layoutId="active-jedi-bg"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        
                        {activeComponentIndex === index && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-1 to-primary-2"
                            layoutId="active-jedi-indicator"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* JEDI Component Content */}
                  <div className="p-8 md:p-12 min-h-[500px] relative">
                    <AnimatePresence mode="wait">
                      {activeComponent && (
                        <motion.div
                          key={activeComponent.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -30 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="space-y-8"
                        >
                          {/* Component Header */}
                          <div className="text-center mb-8">
                            <h3 className="h3 theme-text-primary mb-4">
                              {activeComponent.name}
                            </h3>
                            <p className="h4 theme-text-secondary mb-2">
                              {activeComponent.tagline}
                            </p>
                            <p className="body-1 theme-text-secondary max-w-3xl mx-auto">
                              {activeComponent.description}
                            </p>
                          </div>

                          {/* Component Details Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Key Capabilities */}
                            <div className="space-y-6">
                              <div>
                                <h4 className="h4 theme-text-primary mb-4 flex items-center gap-2">
                                  <Icon name="zap" className="w-5 h-5 text-primary-1" />
                                  Key Capabilities
                                </h4>
                                <div className="space-y-3">
                                  {activeComponent.capabilities.primary.slice(0, 4).map((capability, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-start gap-3"
                                    >
                                      <Icon 
                                        name="check-circle" 
                                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-primary-1' : 'text-green-500'}`}
                                      />
                                      <div>
                                        <p className="font-medium theme-text-primary">
                                          {capability.name}
                                        </p>
                                        <p className="text-sm theme-text-secondary">
                                          {capability.userBenefit}
                                        </p>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>

                              {/* Business Value */}
                              <div>
                                <h4 className="h4 theme-text-primary mb-4 flex items-center gap-2">
                                  <Icon name="trending-up" className="w-5 h-5 text-primary-1" />
                                  Business Impact
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary-1/10 to-primary-2/10">
                                    <div className="text-2xl font-bold theme-text-primary">
                                      {componentImplementations.length}+
                                    </div>
                                    <div className="text-sm theme-text-secondary">
                                      Success Stories
                                    </div>
                                  </div>
                                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                                    <div className="text-2xl font-bold theme-text-primary">
                                      80%+
                                    </div>
                                    <div className="text-sm theme-text-secondary">
                                      Efficiency Gain
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Success Stories Preview */}
                            <div>
                              <h4 className="h4 theme-text-primary mb-4 flex items-center gap-2">
                                <Icon name="star" className="w-5 h-5 text-primary-1" />
                                Success Stories
                              </h4>
                              <div className="space-y-4">
                                {componentImplementations.slice(0, 2).map((implementation, index) => (
                                  <motion.div
                                    key={implementation.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className={`p-4 rounded-lg border ${isDarkMode ? 'bg-n-7/50 border-n-6' : 'bg-gray-50 border-gray-200'}`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center text-white font-bold text-sm">
                                        {implementation.client?.charAt(0) || 'C'}
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-semibold theme-text-primary mb-1">
                                          {implementation.client}
                                        </h5>
                                        <p className="text-sm theme-text-secondary mb-2">
                                          {implementation.industry}
                                        </p>
                                        <p className="text-sm theme-text-secondary">
                                          {implementation.problem}
                                        </p>
                                        <div className="mt-2 flex items-center gap-4 text-xs">
                                          <span className="text-green-500 font-medium">
                                            ✓ {implementation.results?.responseTime || '80% faster'}
                                          </span>
                                          <span className="text-blue-500 font-medium">
                                            ✓ {implementation.results?.customerSatisfaction || '60% improvement'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Call to Action */}
                          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-n-6">
                            <Link
                              to={`/technology/${activeComponent.id}`}
                              className="btn-primary flex items-center gap-2"
                            >
                              Learn More About {activeComponent.name}
                              <Icon name="arrow-right" className="w-4 h-4" />
                            </Link>
                            <Link
                              to="/contact"
                              className="btn-secondary flex items-center gap-2"
                            >
                              Get Started
                              <Icon name="arrow-right" className="w-4 h-4" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Lead Capture Modal */}
        <LeadCaptureModal
          isOpen={showLeadModal}
          onClose={() => setShowLeadModal(false)}
          onSubmit={handleLeadSubmit}
          context={leadContext}
        />
      </div>
      <Gradient />
    </Section>
  );
};

export default Services;