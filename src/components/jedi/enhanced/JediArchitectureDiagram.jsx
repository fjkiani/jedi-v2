import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTheme } from '@/context/ThemeContext';
import { 
  FiCpu, FiSettings, FiZap, FiDatabase, FiUsers, 
  FiArrowRight, FiChevronDown, FiChevronUp 
} from 'react-icons/fi';

const JediArchitectureDiagram = ({ 
  className = "",
  showDetails = true,
  interactive = true,
  jediComponents = [],
  technologies = [],
  industries = [],
  useCases = []
}) => {
  const { isDarkMode } = useTheme();
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Generate nodes dynamically from JEDI components
  useEffect(() => {
    if (!jediComponents || jediComponents.length === 0) return;

    const generateNodes = () => {
      const nodeMap = {
        'jedi-ensemble': { x: 250, y: 100, color: 'purple', icon: FiCpu },
        'jedi-rules': { x: 50, y: 300, color: 'green', icon: FiSettings },
        'jedi-automate': { x: 450, y: 300, color: 'orange', icon: FiZap },
        'data-layer': { x: 200, y: 500, color: 'gray', icon: FiDatabase },
        'client-apps': { x: 50, y: 100, color: 'blue', icon: FiUsers }
      };

      return jediComponents.map((component, index) => {
        const nodeConfig = nodeMap[component.id] || { x: 100 + index * 200, y: 100, color: 'blue', icon: FiCpu };
        const IconComponent = nodeConfig.icon;
        
        return {
          id: component.id,
          type: 'default',
          position: { x: nodeConfig.x, y: nodeConfig.y },
          data: {
            label: (
              <div className={`p-4 rounded-lg border-2 ${
                isDarkMode 
                  ? `bg-gradient-to-br from-${nodeConfig.color}-900/30 to-${nodeConfig.color}-800/30 border-${nodeConfig.color}-500/50` 
                  : `bg-gradient-to-br from-${nodeConfig.color}-50 to-${nodeConfig.color}-100 border-${nodeConfig.color}-200`
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <IconComponent className={`text-${nodeConfig.color}-500 text-xl`} />
                  <h3 className="font-bold text-lg">{component.name}</h3>
                </div>
                <p className="text-sm opacity-80">{component.tagline}</p>
                <div className="mt-2 text-xs space-y-1">
                  {component.capabilities?.primary && component.capabilities.primary.length > 0 ? component.capabilities.primary.slice(0, 3).map((capability, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-2 h-2 bg-${nodeConfig.color}-400 rounded-full`}></div>
                      <span>{capability.name}</span>
                    </div>
                  )) : null}
                </div>
              </div>
            ),
            component: component.id,
            componentData: component
          }
        };
      });
    };

    const generateEdges = () => {
      const edgeConfigs = [
        { source: 'client-apps', target: 'jedi-ensemble', color: 'purple' },
        { source: 'jedi-ensemble', target: 'jedi-rules', color: 'green' },
        { source: 'jedi-ensemble', target: 'jedi-automate', color: 'orange' },
        { source: 'jedi-rules', target: 'data-layer', color: 'gray' },
        { source: 'jedi-automate', target: 'data-layer', color: 'gray' }
      ];

      return edgeConfigs.map((config, index) => ({
        id: `edge-${index}`,
        source: config.source,
        target: config.target,
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: isDarkMode ? `var(--color-${config.color}-400)` : `var(--color-${config.color}-600)`, 
          strokeWidth: 2 
        },
        markerEnd: { 
          type: MarkerType.ArrowClosed, 
          color: isDarkMode ? `var(--color-${config.color}-400)` : `var(--color-${config.color}-600)` 
        }
      }));
    };

    setNodes(generateNodes());
    setEdges(generateEdges());
  }, [jediComponents, isDarkMode]);

  const nodeTypes = {
    default: ({ data }) => (
      <div className="cursor-pointer" onClick={() => setSelectedNode(data.component)}>
        {data.label}
      </div>
    )
  };

  // Get component details dynamically
  const getComponentDetails = (componentId) => {
    const component = jediComponents.find(c => c.id === componentId);
    if (!component) return null;

    return {
      title: component.name,
      description: component.description,
      features: component.capabilities?.primary && component.capabilities.primary.length > 0 ? component.capabilities.primary.map(cap => cap.name) : [],
      metrics: component.metrics || [
        { label: "Model Accuracy", value: "95-99.5%" },
        { label: "Response Time", value: "< 200ms" },
        { label: "Uptime", value: "99.9%" },
        { label: "Client Satisfaction", value: "98%" }
      ]
    };
  };

  // Get related technologies for a component
  const getRelatedTechnologies = (componentId) => {
    if (!technologies || technologies.length === 0) return [];
    
    // This would be based on actual relationships in Hygraph
    const techMap = {
      'jedi-ensemble': ['openai-gpt', 'anthropic-claude', 'langchain', 'weaviate'],
      'jedi-rules': ['postgresql', 'mongodb', 'docker'],
      'jedi-automate': ['hugging-face', 'docker', 'kubernetes']
    };

    const techSlugs = techMap[componentId] || [];
    return technologies.filter(tech => techSlugs.includes(tech.slug));
  };

  // Get related use cases for a component
  const getRelatedUseCases = (componentId) => {
    if (!useCases || useCases.length === 0) return [];
    
    // This would be based on actual relationships in Hygraph
    return useCases.filter(useCase => 
      useCase.components?.some(comp => comp.id === componentId)
    );
  };

  const selectedComponentDetails = selectedNode ? getComponentDetails(selectedNode) : null;
  const relatedTechnologies = selectedNode ? getRelatedTechnologies(selectedNode) : [];
  const relatedUseCases = selectedNode ? getRelatedUseCases(selectedNode) : [];

  return (
    <div className={`w-full ${className}`}>
      {/* Architecture Diagram */}
      <div className="h-96 mb-6 rounded-xl border overflow-hidden">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            className="bg-transparent"
          >
            <Background 
              color={isDarkMode ? '#374151' : '#E5E7EB'} 
              gap={20} 
              size={1} 
            />
            <Controls 
              className={`${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3'}`}
            />
            <MiniMap 
              className={`${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3'}`}
              nodeColor={(node) => {
                const colorMap = {
                  'jedi-ensemble': '#8B5CF6',
                  'jedi-rules': '#10B981',
                  'jedi-automate': '#F59E0B',
                  'data-layer': '#6B7280',
                  'client-apps': '#3B82F6'
                };
                return colorMap[node.data?.component] || '#6B7280';
              }}
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {/* Component Details */}
      {showDetails && selectedComponentDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl border ${
            isDarkMode 
              ? 'bg-gradient-to-br from-n-7 to-n-8 border-n-6' 
              : 'bg-gradient-to-br from-n-1 to-n-2 border-n-3'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                {selectedComponentDetails.title}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                {selectedComponentDetails.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className={`p-2 rounded-lg ${
                isDarkMode 
                  ? 'hover:bg-n-6 text-n-3' 
                  : 'hover:bg-n-3 text-n-6'
              }`}
            >
              <FiChevronUp className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features */}
            <div>
              <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Key Features
              </h4>
              <ul className="space-y-2">
                {selectedComponentDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-1 rounded-full mt-2 flex-shrink-0"></div>
                    <span className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Metrics */}
            <div>
              <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Performance Metrics
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedComponentDetails.metrics.map((metric, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-n-6' : 'bg-n-2'
                  }`}>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                      {metric.value}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Technologies */}
          {relatedTechnologies.length > 0 && (
            <div className="mt-6">
              <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {relatedTechnologies.map((tech, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      isDarkMode
                        ? 'bg-n-6 text-n-2'
                        : 'bg-n-2 text-n-7'
                    }`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Use Cases */}
          {relatedUseCases.length > 0 && (
            <div className="mt-6">
              <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Real Implementations
              </h4>
              <div className="space-y-2">
                {relatedUseCases.slice(0, 3).map((useCase, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-n-6' : 'bg-n-2'
                  }`}>
                    <h5 className={`font-medium ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                      {useCase.title}
                    </h5>
                    <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                      {useCase.industry?.name} • {useCase.results?.responseTime || '80% faster'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* How It Works */}
      <div className={`mt-6 p-6 rounded-xl border ${
        isDarkMode 
          ? 'bg-gradient-to-br from-n-7 to-n-8 border-n-6' 
          : 'bg-gradient-to-br from-n-1 to-n-2 border-n-3'
      }`}>
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
          How JEDI Components Work Together
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary-1 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Client Request
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                Your application sends a request to JEDI Ensemble™, which intelligently routes it to the best AI model for the task.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary-1 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Business Logic Processing
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                JEDI Rules™ processes your business logic and makes automated decisions based on your predefined rules.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary-1 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Performance Optimization
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                JEDI AutoTune™ continuously optimizes the AI models for peak performance and accuracy.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary-1 text-white rounded-full flex items-center justify-center text-sm font-bold">
              4
            </div>
            <div>
              <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Intelligent Response
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                The system returns an intelligent, context-aware response that solves your business problem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JediArchitectureDiagram;