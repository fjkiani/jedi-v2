
import React, { useState, useEffect, useRef } from 'react';
import { FiPlay, FiCpu, FiTerminal, FiLoader, FiActivity } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { openAIService, getTechIconUrl } from '@/services/openAIService';
import SimulationHUD from './SimulationHUD';
import { motion, AnimatePresence } from 'framer-motion';

const ZetaSimulation = ({ useCase }) => {
    const { isDarkMode } = useTheme();
    const [terminalLogs, setTerminalLogs] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const logsEndRef = useRef(null);

    if (!useCase || !useCase.implementation) return null;

    const { implementation } = useCase;
    const queries = useCase.queries || implementation.queries || [
        "Initialize diagnostic scan sequence...",
        "Analyze data integrity...",
        "Generate optimization report..."
    ];

    // Auto-scroll logs
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [terminalLogs]);


    const addLog = (msg, type = 'info') => {
        setTerminalLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString('en-US', { hour12: false }) }]);
    };

    const runSimulation = async (query) => {
        if (isProcessing) return;

        setIsProcessing(true);
        setResult(null);
        setTerminalLogs([]); // Clear previous logs

        // Initial Command Log
        addLog(`COMMAND RECEIVED: ${query}`, 'cmd');
        await new Promise(r => setTimeout(r, 600));

        // Use dynamic flow from architecture if available
        console.log("ZetaSimulation Flow Length:", useCase.architecture?.flow?.length);
        const dynamics = useCase.architecture?.flow?.length > 0 ? useCase.architecture.flow.map(step => ({
            msg: `[${step.step}] ${step.description}`,
            delay: 400 + Math.random() * 600
        })) : [
            { msg: "Initializing JEDI Core v4.2...", delay: 800 },
            { msg: "Establishing secure uplink to Neural Grid...", delay: 1000 },
            { msg: "Processing input vectors...", delay: 1200 }
        ];

        // Execute Flow
        for (const step of dynamics) {
            addLog(step.msg, 'sys');
            await new Promise(r => setTimeout(r, step.delay));
        }

        // FEATURE: Render Technologies in Terminal
        if (useCase.technologies && useCase.technologies.length > 0) {
            addLog("LOADING_CORE_MODULES...", 'sys');
            await new Promise(r => setTimeout(r, 400));

            // Chunk them to look like loading bars or status checks
            for (const tech of useCase.technologies) {
                // If the tech object has an icon, we render it textually or just the name
                // Since this is a text terminal, we can't easily render React components inside the log state *string* 
                // unless we change the log structure to accept nodes.
                // WE WILL CHANG IT BELOW.
                addLog({
                    text: `MODULE_LOAD: ${tech.name ? tech.name.toUpperCase() : typeof tech === 'string' ? tech.toUpperCase() : 'UNKNOWN'}`,
                    iconUrl: getTechIconUrl(tech), // Hygraph icon or dynamic CDN URL
                    status: 'OK'
                }, 'tech');
                await new Promise(r => setTimeout(r, 200));
            }
        }

        try {
            // "Real" Logic (Mock or API) - we use the service to simulate delay/processing
            const response = await openAIService.generateResponse(
                useCase,
                query,
                {
                    capabilities: implementation.capabilities,
                    architecture: implementation.architecture,
                    metrics: useCase.metrics
                }
            );

            await new Promise(r => setTimeout(r, 500));
            addLog("Analysis Complete. Telemetry Loaded.", 'success');

            // Extract relevant data from the service response structure to match HUD expectations
            // The service returns sections. We map them back to the simple props HUD needs.
            const flowSection = response.sections.find(s => s.title === "IMPLEMENTATION FLOW");
            const systemSection = response.sections.find(s => s.title === "SYSTEM OVERVIEW");
            const capabilitySection = response.sections.find(s => s.title === "CAPABILITIES");

            // Helper to safe-get content
            const getContent = (section, subTitle) => section?.subsections?.find(sub => sub.title === subTitle)?.content || [];

            setResult({
                rawResponse: response,
                // Direct answer to the specific query — shown at top of HUD
                directAnswer: response.directAnswer || null,
                relevantCapabilities: response.relevantCapabilities || [],
                architecture: {
                    ...useCase.architecture,
                    // query-specific processing steps (highlighted per query)
                    components: getContent(flowSection, "Processing Steps"),
                    coreComponents: getContent(systemSection, "Core Components"),
                    flow: getContent(flowSection, "Processing Steps"),
                },
                metrics: getContent(flowSection, "Key Metrics"),
                capabilities: getContent(capabilitySection, "Key Features").map(c => c.description || c),
                technologies: getContent(systemSection, "Technology Stack"),
            });

        } catch (error) {
            console.error("Simulation Error", error);
            addLog("CRITICAL ERROR: Connection Failed.", 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={`relative rounded-2xl border overflow-hidden flex flex-col h-[900px] shadow-2xl transition-colors duration-500 ${isDarkMode ? 'bg-n-8 border-n-6 shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)]' : 'bg-gray-50 border-n-3 shadow-xl'}`}>

            {/* Header / Status Bar */}
            <div className={`h-14 border-b flex items-center justify-between px-6 z-20 shrink-0 ${isDarkMode ? 'bg-n-9/80 border-n-7 backdrop-blur-md' : 'bg-white/80 border-n-3 backdrop-blur-md'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1 ring-1 ring-primary-1/50' : 'bg-primary-1 text-white shadow-lg'}`}>
                        <FiCpu size={16} />
                    </div>
                    <div>
                        <div className={`text-xs font-mono uppercase tracking-[0.2em] font-bold ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>System Interface</div>
                        <div className={`text-sm font-bold tracking-wide ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{useCase.title}</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider ${isDarkMode ? 'bg-n-8 border-n-7' : 'bg-white border-n-3'}`}>
                        <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-primary-1 animate-pulse' : 'bg-green-500'}`}></span>
                        <span className={isDarkMode ? 'text-n-3' : 'text-n-6'}>{isProcessing ? 'PROCESSING' : 'ONLINE'}</span>
                    </div>
                </div>
            </div>

            {/* UPPER SECTION: Application (Controls + Dashboard) */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10 min-h-0">

                {/* 1. Control Panel (Left) */}
                <div className={`w-full lg:w-[350px] flex flex-col border-r ${isDarkMode ? 'bg-n-9/30 border-n-7' : 'bg-white/50 border-n-3'}`}>
                    <div className={`p-5 border-b ${isDarkMode ? 'border-n-7' : 'border-n-3'}`}>
                        <div className="text-xs font-mono text-n-4 tracking-wider uppercase mb-1">Control Deck</div>
                        <div className={`text-base font-bold ${isDarkMode ? 'text-n-1' : 'text-n-7'}`}>Available Protocols</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {queries.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => runSimulation(q)}
                                disabled={isProcessing}
                                className={`w-full text-left p-5 rounded-xl border transition-all duration-300 group relative overflow-hidden ${isProcessing ? 'opacity-50 cursor-not-allowed' :
                                    isDarkMode
                                        ? 'bg-n-8 border-n-6 hover:border-primary-1/50 hover:bg-n-7 hover:shadow-[0_4px_20px_-10px_rgba(var(--color-primary-1-rgb),0.3)]'
                                        : 'bg-white border-n-3 hover:border-primary-1 hover:shadow-lg'
                                    }`}
                            >
                                <div className="flex items-start gap-3 relative z-10">
                                    <div className={`shrink-0 w-8 h-8 rounded flex items-center justify-center text-sm font-mono border mt-0.5 ${isDarkMode ? 'border-n-6 text-n-4 group-hover:border-primary-1 group-hover:text-primary-1' : 'border-n-3 text-n-5 group-hover:border-primary-1 group-hover:text-primary-1'}`}>
                                        {i + 1}
                                    </div>
                                    <span className={`text-base font-medium leading-snug ${isDarkMode ? 'text-n-3 group-hover:text-n-1' : 'text-n-6 group-hover:text-n-8'}`}>{q}</span>
                                </div>
                                {isProcessing && <div className="absolute bottom-0 left-0 h-0.5 bg-primary-1 animate-[loading_2s_ease-in-out_infinite] w-full"></div>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Dashboard HUD (Right) */}
                <div className={`flex-1 relative overflow-hidden flex flex-col ${isDarkMode ? 'bg-n-8' : 'bg-gray-50/50'}`}>
                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                            backgroundImage: `linear-gradient(${isDarkMode ? '#333' : '#ccc'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#333' : '#ccc'} 1px, transparent 1px)`,
                            backgroundSize: '20px 20px'
                        }}
                    />
                    <div className="flex-1 p-6 overflow-y-auto relative z-10">
                        {result ? (
                            <SimulationHUD result={result} loading={isProcessing} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
                                <div className={`w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center mb-6 animate-[spin_20s_linear_infinite] ${isDarkMode ? 'border-n-6' : 'border-n-4'}`}>
                                    <div className={`w-24 h-24 rounded-full border border-dotted flex items-center justify-center animate-[spin_10s_linear_infinite_reverse] ${isDarkMode ? 'border-n-6' : 'border-n-4'}`}>
                                        <FiActivity size={32} className={isDarkMode ? 'text-n-4' : 'text-n-5'} />
                                    </div>
                                </div>
                                <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-n-4">Awaiting Protocol</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* LOWER SECTION: Terminal Console (Bottom) */}
            <div className={`h-[320px] shrink-0 flex flex-col border-t relative overflow-hidden ${isDarkMode ? 'bg-black border-n-7' : 'bg-n-8 border-n-6'}`}>
                {/* Terminal Bar */}
                <div className="h-10 flex items-center justify-between px-5 bg-primary-1/5 border-b border-primary-1/10 shrink-0">
                    <span className="text-sm font-mono text-primary-1 uppercase tracking-wider flex items-center gap-2">
                        <FiTerminal size={16} /> Console Output
                    </span>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                    </div>
                </div>

                {/* Log Stream */}
                <div className="flex-1 p-5 font-mono text-base overflow-y-auto custom-scrollbar leading-relaxed">
                    <div className="text-n-4 mb-2 select-none opacity-40 text-sm">
                        // SYSTEM.KERNEL.INIT<br />
                        // LISTENING_ON_PORT_3000...
                    </div>
                    <AnimatePresence mode='popLayout'>
                        {terminalLogs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`mb-2 break-words font-mono text-sm flex items-center gap-2 ${log.type === 'cmd' ? 'text-primary-1 font-bold mt-2 mb-2' :
                                    log.type === 'error' ? 'text-red-400' :
                                        log.type === 'success' ? 'text-green-400' :
                                            log.type === 'tech' ? 'text-blue-400' : // New tech color
                                                'text-n-3'
                                    }`}
                            >
                                <span className="opacity-40 mr-1 text-xs tracking-wider shrink-0 w-16">[{log.time}]</span>

                                {log.type === 'cmd' && <span className="mr-2">root@zeta:~$</span>}

                                {/* Handle Rich Logs vs String Logs */}
                                {typeof log.msg === 'object' ? (
                                    <span className="flex items-center gap-2">
                                        {log.msg.iconUrl ? <img src={log.msg.iconUrl} alt="" className="w-5 h-5 object-contain inline" /> : log.msg.icon && <span className="text-sm">{log.msg.icon}</span>}
                                        <span>{log.msg.text}</span>
                                        {log.msg.status && <span className="text-[10px] bg-white/10 px-1 rounded text-white/50">{log.msg.status}</span>}
                                    </span>
                                ) : (
                                    <span>{log.msg}</span>
                                )}

                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={logsEndRef} />
                </div>
            </div>

        </div>
    );
};

export default ZetaSimulation;
