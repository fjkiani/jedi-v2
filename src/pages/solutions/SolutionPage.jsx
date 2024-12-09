import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import InteractiveCode from '@/components/InteractiveCode/InteractiveCode';
import { techUseCaseMapper } from '@/constants/techUseCaseMapper';
import { openAIService } from '@/services/openAIService';
import AIResponse from '@/components/response/AIResponse';
import Implementation from '@/components/technology/Implementation';
import { openAIImplementation } from '@/constants/implementations/openai';

const SolutionPage = () => {
  const { slug } = useParams();
  const solution = getSolutionBySlug(slug);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

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

  const handleTechClick = (techName) => {
    const techId = techName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/technology/${techId}`);
  };

  console.log('TechUseCaseMapper:', techUseCaseMapper);
  console.log('OpenAI tech:', techUseCaseMapper.openai);

  const openAITech = techUseCaseMapper.openai;
  console.log('OpenAI implementation:', openAITech.implementation);
  console.log('OpenAI Implementation:', openAIImplementation);

  const openAIConfig = {
    title: "AI-Powered Research & Development",
    exampleQueries: {
      samples: [
        "Analyze recent breakthroughs in CRISPR technology",
        "Summarize developments in renewable energy",
        "Review machine learning applications in drug discovery"
      ]
    }
  };

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
            <Implementation 
              tech={openAIConfig}
              useCases={solution.businessValue.useCases}
              showDemo={true}
            />
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
                    onClick={() => handleTechClick(name)}
                    className="bg-n-7 rounded-xl p-6 border border-n-6 cursor-pointer 
                             transition-all duration-300 hover:border-primary-1 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={tech.icon} 
                        alt={name}
                        className="w-8 h-8"
                      />
                      <h4 className="font-semibold text-white">{name}</h4>
                    </div>
                    <p className="text-n-3 mb-4">{tech.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-primary-1">
                      <span>View Implementation Details</span>
                      <Icon name="arrow-right" className="w-4 h-4" />
                    </div>

                    {tech.useCases && (
                      <div className="mt-4 pt-4 border-t border-n-6">
                        <h5 className="text-sm font-medium text-n-3 mb-2">
                          Related Use Cases:
                        </h5>
                        <ul className="text-sm text-n-4">
                          {solution.businessValue.useCases
                            .filter(useCase => tech.useCases.includes(useCase))
                            .map((useCase, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-1"></span>
                                {useCase}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
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
