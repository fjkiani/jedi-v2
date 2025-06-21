import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { logo } from '../assets';
import { Icon } from '@/components/Icon';
import LeadCaptureModal from './copilot/LeadCaptureModal';
import { contactFormService } from '../services/contactFormService';

// Help categories with different assistance types
const helpCategories = [
  {
    id: 'solutions',
    title: 'AI Solutions',
    icon: 'cpu',
    description: 'Explore our AI solutions and find the perfect fit for your business needs.',
    features: [
      'Custom AI Development',
      'Process Automation',
      'Data Analytics & ML',
      'Digital Transformation'
    ],
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'industries',
    title: 'Industry Focus',
    icon: 'target',
    description: 'Discover how we transform specific industries with cutting-edge AI.',
    features: [
      'Healthcare AI Solutions',
      'Financial Services',
      'Manufacturing & IoT',
      'Education Technology'
    ],
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'consultation',
    title: 'Get Started',
    icon: 'message-circle',
    description: 'Ready to discuss your project? Let\'s start engineering your vision.',
    features: [
      'Free Initial Consultation',
      'Custom ROI Analysis',
      'Technical Architecture Review',
      'Implementation Roadmap'
    ],
    color: 'from-purple-500 to-pink-500'
  }
];

const SidebarConsultant = ({ 
  className = ""
}) => {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the consultant tab immediately for better visibility
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Reduced delay for faster appearance

    return () => clearTimeout(timer);
  }, []);

  const handleConsultantClick = (categoryId = 'consultation') => {
    const category = helpCategories.find(cat => cat.id === categoryId) || helpCategories[2];
    setIsExpanded(false);
    setShowLeadModal(true);
  };

  const handleTabClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLeadSubmit = async (formData) => {
    try {
      const enrichedFormData = {
        ...formData,
        leadSource: 'Sidebar Consultant',
        context: `User engaged with ${helpCategories[activeCategory]?.title || 'JEDI Help'}`,
        captureType: 'sidebar_consultant'
      };

      await contactFormService.submitLead(enrichedFormData);
      setShowLeadModal(false);
    } catch (error) {
      console.error('Error submitting lead:', error);
      throw error;
    }
  };

  // Always show the component for better visibility
  const activeHelpCategory = helpCategories[activeCategory];

  return (
    <>
      {/* Sidebar Consultant - Always visible with enhanced prominence */}
      <div className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 ${className}`}>
        {/* Enhanced tab with much better visibility */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: isExpanded ? 0 : 56, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`relative cursor-pointer shadow-2xl backdrop-blur-sm transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-purple-500/30 text-white' 
              : 'bg-gradient-to-br from-white/95 to-gray-50/95 border-purple-300/50 text-gray-900'
          } border-2 border-l border-t border-b rounded-l-3xl hover:shadow-3xl hover:scale-105 group`}
          onClick={handleTabClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Much larger and more prominent tab */}
          <div className="w-28 h-40 flex flex-col items-center justify-center gap-3 p-4">
            {/* Larger animated logo */}
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg relative">
              <img src={logo} alt="JEDI" className="w-9 h-9 brightness-0 invert" />
              {/* Pulsing ring animation */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-full border border-pink-400 animate-pulse"></div>
            </div>
            
            {/* Larger text */}
            <div className={`text-sm font-bold text-center leading-tight ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            } group-hover:text-purple-400 transition-colors`}>
              JEDI
              <br />
              <span className="text-lg">Help</span>
            </div>
            
            {/* More prominent indicator */}
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-ping animation-delay-150"></div>
            </div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`absolute right-24 top-0 w-96 min-h-[32rem] rounded-2xl shadow-2xl border backdrop-blur-sm overflow-hidden ${
                  isDarkMode 
                    ? 'bg-gray-900/95 border-gray-600 text-white' 
                    : 'bg-white/95 border-gray-300 text-gray-900'
                }`}
              >
                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-colors z-10 ${
                    isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-600'
                  }`}
                >
                  ×
                </button>

                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <img src={logo} alt="JEDI Consultant" className="w-7 h-7 brightness-0 invert" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm mb-1">JEDI Labs Consultant</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        How can we help engineer your vision?
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className={`flex border-b ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
                  {helpCategories.map((category, index) => (
                    <button
                      key={category.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCategory(index);
                      }}
                      className={`flex-1 px-2 py-2 text-sm font-medium text-center transition-all duration-300 relative ${
                        activeCategory === index
                          ? isDarkMode ? 'text-white' : 'text-gray-900'
                          : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Icon name={category.icon} className="w-3 h-3" />
                        <span className="text-sm">{category.title}</span>
                      </div>
                      
                      {/* Active indicator */}
                      {activeCategory === index && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                          layoutId="active-help-indicator"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Category Header */}
                      <div className="text-center">
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center bg-gradient-to-br ${activeHelpCategory.color}`}>
                          <Icon name={activeHelpCategory.icon} className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-sm mb-2">{activeHelpCategory.title}</h3>
                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {activeHelpCategory.description}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2">
                        {activeHelpCategory.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex-shrink-0" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 pt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConsultantClick(activeHelpCategory.id);
                          }}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl bg-gradient-to-r ${activeHelpCategory.color} text-white hover:scale-105`}
                        >
                          {activeHelpCategory.id === 'consultation' ? '🚀 Start Consultation' : `💬 Discuss ${activeHelpCategory.title}`}
                        </button>
                        
                        {activeHelpCategory.id !== 'consultation' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConsultantClick('consultation');
                            }}
                            className={`w-full px-4 py-2 rounded-lg text-lg font-medium border transition-all duration-200 ${
                              isDarkMode 
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500' 
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                            }`}
                          >
                            🎯 Get Custom Consultation
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Speech bubble pointer */}
                <div className={`absolute right-0 top-12 translate-x-3 w-4 h-4 rotate-45 ${
                  isDarkMode ? 'bg-gray-900 border-r border-t border-gray-600' : 'bg-white border-r border-t border-gray-300'
                }`} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        contextData={{
          leadSource: 'Sidebar Consultant',
          context: `User engaged with ${activeHelpCategory?.title || 'JEDI Help'}`,
          helpCategory: activeHelpCategory?.id
        }}
        onSubmit={handleLeadSubmit}
      />
    </>
  );
};

export default SidebarConsultant;