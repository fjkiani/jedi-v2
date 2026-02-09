
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FiChevronRight, FiLayers, FiDatabase, FiSettings, FiCpu, FiGlobe, FiShield, FiCode } from 'react-icons/fi';
import Heading from '@/components/Heading';

// Icon Map for Categories (Hardcoded for now based on likely names)
const CATEGORY_ICONS = {
    "Agent Core": FiCpu,
    "Databases": FiDatabase,
    "General Technology": FiGlobe,
    "Security": FiShield,
    "DevOps": FiSettings,
    "API Layer": FiCode,
    "Infrastructure": FiLayers
};

const TechStream = ({ techStack }) => {
    const { isDarkMode } = useTheme();

    if (!techStack || Object.keys(techStack).length === 0) return null;

    const categories = Object.entries(techStack);

    return (
        <div className="relative">
            {/* Vertical Connecting Line */}
            <div className={`absolute left-8 top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-n-6' : 'bg-n-3'}`} />

            <div className="space-y-16 py-10">
                {categories.map(([categoryName, techs], index) => {
                    const IconComponent = CATEGORY_ICONS[categoryName] || FiLayers;

                    return (
                        <motion.div
                            key={categoryName}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative pl-24"
                        >
                            {/* Timeline Node */}
                            <div className={`absolute left-0 w-16 h-16 rounded-2xl flex items-center justify-center border-4 z-10 
                  ${isDarkMode ? 'bg-n-8 border-n-6 text-primary-1 process-circle-dark' : 'bg-white border-n-1 text-primary-1 process-circle-light'}`}>
                                <IconComponent size={24} />
                            </div>

                            {/* Content Card */}
                            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-white border-n-3 shadow-sm'}`}>
                                <h3 className={`h4 mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{categoryName}</h3>
                                <p className={`text-sm mb-6 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                                    Operational Layer :: Level {index + 1}
                                </p>

                                {/* Tech Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {Object.entries(techs).map(([techName, details], tIdx) => (
                                        <div key={techName} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors 
                          ${isDarkMode ? 'bg-n-7/50 border-n-6 hover:border-n-5' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>

                                            {details.icon ? (
                                                <img src={details.icon} alt={techName} className="w-8 h-8 object-contain p-1 bg-white rounded-lg" />
                                            ) : (
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isDarkMode ? 'bg-n-6 text-n-3' : 'bg-n-3 text-n-6'}`}>
                                                    {techName.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}

                                            <div>
                                                <div className={`font-bold text-sm ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{techName}</div>
                                                <div className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                                                    {details.category || 'Tech'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default TechStream;
