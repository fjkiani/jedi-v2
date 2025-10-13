import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { useTheme } from '@/context/ThemeContext';
import { FiMessageSquare, FiZap, FiCheckCircle } from 'react-icons/fi';
import CoPilotCore from '@/components/copilot/CoPilotCore';

const JediTabbedInterface = ({ 
  children, 
  tabs = [], 
  defaultTab = 0,
  showCoPilot = true,
  suggestedQueries = [],
  onQuerySelect = () => {},
  className = ""
}) => {
  const { isDarkMode } = useTheme();
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showCoPilotPanel, setShowCoPilotPanel] = useState(false);

  const handleQuerySelect = (query) => {
    setSelectedQuery(query);
    setShowCoPilotPanel(true);
    onQuerySelect(query);
  };

  const handleCoPilotComplete = (analysisType) => {
    console.log('Co-pilot analysis complete:', analysisType);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Suggested Queries Section */}
      {showCoPilot && suggestedQueries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className={`p-6 rounded-xl border ${
            isDarkMode 
              ? 'bg-gradient-to-br from-n-7 to-n-8 border-n-6' 
              : 'bg-gradient-to-br from-n-1 to-n-2 border-n-3'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <FiMessageSquare className="text-primary-1 text-xl" />
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Explore with AI
              </h3>
            </div>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
              Ask our AI co-pilot about JEDI capabilities, implementations, or get personalized recommendations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {suggestedQueries.map((query, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuerySelect(query)}
                  className={`p-4 rounded-lg border text-left transition-all hover:scale-105 ${
                    isDarkMode
                      ? 'bg-n-6 border-n-5 hover:border-primary-1 hover:bg-n-5'
                      : 'bg-n-1 border-n-3 hover:border-primary-1 hover:bg-n-2'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiZap className="text-primary-1 text-sm" />
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                      AI Analysis
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    {query}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabbed Interface */}
      <Tab.Group defaultIndex={defaultTab}>
        <Tab.List className={`flex space-x-1 rounded-xl p-1 ${
          isDarkMode ? 'bg-n-6' : 'bg-n-2'
        }`}>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                `w-full rounded-lg py-3 px-4 text-sm font-medium transition-all ${
                  selected
                    ? 'bg-primary-1 text-white shadow-lg'
                    : isDarkMode
                    ? 'text-n-3 hover:text-n-1 hover:bg-n-5'
                    : 'text-n-6 hover:text-n-8 hover:bg-n-3'
                }`
              }
            >
              <div className="flex items-center justify-center gap-2">
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.name}
              </div>
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          <AnimatePresence mode="wait">
            {tabs.map((tab, index) => (
              <Tab.Panel key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab.content}
                </motion.div>
              </Tab.Panel>
            ))}
          </AnimatePresence>
        </Tab.Panels>
      </Tab.Group>

      {/* Co-pilot Panel */}
      {showCoPilotPanel && selectedQuery && (
        <CoPilotCore
          useCaseData={{
            title: "JEDI AI Components",
            description: "Comprehensive AI solution platform",
            capabilities: ["Multi-model orchestration", "Business automation", "Performance optimization"],
            industry: { name: "Technology" }
          }}
          selectedQuery={selectedQuery}
          onAnalysisComplete={handleCoPilotComplete}
          onSuggestedQuery={handleQuerySelect}
          onClose={() => setShowCoPilotPanel(false)}
        />
      )}
    </div>
  );
};

export default JediTabbedInterface;
