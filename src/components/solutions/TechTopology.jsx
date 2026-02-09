
import React, { useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTheme } from '@/context/ThemeContext'; // Import Theme Context!

// Custom Node: Tech (Lowest Level)
const TechNode = ({ data }) => {
    const { isDarkMode } = useTheme();
    return (
        <div className={`px-4 py-2 shadow-md rounded-md border min-w-[150px] text-center transition-colors 
            ${isDarkMode ? 'bg-n-8 border-n-6 text-n-1' : 'bg-white border-n-3 text-n-8'}`}>
            <Handle type="target" position={Position.Left} className={`w-2 h-2 ${isDarkMode ? 'bg-primary-1' : 'bg-primary-1'}`} />
            <div className="flex items-center justify-center gap-2 mb-1">
                {data.icon && <img src={data.icon} className="w-4 h-4 object-contain" alt="" />}
                <div className={`text-xs font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{data.label}</div>
            </div>
            {data.category && <div className={`text-[10px] tracking-wider uppercase ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{data.category}</div>}
            <Handle type="source" position={Position.Right} className={`w-2 h-2 ${isDarkMode ? 'bg-primary-1' : 'bg-primary-1'}`} />
        </div>
    );
};

// Custom Node: Subcategory (Middle Level)
const SubCategoryNode = ({ data }) => {
    const { isDarkMode } = useTheme();
    return (
        <div className={`px-4 py-2 shadow-md rounded-md border min-w-[120px] text-center transition-colors
            ${isDarkMode ? 'bg-n-7 border-primary-1 text-primary-1' : 'bg-gray-50 border-primary-1 text-primary-1'}`}>
            <Handle type="target" position={Position.Left} className={isDarkMode ? '!bg-n-1' : '!bg-n-8'} />
            <div className="text-xs font-bold uppercase tracking-widest">{data.label}</div>
            <Handle type="source" position={Position.Right} className={isDarkMode ? '!bg-n-1' : '!bg-n-8'} />
        </div>
    );
};

// Custom Node: Root (Solution Level)
const RootNode = ({ data }) => {
    const { isDarkMode } = useTheme();
    return (
        <div className={`px-6 py-3 shadow-lg rounded-xl min-w-[150px] text-center border-2 transition-colors
            ${isDarkMode ? 'bg-primary-1 text-n-1 border-n-1' : 'bg-primary-1 text-white border-white'}`}>
            <div className="text-sm font-black uppercase tracking-widest">{data.label}</div>
            <Handle type="source" position={Position.Right} className={isDarkMode ? '!bg-n-8' : '!bg-white'} />
        </div>
    );
};

const nodeTypes = {
    tech: TechNode,
    subcategory: SubCategoryNode,
    root: RootNode,
};

const TechTopology = ({ solutionName, techStack }) => {
    const { isDarkMode } = useTheme(); // Hook into Theme

    const { nodes, edges } = useMemo(() => {
        if (!techStack) return { nodes: [], edges: [] };

        const nodes = [];
        const edges = [];

        // Root Node (The Solution)
        const rootId = 'root';
        nodes.push({
            id: rootId,
            type: 'root',
            data: { label: solutionName },
            position: { x: 0, y: 300 }, // Vertical Center rough estimate
        });

        const subcats = Object.entries(techStack);
        const subcatSpacingY = 150;
        const startY = 300 - ((subcats.length - 1) * subcatSpacingY) / 2;

        subcats.forEach(([subcatName, techs], idx) => {
            const subcatId = `sub-${idx}`;
            const subcatY = startY + (idx * subcatSpacingY);

            // Subcategory Node
            nodes.push({
                id: subcatId,
                type: 'subcategory',
                data: { label: subcatName },
                position: { x: 300, y: subcatY },
            });

            // Edge Root -> Subcat
            edges.push({
                id: `e-${rootId}-${subcatId}`,
                source: rootId,
                target: subcatId,
                animated: true,
                style: { stroke: '#AC6AFF' },
            });

            // Tech Nodes
            const techList = Object.entries(techs);
            const techSpacingY = 60;
            const techStartY = subcatY - ((techList.length - 1) * techSpacingY) / 2;

            techList.forEach(([techName, details], tIdx) => {
                const techId = `tech-${idx}-${tIdx}`;
                nodes.push({
                    id: techId,
                    type: 'tech',
                    data: { label: techName, icon: details.icon, category: details.category },
                    position: { x: 600, y: techStartY + (tIdx * techSpacingY) }, // Tier 3
                });

                // Edge Subcat -> Tech
                edges.push({
                    id: `e-${subcatId}-${techId}`,
                    source: subcatId,
                    target: techId,
                    style: { stroke: isDarkMode ? '#5F6368' : '#9CA3AF' }, // Dynamic Edge Color
                });
            });
        });

        return { nodes, edges };
    }, [solutionName, techStack, isDarkMode]);

    if (!techStack || Object.keys(techStack).length === 0) return null;

    return (
        <div className={`w-full h-[600px] border rounded-2xl overflow-hidden relative group transition-colors 
            ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-gray-50 border-n-3'}`}>

            <div className={`absolute top-4 left-4 z-10 text-xs font-mono uppercase transition-colors
                ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
          >> SYSTEM_TOPOLOGY.VISUALIZER
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-right"
            >
                <Background
                    color={isDarkMode ? "#2E3036" : "#E5E7EB"}
                    gap={20}
                    size={1}
                />
                <Controls className={isDarkMode ? '!bg-n-7 !border-n-6 !fill-n-1' : '!bg-white !border-gray-200 !fill-gray-700'} />
            </ReactFlow>
        </div>
    );
};

export default TechTopology;
