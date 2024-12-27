import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { Link } from 'react-router-dom';
import { getIconForCategory } from '@/constants/categoryIcons';
import ArchitectureDiagram from '@/components/diagrams/ArchitectureDiagram';
import { financialOverview } from '@/constants/implementations/industries/financial/overview';
import { healthcareOverview } from '@/constants/implementations/industries/healthcare/overview';
import { dataIntegrationOverview } from '@/constants/implementations/industries/financial/components/data-integration/overview';
import { fraudDetectionImplementation } from '@/constants/implementations/industries/financial/implementation';
import { getIndustryDiagram } from '@/constants/registry/industryDiagramsRegistry';

const TECH_TABS = {
  OVERVIEW: { id: 'Overview', icon: 'layout' },
  ARCHITECTURE: { id: 'Architecture', icon: 'grid' },
  TECH_STACK: { id: 'Tech Stack', icon: 'layers' },
  METRICS: { id: 'Metrics', icon: 'chart' }
};

const getOverviewForIndustry = (industryId) => {
  switch (industryId) {
    case 'healthcare':
      return healthcareOverview;
    case 'financial':
      return financialOverview;
    default:
      return null;
  }
};

const SectionDetails = ({ section, industryId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isExpanded, setIsExpanded] = useState(false);
  if (!section || !industryId) return null;

  const overview = getOverviewForIndustry(industryId);
  const solutionKey = industryId === 'healthcare' ? 'patient-risk-analysis' : 'fraud-detection';
  const workflowStep = overview?.[solutionKey]?.workflow?.steps?.find(step => {
    if (!step?.title || !section?.label) return false;
    return step.title.toLowerCase().includes(section.label.toLowerCase());
  });

  if (!workflowStep) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-6 rounded-2xl bg-n-8 border border-n-6 overflow-hidden"
    >
      {/* Header - Always Visible */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-4 p-6 cursor-pointer hover:bg-n-7/50 transition-colors"
      >
        {/* Icon */}
        <div className={`${isExpanded ? 'w-16 h-16' : 'w-12 h-12'} 
          rounded-xl bg-n-7 flex items-center justify-center shrink-0 transition-all`}
        >
          <Icon 
            name={workflowStep.icon} 
            className={`${isExpanded ? 'w-8 h-8' : 'w-6 h-6'} 
              text-primary-1 transition-all`} 
          />
        </div>

        {/* Title and Description */}
        <div className="flex-1 min-w-0 mr-4">
          <h3 className="text-xl font-semibold text-n-1 mb-2">
            {workflowStep.title}
          </h3>
          <p className={`text-n-3 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {workflowStep.description}
          </p>
        </div>

        {/* Expand/Collapse Button */}
        <div className="shrink-0 self-start mt-1.5">
          <Icon 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            className="w-5 h-5 text-n-3"
          />
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-n-6">
              {/* Content Tabs */}
              <div className="border-b border-n-6">
                <div className="flex gap-2 p-4">
                  {['overview', 'technical', 'implementation', 'architecture'].map((tab) => (
                    <button
                      key={tab}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(tab);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium
                        transition-colors duration-200
                        ${activeTab === tab 
                          ? 'bg-primary-1 text-n-1' 
                          : 'text-n-3 hover:text-n-1 hover:bg-n-7'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <motion.div 
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {activeTab === 'overview' && workflowStep.details && (
                      <div className="space-y-4">
                        {workflowStep.details.map((detail, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-4 rounded-xl bg-n-7 border border-n-6
                              hover:border-primary-1 transition-colors cursor-pointer group"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary-1 mt-2" />
                            <p className="text-n-3 group-hover:text-n-1 transition-colors">
                              {detail}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'technical' && workflowStep.technicalSpecs && (
                      <div className="grid grid-cols-2 gap-6">
                        {Object.entries(workflowStep.technicalSpecs).map(([key, value], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-xl bg-n-7 border border-n-6 hover:border-primary-1 
                              transition-colors cursor-pointer group"
                          >
                            <div className="text-n-3 mb-1 group-hover:text-n-2 transition-colors">
                              {key}:
                            </div>
                            <div className="text-xl font-semibold text-n-1">
                              {value}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'implementation' && workflowStep.implementation && (
                      <div className="space-y-6">
                        {Object.entries(workflowStep.implementation).map(([category, technologies], index) => (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-3"
                          >
                            <h4 className="text-n-2 font-medium capitalize">
                              {category.replace('_', ' ')}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {technologies.map((tech, idx) => (
                                <motion.button
                                  key={idx}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 rounded-xl bg-n-7 text-n-1 border border-n-6 
                                    hover:border-primary-1 hover:bg-n-6 transition-all duration-200"
                                >
                                  {tech}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'architecture' && (
                      <div className="space-y-4">
                        <p className="text-n-3 mb-6">
                          {fraudDetectionImplementation.architecture.description}
                        </p>
                        {fraudDetectionImplementation.architecture.flow.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-4 rounded-xl bg-n-8 border border-n-6"
                          >
                            <div className="w-8 h-8 rounded-full bg-n-6 flex items-center justify-center shrink-0">
                              <span className="text-primary-1 font-semibold">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="text-n-1 font-medium mb-1">{step.step}</h4>
                              <p className="text-n-3 text-sm mb-2">{step.description}</p>
                              <div className="text-xs text-primary-1">{step.details}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const IndustryHero = ({ industry, solution, sections, diagram }) => {
  const [activeTab, setActiveTab] = useState(TECH_TABS.OVERVIEW.id);
  const [selectedSection, setSelectedSection] = useState(sections?.[0]?.id);

  // Memoize the current section's data
  const sectionData = useMemo(() => {
    if (!selectedSection || !industry.diagrams) return null;
    return industry.diagrams[selectedSection];
  }, [selectedSection, industry.diagrams]);

  const renderTabContent = () => {
    switch (activeTab) {
      case TECH_TABS.OVERVIEW.id:
        return (
          <div className="space-y-6">
            {/* Business Value */}
            <div className="p-6 rounded-xl bg-n-7 border border-n-6">
              <h3 className="text-xl font-semibold text-n-1 mb-4">Business Value</h3>
              <div className="grid gap-3">
                {[
                  'Detect fraud in real-time with <100ms latency',
                  'Reduce false positives by 60% through data enrichment',
                  'Process over 10,000 transactions per second',
                  '360° view of customer behavior patterns'
                ].map((value, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-1" />
                    <span className="text-n-3">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div className="p-6 rounded-xl bg-n-7 border border-n-6">
              <h3 className="text-xl font-semibold text-n-1 mb-4">Capabilities</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Multi-source data integration',
                  'Real-time stream processing',
                  'Historical data analysis',
                  'Automated data enrichment',
                  'Data quality monitoring',
                  'Scalable data pipeline'
                ].map((capability, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Icon name="check-circle" className="w-5 h-5 text-primary-1" />
                    <span className="text-n-3">{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div className="p-6 rounded-xl bg-n-7 border border-n-6">
              <h3 className="text-xl font-semibold text-n-1 mb-4">Examples</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name="arrow-right" className="w-5 h-5 text-primary-1" />
                  <span className="text-n-3">Credit card transaction monitoring</span>
                </div>
              </div>
            </div>
          </div>
        );

      case TECH_TABS.ARCHITECTURE.id:
        return (
          <div className="relative h-[500px] bg-n-8 rounded-2xl border border-n-6 overflow-hidden">
            <ArchitectureDiagram 
              diagram={getIndustryDiagram(industry.id, selectedSection)} 
            />
          </div>
        );

      case TECH_TABS.TECH_STACK.id:
        return (
          <div className="space-y-6">
            {/* Using tech stack data from implementation.js */}
            {Object.entries(fraudDetectionImplementation.architecture.components).map(([category, techs], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-n-7 border border-n-6"
              >
                <h3 className="text-lg font-semibold mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {techs.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-n-6 text-n-1">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case TECH_TABS.METRICS.id:
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Using metrics from implementation.js */}
            {fraudDetectionImplementation.metrics.items.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-n-7 border border-n-6"
              >
                <div className="text-2xl font-bold text-primary-1 mb-2">
                  {metric.value}
                </div>
                <div className="text-n-1 font-medium mb-1">{metric.label}</div>
                <div className="text-sm text-n-3">{metric.description}</div>
                {metric.details && (
                  <div className="mt-2 text-xs text-n-4">{metric.details}</div>
                )}
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Section className="overflow-hidden pt-[8rem]">
      <div className="container relative">
        {/* Breadcrumb */}
        <div className="text-n-3 mb-6 flex items-center gap-2">
          <Link to="/industries" className="hover:text-n-1">Industries</Link>
          <Icon name="arrow-right" className="w-4 h-4" />
          <span className="text-n-1">{industry.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Column - Content */}
          <div>
            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h1 mb-6"
            >
              {industry.title}
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-n-3 text-lg mb-8"
            >
              {industry.description}
            </motion.p>

            {/* Section Navigation */}
            {sections?.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                        text-sm font-medium transition-colors duration-200
                        ${selectedSection === section.id 
                          ? 'bg-primary-1 text-n-1' 
                          : 'text-n-3 hover:text-n-1 hover:bg-n-7'}`}
                    >
                      <Icon name={section.icon} className="w-5 h-5" />
                      {section.label}
                    </button>
                  ))}
                </div>

                {/* Add Section Details Panel */}
                <AnimatePresence mode="wait">
                  {selectedSection && (
                    <SectionDetails 
                      section={sections.find(s => s.id === selectedSection)}
                      industryId={industry.id}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Column - Interactive Content */}
          <div className="relative lg:pl-10">
            {/* Tabs Navigation */}
            <div className="bg-n-8 border border-n-6 rounded-2xl overflow-hidden mb-8">
              <div className="border-b border-n-6 p-4">
                <div className="flex gap-2">
                  {Object.values(TECH_TABS).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                        text-sm font-medium transition-colors duration-200
                        ${activeTab === tab.id 
                          ? 'bg-primary-1 text-n-1' 
                          : 'text-n-3 hover:text-n-1 hover:bg-n-7'}`}
                    >
                      <Icon name={tab.icon} className="w-5 h-5" />
                      {tab.id}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default IndustryHero;
