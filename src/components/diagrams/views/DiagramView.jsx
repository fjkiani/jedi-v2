import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { DiagramConnection } from '../DiagramConnection';

export const DiagramView = ({ diagram }) => {
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    console.log('Diagram prop structure:', {
      hasNodes: !!diagram?.nodes,
      nodesLength: diagram?.nodes?.length,
      nodesType: typeof diagram?.nodes,
      firstNode: diagram?.nodes?.[0],
      hasConnections: !!diagram?.connections,
      connectionsLength: diagram?.connections?.length,
      raw: diagram
    });
  }, [diagram]);

  // Calculate layout positions with adjusted spacing
  const layoutNodes = useMemo(() => {
    if (!diagram?.nodes?.length) {
      console.warn('No nodes provided to DiagramView', {
        diagram,
        nodes: diagram?.nodes,
        isArray: Array.isArray(diagram?.nodes)
      });
      return [];
    }

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
    const nodes = diagram.nodes.map((node, index) => {
      console.log('Processing node:', {
        node,
        index,
        hasId: !!node?.id,
        nodeType: typeof node
      });

      if (!node?.id) {
        console.warn('Node missing ID:', node);
        return null;
      }

      const isBottomRow = index >= 3; // Assuming first 3 nodes are top row
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      // Log calculation values
      console.log('Position calculation values:', {
        index,
        row,
        col,
        isBottomRow,
        spacingX: spacing.x,
        spacingY: spacing.y,
        marginLeft: spacing.margin.left,
        marginTop: spacing.margin.top,
        marginBottom: spacing.margin.bottom
      });
      
      // Ensure x and y are numbers
      const x = Number(col * spacing.x + spacing.margin.left);
      const y = Number(row * spacing.y + spacing.margin.top + (isBottomRow ? spacing.margin.bottom : 0));
      
      if (isNaN(x) || isNaN(y)) {
        console.error('Invalid position calculation:', {
          col, row, spacing, margin: spacing.margin, isBottomRow,
          calculations: {
            x: `${col} * ${spacing.x} + ${spacing.margin.left} = ${x}`,
            y: `${row} * ${spacing.y} + ${spacing.margin.top} + ${isBottomRow ? spacing.margin.bottom : 0} = ${y}`
          }
        });
        return null;
      }
      
      const result = {
        ...node,
        x,
        y
      };

      console.log(`Node ${node.id} final position:`, {
        id: node.id,
        x,
        y,
        isBottomRow,
        row,
        col
      });
      return result;
    }).filter(Boolean);

    console.log('Final processed nodes:', nodes);
    return nodes;
  }, [diagram]);

  const dimensions = useMemo(() => {
    if (!layoutNodes.length) {
      console.warn('No layout nodes available for dimension calculation');
      return { width: 1200, height: 800 };
    }
    
    const nodeXs = layoutNodes.map(n => Number(n.x) + 300);
    const nodeYs = layoutNodes.map(n => Number(n.y) + 250);
    
    console.log('Node dimensions:', { xs: nodeXs, ys: nodeYs });
    
    const maxX = Math.max(...nodeXs);
    const maxY = Math.max(...nodeYs);
    
    if (isNaN(maxX) || isNaN(maxY)) {
      console.error('Invalid dimension calculation:', { nodeXs, nodeYs, maxX, maxY });
      return { width: 1200, height: 800 };
    }
    
    const result = {
      width: Math.max(maxX + 100, 1200),
      height: Math.max(maxY + 100, 800)
    };

    console.log('SVG dimensions:', result);
    return result;
  }, [layoutNodes]);

  // Helper function to find node by ID
  const findNode = (id) => {
    const node = layoutNodes.find(n => n.id === id);
    if (!node) {
      console.warn(`Node not found for ID: ${id}`);
      return null;
    }
    if (isNaN(node.x) || isNaN(node.y)) {
      console.error('Found node has invalid coordinates:', node);
      return null;
    }
    return node;
  };

  useEffect(() => {
    console.log('Connections:', diagram?.connections);
  }, [diagram]);

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
        style={{ height: '900px' }}
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
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
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
            {diagram.connections?.map((connection) => {
              const fromNode = findNode(connection.from);
              const toNode = findNode(connection.to);
              
              if (!fromNode || !toNode) {
                console.warn('Missing nodes for connection:', {
                  connection,
                  fromNode,
                  toNode
                });
                return null;
              }

              if (isNaN(fromNode.x) || isNaN(fromNode.y) || isNaN(toNode.x) || isNaN(toNode.y)) {
                console.error('Invalid node coordinates:', {
                  connection,
                  fromNode: { x: fromNode.x, y: fromNode.y },
                  toNode: { x: toNode.x, y: toNode.y }
                });
                return null;
              }

              console.log(`Connection ${connection.from}->${connection.to}:`, {
                fromNode: { x: fromNode.x, y: fromNode.y },
                toNode: { x: toNode.x, y: toNode.y }
              });
              
              return (
                <DiagramConnection
                  key={`${connection.from}-${connection.to}`}
                  connection={connection}
                  fromNode={fromNode}
                  toNode={toNode}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DiagramView; 