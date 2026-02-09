import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

const SystemLog = ({ className = "" }) => {
    const { isDarkMode } = useTheme();
    const [logs, setLogs] = useState([]);

    // Simulates a live system boot sequence
    useEffect(() => {
        const sequence = [
            "Initializing JEDI Core...",
            "Connecting to Neural Uplink...",
            "Fetching Agent Protocols...",
            "Verifying Security Clearance...",
            "Access Granted: COMMANDER LEVEL",
            "Loading Registry...",
            "System Ready."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < sequence.length) {
                setLogs(prev => {
                    const newLogs = [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} > ${sequence[i]}`];
                    // Keep only last 5 logs to prevent overflow if used in small spaces
                    return newLogs.slice(-5);
                });
                i++;
            } else {
                // Reset or just loop "System Ready" or keep quiet
                // For hero, maybe we want it to keep looking active?
                // Let's add random "Scanning" logs occasionally
                if (Math.random() > 0.7) {
                    setLogs(prev => [...prev.slice(-4), `${new Date().toISOString().split('T')[1].split('.')[0]} > SCANNING SECTOR ${Math.floor(Math.random() * 9)}...`]);
                }
            }
        }, 800);
        return () => clearInterval(interval);
    }, []);

    // Theme-based styles
    const themeStyles = isDarkMode
        ? "text-green-500/80 bg-black/90 border-green-500/20"
        : "text-n-8/80 bg-n-1/90 border-n-4 shadow-lg";

    return (
        <div className={`font-mono text-xs p-4 border rounded-lg overflow-hidden relative font-code backdrop-blur-sm ${themeStyles} ${className}`}>
            <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            </div>
            <div className="flex flex-col justify-end h-full">
                {logs.map((log, i) => (
                    <div key={i} className="mb-1 truncate">{log}</div>
                ))}
                <div className="animate-pulse">_</div>
            </div>
        </div>
    );
};

export default SystemLog;
