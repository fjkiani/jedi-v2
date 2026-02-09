
import React from 'react';
import { initial } from 'lodash';
import { Icon } from '@/components/Icon';

const TechLoadout = ({ techStack }) => {
    if (!techStack || Object.keys(techStack).length === 0) return null;

    return (
        <div className="w-full font-mono text-sm">
            <div className="flex items-center gap-2 mb-6 opacity-50 uppercase tracking-widest text-xs">
                <span className="w-2 h-2 bg-primary-1 animate-pulse rounded-full"></span>
                <span>System Loadout // Arsenal</span>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(techStack).map(([category, techs]) => (
                    <div key={category} className="group">
                        <h3 className="text-primary-1 mb-3 uppercase tracking-wider text-xs border-b border-n-6 pb-1 flex justify-between">
                            <span>{`>> ${category}`}</span>
                            <span className="opacity-50">{Object.keys(techs).length}</span>
                        </h3>

                        <ul className="space-y-2">
                            {Object.entries(techs).map(([techName, details]) => (
                                <li key={techName} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-default">
                                    {details.icon ? (
                                        <img src={details.icon} alt={techName} className="w-5 h-5 object-contain opacity-80" />
                                    ) : (
                                        <div className="w-5 h-5 bg-n-6 rounded flex items-center justify-center text-[10px]">
                                            {techName.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-n-1 leading-none">{techName}</span>
                                        {/* Optional: Add version or status if available later */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechLoadout;
