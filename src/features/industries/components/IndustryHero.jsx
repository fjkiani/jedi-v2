import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { Link } from 'react-router-dom';
import { getIconForCategory } from '@/constants/categoryIcons';
import ArchitectureDiagram from '@/components/diagrams/ArchitectureDiagram';
import { financialOverview } from '@/constants/implementations/industries/financial/overview';
import { healthcareOverview } from '@/constants/implementations/industries/healthcare/overview';
import { dataIntegrationOverview } from '@/constants/implementations/industries/financial/components/data-integration/overview';
import { getIndustryDiagram } from '@/constants/registry/industryDiagramsRegistry';
import { UseCaseView } from '@/components/diagrams/views/UseCaseView';
import { DiagramView } from '@/components/diagrams/DiagramView';
import { DeploymentView } from '@/components/diagrams/views/DeploymentView';
import { industryService } from '@/services/industryService';
import AIResponse from '@/components/response/AIResponse';
import { USE_CASE_REGISTRY, getUseCases } from '@/constants/registry/useCaseRegistry';
import { useCaseService } from '@/services/useCaseService';

const TECH_TABS = {
  OVERVIEW: { id: 'Overview', icon: 'layout' },
  ARCHITECTURE: { id: 'Architecture', icon: 'grid' },
  DEPLOYMENT: { id: 'Deployment', icon: 'server' },
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

// Helper function to get queries for the current industry and section
const getQueriesForSection = (industry, section) => {
  const sectionToUseCaseMap = {
    'fundamentals': 'fundamentals',
    'data-collection': 'fundamentals',
    'data-processing': 'fundamentals',
    'model-training': 'fundamentals',
    'deployment': 'fundamentals'
  };

  const useCaseSection = sectionToUseCaseMap[section] || section;
  const useCases = USE_CASE_REGISTRY[industry]?.[useCaseSection]?.useCases || {};
  
  // Get all queries from all use cases in this section
  return Object.values(useCases).reduce((allQueries, useCase) => {
    if (useCase.queries) {
      allQueries.push(...useCase.queries);
    }
    return allQueries;
  }, []);
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
  const [queries, setQueries] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [selectedUseCase, setSelectedUseCase] = useState(null);

  const [useCaseState, setUseCaseState] = useState({
    query: '',
    result: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const sectionQueries = await useCaseService.getQueries(industry.id);
        setQueries(sectionQueries);
      } catch (error) {
        console.error('Error fetching queries:', error);
      }
    };

    if (industry.id) {
      fetchQueries();
    }
  }, [industry.id]);

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        const fetchedUseCases = await useCaseService.getUseCasesBySection(industry.id, selectedSection);
        console.log('Fetched use cases:', fetchedUseCases);
        if (fetchedUseCases && fetchedUseCases.length > 0) {
          setUseCases(fetchedUseCases);
          setSelectedUseCase(fetchedUseCases[0]); // Set first as default
        }
      } catch (error) {
        console.error('Error fetching use cases:', error);
      }
    };

    if (industry.id && selectedSection) {
      fetchUseCases();
    }
  }, [industry.id, selectedSection]);

  const runIndustryDemo = async (sampleQuery) => {
    console.log('Running demo with:', { 
      industry: industry.id, 
      section: selectedSection, 
      query: sampleQuery
    });

    setUseCaseState(prev => ({
      ...prev,
      loading: true,
      query: sampleQuery,
      error: null
    }));

    try {
      const response = await industryService.generateResponse(
        industry.id,
        selectedSection,
        sampleQuery
      );
      
      setUseCaseState(prev => ({
        ...prev,
        loading: false,
        result: response
      }));
    } catch (error) {
      console.error("Error in runIndustryDemo:", error);
      setUseCaseState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case TECH_TABS.OVERVIEW.id:
        const useCaseData = selectedUseCase || getIndustryDiagram(industry.id, selectedSection);
        
        return (
          <div className="space-y-8">
            {/* Title and Description */}
            <div className="text-center">
              <h2 className="h2 mb-4">{useCaseData?.title || 'Industry Solutions'}</h2>
              <p className="text-n-3 text-lg">{useCaseData?.description}</p>
            </div>

            {/* Use Case Selector */}
            {useCases.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {useCases.map((useCase) => (
                  <button
                    key={useCase.id}
                    onClick={() => setSelectedUseCase(useCase)}
                    className={`px-6 py-3 rounded-xl text-base font-medium transition-colors duration-200
                      ${selectedUseCase?.id === useCase.id 
                        ? 'bg-n-6 text-n-1 border-2 border-primary-1' 
                        : 'bg-n-8 text-n-3 border border-n-6 hover:text-n-1'}`}
                  >
                    {useCase.title}
                  </button>
                ))}
              </div>
            )}

            {/* Sample Queries Section */}
            {selectedUseCase?.queries?.length > 0 && (
              <div>
                <h2 className="h2 mb-4">Try the Use Case</h2>
                <p className="text-n-3 mb-6">Select a sample query to run:</p>
                
                <div className="flex flex-col gap-3">
                  {selectedUseCase.queries.map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => runIndustryDemo(sample)}
                      className="w-full text-left p-6 rounded-xl bg-n-8 border border-n-6 
                        hover:border-primary-1 transition-colors duration-200"
                    >
                      <p className="text-n-1 text-lg">{sample}</p>
                    </button>
                  ))}
                </div>

                {(useCaseState.loading || useCaseState.result) && (
                  <div className="mt-8 bg-n-8 rounded-xl border border-n-6 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl">AI Analysis</h3>
                      <span className="text-n-3">Powered by Industry AI</span>
                    </div>

                    {/* Loading State */}
                    {useCaseState.loading && (
                      <div className="flex items-center justify-center p-4">
                        <div className="w-6 h-6 border-2 border-primary-1 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}

                    {/* Error State */}
                    {useCaseState.error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-500">{useCaseState.error}</p>
                      </div>
                    )}

                    {/* Result */}
                    {useCaseState.result && !useCaseState.loading && (
                      <div>
                        <AIResponse response={useCaseState.result} variant="simple" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case TECH_TABS.ARCHITECTURE.id:
        return (
          <div className="bg-n-8 rounded-2xl border border-n-6 overflow-hidden h-[600px]">
            <DiagramView diagram={getIndustryDiagram(industry.id, selectedSection)} />
          </div>
        );

      case TECH_TABS.DEPLOYMENT.id:
        return (
          <div className="bg-n-8 rounded-2xl border border-n-6 overflow-hidden">
            <DeploymentView diagram={getIndustryDiagram(industry.id, selectedSection)} />
          </div>
        );

      case TECH_TABS.METRICS.id:
        return (
          <div className="grid grid-cols-2 gap-6">
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
