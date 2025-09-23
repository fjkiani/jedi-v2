import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';
import JediImplementationCard from './JediImplementationCard';
import { useTheme } from '@/context/ThemeContext';

const InteractiveApplicationsTab = ({ implementations }) => {
  const { isDarkMode } = useTheme();
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImplementation, setSelectedImplementation] = useState(null);

  // Get unique industries from implementations
  const industries = useMemo(() => {
    const uniqueIndustries = [...new Set(implementations.map(impl => impl.industry))];
    return ['all', ...uniqueIndustries];
  }, [implementations]);

  // Filter implementations based on industry and search
  const filteredImplementations = useMemo(() => {
    return implementations.filter(impl => {
      const matchesIndustry = selectedIndustry === 'all' || impl.industry === selectedIndustry;
      const matchesSearch = searchTerm === '' || 
        impl.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        impl.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        impl.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        impl.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesIndustry && matchesSearch;
    });
  }, [implementations, selectedIndustry, searchTerm]);

  const handleImplementationClick = (implementation) => {
    setSelectedImplementation(implementation);
  };

  const closeModal = () => {
    setSelectedImplementation(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className={`h3 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
          Real Industry Applications
        </h2>
        <p className={`body-1 max-w-3xl mx-auto ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
          See how JEDI components have solved real business problems across industries. 
          Click on any case study to see the full implementation details.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        {/* Industry Filter */}
        <div className="flex flex-wrap gap-2">
          {industries.map(industry => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedIndustry === industry
                  ? 'bg-primary-1 text-white shadow-lg'
                  : isDarkMode 
                    ? 'bg-n-7 text-n-3 hover:bg-n-6' 
                    : 'bg-n-2 text-n-5 hover:bg-n-3'
              }`}
            >
              {industry === 'all' ? 'All Industries' : industry}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Icon 
            name="search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-n-5" 
          />
          <input
            type="text"
            placeholder="Search by client, industry, or technology..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'bg-n-8 border-n-6 text-n-1 placeholder-n-4' 
                : 'bg-n-1 border-n-3 text-n-8 placeholder-n-5'
            }`}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-6'}`}>
        Showing {filteredImplementations.length} of {implementations.length} applications
        {selectedIndustry !== 'all' && ` in ${selectedIndustry}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Implementation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredImplementations.map((implementation, index) => (
            <motion.div
              key={implementation.id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full cursor-pointer"
              onClick={() => handleImplementationClick(implementation)}
            >
              <JediImplementationCard
                implementation={implementation}
                variant="interactive"
                className="h-full hover:shadow-xl transition-shadow duration-300"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredImplementations.length === 0 && (
        <div className={`text-center py-12 ${isDarkMode ? 'text-n-4' : 'text-n-6'}`}>
          <Icon name="search" className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No applications found</p>
          <p>Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedImplementation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 ${
                isDarkMode ? 'bg-n-8 border border-n-6' : 'bg-n-1 border border-n-3'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className={`h3 mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    {selectedImplementation.client}
                  </h3>
                  <p className={`text-lg ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                    {selectedImplementation.industry}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-n-7' : 'hover:bg-n-2'
                  }`}
                >
                  <Icon name="x" className="w-6 h-6" />
                </button>
              </div>

              {/* Problem & Solution */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>The Problem</h4>
                  <p className={`${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                    {selectedImplementation.problem}
                  </p>
                </div>
                <div>
                  <h4 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Our Solution</h4>
                  <p className={`${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                    {selectedImplementation.solution}
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="mb-8">
                <h4 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Results Achieved</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(selectedImplementation.results || {}).map(([key, value]) => (
                    <div key={key} className={`p-4 rounded-lg text-center ${
                      isDarkMode ? 'bg-n-7' : 'bg-n-2'
                    }`}>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className={`text-lg font-bold text-primary-1 mt-1`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-8">
                <h4 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedImplementation.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode 
                          ? 'bg-primary-1/20 text-primary-1' 
                          : 'bg-primary-1/10 text-primary-1'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Business Impact */}
              {selectedImplementation.businessImpact && (
                <div className="mb-8">
                  <h4 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Business Impact</h4>
                  <p className={`${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                    {selectedImplementation.businessImpact}
                  </p>
                </div>
              )}

              {/* Scalability */}
              {selectedImplementation.scalability && (
                <div className="mb-8">
                  <h4 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Scalability</h4>
                  <p className={`${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                    {selectedImplementation.scalability}
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-n-3 dark:border-n-6">
                <button className="btn-primary flex items-center gap-2">
                  <span>See How This Applies to Your Business</span>
                  <Icon name="arrow-right" className="w-4 h-4" />
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <span>Schedule a Consultation</span>
                  <Icon name="calendar" className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveApplicationsTab;
