
import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiActivity, FiLayers, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

const HUDSection = ({ title, icon: Icon, children, className = '' }) => {
    const { isDarkMode } = useTheme();
    return (
        <div className={`p-5 rounded-lg border ${isDarkMode ? 'bg-n-8 border-n-7' : 'bg-gray-50 border-n-3'} ${className}`}>
            <h4 className="text-sm font-mono uppercase tracking-wider text-n-4 mb-4 flex items-center gap-2 border-b border-n-6 pb-2">
                <Icon size={16} /> {title}
            </h4>
            {children}
        </div>
    );
};

const SimulationHUD = ({ result, loading }) => {
    const { isDarkMode } = useTheme();

    if (loading) return null; // Parent handles loading state visual
    if (!result) return null;

    const { architecture, metrics, capabilities, technologies } = result;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 h-full font-mono"
        >
            {/* 1. Live Telemetry - Visual Bars */}
            {metrics && metrics.length > 0 && (
                <HUDSection title="Live Telemetry" icon={FiActivity}>
                    <div className="space-y-4">
                        {metrics.map((m, i) => {
                            // Extract Value/Label
                            const rawLabel = typeof m === 'string' ? m.split(':')[0] : m.label;
                            const rawValue = typeof m === 'string' ? m.split(':')[1] : m.value;

                            // Parse percentage for bar width if possible
                            let percent = 50; // Default
                            if (rawValue && rawValue.includes('%')) {
                                percent = parseInt(rawValue.replace('%', '').replace('+', '').replace('<', '').replace('>', ''));
                            } else if (rawValue && rawValue.toLowerCase().includes('ms')) {
                                percent = 85; // High speed
                            }

                            return (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-1.5 text-sm">
                                        <span className={`uppercase tracking-wide ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{rawLabel}</span>
                                        <span className={`font-bold ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`}>{rawValue}</span>
                                    </div>
                                    <div className={`h-2 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-n-7' : 'bg-n-2'}`}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="h-full bg-primary-1 shadow-[0_0_10px_rgba(var(--color-primary-1-rgb),0.5)]"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </HUDSection>
            )}

            {/* 2. System Architecture & Technologies */}
            <div className="grid grid-cols-2 gap-4">

                {/* Core Components */}
                {architecture && architecture.components && (
                    <HUDSection title="System Core" icon={FiLayers}>
                        <div className="space-y-3">
                            {architecture.components.slice(0, 3).map((comp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -5, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 + 0.3 }}
                                    className={`p-3 rounded-lg border relative overflow-hidden group hover:border-primary-1/50 transition-colors ${isDarkMode ? 'bg-n-9 border-n-7' : 'bg-white border-n-3'}`}
                                >
                                    <div className={`font-bold uppercase tracking-wider mb-1 text-sm ${isDarkMode ? 'text-n-1' : 'text-n-7'}`}>{comp.name}</div>
                                    <div className="text-n-4 leading-relaxed text-xs opacity-80">{comp.description}</div>
                                </motion.div>
                            ))}
                        </div>
                    </HUDSection>
                )}

                {/* Tech Stack - Use icon URL from Hygraph when available, else React icon component */}
                {technologies && technologies.length > 0 && (
                    <HUDSection title="Neural Stack" icon={FiCpu}>
                        <div className="grid grid-cols-2 gap-3">
                            {technologies.map((tech, i) => (
                                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-n-8 border-n-7' : 'bg-white border-n-3'}`}>
                                    {tech.iconUrl ? (
                                        <img src={tech.iconUrl} alt={tech.name} className="w-8 h-8 object-contain flex-shrink-0" />
                                    ) : (
                                        <span className="text-xl flex-shrink-0">⚡</span>
                                    )}
                                    <div className="text-sm font-semibold text-n-4 truncate">{tech.name}</div>
                                </div>
                            ))}
                        </div>
                    </HUDSection>
                )}

            </div>

            {/* 3. Active Capabilities - Grid */}
            {capabilities && capabilities.length > 0 && (
                <HUDSection title="Active Modules" icon={FiCheckCircle} className="flex-1">
                    <div className="flex flex-wrap gap-2">
                        {capabilities.map((cap, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`px-3 py-1.5 rounded text-xs uppercase border flex items-center gap-2 ${isDarkMode ? 'bg-primary-1/10 border-primary-1/20 text-primary-1' : 'bg-primary-1/5 border-primary-1/10 text-primary-1'}`}
                            >
                                <FiCheckCircle size={14} />
                                {cap}
                            </motion.div>
                        ))}
                    </div>
                </HUDSection>
            )}

        </motion.div>
    );
};

export default SimulationHUD;
