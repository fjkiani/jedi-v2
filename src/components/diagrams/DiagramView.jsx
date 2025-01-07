import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export const DiagramView = ({ diagram }) => {
  if (!diagram || !diagram.nodes) {
    return <div>No diagram data available</div>;
  }

  // Transform nodes to ReactFlow format
  const nodes = diagram.nodes.map(node => ({
    id: node.id,
    position: { x: node.x, y: node.y },
    data: {
      label: (
        <div className="bg-n-8/80 backdrop-blur p-4 rounded-lg border border-n-6 min-w-[200px] text-center">
          <div className="font-semibold text-n-1 mb-2">{node.label}</div>
          <div className="text-sm text-n-3">{node.description}</div>
        </div>
      )
    },
    style: {
      background: 'transparent',
      border: 'none',
      width: 'auto'
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
    <div className="h-[600px] bg-n-8 rounded-lg border border-n-6">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        className="react-flow-dark"
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ zoom: 0.8 }}
      >
        <Background color="#4b5563" gap={16} />
        <Controls className="react-flow-controls" />
      </ReactFlow>
    </div>
  );
};

export default DiagramView;
