import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Button from './Button';
import LeadCaptureModal from './copilot/LeadCaptureModal';
import { contactFormService } from '../services/contactFormService';
import { logo } from '../assets';

const LeadCaptureCTA = ({ 
  title = "Ready to Transform Your Business?",
  subtitle = "Let's discuss how JEDI AI can solve your specific challenges and unlock exponential growth.",
  context = {},
  className = "",
  variant = "default" // default, compact, floating
}) => {
  const { isDarkMode } = useTheme();
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadContext, setLeadContext] = useState({});

  const handleLeadCapture = (captureType, additionalContext = {}) => {
    setLeadContext({
      ...context,
      ...additionalContext,
      captureType,
      leadSource: 'Lead Capture CTA',
      timestamp: new Date().toISOString()
    });
    setShowLeadModal(true);
  };

  const handleLeadSubmit = async (formData) => {
    try {
      const enrichedFormData = {
        ...formData,
        ...leadContext,
        leadSource: leadContext.leadSource || 'Lead Capture CTA'
      };

      await contactFormService.submitLead(enrichedFormData);
      setShowLeadModal(false);
      setLeadContext({});
    } catch (error) {
      console.error('Error submitting lead:', error);
      throw error;
    }
  };

  if (variant === "floating") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`fixed bottom-6 right-6 z-50 ${className}`}
        >
          <button
            onClick={() => handleLeadCapture('floating_cta')}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <img src={logo} alt="JEDI AI" className="w-6 h-6 brightness-0 invert" />
              <span className="font-medium">Get Started</span>
            </div>
          </button>
        </motion.div>

        <LeadCaptureModal
          isOpen={showLeadModal}
          onClose={() => {
            setShowLeadModal(false);
            setLeadContext({});
          }}
          contextData={leadContext}
          onSubmit={handleLeadSubmit}
        />
      </>
    );
  }

  if (variant === "compact") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 p-6 ${className}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/50"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <img src={logo} alt="JEDI AI" className="w-7 h-7 brightness-0 invert" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
              </div>
            </div>
            <Button
              onClick={() => handleLeadCapture('compact_cta')}
              size="sm"
              className="ml-4"
            >
              Let's Talk
            </Button>
          </div>
        </motion.div>

        <LeadCaptureModal
          isOpen={showLeadModal}
          onClose={() => {
            setShowLeadModal(false);
            setLeadContext({});
          }}
          contextData={leadContext}
          onSubmit={handleLeadSubmit}
        />
      </>
    );
  }

  // Default variant
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 p-6 md:p-8 max-w-4xl mx-auto ${className}`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.05),transparent_50%)]"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <img src={logo} alt="JEDI AI" className="w-6 h-6 md:w-8 md:h-8 brightness-0 invert" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <Button
              onClick={() => handleLeadCapture('consultation', { 
                context: 'Consultation request from CTA', 
                priority: 'high' 
              })}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-sm md:text-base py-2 md:py-3 px-4 md:px-6"
            >
              📞 Schedule Consultation
            </Button>
            <Button
              onClick={() => handleLeadCapture('demo_request', { 
                context: 'Demo request from CTA', 
                priority: 'medium' 
              })}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30 text-sm md:text-base py-2 md:py-3 px-4 md:px-6"
            >
              🎥 Request Demo
            </Button>
            <Button
              onClick={() => handleLeadCapture('assessment', { 
                context: 'Free assessment from CTA', 
                priority: 'medium' 
              })}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30 text-sm md:text-base py-2 md:py-3 px-4 md:px-6 sm:col-span-2 lg:col-span-1"
            >
              📋 Free Assessment
            </Button>
          </div>
        </div>
      </motion.div>

      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => {
          setShowLeadModal(false);
          setLeadContext({});
        }}
        contextData={leadContext}
        onSubmit={handleLeadSubmit}
      />
    </>
  );
};

export default LeadCaptureCTA; 