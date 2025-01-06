import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LocalTechnologyOverview from './LocalTechnologyOverview';
import Section from '@/components/Section';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { aiMlSolution } from '@/constants/solutions/ai-ml';

const EnhancedTechnologyDetail = () => {
  const { slug } = useParams();
  console.log('EnhancedTechnologyDetail - Rendering with slug:', slug);
  const [showArchitecture, setShowArchitecture] = useState(false);

  // Find the technology in the architecture
  const findTechnologyInArchitecture = () => {
    console.log('EnhancedTechnologyDetail - Searching for technology in architecture');
    const architectureNodes = aiMlSolution?.architecture?.nodes || [];
    console.log('EnhancedTechnologyDetail - Architecture nodes:', architectureNodes);
    
    for (const node of architectureNodes) {
      console.log('EnhancedTechnologyDetail - Checking node:', node.label);
      if (node.technologies) {
        console.log('EnhancedTechnologyDetail - Node technologies:', node.technologies);
        for (const [category, techs] of Object.entries(node.technologies)) {
          console.log('EnhancedTechnologyDetail - Category:', category, 'Techs:', techs);
          const techList = Array.isArray(techs) ? techs : Object.keys(techs);
          console.log('EnhancedTechnologyDetail - Tech list:', techList);
          
          const foundTech = techList.find(tech => {
            const techName = typeof tech === 'string' ? tech : tech.name;
            const normalizedTechName = techName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            console.log('EnhancedTechnologyDetail - Comparing:', normalizedTechName, 'with:', normalizedSlug);
            return normalizedTechName === normalizedSlug;
          });

          if (foundTech) {
            console.log('EnhancedTechnologyDetail - Found tech:', foundTech);
            return {
              node,
              category,
              technology: foundTech
            };
          }
        }
      }
    }
    console.log('EnhancedTechnologyDetail - No technology found in architecture');
    return null;
  };

  const architectureInfo = findTechnologyInArchitecture();
  console.log('EnhancedTechnologyDetail - Architecture info:', architectureInfo);

  // Add a check to see if LocalTechnologyOverview is rendering
  console.log('Rendering EnhancedTechnologyDetail with slug:', slug);
  
  const renderArchitectureSection = () => {
    if (!architectureInfo) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        <div className="bg-n-8 rounded-xl border border-n-6 p-8">
          <h2 className="text-2xl font-bold text-n-1 mb-6">Architecture Context</h2>
          
          <div className="space-y-6">
            {/* Component Information */}
            <div>
              <h3 className="text-xl font-semibold text-n-1 mb-4">Component: {architectureInfo.node.label}</h3>
              <p className="text-n-3">{architectureInfo.node.description}</p>
              <div className="mt-4">
                <span className="text-n-3">Category: </span>
                <span className="text-primary-1">{architectureInfo.category}</span>
              </div>
            </div>

            {/* Architecture Diagram */}
            <div className="h-[600px] bg-n-7 rounded-lg overflow-hidden">
              <ReactFlow
                nodes={aiMlSolution.architecture.nodes.map(node => ({
                  id: node.id,
                  position: { x: node.x, y: node.y },
                  data: {
                    label: (
                      <div 
                        className={`bg-transparent p-4 rounded-lg text-sm border border-dashed min-w-[200px] cursor-pointer
                          ${node.id === architectureInfo.node.id ? 'border-primary-1 text-primary-1' : 'border-n-6 text-n-3'}`}
                      >
                        <div className="font-medium mb-2">{node.label}</div>
                        <div>{node.description}</div>
                      </div>
                    )
                  },
                  type: 'default',
                  style: { 
                    background: 'transparent', 
                    border: 'none',
                    width: 250,
                  },
                }))}
                edges={aiMlSolution.architecture.connections.map((connection, index) => ({
                  id: `e${index}`,
                  source: connection.from,
                  target: connection.to,
                  type: 'smoothstep',
                  style: { stroke: '#6366f1' },
                  animated: true,
                }))}
                fitView
                className="react-flow-dark"
              >
                <Background color="#4b5563" gap={16} />
                <Controls className="react-flow-controls" />
                <MiniMap 
                  className="bg-n-7 border border-n-6 rounded-lg"
                  nodeColor="#6366f1"
                  maskColor="rgba(0, 0, 0, 0.1)"
                />
              </ReactFlow>
            </div>

            {/* Related Technologies */}
            {architectureInfo.node.technologies && (
              <div>
                <h3 className="text-xl font-semibold text-n-1 mb-4">Related Technologies</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(architectureInfo.node.technologies)
                    .flatMap(([category, techs]) => {
                      const techList = Array.isArray(techs) ? techs : Object.keys(techs);
                      return techList
                        .filter(tech => {
                          const techName = typeof tech === 'string' ? tech : tech.name;
                          return techName.toLowerCase() !== slug.toLowerCase();
                        })
                        .map((tech, index) => {
                          const techName = typeof tech === 'string' ? tech : tech.name;
                          return (
                            <motion.div
                              key={`${category}-${index}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-n-7 rounded-lg p-4 border border-n-6"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={`https://cdn.simpleicons.org/${techName.toLowerCase().replace(/\s+/g, '')}`}
                                  alt={techName}
                                  className="w-8 h-8"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://cdn.simpleicons.org/github/white';
                                  }}
                                />
                                <span className="text-n-1">{techName}</span>
                              </div>
                            </motion.div>
                          );
                        });
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <LocalTechnologyOverview />
      {architectureInfo ? renderArchitectureSection() : (
        <div className="text-n-3 mt-8">
          No architecture information found for {slug}
        </div>
      )}
    </div>
  );
};

export default EnhancedTechnologyDetail; 