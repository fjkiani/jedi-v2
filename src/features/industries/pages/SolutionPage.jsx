import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { financial } from '@/constants/industry/financial';
import { TabsRoot, TabsList, TabTrigger, TabsContent, TabPanel } from '@/components/ui/Tabs';
import CaseStudiesTab from '@/pages/solutions/tabs/CaseStudiesTab';

const SolutionPage = () => {
  const { industryId, solutionId } = useParams();
  
  const industry = industryId === 'financial' ? financial : null;
  const solution = industry?.solutions?.find(s => s.id === solutionId);

  console.log('Data Check:', {
    industryId,
    solutionId,
    industry,
    solution,
    allSolutions: industry?.solutions
  });

  if (!industry || !solution) {
    return (
      <div className="container pt-[8rem]">
        <h1 className="h1 text-center">Solution Not Found</h1>
        <pre className="text-sm text-n-3">
          {JSON.stringify({ industryId, solutionId }, null, 2)}
        </pre>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'layout',
      content: (
        <div className="space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="h4 mb-4">Industry Impact</h3>
              <p className="text-n-3">{solution.fullDescription}</p>
            </div>
            <div>
              <h3 className="h4 mb-4">Solution Capabilities</h3>
              <ul className="space-y-3">
                {solution.capabilities?.map((capability, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Icon name="check" className="w-6 h-6 text-primary-1 mt-1" />
                    <span className="text-n-3">{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'case-studies',
      label: 'Case Studies',
      icon: 'book-open',
      content: <CaseStudiesTab solution={solution} />
    },
    {
      id: 'documentation',
      label: 'Documentation',
      icon: 'file-text',
      content: (
        <div>
          <h3 className="h4 mb-4">Documentation</h3>
          <p className="text-n-3">Industry-specific documentation and guides.</p>
        </div>
      )
    },
    {
      id: 'technical',
      label: 'Technical',
      icon: 'code',
      content: (
        <div>
          <h3 className="h4 mb-4">Technical Implementation</h3>
          <p className="text-n-3">Details on how to implement this solution in the financial industry.</p>
        </div>
      )
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="overflow-hidden pt-[8rem]">
        <div className="container relative">
          {/* Breadcrumb */}
          <div className="text-n-3 mb-6 flex items-center gap-2">
            <Link to="/industries" className="hover:text-n-1">Industries</Link>
            <Icon name="arrow-right" className="w-4 h-4" />
            <Link to={`/industries/${industryId}`} className="hover:text-n-1">
              {industry.title}
            </Link>
            <Icon name="arrow-right" className="w-4 h-4" />
            <span className="text-n-1">{solution.title}</span>
          </div>

          {/* Hero Content */}
          <div className="relative z-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[45rem]"
            >
              <h1 className="h1 mb-6 inline-block bg-clip-text text-transparent 
                bg-gradient-to-r from-primary-1 to-primary-2">
                {solution.title}
              </h1>
              <p className="body-1 text-n-3 mb-8">
                {solution.fullDescription}
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Tabs Section */}
      <Section>
        <div className="container">
          <TabsRoot defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              {tabs.map((tab) => (
                <TabTrigger key={tab.id} value={tab.id}>
                  <span className="flex items-center gap-2">
                    <Icon name={tab.icon} className="w-4 h-4" />
                    {tab.label}
                  </span>
                </TabTrigger>
              ))}
            </TabsList>

            <TabsContent>
              {tabs.map((tab) => (
                <TabPanel key={tab.id} value={tab.id}>
                  {tab.content}
                </TabPanel>
              ))}
            </TabsContent>
          </TabsRoot>
        </div>
      </Section>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-[40%] w-[70%] h-[70%] 
          bg-radial-gradient from-primary-1/30 to-transparent blur-xl" />
        <div className="absolute bottom-0 right-[40%] w-[70%] h-[70%] 
          bg-radial-gradient from-primary-2/30 to-transparent blur-xl" />
      </div>
    </>
  );
};

export default SolutionPage;
