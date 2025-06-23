import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import { logo } from '@/assets';
import { useTheme } from '@/context/ThemeContext';

// Enhanced GraphQL Query to get industry details with applications
const GetIndustriesWithDetails = gql`
  query GetIndustriesWithDetails {
    industries(stage: PUBLISHED, orderBy: name_ASC) {
      id
      name
      slug
      description
      fullDescription { raw }
      benefits
      capabilities
      # Get sample industry applications for preview
      industryApplication(first: 3) {
        id
        applicationTitle
        tagline
        industryChallenge { raw }
        jediApproach { raw }
        keyCapabilities
        jediComponent(first: 2) {
          id
          name
          icon { url }
        }
      }
    }
  }
`;

// Enhanced mapping for icons and colors with challenge/solution info
const industryConfig = {
  'healthcare': {
    icon: 'heart',
    color: 'from-blue-500 to-blue-700',
    headline: 'Transforming Patient Care with AI',
    challenge: 'Healthcare faces rising costs, staffing shortages, and the need for personalized care at scale.',
    solution: 'Our AI solutions enhance diagnostics, automate workflows, and enable predictive healthcare.',
    keyMetrics: ['40% reduction in diagnostic time', '60% improvement in patient outcomes', '30% cost savings']
  },
  'financial-services': {
    icon: 'dollar-sign',
    color: 'from-green-500 to-green-700',
    headline: 'Revolutionizing Financial Operations',
    challenge: 'Financial institutions struggle with fraud detection, regulatory compliance, and customer personalization.',
    solution: 'We deliver intelligent automation for risk management, fraud prevention, and customer insights.',
    keyMetrics: ['95% fraud detection accuracy', '50% faster compliance reporting', '25% increase in customer satisfaction']
  },
  'education': {
    icon: 'book-open',
    color: 'from-purple-500 to-purple-700',
    headline: 'Personalizing Learning Experiences',
    challenge: 'Educational institutions need to scale personalized learning while managing diverse student needs.',
    solution: 'Our AI platforms create adaptive learning paths and automate administrative processes.',
    keyMetrics: ['35% improvement in learning outcomes', '50% reduction in admin time', '80% student engagement increase']
  },
  'manufacturing': {
    icon: 'cog',
    color: 'from-orange-500 to-orange-700',
    headline: 'Smart Manufacturing & Predictive Maintenance',
    challenge: 'Manufacturers face equipment downtime, quality control issues, and supply chain disruptions.',
    solution: 'We implement predictive maintenance, quality assurance AI, and smart factory automation.',
    keyMetrics: ['70% reduction in downtime', '45% improvement in quality', '30% supply chain optimization']
  },
  'retail': {
    icon: 'shopping-cart',
    color: 'from-pink-500 to-pink-700',
    headline: 'Enhancing Customer Experience & Operations',
    challenge: 'Retailers struggle with inventory management, customer personalization, and omnichannel experiences.',
    solution: 'Our solutions optimize inventory, personalize recommendations, and enhance customer journeys.',
    keyMetrics: ['25% increase in sales', '40% inventory optimization', '60% customer retention improvement']
  },
  'energy': {
    icon: 'zap',
    color: 'from-yellow-500 to-yellow-700',
    headline: 'Optimizing Energy Distribution & Consumption',
    challenge: 'Energy companies need to balance supply and demand while integrating renewable sources.',
    solution: 'We provide smart grid optimization, demand forecasting, and renewable energy management.',
    keyMetrics: ['20% energy efficiency improvement', '35% grid stability increase', '50% renewable integration']
  },
  'default': {
    icon: 'grid',
    color: 'from-n-5 to-n-7',
    headline: 'Custom AI Solutions for Your Industry',
    challenge: 'Every industry faces unique challenges that require tailored AI solutions.',
    solution: 'We develop custom AI implementations designed specifically for your industry needs.',
    keyMetrics: ['Custom ROI metrics', 'Industry-specific solutions', 'Tailored implementation']
  }
};

