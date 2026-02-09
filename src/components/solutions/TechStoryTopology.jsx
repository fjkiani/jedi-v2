
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
    FiCpu, FiDatabase, FiGlobe, FiShield, FiSettings, FiCode, FiLayers,
    FiServer, FiGrid, FiActivity, FiZap, FiLayout
} from 'react-icons/fi';

// Mapped Icons for Specific Categories
const CATEGORY_ICONS = {
    // Core Infrastructure
    "Agent Core": FiCpu,
    "AI Agents": FiCpu, // Hygraph
    "Databases": FiDatabase,
    "Data Engineering": FiDatabase, // Hygraph
    "General Technology": FiGlobe,
    "Security": FiShield,
    "DevOps": FiSettings,
    "Automation": FiZap, // Hygraph
    "System Integration": FiLayers, // Hygraph
    "API Layer": FiCode,
    "Infrastructure": FiServer,
    "Frontend": FiLayout,
    "Frontend Development": FiLayout, // Hygraph
    "Backend": FiServer,
    "AI/ML": FiActivity,
    "Machine-Learning": FiActivity, // Hygraph
    "Decision Algorithms": FiActivity, // Hygraph
    "Task Planning": FiGrid, // Hygraph
    "Continuous Learning": FiActivity // Hygraph
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const TechStoryTopology = ({ techStack }) => {
    const { isDarkMode } = useTheme();
    const categories = Object.entries(techStack);

    return (
        <div className={`relative py-10 ${isDarkMode ? 'bg-n-8' : 'bg-transparent'}`}>

            {/* Background Circuitry - Decorative */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-1 to-transparent`} />
                <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-1 to-transparent`} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-n-8 via-transparent to-transparent opacity-50" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
            >
                {categories.map(([categoryName, techs], index) => {
                    const IconComponent = CATEGORY_ICONS[categoryName] || FiLayers;
                    const techCount = Object.keys(techs).length;

                    return (
                        <motion.div
                            key={categoryName}
                            variants={itemVariants}
                            className={`group relative overflow-hidden rounded-xl border transition-all duration-300
                                ${isDarkMode
                                    ? 'bg-n-8/80 border-n-6 hover:border-primary-1/50 hover:bg-n-7'
                                    : 'bg-white/80 border-n-3 hover:border-primary-1/50 shadow-sm hover:shadow-md'}
                            `}
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-primary-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Card Header & Status */}
                            <div className="p-5 border-b border-n-6/50 flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-n-7 text-primary-1' : 'bg-n-1 text-primary-1 shadow-inner'}`}>
                                        <IconComponent size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider">{categoryName}</h3>
                                        <div className="text-[10px] font-mono text-n-4 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            ONLINE // {techCount} NODES
                                        </div>
                                    </div>
                                </div>
                                <div className="font-mono text-[10px] text-n-5 opacity-50">
                                    SYS-{index.toString().padStart(2, '0')}
                                </div>
                            </div>

                            {/* Tech Grid Content */}
                            <div className="p-4 grid grid-cols-2 gap-2">
                                {Object.entries(techs).map(([techName, details]) => {
                                    const TechWrapper = details.slug ? Link : 'div';
                                    const techProps = details.slug ? { to: `/technology/${details.slug}` } : {};
                                    return (
                                        <TechWrapper key={techName} {...techProps} className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 transition-colors group/tech">
                                            {/* Micro Icon */}
                                            <div className="w-6 h-6 flex items-center justify-center opacity-80 group-hover/tech:opacity-100 transition-opacity flex-shrink-0">
                                                {details.icon ? (
                                                    <img src={details.icon} alt={techName} className="max-w-full max-h-full object-contain" />
                                                ) : (
                                                    <FiZap size={12} className="text-n-4" />
                                                )}
                                            </div>
                                            <span className={`text-xs font-mono truncate ${isDarkMode ? 'text-n-3 group-hover/tech:text-n-1' : 'text-n-6 group-hover/tech:text-n-8'} ${details.slug ? 'group-hover/tech:text-primary-1' : ''}`}>
                                                {techName}
                                            </span>
                                        </TechWrapper>
                                    );
                                })}
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-2 h-2 border-t border-r border-primary-1" />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* System Footer Decoration */}
            <div className="mt-8 flex justify-center opacity-50">
                <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-n-4">
                    <span>Architecture Verified</span>
                    <span className="w-4 h-[1px] bg-n-6" />
                    <span>Zeta Protocol v2.0</span>
                </div>
            </div>
        </div>
    );
};

export default TechStoryTopology;
