import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../Modal';
import Button from '../Button';
import { useTheme } from '@/context/ThemeContext';

const LeadCaptureModal = ({ 
  isOpen, 
  onClose, 
  contextData = {}, // Industry, solution, conversation context
  onSubmit 
}) => {
  const { isDarkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Step 1: Basic Contact
    name: '',
    email: '',
    company: '',
    phone: '',
    
    // Step 2: Project Details
    projectScope: '',
    industry: contextData.industry || '',
    primaryChallenge: '',
    currentSolution: '',
    
    // Step 3: Requirements & Budget
    budgetRange: '',
    timeline: '',
    urgency: 'medium',
    teamSize: '',
    
    // Step 4: Additional Details
    specificRequirements: '',
    expectedOutcomes: '',
    additionalNotes: ''
  });

  const totalSteps = 4;

  // Form validation rules
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.company.trim()) newErrors.company = 'Company is required';
        break;
      

        if (!formData.primaryChallenge.trim()) {
          newErrors.primaryChallenge = 'Please describe your primary challenge';
        }
        break;
      
      case 3:
        if (!formData.budgetRange) newErrors.budgetRange = 'Please select a budget range';
        if (!formData.timeline) newErrors.timeline = 'Please select a timeline';
        if (!formData.urgency) newErrors.urgency = 'Please select urgency level';
        break;
      
      case 4:
        // Step 4 is optional, no required fields
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCurrentStep(1);
      setSubmitSuccess(false);
      setErrors({});
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        projectScope: '',
        industry: contextData.industry || '',
        primaryChallenge: '',
        currentSolution: '',
        budgetRange: '',
        timeline: '',
        urgency: 'medium',
        teamSize: '',
        specificRequirements: '',
        expectedOutcomes: '',
        additionalNotes: ''
      });
      onClose();
    }
  };

  const getStepTitle = (step) => {
    const titles = {
      1: 'Contact Information',
      2: 'Project Details',
      3: 'Requirements & Budget',
      4: 'Additional Details'
    };
    return titles[step];
  };

  const getModalTitle = () => {
    if (submitSuccess) return 'Thank You!';
    
    const typeLabels = {
      consultation: 'Schedule Consultation',
      roi_analysis: 'Request ROI Analysis',
      case_study: 'Download Case Study',
      custom_quote: 'Get Custom Quote',
      general_inquiry: 'Contact Our Team',
      demo_request: 'Request Demo',
      assessment: 'Free Assessment'
    };
    
    return typeLabels[contextData.captureType] || 'Contact Our Team';
  };

  const renderStepContent = () => {
    if (submitSuccess) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Request Submitted Successfully!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Thank you for your interest. Our team will review your request and get back to you within 24 hours.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You can close this window and continue exploring our AI solutions.
          </p>
        </motion.div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                placeholder="Your full name"
              />
              {errors.name && <p className="text-red-500 text-lg mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                placeholder="your.email@company.com"
              />
              {errors.email && <p className="text-red-500 text-lg mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.company 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                placeholder="Your company name"
              />
              {errors.company && <p className="text-red-500 text-lg mt-1">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 dark:border-gray-600 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Industry (Optional)
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 dark:border-gray-600 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
                placeholder="e.g., Healthcare, Finance, Manufacturing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Scope *
              </label>
              <select
                value={formData.projectScope}
                onChange={(e) => handleInputChange('projectScope', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.projectScope 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              >
                <option value="">Select project scope</option>
                <option value="ai-implementation">AI Implementation & Integration</option>
                <option value="process-automation">Process Automation</option>
                <option value="data-analytics">Data Analytics & Insights</option>
                <option value="machine-learning">Machine Learning Solutions</option>
                <option value="digital-transformation">Digital Transformation</option>
                <option value="custom-ai-development">Custom AI Development</option>
                <option value="ai-strategy-consulting">AI Strategy & Consulting</option>
                <option value="proof-of-concept">Proof of Concept / Pilot</option>
                <option value="enterprise-solution">Enterprise-wide Solution</option>
                <option value="other">Other (please specify in additional notes)</option>
              </select>
              {errors.projectScope && <p className="text-red-500 text-lg mt-1">{errors.projectScope}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Primary Challenge *
              </label>
              <select
                value={formData.primaryChallenge}
                onChange={(e) => handleInputChange('primaryChallenge', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.primaryChallenge 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              >
                <option value="">Select primary challenge</option>
                <option value="manual-processes">Too many manual processes</option>
                <option value="data-silos">Data silos and lack of integration</option>
                <option value="scalability-issues">Scalability and growth challenges</option>
                <option value="operational-efficiency">Need to improve operational efficiency</option>
                <option value="customer-experience">Enhance customer experience</option>
                <option value="cost-reduction">Reduce operational costs</option>
                <option value="decision-making">Improve data-driven decision making</option>
                <option value="competitive-advantage">Gain competitive advantage</option>
                <option value="compliance-requirements">Meet compliance requirements</option>
                <option value="legacy-systems">Modernize legacy systems</option>
                <option value="talent-shortage">Skills/talent shortage</option>
                <option value="other">Other (please specify in additional notes)</option>
              </select>
              {errors.primaryChallenge && <p className="text-red-500 text-lg mt-1">{errors.primaryChallenge}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Solution (Optional)
              </label>
              <textarea
                value={formData.currentSolution}
                onChange={(e) => handleInputChange('currentSolution', e.target.value)}
                rows={2}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 dark:border-gray-600 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
                placeholder="What are you currently using? What's not working?"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Budget Range *
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.budgetRange 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              >
                <option value="">Select budget range</option>
                <option value="under-50k">Under $50K</option>
                <option value="50k-100k">$50K - $100K</option>
                <option value="100k-250k">$100K - $250K</option>
                <option value="250k-500k">$250K - $500K</option>
                <option value="500k-1m">$500K - $1M</option>
                <option value="over-1m">Over $1M</option>
                <option value="flexible">Flexible/To be discussed</option>
              </select>
              {errors.budgetRange && <p className="text-red-500 text-lg mt-1">{errors.budgetRange}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timeline *
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.timeline 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              >
                <option value="">Select timeline</option>
                <option value="immediate">Immediate (0-1 month)</option>
                <option value="short">Short-term (1-3 months)</option>
                <option value="medium">Medium-term (3-6 months)</option>
                <option value="long">Long-term (6+ months)</option>
                <option value="planning">Still in planning phase</option>
              </select>
              {errors.timeline && <p className="text-red-500 text-lg mt-1">{errors.timeline}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Urgency Level *
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.urgency 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              >
                <option value="low">Low - Exploring options</option>
                <option value="medium">Medium - Actively evaluating</option>
                <option value="high">High - Need solution soon</option>
                <option value="critical">Critical - Urgent business need</option>
              </select>
              {errors.urgency && <p className="text-red-500 text-lg mt-1">{errors.urgency}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team Size (Optional)
              </label>
              <select
                value={formData.teamSize}
                onChange={(e) => handleInputChange('teamSize', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 dark:border-gray-600 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
              >
                <option value="">Select team size</option>
                <option value="1-10">1-10 people</option>
                <option value="11-50">11-50 people</option>
                <option value="51-200">51-200 people</option>
                <option value="201-1000">201-1,000 people</option>
                <option value="1000+">1,000+ people</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Specific Requirements (Optional)
              </label>
              <textarea
                value={formData.specificRequirements}
                onChange={(e) => handleInputChange('specificRequirements', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 dark:border-gray-600 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
                placeholder="Any specific technical requirements, integrations, or constraints?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Outcomes (Optional)
              </label>
              <textarea
                value={formData.expectedOutcomes}
                onChange={(e) => handleInputChange('expectedOutcomes', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 dark:border-gray-600 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
                placeholder="What success looks like for this project?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 dark:border-gray-600 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
                placeholder="Anything else you'd like us to know?"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      maxWidth="lg"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {getModalTitle()}
          </h2>
          {!submitSuccess && contextData.context && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {contextData.context}
            </p>
          )}
        </div>

        {/* Progress Indicator */}
        {!submitSuccess && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Error Message */}
        {errors.submit && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        {!submitSuccess && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrev}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Success Actions */}
        {submitSuccess && (
          <div className="flex justify-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LeadCaptureModal; 