import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Section from './Section';
import { FiActivity, FiCpu, FiGlobe, FiShield, FiTrendingUp, FiZap, FiTarget } from 'react-icons/fi';

const industries = [
    { id: 'fin', name: 'Finance', icon: FiTrendingUp, status: 'SECURED', desc: 'Algorithmic Trading & Risk Analysis' },
    { id: 'health', name: 'Healthcare', icon: FiActivity, status: 'MONITORING', desc: 'Diagnostic Imaging & Patient Data' },
    { id: 'energy', name: 'Energy', icon: FiZap, status: 'OPTIMIZED', desc: 'Grid Load Balancing & forecasting' },
    { id: 'def', name: 'Defense', icon: FiShield, status: 'RESTRICTED', desc: 'Threat Detection & Logistics' },
    { id: 'mfg', name: 'Industrial', icon: FiCpu, status: 'AUTOMATED', desc: 'Predictive Maintenance & QC' },
    { id: 'log', name: 'Logistics', icon: FiGlobe, status: 'TRACKING', desc: 'Global Supply Chain Optimization' },
];

const IndustryTargetingGrid = () => {
    const { isDarkMode } = useTheme();

    return (
        <Section className="overflow-hidden" id="targeting-grid">
            <div className="container relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className={`h2 mb-4 font-mono uppercase tracking-tight ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                        Operational Sectors
                    </h2>
                    <div className={`flex items-center justify-center gap-2 font-mono text-sm tracking-wider uppercase ${isDarkMode ? 'text-n-4' : 'text-n-6'}`}>
                        <FiTarget className="text-primary-1 animate-pulse" />
                        <span>Industries We Transform</span>
                    </div>
                </div>

                {/* The Grid - Responsive Grid that looks like a HUD */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {industries.map((ind, i) => (
                        <motion.div
                            key={ind.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative p-6 border group hover:scale-[1.02] transition-transform duration-300 cursor-default overflow-hidden ${isDarkMode
                                ? 'bg-n-8/50 border-n-6 hover:border-primary-1 hover:bg-n-8'
                                : 'bg-white border-n-3 hover:border-primary-1 hover:shadow-lg'
                                }`}
                        >
                            {/* Crosshairs */}
                            <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-n-4/30"></div>
                            <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-n-4/30"></div>
                            <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-n-4/30"></div>
                            <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-n-4/30"></div>

                            {/* Content */}
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-n-7 text-primary-1' : 'bg-primary-1/10 text-primary-1'}`}>
                                    <ind.icon size={24} />
                                </div>
                                <div className="text-right">
                                    <div className={`text-[10px] font-mono mb-1 ${isDarkMode ? 'text-n-5' : 'text-n-4'}`}>STATUS</div>
                                    <div className={`text-xs font-mono font-bold tracking-tighter ${ind.status === 'RESTRICTED' ? 'text-red-500' : 'text-green-500'}`}>{ind.status}</div>
                                </div>
                            </div>

                            <h3 className={`text-xl font-mono uppercase mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{ind.name}</h3>
                            <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{ind.desc}</p>

                            <div className="flex items-center gap-2 pt-4 border-t border-dashed border-n-4/20">
                                <div className={`w-1.5 h-1.5 rounded-full bg-primary-1 animate-pulse`}></div>
                                <span className={`text-xs font-mono tracking-widest ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`}>DEPLOY_READY</span>
                            </div>

                            {/* Hover Scan Effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary-1/50 opacity-0 group-hover:opacity-100 group-hover:animate-scan-line pointer-events-none"></div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </Section>
    );
};

export default IndustryTargetingGrid;
