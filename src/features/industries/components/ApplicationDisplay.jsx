import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { RichText } from '@graphcms/rich-text-react-renderer';
import logo from '@/assets/logo/logo.png';
import { TabsRoot, TabsList, TabTrigger, TabPanel } from '@/components/ui/Tabs';
import { FiCheckCircle, FiList, FiCpu, FiTarget, FiAward, FiInfo, FiAlertTriangle, FiZap, FiClock, FiDollarSign, FiXCircle, FiDatabase, FiTrendingUp, FiShield, FiChevronDown, FiChevronUp } from 'react-icons/fi';

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

      {/* --- Technologies Used Section (Modified StyLING) --- */}
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

// --- Local Helper Functions for Rendering Sections ---
// (Replicated from IndustryPage for use within this component)
const renderRichTextSection = (title, content, isDarkMode, TitleIcon = FiInfo) => {
  if (!content?.raw) return null;
  return (
    // Use smaller padding/margins within tabs
    <div className={`p-4 md:p-6 rounded-lg border mb-6 ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'} shadow-sm`}>
      <h4 className={`h5 mb-3 flex items-center ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
        <TitleIcon className="mr-2 text-primary-1/90 w-5 h-5" />
        {title}
      </h4>
      <div className={`prose prose-base max-w-none ${isDarkMode ? 'prose-invert text-n-3' : 'text-n-6'}`}>
        <RichText content={content.raw} />
      </div>
    </div>
  );
};

const renderListSection = (title, items, icon = FiCheckCircle, isDarkMode, TitleIcon = FiList) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
     return (
        <div className={`p-4 md:p-6 rounded-lg border mb-6 ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'} shadow-sm`}>
          <h4 className={`h5 mb-3 flex items-center ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            <TitleIcon className="mr-2 text-primary-1/90 w-5 h-5" />
            {title}
          </h4>
          <p className={`italic text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>No items listed.</p>
        </div>
     );
  }
  return (
    <div className={`p-4 md:p-6 rounded-lg border mb-6 ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'} shadow-sm`}>
      <h4 className={`h5 mb-4 flex items-center ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
        <TitleIcon className="mr-2 text-primary-1/90 w-5 h-5" />
        {title}
      </h4>
      <ul className={`space-y-3`}>
        {items.map((item, index) => (
          <li key={index} className={`flex items-start gap-3 p-2 rounded-md ${isDarkMode ? 'text-n-3 hover:bg-n-7' : 'text-n-6 hover:bg-n-2'} transition-colors`}>
             {React.createElement(icon, { className: `w-5 h-5 text-primary-1 mt-0.5 flex-shrink-0` })}
            <span className="body-2">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
// --- End Helper Functions ---

// --- NEW: More Structured Section Renderers (DYNAMIC VERSION) ---

const ChallengeSection = ({ content, isDarkMode }) => {
  if (!content?.raw?.children) return null;

  // Parse paragraphs and find the first bulleted list
  const paragraphs = content.raw.children.filter(c => c.type === 'paragraph' && c.children.some(t => t.text?.trim()));
  const bulletListNode = content.raw.children.find(c => c.type === 'bulleted-list');
  const derivedHurdles = bulletListNode?.children.map(li => ({
      text: li.children[0]?.children[0]?.text, // Basic text extraction
      icon: FiAlertTriangle // Generic icon
  })).filter(item => item.text) || []; // Filter out any null/empty text

  // Statistic extraction (keep but acknowledge it might not always work)
  let statistic = null;
  const statRegex = /(~\d+% attrition rate)/; // Keep specific regex for now
  paragraphs.forEach(p => {
     const text = p.children.map(t => t.text).join('');
     const match = text.match(statRegex);
     if (match) {
         statistic = match[1];
     }
  });
  
  // REMOVE HARDCODED painPoints array

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className={`p-6 md:p-8 rounded-2xl border mb-8 ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'} shadow-lg`}
    >
      <h4 className={`h4 mb-6 flex items-center gap-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
        <FiAlertTriangle className="text-red-500 w-6 h-6" />
        The Challenge
      </h4>
      
      {/* Render Main Description Paragraphs */}
      <div className={`prose prose-base max-w-none mb-6 ${isDarkMode ? 'prose-invert text-n-3' : 'text-n-6'}`}>
        {paragraphs.map((p, i) => <RichText key={i} content={{ type: 'root', children: [p] }} />)}
      </div>

      {/* Highlight Statistic */}
      {statistic && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.3 }}
            className={`my-6 p-4 rounded-lg border text-center ${isDarkMode ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
              <span className={`block text-2xl font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{statistic}</span>
              <span className={`text-sm ${isDarkMode ? 'text-red-400/80' : 'text-red-600/80'}`}>Attrition rate for drug candidates</span>
          </motion.div>
      )}

      {/* Render DERIVED Hurdles */}
      {derivedHurdles.length > 0 && (
          <div>
              <h5 className={`h6 mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>Key Hurdles Identified:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {derivedHurdles.map((hurdle, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-2 border-n-3'}`}
                      >
                          {/* Use the hurdle's assigned icon */}
                          <hurdle.icon className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-red-400/90' : 'text-red-500/90'}`} /> 
                          <span className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{hurdle.text}</span>
                      </motion.div>
                  ))}
              </div>
          </div>
      )}
       {/* Add a fallback if no list items found but paragraphs exist */}
       {derivedHurdles.length === 0 && paragraphs.length > 0 && ( 
           <p className={`italic text-sm mt-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Challenges are detailed in the description above.</p>
       )}
    </motion.div>
  );
};


const ApproachSection = ({ content, isDarkMode }) => {
   if (!content?.raw?.children) return null;

   // More robust parsing: Group paragraphs and lists under component mentions
   const sections = [];
   let currentSection = { title: 'intro', paragraphs: [], list: [] };

   content.raw.children.forEach(child => {
       const textContent = child.children?.map(c => c.text).join('') || '';
       let sectionChanged = false;

       if (child.type === 'paragraph') {
           if (textContent.includes('ProteinBind™')) {
               if (currentSection.title !== 'intro' || currentSection.paragraphs.length > 0 || currentSection.list.length > 0) sections.push(currentSection);
               currentSection = { title: 'ProteinBind™', icon: <FiCpu className="w-6 h-6"/>, paragraphs: [child], list: [] };
               sectionChanged = true;
           } else if (textContent.includes('JEDI Ensemble™')) {
               if (currentSection.title !== 'intro' || currentSection.paragraphs.length > 0 || currentSection.list.length > 0) sections.push(currentSection);
               currentSection = { title: 'JEDI Ensemble™', icon: <FiDatabase className="w-6 h-6"/>, paragraphs: [child], list: [] };
               sectionChanged = true;
           } else if (textContent.includes('By combining high-fidelity')) {
                if (currentSection.title !== 'intro' || currentSection.paragraphs.length > 0 || currentSection.list.length > 0) sections.push(currentSection);
               currentSection = { title: 'conclusion', paragraphs: [child], list: [] };
               sectionChanged = true;
           }
           
           if (!sectionChanged) {
               currentSection.paragraphs.push(child);
           }

       } else if (child.type === 'bulleted-list') {
           const items = child.children.map(li => li.children[0]?.children[0]?.text).filter(Boolean);
           currentSection.list.push(...items.map(item => ({ text: item, icon: FiCheckCircle }))); // Assign generic icon
       }
   });
   sections.push(currentSection); // Push the last section

   const renderComponentCard = (section) => (
        <motion.div 
            key={section.title}
            initial={{ opacity: 0.8, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4 }}
            className={`p-5 rounded-xl border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} mb-6`}
        >
            <h5 className={`h5 mb-4 flex items-center gap-3 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`}>
                {section.icon} {section.title}
            </h5>
            <div className={`prose prose-sm max-w-none mb-4 ${isDarkMode ? 'prose-invert text-n-3' : 'text-n-6'}`}>
                {section.paragraphs.map((p, i) => <RichText key={i} content={{ type: 'root', children: [p] }} />)}
            </div>
            {section.list.length > 0 && (
                <div>
                    <h6 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Key Actions & Benefits:</h6>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> 
                         {section.list.map((benefit, i) => (
                            <div 
                              key={i} 
                              className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-n-8 border-n-6 text-n-3' : 'bg-n-2 border-n-3 text-n-6'}`} 
                            >
                                <benefit.icon className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-primary-1/80' : 'text-primary-1'}`} />
                                <span className="text-sm">{benefit.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );

   // Separate intro and conclusion paragraphs from component sections
   const introSection = sections.find(s => s.title === 'intro');
   const conclusionSection = sections.find(s => s.title === 'conclusion');
   const componentSections = sections.filter(s => s.title !== 'intro' && s.title !== 'conclusion');

   return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className={`p-6 md:p-8 rounded-2xl border ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'} shadow-lg`}
        >
            <h4 className={`h4 mb-6 flex items-center gap-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                <img src={logo} alt="Jedi Logo" className="w-7 h-7" />
                The Jedi Approach
            </h4>
            
            {/* Intro Paragraphs */}
            {introSection && (
              <div className={`prose prose-base max-w-none mb-6 ${isDarkMode ? 'prose-invert text-n-3' : 'text-n-6'}`}>
                  {introSection.paragraphs.map((p, i) => <RichText key={i} content={{ type: 'root', children: [p] }} />)}
              </div>
            )}

            {/* Component Cards */}
            {componentSections.map(section => renderComponentCard(section))}


            {/* Conclusion Paragraphs */}
            {conclusionSection && (
                <div className={`prose prose-base max-w-none mt-6 pt-6 border-t ${isDarkMode ? 'prose-invert text-n-3 border-n-6' : 'text-n-6 border-n-3'}`}>
                    {conclusionSection.paragraphs.map((p, i) => <RichText key={i} content={{ type: 'root', children: [p] }} />)}
                </div>
            )}
        </motion.div>
    );
};

// Modified component accepting application and industryContextData
const ApplicationDisplay = ({ application, industryContextData }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('details'); // Default tab

  if (!application) return null;

  const {
    applicationTitle,
    tagline,
    industryChallenge,
    jediApproach,
    keyCapabilities = [],
    expectedResults = [],
    jediComponent = [],
    technology // Fetch technology if needed for icons etc.
  } = application;

  // Safely access context data
  const {
    fullDescription: industryFullDescription,
    benefits: industryBenefits = [],
    capabilities: industryCapabilities = [],
  } = industryContextData || {}; // Provide default empty object

  const TABS_CONFIG = [
    { id: 'details', label: 'Solution Details', icon: 'solution' }, // Placeholder icon name
    { id: 'context', label: 'Industry Context', icon: 'info' }, // Placeholder icon name
    ...(jediComponent.length > 0 ? [{ id: 'components', label: 'Core Components', icon: 'cpu' }] : []), // Only show if components exist
  ];


  return (
    // Main container with theme styling
    <div className={`rounded-2xl border overflow-hidden shadow-lg ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'}`}>
      {/* Header Section */}
      <div className={`p-6 md:p-8 border-b ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h2 className={`h2 mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{applicationTitle}</h2>
            {tagline && <p className={`body-1 font-medium ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`}>{tagline}</p>}
          </div>
           {/* Optional: Display technology icon */}
           {technology?.icon?.url && (
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-n-6' : 'bg-n-2'}`}>
              <img src={technology.icon.url} alt={technology.name || 'Tech Icon'} className="w-8 h-8 object-contain"/>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <TabsRoot value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`flex flex-wrap gap-2 p-4 border-b ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'}`}>
          {TABS_CONFIG.map((tab) => (
             <TabTrigger
               key={tab.id}
               value={tab.id}
               className={`px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap flex items-center gap-2 
                 data-[state=active]:bg-primary-1 data-[state=active]:text-white data-[state=active]:shadow-md 
                 ${isDarkMode ? 'bg-n-7 text-n-3 hover:bg-n-6' : 'bg-n-2 text-n-5 hover:bg-n-3'} 
                 data-[state=inactive]:bg-opacity-100 data-[state=inactive]:hover:bg-opacity-90 
               `}
             >
               <Icon name={tab.icon} className="w-4 h-4 opacity-80"/> 
               {tab.label}
             </TabTrigger>
          ))}
        </TabsList>

        {/* Tab Content Panels */}
        <div className="p-6 md:p-8">
          <TabPanel value="details">
              {/* Use new structured renderers */}
              <ChallengeSection content={industryChallenge} isDarkMode={isDarkMode} />
              <ApproachSection content={jediApproach} isDarkMode={isDarkMode} />

              {/* Keep lists for capabilities/results if desired */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {renderListSection("Key Capabilities Delivered", keyCapabilities, FiCheckCircle, isDarkMode, FiList)}
                {renderListSection("Expected Results", expectedResults, FiCheckCircle, isDarkMode, FiAward)}
              </div>
          </TabPanel>

          <TabPanel value="context">
              {/* Reuse generic helpers for context tab */}
              {renderRichTextSectionLocally("Broader Industry Context", industryFullDescription, isDarkMode, FiInfo)} 
              {renderListSection("Common Industry Benefits", industryBenefits, FiCheckCircle, isDarkMode, FiTarget)}
              {renderListSection("Common Industry Capabilities", industryCapabilities, FiCheckCircle, isDarkMode, FiList)}
          </TabPanel>

          <TabPanel value="components">
              {jediComponent.length > 0 ? (
                <div className={`p-4 md:p-6 rounded-lg border ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'} shadow-sm`}>
                  <h4 className={`h5 mb-4 flex items-center ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiCpu className="mr-2 text-primary-1/90 w-5 h-5" /> Core Jedi Components
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {jediComponent.map(comp => (
                      <Link
                        key={comp.id}
                        to={`/technology/${comp.slug}`} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${ 
                          isDarkMode ? 'bg-n-6 border-n-5 text-n-3 hover:text-n-1 hover:border-n-4' : 'bg-n-2 border-n-3 text-n-5 hover:text-n-7 hover:border-n-4'
                        }`}
                        title={comp.name}
                      >
                        {comp.icon?.url ? (
                          <img src={comp.icon.url} alt="" className="w-4 h-4 object-contain" />
                        ) : (
                          <Icon name="cpu" className="w-4 h-4" /> 
                        )}
                        <span>{comp.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className={`italic text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>No specific Jedi components linked.</p>
              )}
          </TabPanel>
        </div>
      </TabsRoot>
    </div>
  );
};

export default ApplicationDisplay;

// Define renderRichTextSection locally if needed for the context tab 
// (if it wasn't kept globally or imported)
const renderRichTextSectionLocally = (title, content, isDarkMode, TitleIcon = FiInfo) => {
    if (!content?.raw) return null;
    return (
        <div className={`p-4 md:p-6 rounded-lg border mb-6 ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'} shadow-sm`}> 
        <h4 className={`h5 mb-3 flex items-center ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            <TitleIcon className="mr-2 text-primary-1/90 w-5 h-5" /> 
            {title}
        </h4>
        <div className={`prose prose-base max-w-none ${isDarkMode ? 'prose-invert text-n-3' : 'text-n-6'}`}>
            <RichText content={content.raw} />
        </div>
        </div>
    );
};