const IndustryOverview = () => {
  const { isDarkMode } = useTheme();
  const [industriesData, setIndustriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndustryIndex, setActiveIndustryIndex] = useState(0);

  useEffect(() => {
    const fetchIndustries = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hygraphClient.request(GetIndustriesWithDetails);
        setIndustriesData(data.industries || []);
      } catch (err) {
        console.error("Error fetching industries:", err);
        setError("Failed to load industries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchIndustries();
  }, []);

  const handleIndustryClick = (index) => {
    setActiveIndustryIndex(index);
  };

  const getIndustryConfig = (slug) => {
    return industryConfig[slug] || industryConfig['default'];
  };

  const activeIndustry = industriesData[activeIndustryIndex];
  const activeConfig = activeIndustry ? getIndustryConfig(activeIndustry.slug) : industryConfig['default'];

  return (
    <Section className="relative overflow-hidden bg-n-8/90 backdrop-blur-sm">
      <div className="container relative">
        
        {/* Header - More Compact */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <img src={logo} alt="JEDI AI" className="w-3 h-3 brightness-0 invert" />
            </div>
            <span className="text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Industry Transformation
            </span>
          </div>
          <h2 className="h2 mb-4 font-starjedi dark:text-n-1">industries we transform</h2>
          <p className="body-1 text-n-4 max-w-2xl mx-auto">
            Discover how our AI solutions revolutionize different industries with cutting-edge technology and intelligent automation
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-6">
            <p className="text-red-500 mb-3">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="button button-primary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Industries Showcase - More Compact */}
        {!loading && !error && industriesData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-2xl border ${isDarkMode ? 'bg-n-8/80 border-n-6' : 'bg-white/80 border-n-3'} shadow-xl overflow-hidden backdrop-blur-sm dark:text-n-1`}
          >
            {/* Tab Navigation - More Compact */}
            <div className={`flex flex-wrap border-b ${isDarkMode ? 'border-n-6' : 'border-n-3'} ${isDarkMode ? 'bg-n-7/80' : 'bg-n-2/50'} backdrop-blur-sm`}>
              {industriesData.map((industry, index) => {
                const config = getIndustryConfig(industry.slug);
                return (
                  <motion.button
                    key={industry.id}
                    onClick={() => handleIndustryClick(index)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 sm:flex-none px-4 py-3 text-lg font-medium text-center transition-all duration-300 relative group ${
                      activeIndustryIndex === index
                        ? isDarkMode ? 'text-n-1' : 'text-n-8'
                        : isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Icon name={config.icon} className="w-3 h-3" />
                      <span className="relative z-10">{industry.name}</span>
                    </div>
                    
                    {/* Active Indicator */}
                    {activeIndustryIndex === index && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${config.color}/10 rounded-t-lg`}
                        layoutId="active-industry-bg"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {activeIndustryIndex === index && (
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.color}`}
                        layoutId="active-industry-indicator"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Tab Content - Much More Compact */}
            <div className="p-6 md:p-8 min-h-[400px] relative">
              <AnimatePresence mode="wait">
                {activeIndustry && (
                  <motion.div
                    key={activeIndustry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-6"
                  >
                    {/* Header with Central Icon - More Compact */}
                    <div className="text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative flex justify-center mb-4"
                      >
                        <div className={`w-16 h-16 bg-gradient-to-r ${activeConfig.color} rounded-xl p-0.5 shadow-lg`}>
                          <div className="w-full h-full bg-n-8 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-r ${activeConfig.color}/10`} />
                            <Icon name={activeConfig.icon} className="w-8 h-8 text-white relative z-10" />
                          </div>
                        </div>
                      </motion.div>
                      
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                        {activeConfig.headline}
                      </h3>
                      
                      <p className="text-sm text-n-4 max-w-xl mx-auto mb-6">
                        {activeIndustry.description || activeConfig.solution}
                      </p>
                    </div>

                    {/* Challenge & Solution Cards - More Compact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* The Challenge */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-700/50' : 'bg-red-50 border-red-200'}`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <Icon name="alert-triangle" className="w-4 h-4 text-white" />
                          </div>
                          <h5 className="font-bold text-sm text-red-600 dark:text-red-400">Industry Challenge</h5>
                        </div>
                        <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
                          {activeConfig.challenge}
                        </p>
                      </motion.div>

                      {/* Our Solution */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`p-4 rounded-lg border ${isDarkMode ? 'bg-green-900/20 border-green-700/50' : 'bg-green-50 border-green-200'}`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Icon name="check-circle" className="w-4 h-4 text-white" />
                          </div>
                          <h5 className="font-bold text-sm text-green-600 dark:text-green-400">JEDI Solution</h5>
                        </div>
                        <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                          {activeConfig.solution}
                        </p>
                      </motion.div>
                    </div>

                    {/* Key Metrics & Applications - More Compact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Key Metrics */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Icon name="trending-up" className="w-5 h-5 text-blue-500" />
                          <h5 className={`font-bold text-sm ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Key Impact Metrics</h5>
                        </div>
                        <div className="space-y-2">
                          {activeConfig.keyMetrics.map((metric, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.05 }}
                              className="flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex-shrink-0" />
                              <span className={`text-lg ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{metric}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Featured Applications */}
                      {activeIndustry.industryApplication && activeIndustry.industryApplication.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Icon name="zap" className="w-5 h-5 text-yellow-500" />
                            <h5 className={`font-bold text-lg ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Featured Applications</h5>
                          </div>
                          <div className="space-y-2">
                            {activeIndustry.industryApplication.slice(0, 2).map((app, index) => (
                              <motion.div
                                key={app.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.05 }}
                                className={`p-2 rounded border ${isDarkMode ? 'bg-n-7/30 border-n-6/50' : 'bg-n-2/30 border-n-3/50'} hover:border-purple-500/30 transition-all duration-200`}
                              >
                                <h6 className={`font-medium text-lg mb-1 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                                  {app.applicationTitle}
                                </h6>
                                <p className={`text-lg ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                                  {app.tagline}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Call to Action - More Compact */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-center pt-4 border-t border-n-6/30"
                    >
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                          to={`/industries/${activeIndustry.slug}`}
                          className={`px-6 py-2 bg-gradient-to-r ${activeConfig.color} text-white rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2`}
                        >
                          <Icon name="arrow-right" className="w-4 h-4" />
                          Explore {activeIndustry.name} Solutions
                        </Link>
                        
                        <Link
                          to="/industries"
                          className={`px-6 py-2 border rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 ${
                            isDarkMode 
                              ? 'border-n-5 text-n-3 hover:bg-n-7 hover:text-n-1' 
                              : 'border-n-3 text-n-6 hover:bg-n-2 hover:text-n-8'
                          }`}
                        >
                          <Icon name="grid" className="w-4 h-4" />
                          View All Industries
                        </Link>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </Section>
  );
};

export default IndustryOverview; 