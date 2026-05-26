import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiActivity, FiLayers, FiCheckCircle, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

const HUDSection = ({ title, icon: Icon, children, className = '', accent = false }) => {
    const { isDarkMode } = useTheme();
    return (
        <div className={`p-5 rounded-lg border ${
            accent
                ? isDarkMode
                    ? 'bg-primary-1/5 border-primary-1/30'
                    : 'bg-primary-1/5 border-primary-1/20'
                : isDarkMode
                    ? 'bg-n-8 border-n-7'
                    : 'bg-gray-50 border-n-3'
        } ${className}`}>
            <h4 className={`text-sm font-mono uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2 ${
                accent
                    ? 'text-primary-1 border-primary-1/20'
                    : 'text-n-4 border-n-6'
            }`}>
                <Icon size={16} /> {title}
            </h4>
            {children}
        </div>
    );
};

const SimulationHUD = ({ result, loading }) => {
    const { isDarkMode } = useTheme();

    if (loading) return null;
    if (!result) return null;

    const { architecture, metrics, capabilities, technologies, directAnswer, relevantCapabilities } = result;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5 h-full font-mono"
        >
            {/* ── 0. QUERY RESPONSE — direct answer, shown first ── */}
            {directAnswer && (
                <HUDSection title="Query Response" icon={FiMessageSquare} accent>
                    <div className="space-y-3">
                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                            {directAnswer}
                        </p>
                        {relevantCapabilities && relevantCapabilities.length > 0 && (
                            <div className="flex flex-col gap-1.5 pt-2 border-t border-primary-1/10">
                                {relevantCapabilities.map((cap, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        className="flex items-start gap-2 text-xs text-primary-1"
                                    >
                                        <FiArrowRight className="shrink-0 mt-0.5" size={12} />
                                        {cap}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </HUDSection>
            )}

            {/* ── 1. Processing Steps — query-specific flow ── */}
            {architecture?.components && architecture.components.length > 0 && (
                <HUDSection title="Execution Flow" icon={FiLayers}>
                    <div className="space-y-2">
                        {architecture.components.slice(0, 4).map((comp, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -5, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.08 + 0.2 }}
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                    comp.highlighted
                                        ? isDarkMode
                                            ? 'bg-primary-1/10 border-primary-1/30'
                                            : 'bg-primary-1/5 border-primary-1/20'
                                        : isDarkMode
                                            ? 'bg-n-9 border-n-7'
                                            : 'bg-white border-n-3'
                                }`}
                            >
                                <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold mt-0.5 ${
                                    comp.highlighted
                                        ? 'bg-primary-1 text-white'
                                        : isDarkMode ? 'bg-n-7 text-n-4' : 'bg-n-2 text-n-5'
                                }`}>
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${
                                        comp.highlighted
                                            ? 'text-primary-1'
                                            : isDarkMode ? 'text-n-2' : 'text-n-7'
                                    }`}>
                                        {comp.name}
                                    </div>
                                    <div className={`text-xs leading-relaxed ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                                        {comp.description}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </HUDSection>
            )}

            {/* ── 2. Live Telemetry ── */}
            {metrics && metrics.length > 0 && (
                <HUDSection title="Live Telemetry" icon={FiActivity}>
                    <div className="space-y-3">
                        {metrics.map((m, i) => {
                            const rawLabel = typeof m === 'string' ? m.split(':')[0] : m.label;
                            const rawValue = typeof m === 'string' ? m.split(':')[1] : m.value;
                            let percent = 50;
                            if (rawValue && rawValue.includes('%')) {
                                percent = Math.min(99, parseInt(rawValue.replace(/[^0-9]/g, '')) || 50);
                            } else if (rawValue && rawValue.toLowerCase().includes('ms')) {
                                percent = 85;
                            }
                            return (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-1 text-xs">
                                        <span className={`uppercase tracking-wide ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{rawLabel}</span>
                                        <span className="font-bold text-primary-1">{rawValue}</span>
                                    </div>
                                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-n-7' : 'bg-n-2'}`}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ duration: 0.9, delay: i * 0.1 }}
                                            className="h-full bg-primary-1 shadow-[0_0_8px_rgba(var(--color-primary-1-rgb),0.4)]"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </HUDSection>
            )}

            {/* ── 3. Tech Stack ── */}
            {technologies && technologies.length > 0 && (
                <HUDSection title="Neural Stack" icon={FiCpu}>
                    <div className="grid grid-cols-2 gap-2">
                        {technologies.slice(0, 6).map((tech, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className={`flex items-center gap-2 p-2.5 rounded-lg border ${isDarkMode ? 'bg-n-8 border-n-7' : 'bg-white border-n-3'}`}
                            >
                                {tech.iconUrl ? (
                                    <img src={tech.iconUrl} alt={tech.name} className="w-6 h-6 object-contain shrink-0" />
                                ) : (
                                    <span className="text-base shrink-0">⚡</span>
                                )}
                                <span className={`text-xs font-semibold truncate ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>{tech.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </HUDSection>
            )}

            {/* ── 4. Active Capabilities ── */}
            {capabilities && capabilities.length > 0 && (
                <HUDSection title="Active Modules" icon={FiCheckCircle}>
                    <div className="flex flex-wrap gap-2">
                        {capabilities.map((cap, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className={`px-2.5 py-1 rounded text-xs uppercase border flex items-center gap-1.5 ${
                                    isDarkMode
                                        ? 'bg-primary-1/10 border-primary-1/20 text-primary-1'
                                        : 'bg-primary-1/5 border-primary-1/10 text-primary-1'
                                }`}
                            >
                                <FiCheckCircle size={11} />
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
