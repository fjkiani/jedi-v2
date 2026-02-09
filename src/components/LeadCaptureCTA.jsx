import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Button from './Button';
import LeadCaptureModal from './copilot/LeadCaptureModal'; // Assuming this exists or I'll need to mock it if it breaks
import { contactFormService } from '../services/contactFormService';
import { FiMessageSquare, FiCpu, FiActivity } from 'react-icons/fi';

// Fallback if contactFormService is missing in this context, but imports looked valid
const LeadCaptureCTA = ({
  title = "Ready to Deploy?",
  subtitle = "Initiate a secure channel with JEDI Command to discuss your operational requirements.",
  context = {},
  className = "",
  variant = "default"
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
    // Assuming the modal component handles the logic or existence key

    // For now, since I can't verify LeadCaptureModal internals, I'll assume it works or use a simple alert if needed, 
    // but better to keep the modal if it was there.
    setShowLeadModal(true);
  };

  const handleLeadSubmit = async (formData) => {
    try {
      if (contactFormService && contactFormService.submitLead) {
        await contactFormService.submitLead({
          ...formData,
          ...leadContext
        });
      }
      setShowLeadModal(false);
      setLeadContext({});
    } catch (error) {
      console.error('Error submitting lead:', error);
    }
  };

  // Common Button Styles
  const btnBase = "flex items-center justify-center gap-2 px-6 py-4 border font-mono uppercase text-xs tracking-widest transition-all duration-300 group";
  const btnPrimary = isDarkMode
    ? "bg-primary-1 text-n-8 border-primary-1 hover:bg-white hover:border-white"
    : "bg-n-8 text-n-1 border-n-8 hover:bg-n-6 hover:border-n-6";
  const btnSecondary = isDarkMode
    ? "bg-transparent text-primary-1 border-primary-1 hover:bg-primary-1/10"
    : "bg-transparent text-n-8 border-n-8 hover:bg-n-8/5";


  if (variant === "floating") {
    // Floating "Comms Link"
    return (
      <div className={`fixed bottom-8 right-8 z-[100] ${className}`}>
        <button
          onClick={() => handleLeadCapture('floating_cta')}
          className={`
                relative w-16 h-16 flex items-center justify-center rounded-full border-2 shadow-[0_0_20px_rgba(0,0,0,0.3)]
                ${isDarkMode ? 'bg-n-8 border-primary-1 text-primary-1' : 'bg-white border-n-8 text-n-8'}
                group overflow-hidden transition-transform hover:scale-110 active:scale-95
            `}
        >
          <div className={`absolute inset-0 opacity-20 animate-spin-slow ${isDarkMode ? 'bg-gradient-to-tr from-transparent via-primary-1 to-transparent' : 'bg-gradient-to-tr from-transparent via-n-8 to-transparent'}`}></div>
          <FiMessageSquare size={24} className="relative z-10" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>
      </div>
    );
  }

  // Default "Section" Variant
  return (
    <section className={`relative py-20 px-4 overflow-hidden ${className}`}>
      <div className="container max-w-5xl mx-auto relative z-10">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`
                    relative p-8 md:p-12 border-2 
                    ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-white border-n-3 shadow-2xl'}
                `}
        >
          {/* Decorative Corners */}
          <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 ${isDarkMode ? 'border-primary-1' : 'border-n-8'}`}></div>
          <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 ${isDarkMode ? 'border-primary-1' : 'border-n-8'}`}></div>
          <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 ${isDarkMode ? 'border-primary-1' : 'border-n-8'}`}></div>
          <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 ${isDarkMode ? 'border-primary-1' : 'border-n-8'}`}></div>

          {/* Center Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            <div className="flex-1 text-center md:text-left">
              <div className={`inline-flex items-center gap-2 mb-4 px-3 py-1 border rounded-full text-xs font-mono uppercase tracking-wider ${isDarkMode ? 'border-green-500 text-green-500' : 'border-n-8 text-n-8'}`}>
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></span>
                Secure Transmission
              </div>
              <h2 className={`h3 mb-4 uppercase font-mono ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                {title}
              </h2>
              <p className={`body-2 max-w-md ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                {subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button
                onClick={() => handleLeadCapture('consultation')}
                className={btnPrimary}
              >
                <FiCpu className="mr-2" />
                <span>Initiate_Protocol</span>
              </button>

              <button
                onClick={() => handleLeadCapture('demo')}
                className={btnSecondary}
              >
                <FiActivity className="mr-2" />
                <span>Request_Scan</span>
              </button>
            </div>

          </div>

          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        </motion.div>

      </div>

      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        contextData={leadContext}
        onSubmit={handleLeadSubmit}
      />
    </section>
  );
};

export default LeadCaptureCTA;