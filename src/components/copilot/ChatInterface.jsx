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
    
    // If no queries available, return contextual suggestions based on IndustryApplication data
    if (uniqueQueries.length === 0) {
      const industryContext = industries.find(ind => ind.slug === selectedIndustry);
      
      if (industryContext && industryContext.industryApplication && industryContext.industryApplication.length > 0) {
        // Create lead-capturing suggestions based on actual IndustryApplication data
        const applications = industryContext.industryApplication.slice(0, 3);
        return applications.map(app => `Tell me about ${app.applicationTitle}`);
      }
      
      // If no IndustryApplication data either, return contextual but lead-focused prompts
      if (industryContext) {
        return [
          `What AI solutions work best for ${industryContext.name.toLowerCase()}?`,
          `Show me successful implementations in ${industryContext.name.toLowerCase()}`,
          `How can JEDI help transform ${industryContext.name.toLowerCase()} operations?`
        ];
      }
      
      // Final fallback - still lead-focused
      return [
        "What industries does JEDI serve?",
        "Show me your most successful AI implementations",
        "How can JEDI's AI platform help my business?"
      ];
    }

    return uniqueQueries;
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
    <div className="flex flex-col h-full max-h-[600px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-med">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 text-med">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <img src={logo} alt="JEDI AI Co-Pilot" className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">JEDI AI Co-Pilot</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedIndustry === 'all' ? 'All Industries' : 
             industries.find(ind => ind.slug === selectedIndustry)?.name || 'Industry Focus'}
          </p>
        </div>
      </div>

      {/* Welcome Message */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 mb-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700 text-xs"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-200">
                  Welcome to JEDI Labs AI Co-Pilot
                </h3>
                <p className="text-lg text-purple-700 dark:text-purple-300">
                  {getWelcomeMessage().content}
                </p>
              </div>
            </div>
            
            {/* Suggested Queries */}
            {/* <div className="space-y-2">
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Try asking about:
              </p>
              <div className="flex flex-wrap gap-2">
                {getSuggestedQueries().map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuery(query)}
                    className="px-3 py-1 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-600 rounded-full text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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

        {/* Loading Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ThinkingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
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
            className={`flex-1 resize-none rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-purple-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
            rows="2"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !currentInput.trim()}
            className={`px-6 ${isLoading || !currentInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </Button>
        </div>
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
    </div>
  );
};

export default ChatInterface; 