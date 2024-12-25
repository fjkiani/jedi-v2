import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { TabsRoot, TabsList, TabTrigger, TabsContent, TabPanel } from '@/components/ui/Tabs';
import SolutionOverview from '../components/SolutionOverview';
import CaseStudiesTab from '@/pages/solutions/tabs/CaseStudiesTab';
import DocumentationTab from '@/pages/solutions/tabs/DocumentationTab';
import TechnicalTab from '@/pages/solutions/tabs/TechnicalTab';
import { getSolutionConfig } from '@/constants/registry/solutionRegistry';
import { industriesList } from '@/constants/industry';

const SolutionPage = () => {
  const { industryId, solutionId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Get industry and solution data
  const industry = industriesList.find(ind => ind.id === industryId);
  const solution = industry?.solutions?.find(s => s.id === solutionId);
  
  // Get solution configuration from registry
  const solutionConfig = useMemo(() => {
    return getSolutionConfig(industryId, solutionId);
  }, [industryId, solutionId]);

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
    setActiveTab('documentation');
  };

  return (
    <>
      <Section className="overflow-hidden pt-[8rem]">
        <div className="container">
          {/* Breadcrumb */}
          <div className="text-n-3 mb-6 flex items-center gap-2">
            <Link to="/industries" className="hover:text-n-1">Industries</Link>
            <Icon name="arrow-right" className="w-4 h-4" />
            <Link to={`/industries/${industryId}`} className="hover:text-n-1">
              {industry?.title}
            </Link>
            <Icon name="arrow-right" className="w-4 h-4" />
            <span className="text-n-1">{solution?.title}</span>
          </div>

          {/* Hero Content */}
          <div className="relative z-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[45rem]"
            >
              <h1 className="h1 mb-6">{solution?.title}</h1>
              <p className="body-1 text-n-3 mb-8">
                {solution?.description}
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Tabs Section */}
      <Section>
        <div className="container">
          <TabsRoot value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabTrigger value="overview">
                <span className="flex items-center gap-2">
                  <Icon name="layout" className="w-4 h-4" />
                  Overview
                </span>
              </TabTrigger>
              <TabTrigger value="documentation">
                <span className="flex items-center gap-2">
                  <Icon name="file-text" className="w-4 h-4" />
                  Documentation
                </span>
              </TabTrigger>
              <TabTrigger value="case-studies">
                <span className="flex items-center gap-2">
                  <Icon name="book-open" className="w-4 h-4" />
                  Case Studies
                </span>
              </TabTrigger>
              <TabTrigger value="technical">
                <span className="flex items-center gap-2">
                  <Icon name="code" className="w-4 h-4" />
                  Technical
                </span>
              </TabTrigger>
            </TabsList>

            <TabsContent>
              <TabPanel value="overview">
                <SolutionOverview 
                  industry={{ id: industryId }}
                  solution={{ id: solutionId }}
                  onComponentClick={handleComponentClick}
                />
              </TabPanel>
              <TabPanel value="documentation">
                <DocumentationTab 
                  documentation={solutionConfig?.documentation}
                  selectedComponent={selectedComponent}
                  industry={{ id: industryId }}
                />
              </TabPanel>
              <TabPanel value="case-studies">
                <CaseStudiesTab solution={solution} />
              </TabPanel>
              <TabPanel value="technical">
                <TechnicalTab 
                  solution={{ id: solutionId }}
                  implementation={solutionConfig?.implementation}
                  diagrams={solutionConfig?.diagrams}
                />
              </TabPanel>
            </TabsContent>
          </TabsRoot>
        </div>
      </Section>
    </>
  );
};

export default SolutionPage;
