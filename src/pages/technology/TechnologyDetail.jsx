import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { techUseCaseMapper } from '@/constants/techUseCaseMapper';
import { aiMlTechStack } from '@/constants/techCategories/aiMlTechStack';
import { FiChevronDown, FiServer } from 'react-icons/fi';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import InteractiveCode from '@/components/InteractiveCode/InteractiveCode';
import 'reactflow/dist/style.css';

const TechnologyDetail = () => {
  const { techId } = useParams();
  const [activeTab, setActiveTab] = useState('architecture');
  const [expandedSections, setExpandedSections] = useState({});

  const techStackConfig = Object.values(aiMlTechStack).find(
    tech => tech.id === techId
  );
  const useCaseConfig = techUseCaseMapper[techId];

  const techConfig = {
    ...techStackConfig,
    ...useCaseConfig,
    relatedUseCases: [
      ...(useCaseConfig?.relatedUseCases || []),
      ...(techStackConfig?.useCases?.map(useCase => ({
        title: useCase.title,
        solutionSlug: useCase.relatedSolution,
        implementation: {
          overview: useCase.description,
          architecture: {
            components: useCase.architecture.components,
            flow: useCase.architecture.workflow || []
          },
          benefits: useCase.implementation.benefits,
          metrics: useCase.implementation.metrics,
          steps: useCase.implementation.steps
        }
      })) || [])
    ]
  };

  if (!techConfig) return null;

  const createWorkflowDiagram = (workflow) => {
    if (!workflow || workflow.length === 0) return { nodes: [], edges: [] };

    return {
      nodes: workflow.map((step, index) => ({
        id: `${index}`,
        data: { 
          label: (
            <div className="bg-transparent p-4 rounded-lg text-sm text-n-3 border border-dashed border-n-6 min-w-[200px]">
              {step}
            </div>
          )
        },
        position: { 
          x: 300 * (index % 3),
          y: Math.floor(index / 3) * 200
        },
        type: 'default',
        style: { 
          background: 'transparent', 
          border: 'none',
          width: 250,
        },
      })),
      edges: workflow.slice(0, -1).map((_, i) => ({
        id: `e${i}-${i+1}`,
        source: `${i}`,
        target: `${i+1}`,
        type: 'smoothstep',
        style: { stroke: '#6366f1' },
        animated: true,
      })),
    };
  };

  return (
    <motion.div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="flex items-start gap-6">
        <img 
          src={techConfig.icon || techConfig.image} 
          alt={techConfig.name} 
          className="w-16 h-16" 
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{techConfig.name}</h1>
          <p className="text-n-3 text-lg">{techConfig.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-n-7 rounded-full text-sm text-n-1">
              {techConfig.category}
            </span>
            {techConfig.primaryUses?.map((use, index) => (
              <span key={index} className="px-3 py-1 bg-n-7 rounded-full text-sm text-n-1">
                {use}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      {techConfig.relatedUseCases?.map((useCase, index) => (
        <div key={index} className="bg-n-8 rounded-xl p-6 border border-n-6">
          <h2 className="text-2xl font-bold mb-6">{useCase.title}</h2>
          <p className="text-n-3 mb-6">{useCase.implementation.overview}</p>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {['architecture', 'implementation', 'benefits'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-primary-1 text-white' 
                    : 'bg-n-7 text-n-3 hover:bg-n-6'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
              {activeTab === 'architecture' && (
                <div className="space-y-6">
                  {/* Flow Diagram */}
                  <div className="h-[400px] bg-n-7 rounded-lg p-4">
                    <ReactFlow 
                      nodes={createWorkflowDiagram(useCase.implementation.architecture.flow).nodes}
                      edges={createWorkflowDiagram(useCase.implementation.architecture.flow).edges}
                      fitView
                      className="react-flow-dark"
                    >
                      <Background color="#4b5563" gap={16} />
                      <Controls className="react-flow-controls" />
                      <MiniMap className="react-flow-minimap" />
                    </ReactFlow>
                  </div>

                  {/* Components */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {useCase.implementation.architecture.components.map((component, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="bg-n-7 rounded-lg p-4 cursor-pointer"
                      >
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <FiServer className="mr-2" />
                          {component.name}
                        </h4>
                        <p className="text-n-3 mb-2">{component.role}</p>
                        <div className="flex flex-wrap gap-2">
                          {component.tech.map((tech, techIdx) => (
                            <span key={techIdx} className="px-2 py-1 bg-n-6 rounded text-xs text-n-1">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'implementation' && (
                <div className="space-y-6">
                  <InteractiveCode 
                    codeExample={useCase.implementation.codeExample}
                  />
                  
                  {/* Implementation steps */}
                  <div className="bg-n-7 rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-4">Implementation Steps</h3>
                    <div className="space-y-4">
                      {useCase.implementation.steps?.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="bg-n-6 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </div>
                          <p className="text-n-3">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'benefits' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {useCase.implementation.benefits.map((benefit, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="bg-n-7 rounded-lg p-4"
                      >
                        <div className="flex items-center space-x-2">
                          <FiServer className="text-primary-1" />
                          <p className="text-n-3">{benefit}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ))}

      {/* Deployment Options */}
      {techConfig.deploymentOptions && (
        <div className="bg-n-8 rounded-xl p-6 border border-n-6">
          <h2 className="text-2xl font-bold mb-6">Deployment Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Cloud Platforms</h3>
              <div className="space-y-2">
                {techConfig.deploymentOptions.cloud.map((platform, idx) => (
                  <div key={idx} className="text-n-3">{platform}</div>
                ))}
              </div>
            </div>
            <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Containerization</h3>
              <div className="space-y-2">
                {techConfig.deploymentOptions.containerization.map((container, idx) => (
                  <div key={idx} className="text-n-3">{container}</div>
                ))}
              </div>
            </div>
            <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Scaling</h3>
              <div className="space-y-2">
                {techConfig.deploymentOptions.scaling.map((scale, idx) => (
                  <div key={idx} className="text-n-3">{scale}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Details */}
      {techConfig.integrations && (
        <div className="bg-n-8 rounded-xl p-6 border border-n-6">
          <h2 className="text-2xl font-bold mb-6">Integrations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Primary Integrations</h3>
              <div className="space-y-2">
                {techConfig.integrations.primary.map((integration, idx) => (
                  <div key={idx} className="text-n-3">{integration}</div>
                ))}
              </div>
            </div>
            <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">APIs</h3>
              <div className="space-y-2">
                {techConfig.integrations.apis.map((api, idx) => (
                  <div key={idx} className="text-n-3">{api}</div>
                ))}
              </div>
            </div>
            <div className="bg-n-7 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Security Features</h3>
              <div className="space-y-2">
                {techConfig.integrations.security.map((feature, idx) => (
                  <div key={idx} className="text-n-3">{feature}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TechnologyDetail;