import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { DiagramNode } from './DiagramNode';

const calculatePath = (start, end) => {
  if (!start || !end) return '';
  
  // Add some curve to the path
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  return `M ${start.x + 250} ${start.y + 50} 
          C ${midX} ${start.y + 50}, 
            ${midX} ${end.y + 50}, 
            ${end.x} ${end.y + 50}`;
};

export const DiagramView = ({ diagram }) => {
  const [scale, setScale] = useState(1);
  
  // Calculate dimensions based on nodes
  const dimensions = useMemo(() => {
    if (!diagram?.nodes?.length) return { width: 1200, height: 800 };
    
    const maxX = Math.max(...diagram.nodes.map(n => n.x + 300));
    const maxY = Math.max(...diagram.nodes.map(n => n.y + 250));
    
    return {
      width: Math.max(maxX + 100, 1200),
      height: Math.max(maxY + 100, 800)
    };
  }, [diagram?.nodes]);

  if (!diagram?.nodes) {
    return (
      <div className="text-center text-n-3 py-8">
        <p>No diagram data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Zoom controls */}
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => setScale(s => Math.min(s + 0.1, 2))}
          className="p-2 bg-n-6 rounded hover:bg-n-5"
        >
          <Icon name="plus" className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
          className="p-2 bg-n-6 rounded hover:bg-n-5"
        >
          <Icon name="minus" className="w-4 h-4" />
        </button>
      </div>
      
      {/* Diagram container */}
      <div 
        className="relative overflow-auto border border-n-6 rounded-lg bg-n-8"
        style={{ height: '600px' }}
      >
        <div 
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            position: 'relative'
          }}
        >
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="absolute top-0 left-0"
          >
            {/* Connection lines */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#2A85FF"
                />
              </marker>
            </defs>

            {/* Draw connections */}
            {diagram.connections?.map((connection, index) => {
              const fromNode = diagram.nodes.find(n => n.id === connection.from);
              const toNode = diagram.nodes.find(n => n.id === connection.to);
              
              if (!fromNode || !toNode) return null;

              return (
                <g key={`${connection.from}-${connection.to}`}>
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    d={calculatePath(fromNode, toNode)}
                    stroke="#2A85FF"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  {connection.label && (
                    <text
                      x={(fromNode.x + toNode.x + 250) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 10}
                      className="fill-n-3 text-xs"
                      textAnchor="middle"
                    >
                      {connection.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Draw nodes */}
            {diagram.nodes.map((node, index) => (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <DiagramNode node={node} />
              </motion.g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DiagramView;
