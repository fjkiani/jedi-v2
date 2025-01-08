import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { Icon } from '@/components/Icon';

export const JEDIDiagramView = ({ diagram, showHeader = true }) => {
  const [hoveredNode, setHoveredNode] = useState(null);

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
    draggable: true, // Enable node dragging
    data: {
      label: (
        <div 
          className={`bg-n-8/80 backdrop-blur p-4 rounded-lg border border-n-6 min-w-[200px] text-center transition-all duration-200 ${
            hoveredNode === node.id ? 'scale-105' : ''
          }`}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <div className="font-semibold text-n-1 mb-2">{node.label}</div>
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
      stroke: '#6366f1',
      strokeDasharray: '5 5',
      strokeWidth: 2
    },
    labelStyle: { 
      fill: '#9ca3af', 
      fontSize: '12px'
    }
  }));

  return (
    <div className="space-y-6">
      {/* Title and Description - Only shown if showHeader is true */}
      {showHeader && (
        <div className="text-center mb-8">
          <h3 className="h4 mb-4">{diagram.title}</h3>
          <p className="text-n-3">{diagram.description}</p>
        </div>
      )}

      {/* Diagram Container */}
      <div className="relative h-[600px] bg-n-8 rounded-lg border border-n-6">
        {/* Drag Instructions */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-lg bg-n-6/80 backdrop-blur-sm text-sm text-n-3">
          <Icon name="cursor-grab" className="w-4 h-4" />
          <span>Drag to explore</span>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          className="react-flow-dark"
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
          <Background color="#4b5563" gap={16} />
          <Controls className="react-flow-controls" />
          <MiniMap 
            style={{
              backgroundColor: 'var(--color-n-7)',
              maskImage: 'linear-gradient(to bottom, transparent, black)'
            }}
            nodeColor="#6366f1"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default JEDIDiagramView; 