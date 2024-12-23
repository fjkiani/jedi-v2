import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';
import CodeBlock from '../../../components/CodeBlock';
import TransactionDemo from './TransactionDemo';

const TechnicalTab = ({ solution, implementation }) => {
  const [activeTab, setActiveTab] = useState('implementation');

  // Keep existing tabs and add new ones
  const tabs = [
    {
      id: 'implementation',
      label: 'Implementation Details',
      icon: 'layers'
    },
    {
      id: 'deployment',
      label: 'Deployment Flow',
      icon: 'git-branch'
    },
    {
      id: 'examples',
      label: 'Interactive Examples',
      icon: 'play'
    },
    {
      id: 'patterns',
      label: 'Pattern Recognition',
      icon: 'chart'
    },
    // Add new educational tab
    {
      id: 'education',
      label: 'Learning Resources',
      icon: 'book'
    }
  ];

  const renderEducationTab = () => (
    <div className="space-y-6">
      {implementation.overview?.sections?.map((section, index) => (
        <motion.div
          key={index}
          className="p-6 rounded-xl bg-n-8 border border-n-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <h3 className="text-xl font-medium mb-4">{section.title}</h3>
          <p className="text-n-3 mb-6">{section.content}</p>
          
          {section.keyPoints && (
            <div className="space-y-2">
              <h4 className="text-lg font-medium mb-3">Key Points</h4>
              <ul className="space-y-2">
                {section.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icon name="check-circle" className="w-5 h-5 text-primary-1 mt-1" />
                    <span className="text-n-3">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.challenges && (
            <div className="mt-6 space-y-4">
              <h4 className="text-lg font-medium mb-3">Key Challenges</h4>
              {section.challenges.map((challenge, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-n-7">
                  <h5 className="font-medium mb-2">{challenge.name}</h5>
                  <p className="text-sm text-n-3 mb-2">{challenge.description}</p>
                  <div className="flex items-center gap-2">
                    <Icon name="zap" className="w-4 h-4 text-primary-1" />
                    <span className="text-sm text-primary-1">{challenge.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 rounded-xl bg-n-8 border border-n-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id 
                ? 'bg-primary-1 text-n-1' 
                : 'text-n-3 hover:text-n-1'
            }`}
          >
            <Icon name={tab.icon} className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Keep all existing tab content */}
          {activeTab === 'implementation' && (
            <div className="space-y-6">
              {implementation.architecture?.components?.map((component, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-xl bg-n-8 border border-n-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="text-lg font-medium mb-2">{component.name}</h4>
                  <p className="text-n-3 mb-4">{component.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {component.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 rounded-full bg-n-7 text-sm text-n-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="p-6 rounded-xl bg-n-8 border border-n-6">
              <h3 className="text-xl mb-6">Deployment Flow</h3>
              <ol className="relative">
                {implementation.architecture?.flow?.map((step, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-4 pb-8 last:pb-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary-1 flex items-center justify-center text-n-1 font-medium">
                        {index + 1}
                      </div>
                      {index < implementation.architecture.flow.length - 1 && (
                        <div className="absolute top-8 left-1/2 w-px h-full bg-n-6" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="text-n-1">{step}</span>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-6">
              {implementation.examples?.items?.map((example, index) => (
                <div key={index} className="p-6 rounded-xl bg-n-8 border border-n-6">
                  <h3 className="text-xl mb-4">{example.title}</h3>
                  <p className="text-n-3 mb-6">{example.description}</p>
                  {example.demoData?.sampleTransactions && (
                    <TransactionDemo 
                      transactions={example.demoData.sampleTransactions}
                      onAnalyze={(result) => console.log('Analysis result:', result)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'patterns' && (
            <div className="space-y-6">
              {implementation.examples?.items?.[1]?.demoData?.patterns?.map((pattern, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-lg bg-n-7"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{pattern.name}</h4>
                    <span className={`px-2 py-1 rounded text-sm ${
                      pattern.riskLevel === 'High' ? 'bg-red-500/20 text-red-500' :
                      pattern.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-green-500/20 text-green-500'
                    }`}>
                      {pattern.riskLevel}
                    </span>
                  </div>
                  <p className="text-sm text-n-3 mb-2">{pattern.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {pattern.indicators.map((indicator, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-full bg-n-6 text-xs">
                        {indicator}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add new education tab content */}
          {activeTab === 'education' && renderEducationTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TechnicalTab; 