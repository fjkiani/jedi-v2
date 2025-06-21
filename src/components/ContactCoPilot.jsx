import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Button from './Button';
import LeadCaptureModal from './copilot/LeadCaptureModal';
import { contactFormService } from '../services/contactFormService';
import { logo } from '../assets';

const ContactCoPilot = ({ className = "", variant = "sidebar" }) => {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [leadData, setLeadData] = useState({});
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Smart auto-scroll: only scroll if user is near the bottom
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      const container = messagesContainerRef.current;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      // Only auto-scroll if user is within 100px of the bottom
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      if (isNearBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 'welcome',
      type: 'copilot',
      content: "👋 Hi! I'm your JEDI Labs consultant. What's your biggest business challenge right now?",
      timestamp: new Date(),
      suggestedQueries: [
        "Reduce operational costs",
        "Automate manual processes", 
        "Improve data analysis",
        "Scale operations",
        "Enhance customer experience"
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSubmit = async (e, query) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    setShowWelcome(false);
    setIsExpanded(true);
    
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
      // Process the query and generate response
      const response = await processQuery(query, leadData);
      
      // Add co-pilot response
      const copilotMessage = {
        id: Date.now() + 1,
        type: 'copilot',
        content: response.content,
        timestamp: new Date(),
        actionRequired: response.actionRequired
      };

      setMessages(prev => [...prev, copilotMessage]);
      setLeadData(prev => ({ ...prev, ...response.leadData }));

      // Show lead capture modal after understanding the challenge
      if (response.showLeadCapture) {
        setTimeout(() => {
          setShowLeadModal(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'copilot',
        content: "Let me connect you with our team directly to discuss your specific needs.",
        timestamp: new Date(),
        actionRequired: true
      };

      setMessages(prev => [...prev, errorMessage]);
      // Show lead modal on error too
      setTimeout(() => {
        setShowLeadModal(true);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const processQuery = async (query, currentLeadData) => {
    // Streamlined processing - understand challenge and move to lead capture
    const lowerQuery = query.toLowerCase();
    
    let challenge = '';
    let response = '';
    
    if (lowerQuery.includes('cost') || lowerQuery.includes('expensive') || lowerQuery.includes('budget')) {
      challenge = 'cost_optimization';
      response = "💰 I understand you're looking to reduce operational costs. Our AI solutions typically help companies reduce costs by 40-60% through intelligent automation and optimization. Let me connect you with our team to discuss a custom cost analysis for your specific situation.";
    } else if (lowerQuery.includes('slow') || lowerQuery.includes('manual') || lowerQuery.includes('process')) {
      challenge = 'process_optimization';
      response = "⚡ Manual processes can really hold a business back. We've helped companies automate workflows and achieve 10x efficiency improvements. I'd love to have our team show you exactly how this could work for your processes.";
    } else if (lowerQuery.includes('data') || lowerQuery.includes('analysis') || lowerQuery.includes('insight')) {
      challenge = 'data_intelligence';
      response = "📊 Data analysis challenges are very common. Our AI platform can turn your data into actionable insights with advanced analytics and predictive capabilities. Let me arrange a demo to show you what's possible with your data.";
    } else if (lowerQuery.includes('customer') || lowerQuery.includes('experience') || lowerQuery.includes('service')) {
      challenge = 'customer_experience';
      response = "🎯 Customer experience is crucial for growth. Our AI solutions can personalize customer interactions, reduce response times, and dramatically improve satisfaction scores. I'd like our team to show you some real examples.";
    } else if (lowerQuery.includes('scale') || lowerQuery.includes('growth') || lowerQuery.includes('expand')) {
      challenge = 'scaling_operations';
      response = "🚀 Scaling challenges are exciting opportunities! Our AI infrastructure is designed to grow with you, handling increased volume without proportional cost increases. Let's discuss your specific scaling goals.";
    } else {
      challenge = 'general_transformation';
      response = "🎯 Every business transformation is unique. Based on what you've shared, I believe our JEDI AI platform could provide significant value. Let me connect you with our expert team to explore the possibilities for your specific situation.";
    }

    return {
      content: response,
      leadData: { 
        primaryChallenge: challenge, 
        initialQuery: query,
        conversationSummary: `User inquired about: ${query}`
      },
      showLeadCapture: true,
      actionRequired: true
    };
  };

  const handleLeadSubmit = async (formData) => {
    try {
      const enrichedFormData = {
        ...formData,
        ...leadData,
        conversationContext: messages.slice(-3).map(msg => 
          `${msg.type}: ${typeof msg.content === 'string' ? msg.content.substring(0, 150) : JSON.stringify(msg.content).substring(0, 150)}...`
        ).join('\n'),
        leadSource: 'Contact Co-Pilot',
        leadScore: calculateLeadScore(formData, leadData)
      };

      await contactFormService.submitLead(enrichedFormData);
      
      const confirmationMessage = {
        id: Date.now(),
        type: 'copilot',
        content: `🎉 Perfect! I've connected you with our expert team. Based on your urgency level, you can expect to hear from us within ${getResponseTime(formData.urgency)}. We're excited to help you achieve your goals!`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      setShowLeadModal(false);
    } catch (error) {
      console.error('Error submitting lead:', error);
      throw error;
    }
  };

  const calculateLeadScore = (formData, leadData) => {
    let score = 0;
    
    // Budget scoring
    if (formData.budget === '$100k+') score += 40;
    else if (formData.budget === '$50k-$100k') score += 30;
    else if (formData.budget === '$10k-$50k') score += 20;
    
    // Urgency scoring
    if (formData.urgency === 'critical') score += 30;
    else if (formData.urgency === 'high') score += 20;
    else if (formData.urgency === 'medium') score += 10;
    
    // Company size scoring
    if (formData.teamSize === '500+') score += 20;
    else if (formData.teamSize === '50-500') score += 15;
    else if (formData.teamSize === '10-50') score += 10;
    
    // Challenge alignment scoring
    if (leadData.primaryChallenge) score += 10;
    
    return Math.min(score, 100);
  };

  const getResponseTime = (urgency) => {
    const times = {
      'critical': '2-4 hours',
      'high': '4-8 hours', 
      'medium': '24 hours',
      'low': '48 hours'
    };
    return times[urgency] || '24 hours';
  };

  const handleSuggestedQuery = (query) => {
    setCurrentInput(query);
    handleSubmit(null, query);
  };

  return (
    <div className={`${className}`}>
      <div className="flex flex-col h-[600px] relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
        {/* Unique Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/50 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.05),transparent_50%)]"></div>
        
        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <img src={logo} alt="JEDI Labs Consultant" className="w-8 h-8 brightness-0 invert" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">JEDI AI Co-Pilot</h3>
              <p className="text-base text-gray-500 dark:text-gray-400 font-medium">All Industries</p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={messagesContainerRef}>
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
                    <div className="flex gap-3 mb-6 justify-end">
                      <div className="max-w-[80%]">
                        <div className="rounded-2xl p-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                          <div className="text-base leading-relaxed font-medium">
                            {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 dark:text-gray-300 text-lg">👤</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <img src={logo} alt="JEDI AI" className="w-7 h-7 brightness-0 invert" />
                        </div>
                      </div>
                      <div className="max-w-[80%]">
                        <div className="rounded-2xl p-5 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg">
                          <div className="text-base leading-relaxed text-gray-800 dark:text-gray-200 mb-4 font-medium">
                            {message.id === 'welcome' && (
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🤖</span>
                                <span className="font-semibold text-lg">Hello! I'm your JEDI AI Co-Pilot.</span>
                              </div>
                            )}
                            <div className="text-base leading-relaxed">
                              {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                            </div>
                          </div>
                          
                          {message.suggestedQueries && (
                            <div className="space-y-3">
                              <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                Try asking:
                              </p>
                              <div className="space-y-2">
                                {message.suggestedQueries.map((query, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSuggestedQuery(query)}
                                    className="block w-full text-left px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-200 font-medium"
                                  >
                                    {query}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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
                  className="flex gap-3 mb-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <img src={logo} alt="JEDI AI" className="w-7 h-7 brightness-0 invert" />
                    </div>
                  </div>
                  <div className="rounded-2xl p-5 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-base text-gray-500 dark:text-gray-400 font-medium">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="flex gap-3">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e, currentInput);
                  }
                }}
                placeholder="Tell me about your business challenge..."
                className={`flex-1 resize-none rounded-xl border transition-all duration-200 backdrop-blur-sm p-4 text-base ${
                  isDarkMode
                    ? 'bg-gray-800/80 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-purple-500'
                    : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                rows="2"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !currentInput.trim()}
                onClick={(e) => handleSubmit(e, currentInput)}
                className={`px-8 py-4 text-base font-medium ${isLoading || !currentInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Thinking...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        contextData={leadData}
        onSubmit={handleLeadSubmit}
      />
    </div>
  );
};

export default ContactCoPilot; 