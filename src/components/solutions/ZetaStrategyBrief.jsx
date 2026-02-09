
import React from 'react';
import parse from 'html-react-parser';
import { FiTarget, FiCrosshair, FiZap } from 'react-icons/fi';

const ZetaStrategyBrief = ({ industryApp }) => {
    if (!industryApp) return null;
    const { industryChallenge, jediApproach, keyCapabilities, applicationTitle } = industryApp;

    return (
        <div className="grid gap-10 lg:grid-cols-2 mb-20 items-start">
            {/* Target Analysis (Challenge) */}
            <div className="bg-n-8 border border-n-6 rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FiTarget size={120} />
                </div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-color-1/10 flex items-center justify-center text-color-1">
                        <FiTarget size={20} />
                    </div>
                    <h3 className="h4 text-n-1">Target Analysis</h3>
                </div>
                <div className="body-2 text-n-3 space-y-4">
                    {industryChallenge?.html ? parse(industryChallenge.html) : <p>Analysis pending...</p>}
                </div>
            </div>

            {/* Tactical Response (Approach) */}
            <div className="bg-n-8 border border-primary-1/30 rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary-1">
                    <FiZap size={120} />
                </div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary-1/10 flex items-center justify-center text-primary-1">
                        <FiCrosshair size={20} />
                    </div>
                    <h3 className="h4 text-n-1">Tactical Response</h3>
                </div>
                <div className="body-2 text-n-3 space-y-4">
                    {jediApproach?.html ? parse(jediApproach.html) : <p>Strategy formulation in progress...</p>}
                </div>

                {/* Capabilities Grid */}
                {keyCapabilities && keyCapabilities.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-n-6">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-n-4 mb-4">Core Capabilities</h4>
                        <div className="flex flex-wrap gap-2">
                            {keyCapabilities.map((cap, i) => (
                                <span key={i} className="px-3 py-1 rounded bg-n-7 text-xs font-mono text-primary-1 border border-n-6">
                                    {cap}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Origin Tag */}
            <div className="col-span-full text-center mt-4">
                <span className="text-[10px] uppercase tracking-widest text-n-5">
                    Intelligence Source: {applicationTitle} (Deployment Ref)
                </span>
            </div>
        </div>
    );
};

export default ZetaStrategyBrief;
