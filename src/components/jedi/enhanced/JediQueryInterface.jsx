import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  FiMessageSquare, FiZap, FiSearch, FiStar, 
  FiTrendingUp, FiUsers, FiSettings, FiPlay 
} from 'react-icons/fi';

const JediQueryInterface = ({ 
  queries = [],
  categories = [],
  onQuerySelect = () => {},
  variant = 'default',
  showCategories = true,
  className = ""
}) => {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getIcon = (type) => {
    const iconMap = {
      analysis: FiSearch,
      implementation: FiSettings,
      capabilities: FiZap,
      success: FiTrendingUp,
      clients: FiUsers,
      general: FiMessageSquare,
      inspiration: FiStar,
      default: FiMessageSquare
    };
    return iconMap[type] || iconMap.default;
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          container: 'space-y-2',
          query: 'p-3 rounded-lg text-sm',
          category: 'px-3 py-1 text-xs'
        };
      case 'detailed':
        return {
          container: 'space-y-4',
          query: 'p-6 rounded-xl text-base',
          category: 'px-4 py-2 text-sm'
        };
      case 'grid':
        return {
          container: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
          query: 'p-4 rounded-lg text-sm',
          category: 'px-3 py-1 text-xs'
        };
      default:
        return {
          container: 'space-y-3',
          query: 'p-4 rounded-lg text-sm',
          category: 'px-3 py-1.5 text-xs'
        };
    }
  };

  const styles = getVariantStyles();

  const filteredQueries = queries.filter(query => {
    const matchesCategory = selectedCategory === 'all' || query.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      query.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryQueries = (category) => {
    return queries.filter(query => query.category === category);
  };

  if (variant === 'grid') {
    return (
      <div className={`w-full ${className}`}>
        {/* Search and Categories */}
        <div className="mb-6 space-y-4">
          {searchTerm !== '' && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-2 pl-10 rounded-lg border ${
                  isDarkMode
                    ? 'bg-n-7 border-n-6 text-n-1 placeholder-n-4'
                    : 'bg-n-1 border-n-3 text-n-8 placeholder-n-5'
                }`}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
            </div>
          )}

          {showCategories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-1 text-white'
                    : isDarkMode
                    ? 'bg-n-6 text-n-2 hover:bg-n-5'
                    : 'bg-n-2 text-n-7 hover:bg-n-3'
                }`}
              >
                All ({queries.length})
              </button>
              {categories.map((category, index) => {
                const count = getCategoryQueries(category.key).length;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === category.key
                        ? 'bg-primary-1 text-white'
                        : isDarkMode
                        ? 'bg-n-6 text-n-2 hover:bg-n-5'
                        : 'bg-n-2 text-n-7 hover:bg-n-3'
                    }`}
                  >
                    {category.name} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Query Grid */}
        <div className={styles.container}>
          {filteredQueries.map((query, index) => (
            <motion.button
              key={index}
              onClick={() => onQuerySelect(query)}
              className={`${styles.query} text-left transition-all hover:scale-105 ${
                isDarkMode
                  ? 'bg-n-7 border border-n-6 hover:border-primary-1/50 hover:bg-n-6'
                  : 'bg-n-1 border border-n-3 hover:border-primary-1/50 hover:bg-n-2'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-n-6' : 'bg-n-2'
                }`}>
                  {React.createElement(getIcon(query.type), { 
                    className: `w-4 h-4 text-primary-1` 
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    {query.text}
                  </h4>
                  {query.description && (
                    <p className={`text-xs ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                      {query.description}
                    </p>
                  )}
                  {query.category && (
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                      isDarkMode ? 'bg-n-6 text-n-3' : 'bg-n-2 text-n-6'
                    }`}>
                      {query.category}
                    </span>
                  )}
                </div>
                <FiPlay className={`w-4 h-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`} />
              </div>
            </motion.button>
          ))}
        </div>

        {filteredQueries.length === 0 && (
          <div className={`text-center py-8 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No queries found matching your criteria.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-lg ${
          isDarkMode ? 'bg-n-6' : 'bg-n-2'
        }`}>
          <FiMessageSquare className="w-6 h-6 text-primary-1" />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            Explore with AI
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
            Ask our AI co-pilot about JEDI capabilities and get personalized insights
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search queries or ask your own question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full px-4 py-3 pl-12 rounded-lg border transition-colors ${
            isDarkMode
              ? 'bg-n-7 border-n-6 text-n-1 placeholder-n-4 focus:border-primary-1'
              : 'bg-n-1 border-n-3 text-n-8 placeholder-n-5 focus:border-primary-1'
          }`}
        />
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-n-4" />
      </div>

      {/* Categories */}
      {showCategories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-1 text-white'
                : isDarkMode
                ? 'bg-n-6 text-n-2 hover:bg-n-5'
                : 'bg-n-2 text-n-7 hover:bg-n-3'
            }`}
          >
            All ({queries.length})
          </button>
          {categories.map((category, index) => {
            const count = getCategoryQueries(category.key).length;
            return (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-primary-1 text-white'
                    : isDarkMode
                    ? 'bg-n-6 text-n-2 hover:bg-n-5'
                    : 'bg-n-2 text-n-7 hover:bg-n-3'
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Query List */}
      <div className={styles.container}>
        <AnimatePresence>
          {filteredQueries.map((query, index) => (
            <motion.button
              key={index}
              onClick={() => onQuerySelect(query)}
              className={`w-full ${styles.query} text-left transition-all hover:scale-105 ${
                isDarkMode
                  ? 'bg-n-7 border border-n-6 hover:border-primary-1/50 hover:bg-n-6'
                  : 'bg-n-1 border border-n-3 hover:border-primary-1/50 hover:bg-n-2'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-n-6' : 'bg-n-2'
                }`}>
                  {React.createElement(getIcon(query.type), { 
                    className: `w-5 h-5 text-primary-1` 
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    {query.text}
                  </h4>
                  {query.description && (
                    <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                      {query.description}
                    </p>
                  )}
                </div>
                <FiPlay className={`w-5 h-5 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`} />
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {filteredQueries.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}
        >
          <FiSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-semibold mb-2">No queries found</h4>
          <p>Try adjusting your search terms or category filters.</p>
        </motion.div>
      )}
    </div>
  );
};

export default JediQueryInterface;
