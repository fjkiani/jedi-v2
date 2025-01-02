import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '@/components/Section';
import { industryService } from '@/services/industryService';
import { useCaseService } from '@/services/useCaseService';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import { IndustryHeader } from './components/IndustryHeader';
import { SectionNavigation } from './components/SectionNavigation';
import { SectionDetails } from './components/SectionDetails';
import { TabNavigation } from './components/TabNavigation';
import { OverviewTab } from './components/TabContent/OverviewTab';
import { ArchitectureTab } from './components/TabContent/ArchitectureTab';
import { DeploymentTab } from './components/TabContent/DeploymentTab';
import { MetricsTab } from './components/TabContent/MetricsTab';
import { TECH_TABS } from './constants';

const IndustryHero = ({ industry, sections }) => {
  const [activeTab, setActiveTab] = useState(TECH_TABS.OVERVIEW.id);
  const [selectedSection, setSelectedSection] = useState(sections?.[0]?.id);
  const [useCaseData, setUseCaseData] = useState(null);
  const [queries, setQueries] = useState([]);
  const [useCaseState, setUseCaseState] = useState({
    query: '',
    result: null,
    loading: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get use case data
        const useCases = await useCaseService.getUseCasesBySection(industry.id, selectedSection);
        console.log('Fetched use cases:', useCases);
        if (useCases && useCases.length > 0) {
          const useCase = useCases[0]; // Use the first use case for now
          console.log('Setting use case data:', useCase);
          setUseCaseData(useCase);
          // Don't set queries separately, we'll use them directly from useCaseData
          setQueries([]); // Clear any existing queries
        }
      } catch (error) {
        console.error('Error fetching use case data:', error);
      }
    };

    if (industry.id && selectedSection) {
      console.log('Fetching data for:', industry.id, selectedSection);
      fetchData();
    }
  }, [industry.id, selectedSection]);

  const runIndustryDemo = async (sampleQuery) => {
    setUseCaseState(prev => ({
      ...prev,
      loading: true,
      query: sampleQuery
    }));

    try {
      const implementation = await useCaseService.getImplementation(
        industry.id,
        selectedSection,
        sampleQuery
      );
      
      const response = await industryService.generateResponse(
        industry.id,
        selectedSection,
        sampleQuery,
        implementation
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
        return (
          <OverviewTab 
            useCaseData={useCaseData}
            queries={useCaseData?.queries || []} // Use queries directly from useCaseData
            runIndustryDemo={runIndustryDemo}
            useCaseState={useCaseState}
          />
        );
      case TECH_TABS.ARCHITECTURE.id:
        return <ArchitectureTab diagram={useCaseData?.architecture} />;
      case TECH_TABS.DEPLOYMENT.id:
        return <DeploymentTab diagram={useCaseData?.architecture} />;
      case TECH_TABS.METRICS.id:
        return <MetricsTab industryId={industry.id} section={selectedSection} />;
      default:
        return null;
    }
  };

  return (
    <Section className="overflow-hidden pt-[8rem]">
      <div className="container relative">
        <BreadcrumbNav industryTitle={industry.title} />

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Column */}
          <div>
            <IndustryHeader 
              title={industry.title}
              description={industry.description}
            />
            
            <SectionNavigation 
              sections={sections}
              selectedSection={selectedSection}
              onSectionChange={setSelectedSection}
            />

            <AnimatePresence mode="wait">
              {selectedSection && (
                <SectionDetails 
                  section={sections.find(s => s.id === selectedSection)}
                  industryId={industry.id}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Column */}
          <div className="relative lg:pl-10">
            <div className="bg-n-8 border border-n-6 rounded-2xl overflow-hidden mb-8">
              <TabNavigation 
                tabs={TECH_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
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