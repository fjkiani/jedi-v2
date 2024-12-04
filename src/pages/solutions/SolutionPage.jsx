import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { getSolutionBySlug } from '@/constants/solutions';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import ArchitectureDiagram from '@/components/diagrams/ArchitectureDiagram';
import {
  TabsRoot,
  TabsList,
  TabTrigger,
  TabsContent,
  TabPanel
} from '@/components/ui/Tabs';

const SolutionPage = () => {
  const { slug } = useParams();
  const solution = getSolutionBySlug(slug);
  const [activeTab, setActiveTab] = useState('overview');

  if (!solution) {
    return (
      <Section className="text-center">
        <h2 className="h2">Solution not found</h2>
        <Link to="/solutions" className="button button-gradient mt-4">
          Back to Solutions
        </Link>
      </Section>
    );
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'layout',
      content: (
        <div className="space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="h4 mb-4">Business Value</h3>
              <ul className="space-y-3">
                {solution.businessValue.metrics.map((metric, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Icon name="check" className="w-6 h-6 text-primary-1 mt-1" />
                    <span className="text-n-3">{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="h4 mb-4">Key Capabilities</h3>
              <ul className="space-y-3">
                {solution.businessValue.capabilities.map((capability, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Icon name="check" className="w-6 h-6 text-primary-1 mt-1" />
                    <span className="text-n-3">{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="h4 mb-6">Common Use Cases</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solution.businessValue.useCases.map((useCase, index) => (
                <div 
                  key={index}
                  className="bg-n-7 rounded-xl p-6 border border-n-6"
                >
                  <h4 className="font-semibold text-white mb-2">{useCase}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'architecture',
      label: 'Architecture',
      icon: 'layout-grid',
      content: (
        <div>
          <h3 className="h4 mb-4">{solution.architecture.title}</h3>
          <p className="text-n-3 mb-8">{solution.architecture.description}</p>
          <ArchitectureDiagram domain={slug} />
        </div>
      )
    },
    {
      id: 'tech-stack',
      label: 'Tech Stack',
      icon: 'code',
      content: (
        <div className="space-y-10">
          {Object.entries(solution.techStack).map(([category, technologies]) => (
            <div key={category}>
              <h3 className="h4 mb-6 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(technologies).map(([name, tech]) => (
                  <div 
                    key={name}
                    className="bg-n-7 rounded-xl p-6 border border-n-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={tech.icon} 
                        alt=""
                        className="w-8 h-8"
                      />
                      <h4 className="font-semibold text-white">{name}</h4>
                    </div>
                    <p className="text-n-3">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <Section className="overflow-hidden">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-n-3 mb-4"
        >
          <Link to="/" className="hover:text-color-1">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/solutions" className="hover:text-color-1">Solutions</Link>
          <span className="mx-2">/</span>
          <span className="text-n-1">{solution.title}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="h1 mb-6">{solution.title}</h1>
          <p className="body-1 text-n-3 md:max-w-md lg:max-w-2xl">
            {solution.description}
          </p>
        </motion.div>

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-n-7 rounded-2xl p-8 border border-n-6 max-w-3xl mx-auto">
            <h3 className="h3 mb-4">Ready to Transform Your Business?</h3>
            <p className="text-n-3 mb-6">
              Let's discuss how our {solution.title.toLowerCase()} can help you achieve your goals.
            </p>
            <Link 
              to="/contact" 
              className="button button-gradient"
            >
              Schedule a Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default SolutionPage;
