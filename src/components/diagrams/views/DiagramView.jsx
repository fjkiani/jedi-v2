import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';

export const DiagramView = ({ diagram }) => {
  const [scale, setScale] = useState(1);
  
  console.log('Node example:', diagram.nodes[0]); // Let's see a single node structure
  
  // Calculate layout positions with adjusted spacing
  const layoutNodes = useMemo(() => {
    // Base spacing configuration
    const spacing = {
      x: 400,    // Horizontal spacing between nodes
      y: 300,    // Vertical spacing between rows
      margin: {
        top: 100,    // Top margin
        left: 100,   // Left margin
        bottom: 150  // Extra bottom margin
      }
    };

    // Create a layout that gives more space to bottom nodes
    return diagram.nodes.map((node, index) => {
      const isBottomRow = index >= 3; // Assuming first 3 nodes are top row
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      return {
        ...node,
        x: col * spacing.x + spacing.margin.left,
        y: row * spacing.y + spacing.margin.top + (isBottomRow ? spacing.margin.bottom : 0)
      };
    });
  }, [diagram]);

  const dimensions = useMemo(() => {
    if (!layoutNodes.length) return { width: 1200, height: 800 };
    
    const maxX = Math.max(...layoutNodes.map(n => n.x + 300));
    const maxY = Math.max(...layoutNodes.map(n => n.y + 250)); // Increased node height consideration
    
    return {
      width: Math.max(maxX + 100, 1200),  // Added right margin
      height: Math.max(maxY + 100, 800)   // Added bottom margin
    };
  }, [layoutNodes]);

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
      
      {/* Diagram container with explicit dimensions */}
      <div 
        className="relative overflow-auto border border-n-6 rounded-lg"
        style={{ 
          height: '900px' // Increased container height
        }}
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
          {/* Nodes */}
          {layoutNodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute bg-n-6 rounded-xl p-4"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: '250px'
              }}
            >
              {/* Node content */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {node.label}
              </h3>
              <p className="text-sm text-n-3 mb-3">
                {node.description}
              </p>
              <div className="space-y-2">
                {node.technologies && Object.entries(node.technologies).map(([category, techs]) => (
                  <div key={category}>
                    <span className="text-xs text-n-4">{category}:</span>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(techs) ? techs.map(tech => (
                        <span
                          key={tech}
                          className="text-xs bg-n-7 text-n-2 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      )) : Object.keys(techs).map(tech => (
                        <span
                          key={tech}
                          className="text-xs bg-n-7 text-n-2 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Connections with explicit SVG dimensions */}
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="absolute top-0 left-0 pointer-events-none"
          >
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
            {diagram.connections?.map((connection, index) => (
              <g key={`${connection.from}-${connection.to}`}>
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  d={calculatePath(
                    findNodePosition(layoutNodes, connection.from),
                    findNodePosition(layoutNodes, connection.to)
                  )}
                  stroke="#2A85FF"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const findNodePosition = (nodes, id) => {
  const node = nodes.find(n => n.id === id);
  return node ? { x: node.x + 125, y: node.y + 30 } : null;
};

const calculatePath = (start, end) => {
  if (!start || !end) return '';
  
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  return `M ${start.x} ${start.y} 
          Q ${midX} ${start.y}, ${midX} ${midY}
          Q ${midX} ${end.y}, ${end.x} ${end.y}`;
};

export default DiagramView; 