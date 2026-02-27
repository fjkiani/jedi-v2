import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/Modal';
import { useTheme } from '@/context/ThemeContext';
import { jobApplicationService } from '@/services/jobApplicationService';

const JobApplicationForm = ({ job, onClose, onSuccess }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resumeUrl: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = 'Name is required';
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Please enter a valid email';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await jobApplicationService.submitApplication({
        ...formData,
        jobTitle: job?.title,
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setErrors({ submit: 'Failed to submit. Please try again or email careers@jedilabs.org.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
        Apply: {job?.title || 'Position'}
      </h2>
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`text-center py-8 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}
          >
            <p className="text-lg mb-2">Application submitted successfully.</p>
            <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              We'll review your application and be in touch soon.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-n-2' : 'text-n-7'
                }`}
              >
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name ? 'border-red-500' : isDarkMode ? 'border-n-6 bg-n-7' : 'border-n-3 bg-n-1'
                } ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}
                placeholder="Your name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-n-2' : 'text-n-7'
                }`}
              >
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email ? 'border-red-500' : isDarkMode ? 'border-n-6 bg-n-7' : 'border-n-3 bg-n-1'
                } ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-n-2' : 'text-n-7'
                }`}
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode ? 'border-n-6 bg-n-7' : 'border-n-3 bg-n-1'
                } ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-n-2' : 'text-n-7'
                }`}
              >
                Resume / LinkedIn URL
              </label>
              <input
                type="url"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode ? 'border-n-6 bg-n-7' : 'border-n-3 bg-n-1'
                } ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}
                placeholder="https://linkedin.com/in/... or resume link"
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-n-2' : 'text-n-7'
                }`}
              >
                Cover letter / Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode ? 'border-n-6 bg-n-7' : 'border-n-3 bg-n-1'
                } ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}
                placeholder="Brief introduction and why you're interested..."
              />
            </div>
            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn px-6 py-2 rounded-lg bg-primary-1 text-n-8 font-medium hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Submit application'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className={`px-6 py-2 rounded-lg border font-medium ${
                  isDarkMode
                    ? 'border-n-6 text-n-2 hover:border-n-5'
                    : 'border-n-3 text-n-7 hover:border-n-5'
                }`}
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default JobApplicationForm;
