/**
 * Homepage preview of the JEDI Applications Registry.
 * Teaser that drives clicks to /jedi (APPLICATIONS REGISTRY page).
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  FiShield,
  FiCpu,
  FiActivity,
  FiServer,
  FiLock,
  FiArrowRight,
  FiCrosshair,
} from 'react-icons/fi';

const CONSOLE_LINES = [
  'Initializing JEDI Core...',
  'Fetching Applications...',
  'Verifying Security Clearance...',
  'Access Granted: COMMANDER LEVEL',
  'Loading Registry...',
  'System Ready.',
];

const JediApplicationsPreview = () => {
  const { isDarkMode } = useTheme();
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (currentLine >= CONSOLE_LINES.length) return;
    const t = setTimeout(() => setCurrentLine((c) => c + 1), 600);
    return () => clearTimeout(t);
  }, [currentLine]);

  const [logTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  });

  const cards = [
    { icon: FiCpu, label: 'ACTIVE APPS', value: '4', color: 'text-primary-1' },
    { icon: FiActivity, label: 'SYSTEM LOAD', value: '12%', color: 'text-green-400' },
    { icon: FiServer, label: 'GLOBAL UPTIME', value: '99.99%', color: 'text-cyan-400' },
    { icon: FiLock, label: 'SECURITY LEVEL', value: 'ALPHA', color: 'text-amber-400' },
  ];

  return (
    <section
      id="applications-preview"
      className={`relative py-16 lg:py-20 overflow-hidden ${isDarkMode ? 'bg-n-8' : 'bg-[#0d0d12]'}`}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />
      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-n-5 opacity-60" />
      <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-n-5 opacity-60" />

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Top: Secure connection + title */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 text-n-4 text-sm font-mono mb-3">
                <FiShield className="w-4 h-4 text-green-500" />
                <span>SECURE CONNECTION ESTABLISHED</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                APPLICATIONS
                <br />
                REGISTRY
              </h2>
            </div>

            {/* Console panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-lg border border-green-500/40 bg-black/60 backdrop-blur-sm overflow-hidden min-w-[280px] max-w-sm"
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b border-green-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="p-3 font-mono text-xs text-green-400/90 space-y-1 min-h-[140px]">
                {CONSOLE_LINES.slice(0, currentLine).map((line, i) => (
                  <div key={i}>{logTime} &gt; {line}</div>
                ))}
              </div>
              <Link
                to="/jedi"
                className="block w-full py-2.5 text-center text-white/80 hover:text-white text-xs font-mono border-t border-green-500/30 hover:bg-green-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <FiArrowRight className="w-3.5 h-3.5 rotate-180" />
                RETURN TO COMMAND
              </Link>
            </motion.div>
          </div>

          {/* Status cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {cards.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 + 0.2 }}
                className="rounded-xl border border-n-6 bg-n-8/80 backdrop-blur-sm p-5 hover:border-primary-1/50 transition-colors"
              >
                <item.icon className={`w-8 h-8 mb-3 ${item.color}`} />
                <div className="text-[10px] font-mono uppercase tracking-widest text-n-4 mb-1">
                  {item.label}
                </div>
                <div className={`text-lg font-bold font-mono text-white ${item.color}`}>
                  {item.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/jedi"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-1 text-white font-mono text-sm font-semibold uppercase tracking-wider hover:bg-primary-2 transition-colors"
            >
              <FiCrosshair className="w-4 h-4" />
              Open Applications Registry
            </Link>
            <span className="text-n-5 text-sm">
              View active JEDI deployments and capabilities
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JediApplicationsPreview;
