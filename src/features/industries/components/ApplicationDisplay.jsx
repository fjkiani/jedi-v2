import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { RichText } from '@graphcms/rich-text-react-renderer';
import logo from '@/assets/logo/logo.png';

// Helper function to render list items safely
const renderList = (items, iconName = 'check-circle', itemClassName = '', iconClassName = 'text-green-500') => {
  const { isDarkMode } = useTheme();
  if (!items || !Array.isArray(items) || items.length === 0) {
    return <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Not available.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'} ${itemClassName}`}>
          <Icon name={iconName} className={`w-4 h-4 ${iconClassName} mt-0.5 flex-shrink-0`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

// Define JediComponentPill component for better interactive display
const JediComponentPill = ({ component, isActive, onClick, isDarkMode }) => {
  return (
    <motion.div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer
        ${isActive 
          ? isDarkMode 
            ? 'bg-primary-1/20 border-primary-1 text-primary-1' 
            : 'bg-primary-1/10 border-primary-1 text-primary-1' 
          : isDarkMode 
            ? 'bg-n-6 border-n-5 text-n-2 hover:border-n-4' 
            : 'bg-n-2 border-n-3 text-n-6 hover:border-n-4'
        } transition-all duration-300`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {component.icon?.url ? (
        <img src={component.icon.url} alt={component.name} className="w-5 h-5 object-contain" />
      ) : (
        <Icon name="cpu" className={`w-5 h-5 ${isActive ? 'text-primary-1' : isDarkMode ? 'text-n-3' : 'text-n-5'}`} />
      )}
      <span className={`font-medium ${isActive ? 'text-primary-1' : ''}`}>{component.name}</span>
    </motion.div>
  );
};

// ContentBlock for Challenge and Approach sections
const ContentBlock = ({ title, icon, iconColor, content, isDarkMode }) => {
  const [expandedSections, setExpandedSections] = useState([]);
  
  // Process rich text content into structured sections
  const processContent = (contentRaw) => {
    if (!contentRaw?.raw?.children) return [];
    
    const sections = [];
    let currentSection = { type: 'text', content: [] };
    
    contentRaw.raw.children.forEach(child => {
      if (child.type === 'paragraph' && child.children.some(c => c.text?.trim())) {
        if (currentSection.content.length > 0) {
          sections.push({ ...currentSection });
          currentSection = { type: 'text', content: [] };
        }
        currentSection.content.push(child);
      } else if (child.type === 'bulleted-list') {
        if (currentSection.content.length > 0) {
          sections.push({ ...currentSection });
        }
        sections.push({
          type: 'list',
          content: child.children.map(item => item.children[0].text)
        });
        currentSection = { type: 'text', content: [] };
      }
    });
    
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  const sections = processContent(content);
  
  const toggleSection = (index) => {
    setExpandedSections(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  };

  // Icons for different types of content
  const contentIcons = {
    challenge: ['alert-triangle', 'alert-circle', 'alert-octagon', 'shield-off'],
    approach: ['zap', 'cpu', 'code', 'settings']
  };

  // Get random icon from the appropriate set
  const getRandomIcon = (type) => {
    const icons = type === 'Challenge' ? contentIcons.challenge : contentIcons.approach;
    return icons[Math.floor(Math.random() * icons.length)];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl border ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-2 border-n-3'}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`w-12 h-12 rounded-xl bg-${iconColor}/10 flex items-center justify-center flex-shrink-0 relative overflow-hidden`}
        >
          {title.includes('Jedi Approach') ? (
            <motion.img 
              src={logo} 
              alt="Jedi Logo" 
              className="w-8 h-8 object-contain"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <Icon name={icon} className={`w-6 h-6 text-${iconColor}`} />
          )}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.div>
        <motion.h4 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`h5 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}
        >
          {title}
        </motion.h4>
      </div>
      
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-lg ${
              section.type === 'list' ? 
                `${isDarkMode ? 'bg-n-7/50 backdrop-blur' : 'bg-n-1/80'} p-4 border ${isDarkMode ? 'border-n-6' : 'border-n-3'}` : 
                ''
            }`}
          >
            {section.type === 'text' ? (
              <motion.div 
                className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert text-n-3' : 'text-n-5'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <RichText 
                  content={{ 
                    type: 'root', 
                    children: section.content 
                  }} 
                />
              </motion.div>
            ) : (
              <div className="space-y-3">
                <motion.button
                  onClick={() => toggleSection(index)}
                  className={`w-full flex items-center justify-between text-left font-medium p-2 rounded-lg
                    ${isDarkMode ? 
                      'bg-n-6 text-n-2 hover:bg-n-5' : 
                      'bg-n-2 text-n-7 hover:bg-n-3'
                    } transition-colors`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-sm flex items-center gap-2">
                    <Icon 
                      name={expandedSections.includes(index) ? 'chevron-up' : 'chevron-down'} 
                      className={`w-4 h-4 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`} 
                    />
                    Key Points ({section.content.length})
                  </span>
                </motion.button>
                <AnimatePresence>
                  {expandedSections.includes(index) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid gap-3 pt-2">
                        {section.content.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.1 }}
                            className={`flex items-start gap-3 p-2 rounded-lg ${
                              isDarkMode ? 
                                'bg-n-8/50 text-n-3 hover:bg-n-7' : 
                                'bg-white text-n-5 hover:bg-n-2'
                            } transition-colors`}
                          >
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              className="flex-shrink-0"
                            >
                              <Icon 
                                name={getRandomIcon(title)} 
                                className={`w-5 h-5 ${
                                  title.includes('Challenge') ? 'text-red-500' : 'text-blue-500'
                                }`} 
                              />
                            </motion.div>
                            <span className="text-sm">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Renamed props from 'useCase' to 'application'
const ApplicationSidebar = ({ application, activeComponentId, setActiveComponentId }) => {
  const { isDarkMode } = useTheme();

  if (!application) {
    return (
      <div className={`sticky top-20 space-y-6 p-6 ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} rounded-lg border`}>
        <p className={isDarkMode ? 'text-n-4' : 'text-n-5'}>Loading sidebar data...</p>
      </div>
    );
  }

  // Destructure technology along with others
  const { keyCapabilities = [], expectedResults = [], jediComponent = [], technology = [] } = application;

  console.log('[ApplicationSidebar] Received application data:', {
      keyCapabilities,
      expectedResults,
      jediComponent,
      technology
  });

  return (
    <div className={`sticky top-20 space-y-8 p-6 ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} rounded-2xl border shadow-lg`}>
      {/* Jedi Components Used Section - Interactive Pills */}
      {jediComponent && jediComponent.length > 0 && (
        <div>
          <h3 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Jedi Components</h3>
          <div className="flex flex-col gap-2">
            {jediComponent.map((comp) => (
              <JediComponentPill
                key={comp.id}
                component={comp}
                isActive={activeComponentId === comp.id}
                onClick={() => setActiveComponentId(activeComponentId === comp.id ? null : comp.id)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      )}

      {/* Key Capabilities Section */}
      <div>
        <h3 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Key Capabilities</h3>
        {renderList(keyCapabilities, 'check-square', '', 'text-primary-1')}
      </div>

      {/* Expected Results Section */}
      <div>
        <h3 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Expected Results</h3>
        {renderList(expectedResults, 'award', '', 'text-yellow-500')}
      </div>

      {/* --- Technologies Used Section (Modified Styling) --- */}
      {technology && technology.length > 0 && (
        <div>
          <h3 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Technologies Used</h3>
          <div className="flex flex-wrap gap-3">
            {technology.map((tech) => (
              <Link
                key={tech.id}
                to={`/technology/${tech.slug}`}
                className="flex items-center gap-2 px-3 py-1 bg-n-6 rounded-full border border-n-5 text-n-2 hover:border-primary-1 transition-colors"
                title={tech.name}
              >
                {tech.icon?.url ? (
                  <img src={tech.icon.url} alt={tech.name} className="w-5 h-5 object-contain" />
                ) : (
                  <Icon name="code" className="w-4 h-4 text-n-3" />
                )}
                <span className="text-xs font-medium truncate max-w-[100px]">{tech.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* --- END Modified Section --- */}
    </div>
  );
};

// Main Content Component with Tabs
const MainContent = ({ application, activeComponentId }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    industryChallenge, 
    jediApproach,
    keyCapabilities = [], 
    expectedResults = [], 
    jediComponent = [] 
  } = application;

  // Get the currently active component if any
  const activeComponent = jediComponent.find(comp => comp.id === activeComponentId);

  // Component descriptions mapping (simulated - in a real app, this would come from Hygraph)
  const componentDescriptions = {
    'JEDI Ensemble™': 'Analyzes real-time student interaction data (quiz performance, content engagement, query patterns, feedback) to build a dynamic profile of each learner\'s strengths, weaknesses, and preferred learning modalities.',
    'JEDI Rules™': 'Empowers agents to orchestrate an adaptive A-Z learning path: Identifying knowledge gaps, levels, and providing targeted feedback or intervention prompts.',
    'JEDI AutoTune™': 'Ensures learner profiles are constantly refined and updated based on changing performance and interactions.'
  };
  
  // Function to get component description
  const getComponentDescription = (name) => {
    return componentDescriptions[name] || 
      'An advanced AI component of the JEDI platform designed to enhance solution capabilities and performance.';
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className={`flex border-b ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'overview'
              ? `border-primary-1 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`
              : `border-transparent ${isDarkMode ? 'text-n-3 hover:text-n-1' : 'text-n-5 hover:text-n-7'}`
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'components'
              ? `border-primary-1 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`
              : `border-transparent ${isDarkMode ? 'text-n-3 hover:text-n-1' : 'text-n-5 hover:text-n-7'}`
          }`}
        >
          Jedi Technology
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Challenge Section */}
            <ContentBlock 
              title="The Challenge" 
              icon="alert-triangle" 
              iconColor="red-500" 
              content={industryChallenge}
              isDarkMode={isDarkMode}
            />

            {/* Approach Section */}
            <ContentBlock 
              title="The Jedi Approach" 
              icon="zap" 
              iconColor="blue-500" 
              content={jediApproach}
              isDarkMode={isDarkMode}
            />
            
            {/* Active Component Highlight (if selected from sidebar) */}
            {activeComponent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-xl border ${
                  isDarkMode ? 'bg-primary-1/10 border-primary-1/30' : 'bg-primary-1/5 border-primary-1/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {activeComponent.icon?.url ? (
                    <img 
                      src={activeComponent.icon.url} 
                      alt={activeComponent.name} 
                      className="w-6 h-6 object-contain" 
                    />
                  ) : (
                    <Icon name="cpu" className="w-6 h-6 text-primary-1" />
                  )}
                  <h4 className="font-semibold text-primary-1">{activeComponent.name}</h4>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-n-2' : 'text-n-6'}`}>
                  {getComponentDescription(activeComponent.name)}
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="components"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {jediComponent.length > 0 ? (
              <div className="grid gap-6">
                {jediComponent.map((component) => (
                  <motion.div
                    key={component.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-xl border ${
                      activeComponentId === component.id
                        ? isDarkMode ? 'bg-primary-1/10 border-primary-1' : 'bg-primary-1/5 border-primary-1'
                        : isDarkMode ? 'bg-n-7 border-n-6 hover:border-n-5' : 'bg-n-1 border-n-3 hover:border-n-4'
                    } transition-colors`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {component.icon?.url ? (
                        <img 
                          src={component.icon.url} 
                          alt={component.name}
                          className="w-8 h-8 object-contain rounded-md p-1 bg-primary-1/10" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-primary-1/10 flex items-center justify-center">
                          <Icon name="cpu" className="w-5 h-5 text-primary-1" />
                        </div>
                      )}
                      <h3 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                        {component.name}
                      </h3>
                    </div>
                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                      {getComponentDescription(component.name)}
                    </p>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-n-8' : 'bg-n-2'}`}>
                      <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                        Used in this solution to:
                      </h4>
                      <ul className="space-y-2">
                        {keyCapabilities
                          .filter(cap => cap.toLowerCase().includes(component.name.replace('™', '').toLowerCase()))
                          .map((capability, idx) => (
                            <li 
                              key={idx} 
                              className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}
                            >
                              <Icon name="check-circle" className="w-4 h-4 text-primary-1 mt-0.5 flex-shrink-0" />
                              <span>{capability}</span>
                            </li>
                          ))}
                        {expectedResults
                          .filter(result => result.toLowerCase().includes(component.name.replace('™', '').toLowerCase()))
                          .map((result, idx) => (
                            <li 
                              key={idx} 
                              className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}
                            >
                              <Icon name="trending-up" className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{result}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    {component.slug && (
                      <Link
                        to={`/technology/${component.slug}`}
                        className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${
                          isDarkMode ? 'text-primary-1 hover:text-primary-1/80' : 'text-primary-1 hover:text-primary-1/80'
                        } transition-colors`}
                      >
                        Learn more about {component.name}
                        <Icon name="arrow-right" className="w-4 h-4" />
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
                <p className={`text-center ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                  No Jedi components specified for this solution.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ApplicationDisplay = ({ application }) => {
  const { isDarkMode } = useTheme();
  const [activeComponentId, setActiveComponentId] = useState(null);

  if (!application) {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} border shadow-md`}>
        <p className={isDarkMode ? 'text-n-4' : 'text-n-5'}>Loading application details...</p>
      </div>
    );
  }

  const { applicationTitle, tagline } = application;

  console.log('[ApplicationDisplay] Received data:', application);

  return (
    <motion.div
      className={`rounded-xl ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} border shadow-md overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className={`p-6 md:p-8 border-b ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}>
        <h3 className={`h3 mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{applicationTitle}</h3>
        {tagline && <p className="text-lg text-color-1 font-semibold">{tagline}</p>}
      </div>

      {/* Responsive Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8">
        {/* Main Content Column (Challenge & Approach) */}
        <div className="md:col-span-2">
          <MainContent 
            application={application} 
            activeComponentId={activeComponentId} 
          />
        </div>

        {/* Sidebar Column */}
        <div className="md:col-span-1">
          <ApplicationSidebar 
            application={application} 
            activeComponentId={activeComponentId}
            setActiveComponentId={setActiveComponentId}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationDisplay;
