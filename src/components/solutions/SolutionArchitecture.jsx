import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Icon } from '@/components/Icon';
import ArchitectureDiagram from '@/components/diagrams/ArchitectureDiagram';
import Heading from '@/components/Heading';
import { FiCheck, FiCpu, FiDatabase, FiServer, FiGlobe, FiLayers } from 'react-icons/fi';

const SolutionArchitecture = ({ architecture, solutionId }) => {
    const { isDarkMode } = useTheme();
    const [activeNode, setActiveNode] = useState(null);

    if (!architecture) return null;

    const handleNodeClick = (nodeId) => {
        setActiveNode(activeNode === nodeId ? null : nodeId);
    };

    return (
        <div className="w-full">
            <Heading title={architecture.title || "System Architecture"} text={architecture.description} className="mb-10 text-center" />

            {/* Interactive Diagram Section */}
            <div className={`rounded-3xl overflow-hidden border mb-16 h-[600px] relative w-full ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-white border-n-3 shadow-lg'}`}>
                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary-1 text-white text-xs font-bold rounded uppercase tracking-wider">
                    Interactive Map
                </div>
                <ArchitectureDiagram
                    architecture={architecture}
                    onNodeClick={handleNodeClick}
                    className="w-full h-full"
                />
            </div>

            {/* Deep Dive Grid */}
            <div className="grid gap-8 mt-12">
                {architecture.nodes.map((node, index) => (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-8 rounded-2xl border transition-all duration-300 group
                    ${activeNode === node.id ? 'ring-2 ring-primary-1' : ''}
                    ${isDarkMode
                                ? 'bg-n-7 border-n-6 hover:bg-n-6'
                                : 'bg-white border-n-3 hover:border-primary-1 hover:shadow-xl'
                            }`}
                        id={`node-${node.id}`}
                    >
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Header & Description */}
                            <div className="md:w-1/3 shrink-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-primary-1 ${isDarkMode ? 'bg-n-6' : 'bg-primary-1/10'}`}>
                                        <Icon name={getNodeIcon(node.label)} className="w-5 h-5" />
                                    </div>
                                    <h3 className={`h4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{node.label}</h3>
                                </div>
                                <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                    {node.description}
                                </p>
                            </div>

                            {/* Technologies Deep Dive */}
                            <div className={`md:w-2/3 md:pl-8 md:border-l ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}>
                                {node.technologies ? (
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {Object.entries(node.technologies).map(([category, items]) => (
                                            <div key={category}>
                                                <h4 className={`text-xs font-mono font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-n-4' : 'text-n-4'}`}>
                                                    {category.replace(/([A-Z])/g, ' $1').trim()}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {Array.isArray(items) ? (
                                                        items.map((item, i) => (
                                                            <span
                                                                key={i}
                                                                className={`text-xs px-2.5 py-1 rounded border font-medium flex items-center gap-1.5
                                                            ${isDarkMode
                                                                        ? 'bg-n-6 text-n-1 border-n-5'
                                                                        : 'bg-n-2 text-n-6 border-n-3'}`}
                                                            >
                                                                {item}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        // Object structure fallback if exists
                                                        <span className="text-xs text-n-4">Complex object...</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center opacity-30 text-xs italic">
                                        Infrastructure details abstracted
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Helper to guess icon based on label
const getNodeIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes('data')) return 'database';
    if (l.includes('model') || l.includes('training')) return 'cpu';
    if (l.includes('api') || l.includes('serving')) return 'server';
    if (l.includes('ui') || l.includes('frontend')) return 'layout';
    if (l.includes('monitoring')) return 'activity';
    return 'circle';
};

export default SolutionArchitecture;
