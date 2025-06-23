import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Button from '../Button';
import CoPilotMessage from './CoPilotMessage';
import UserMessage from './UserMessage';
import ThinkingIndicator from './ThinkingIndicator';
import LeadCaptureModal from './LeadCaptureModal';
import { contactFormService } from '../../services/contactFormService';
import { logo } from '../../assets';

const ChatInterface = ({ 
  industries = [], 
  useCases = [], 
  selectedIndustry, 
  onIndustryChange,
  onQuerySubmit 
}) => {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  
  // Lead capture modal state
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadContext, setLeadContext] = useState({});

  // Auto-scroll to bottom when new messages arrive, but only if user is near bottom
  useEffect(() => {
    const scrollContainer = messagesEndRef.current?.parentElement;
    if (scrollContainer) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // Only auto-scroll if user is already near the bottom
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  // Generate welcome message based on selected industry
  const getWelcomeMessage = () => {
    const industryName = selectedIndustry === 'all' ? 'various industries' : 
      industries.find(ind => ind.slug === selectedIndustry)?.name || 'your industry';
    
    return {
      id: 'welcome',
      type: 'copilot',
      content: `Hello! I'm your JEDI AI Co-Pilot. I can help you explore AI solutions for ${industryName}. What challenge would you like to solve today?`,
      timestamp: new Date(),
      suggestedQueries: getSuggestedQueries()
    };
  };

  // Get suggested queries based on current context
  const getSuggestedQueries = () => {
    const filteredUseCases = selectedIndustry === 'all' ? 
      useCases : 
      useCases.filter(uc => uc.industry?.slug === selectedIndustry);

    const allQueries = [];
    filteredUseCases.forEach(useCase => {
      if (useCase.queries && Array.isArray(useCase.queries)) {
        allQueries.push(...useCase.queries);
      }
    });

    // Remove duplicates and return up to 3 queries
    const uniqueQueries = [...new Set(allQueries)].slice(0, 3);
    
    // Create contextual simulation queries based on available use cases and industry
    const getContextualSimulationQueries = () => {
      const industryContext = industries.find(ind => ind.slug === selectedIndustry);
      const industryName = industryContext?.name || 'your industry';
      
      // If we have specific use cases, create simulation queries for them
      if (filteredUseCases.length > 0) {
        const topUseCase = filteredUseCases[0]; // Get the first available use case
        return [
          `🚀 Run implementation simulation for ${topUseCase.title}`,
          `📊 Show me success metrics for ${topUseCase.title}`,
          `🏗️ Walk me through ${topUseCase.title} architecture`,
          `💰 Analyze costs for implementing ${topUseCase.title}`,
          `⚡ Simulate ${topUseCase.title} deployment process`
        ];
      }
      
      // If no use cases but we have industry applications, use those
      if (industryContext && industryContext.industryApplication && industryContext.industryApplication.length > 0) {
        const topApp = industryContext.industryApplication[0];
        return [
          `🚀 Run implementation simulation for ${topApp.applicationTitle}`,
          `📊 Show me metrics for ${topApp.applicationTitle}`,
          `🏗️ Walk me through ${topApp.applicationTitle} technical approach`,
          `💰 Analyze ROI for ${topApp.applicationTitle}`,
          `⚡ Simulate ${topApp.applicationTitle} deployment`
        ];
      }
      
      // Fallback to industry-specific simulation queries
      return [
        `🚀 Run AI implementation simulation for ${industryName}`,
        `📊 Show me AI success metrics for ${industryName}`,
        `🏗️ Walk me through AI architecture for ${industryName}`,
        `💰 Analyze AI investment costs for ${industryName}`,
        `⚡ Simulate AI deployment process for ${industryName}`
      ];
    };
    
    const simulationQueries = getContextualSimulationQueries();
    
    // If no queries available, return contextual suggestions based on IndustryApplication data
    if (uniqueQueries.length === 0) {
      const industryContext = industries.find(ind => ind.slug === selectedIndustry);
      
      if (industryContext && industryContext.industryApplication && industryContext.industryApplication.length > 0) {
        // Create lead-capturing suggestions based on actual IndustryApplication data
        const applications = industryContext.industryApplication.slice(0, 2);
        const appQueries = applications.map(app => `Tell me about ${app.applicationTitle}`);
        
        // Mix application queries with contextual simulation queries
        return [...appQueries, ...simulationQueries.slice(0, 2)];
      }
      
      // If no IndustryApplication data either, return contextual but lead-focused prompts
      if (industryContext) {
        return [
          `What AI solutions work best for ${industryContext.name.toLowerCase()}?`,
          simulationQueries[0], // Use the contextual simulation query
          `How can JEDI help transform ${industryContext.name.toLowerCase()} operations?`
        ];
      }
      
      // Final fallback - still lead-focused with simulation options
      return [
        "What industries does JEDI serve?",
        "🚀 Run AI implementation simulation",
        "How can JEDI's AI platform help my business?"
      ];
    }

    // Mix regular queries with contextual simulation queries for more interactive options
    const mixedQueries = [...uniqueQueries.slice(0, 2), ...simulationQueries.slice(0, 2)];
    return mixedQueries.slice(0, 4);
  };

  // Initialize welcome message when component mounts or industry changes
  useEffect(() => {
    // Reset messages and show welcome when industry changes
    setMessages([getWelcomeMessage()]);
    setShowWelcome(false);
  }, [selectedIndustry, industries, useCases]);

  const handleSubmit = async (e, query) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    setShowWelcome(false);
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      // Call the parent's query handler
      const response = await onQuerySubmit(query, selectedIndustry);
      
      // Add co-pilot response
      const copilotMessage = {
        id: Date.now() + 1,
        type: 'copilot',
        content: response.summary || "I've analyzed your query and found relevant solutions.",
        timestamp: new Date(),
        responseData: response,
        hasInteractiveContent: true
      };

      setMessages(prev => [...prev, copilotMessage]);
    } catch (error) {
      console.error('Error processing query:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'copilot',
        content: "I apologize, but I encountered an issue processing your request. Please try again.",
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = (query, context = {}) => {
    // Check if this is a lead capture trigger
    if (query.startsWith('LEAD_CAPTURE:')) {
      const captureType = query.replace('LEAD_CAPTURE:', '');
      setLeadContext({
        ...context,
        captureType,
        conversationHistory: messages.slice(-3), // Last 3 messages for context
        timestamp: new Date().toISOString()
      });
      setShowLeadModal(true);
      return;
    }

    // Handle regular queries
    setCurrentInput(query);
    handleSubmit(null, query);
  };

  const handleLeadSubmit = async (formData) => {
    try {
      // Add conversation context to form data
      const enrichedFormData = {
        ...formData,
        conversationContext: leadContext.conversationHistory?.map(msg => {
          const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
          return `${msg.type}: ${content.substring(0, 200)}...`;
        }).join('\n'),
        discussedSolutions: leadContext.solutions || [],
        leadSource: 'AI Co-Pilot Chat',
        captureType: leadContext.captureType
      };

      // Submit the lead
      await contactFormService.submitLead(enrichedFormData);
      
      // Add a confirmation message to the chat
      const confirmationMessage = {
        id: Date.now(),
        type: 'ai',
        content: `Thank you for your interest! I've forwarded your inquiry to our team. You should receive a response within ${getResponseTime(formData.urgency)} based on your urgency level. Is there anything else I can help you with while you wait?`,
        timestamp: new Date(),
        isConfirmation: true
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      setShowLeadModal(false);
      setLeadContext({});
      
      // Scroll to bottom to show confirmation
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error submitting lead:', error);
      throw error; // Let the modal handle the error display
    }
  };

  const getResponseTime = (urgency) => {
    const responseTimes = {
      'critical': '2-4 hours',
      'high': '4-8 hours',
      'medium': '24 hours',
      'low': '48 hours'
    };
    return responseTimes[urgency] || '24 hours';
  };

  return (
    <div className="flex flex-col h-full max-h-[500px] sm:max-h-[600px] lg:max-h-[700px] bg-transparent">
      {/* Enhanced Chat Header */}
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm">
        <motion.div 
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={logo} alt="JEDI AI Co-Pilot" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 brightness-0 invert" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <motion.h3 
            className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white truncate"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            JEDI AI Co-Pilot
          </motion.h3>
          <motion.p 
            className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 font-medium truncate"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {selectedIndustry === 'all' ? 'All Industries' : 
             industries.find(ind => ind.slug === selectedIndustry)?.name || 'Industry Focus'}
          </motion.p>
        </div>
        <motion.div 
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">Online</span>
        </motion.div>
      </div>

      {/* Enhanced Welcome Message */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="m-3 sm:m-4 lg:m-6 p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl sm:rounded-2xl border border-purple-200/50 dark:border-purple-700/50 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white text-sm sm:text-base lg:text-lg">🤖</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base lg:text-lg text-purple-900 dark:text-purple-200 mb-2">
                  Welcome to JEDI Labs AI Co-Pilot
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-purple-700 dark:text-purple-300 leading-relaxed">
                  {typeof getWelcomeMessage().content === 'string' ? getWelcomeMessage().content : JSON.stringify(getWelcomeMessage().content)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-900/30">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {message.type === 'user' ? (
                <UserMessage message={message} />
              ) : (
                <CoPilotMessage 
                  message={message} 
                  onSuggestedQuery={handleSuggestedQuery}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced Loading Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <img src={logo} alt="JEDI AI" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 brightness-0 invert" />
              </div>
              <div className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex space-x-1">
                    <motion.div 
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-purple-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-purple-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-purple-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium">
                    Analyzing your query...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <motion.div 
        className="p-3 sm:p-4 lg:p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex gap-2 sm:gap-3 lg:gap-4">
          <div className="flex-1 relative">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e, currentInput);
                }
              }}
              placeholder="Ask me about AI solutions, use cases, or implementation details..."
              className={`w-full resize-none rounded-xl sm:rounded-2xl border transition-all duration-300 p-3 sm:p-4 text-sm sm:text-base backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-gray-800/90 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-purple-500 focus:bg-gray-800'
                  : 'bg-white/90 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:bg-white'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              rows="2"
              disabled={isLoading}
            />
            {currentInput.trim() && (
              <motion.div
                className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
              </motion.div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={isLoading || !currentInput.trim()}
              onClick={(e) => handleSubmit(e, currentInput)}
              className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium h-full min-w-[80px] sm:min-w-[100px] lg:min-w-[120px] shadow-lg ${
                isLoading || !currentInput.trim() 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-xl transition-shadow duration-300'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <motion.div
                    className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="hidden sm:inline">Sending...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span>🚀</span>
                  <span className="hidden sm:inline">Send</span>
                </div>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        context={leadContext}
        onSubmit={handleLeadSubmit}
      />
    </div>
  );
};

export default ChatInterface; 