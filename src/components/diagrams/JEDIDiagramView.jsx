import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { Icon } from '@/components/Icon';
import { useTheme } from '@/context/ThemeContext';

export const JEDIDiagramView = ({ diagram, showHeader = true }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const { isDarkMode } = useTheme();

  if (!diagram?.nodes) {
    return (
      <div className="text-center text-n-3 py-8">
        <p>No diagram data available</p>
      </div>
    );
  }

  // Transform nodes to ReactFlow format
  const nodes = diagram.nodes.map(node => ({
    id: node.id,
    position: { x: node.x, y: node.y },
    draggable: true,
    data: {
      label: (
        <div 
          className={`${isDarkMode ? 'bg-n-8/80' : 'bg-white/80'} backdrop-blur p-4 rounded-lg border ${isDarkMode ? 'border-n-6' : 'border-n-3'} min-w-[200px] text-center transition-all duration-200 ${
            hoveredNode === node.id ? 'scale-105' : ''
          }`}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <div className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'} mb-2`}>{node.label}</div>
          <div className="text-sm text-n-3">{node.description}</div>
        </div>
      )
    },
    style: {
      background: 'transparent',
      border: 'none',
      width: 'auto',
      cursor: 'grab'
    }
  }));

  // Transform connections to ReactFlow format with dotted style
  const edges = diagram.connections.map(conn => ({
    id: `${conn.from}-${conn.to}`,
    source: conn.from,
    target: conn.to,
    label: conn.label,
    type: 'smoothstep',
    animated: true,
    style: { 
      stroke: isDarkMode ? '#6366f1' : '#4f46e5',
      strokeDasharray: '5 5',
      strokeWidth: 2
    },
    labelStyle: { 
      fill: isDarkMode ? '#9ca3af' : '#6b7280', 
      fontSize: '12px'
    }
  }));

  return (
    <div className="space-y-6">
      {/* Title and Description - Only shown if showHeader is true */}
      {showHeader && (
        <div className="text-center mb-8">
          <h3 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{diagram.title}</h3>
          <p className="text-n-3">{diagram.description}</p>
        </div>
      )}

      {/* Diagram Container */}
      <div className={`relative h-[600px] ${isDarkMode ? 'bg-n-8' : 'bg-white'} rounded-lg border ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}>
        {/* Drag Instructions */}
        <div className={`absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-n-6/80' : 'bg-n-2/80'} backdrop-blur-sm text-sm text-n-3`}>
          <Icon name="cursor-grab" className="w-4 h-4" />
          <span>Trackpad to explore</span>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          className={isDarkMode ? 'react-flow-dark' : 'react-flow-light'}
          minZoom={0.2}
          maxZoom={1.5}
          defaultViewport={{ zoom: 0.8 }}
          panOnScroll={true}
          panOnDrag={true}
          selectionOnDrag={false}
          zoomOnScroll={true}
          nodesDraggable={true}
          preventScrolling={false}
        >
          <Background color={isDarkMode ? '#4b5563' : '#9ca3af'} gap={16} />
          <Controls className="react-flow-controls" />
          <MiniMap 
            style={{
              backgroundColor: isDarkMode ? 'var(--color-n-7)' : 'var(--color-n-2)',
              maskImage: 'linear-gradient(to bottom, transparent, black)'
            }}
            nodeColor={isDarkMode ? '#6366f1' : '#4f46e5'}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default JEDIDiagramView; 