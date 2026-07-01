/**
 * TechDemoPanel.jsx
 *
 * Interactive demo panel for every technology detail page.
 * Mirrors ZetaSimulation's UX: question cards (left) + HUD (right) + terminal (bottom).
 * Below the demo: Code Quickstart + optional deep-dive + lead-gen CTA.
 *
 * Props:
 *   tech   — full technology object from Hygraph
 *   isDark — boolean from parent (EnhancedTechnologyDetail)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCpu, FiTerminal, FiActivity, FiCode, FiZap,
  FiChevronDown, FiChevronUp, FiCopy, FiCheck,
  FiArrowRight, FiCalendar, FiMessageSquare, FiStar,
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { openAIService, getTechIconUrl } from '@/services/openAIService';
import SimulationHUD from '@/components/solutions/SimulationHUD';
import {
  generateTechQuestions,
  generateTechCodeSnippet,
  generateTechFlowSteps,
  buildSyntheticUseCase,
  isSlop,
} from '@/utils/techDemoContent';

// ─── Code block with line numbers + copy ─────────────────────────────────────

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lines = code.split('\n');

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10 text-sm font-mono bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs text-white/35 ml-2 uppercase tracking-wider">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/80 transition-colors px-2 py-1 rounded hover:bg-white/10"
        >
          {copied ? <FiCheck size={12} className="text-green-400" /> : <FiCopy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto p-4 max-h-[420px] overflow-y-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="leading-6">
                <td className="select-none text-right pr-4 text-white/20 text-xs w-8 align-top pt-0.5">
                  {i + 1}
                </td>
                <td className="text-white/85 whitespace-pre">{line || ' '}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Flow step list ───────────────────────────────────────────────────────────

const FlowSteps = ({ steps, isDark }) => (
  <div className="space-y-3">
    {steps.map((s, i) => (
      <div key={i} className="flex gap-3 items-start">
        <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
          isDark
            ? 'bg-primary-1/20 border-primary-1/40 text-primary-1'
            : 'bg-primary-1/10 border-primary-1/30 text-primary-1'
        }`}>
          {i + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-n-8'}`}>{s.step}</div>
          <div className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-white/50' : 'text-n-5'}`}>{s.description}</div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Lead-gen CTA ─────────────────────────────────────────────────────────────

const TechCTA = ({ tech, isDark }) => {
  const catName = tech?.category?.[0]?.name || 'AI';
  const subName = tech?.subcategories?.[0]?.name || '';

  const bullets = [
    `Production deployment of ${tech.name} in your stack`,
    `Custom integration with your existing data pipelines`,
    `Ongoing monitoring, optimization, and support`,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`relative rounded-2xl overflow-hidden border ${
        isDark
          ? 'border-primary-1/20 bg-gradient-to-br from-n-8 via-n-8 to-primary-1/5'
          : 'border-primary-1/20 bg-gradient-to-br from-white via-white to-primary-1/5'
      }`}
    >
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-1/10 blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-yellow-400/8 blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10 p-8 md:p-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">

          {/* Left: copy */}
          <div className="flex-1 min-w-0">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border ${
              isDark
                ? 'bg-primary-1/10 border-primary-1/30 text-primary-1'
                : 'bg-primary-1/10 border-primary-1/20 text-primary-1'
            }`}>
              <FiStar size={10} />
              {catName}{subName ? ` · ${subName}` : ''}
            </div>

            <h3 className={`text-2xl md:text-3xl font-bold leading-tight mb-3 ${isDark ? 'text-white' : 'text-n-8'}`}>
              Deploy {tech.name} in your production environment
            </h3>
            <p className={`text-base leading-relaxed mb-6 max-w-xl ${isDark ? 'text-white/60' : 'text-n-5'}`}>
              JEDI's engineering team has deployed {tech.name} across healthcare, finance, and enterprise clients.
              We handle the complexity — you get results in weeks, not months.
            </p>

            {/* Bullet list */}
            <ul className="space-y-2 mb-0">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                    isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-500/15 text-green-600'
                  }`}>
                    <FiCheck size={10} />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-white/70' : 'text-n-6'}`}>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: action cards */}
          <div className="flex flex-col gap-3 w-full lg:w-[280px] shrink-0">

            {/* Primary CTA */}
            <Link
              to="/contact"
              className="group flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-primary-1 hover:bg-primary-1/90 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-1/25 hover:shadow-primary-1/40 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <FiCalendar size={15} />
                </div>
                <div>
                  <div className="font-bold">Book a Technical Call</div>
                  <div className="text-white/70 text-xs font-normal">Free 30-min architecture review</div>
                </div>
              </div>
              <FiArrowRight size={16} className="shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary CTA */}
            <Link
              to="/use-cases"
              className={`group flex items-center justify-between gap-3 px-5 py-4 rounded-xl border font-semibold text-sm transition-all hover:scale-[1.02] ${
                isDark
                  ? 'bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/25'
                  : 'bg-white border-gray-200 text-n-8 hover:border-primary-1/40 hover:shadow-md shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isDark ? 'bg-white/10' : 'bg-gray-100'
                }`}>
                  <FiZap size={15} className={isDark ? 'text-yellow-400' : 'text-yellow-600'} />
                </div>
                <div>
                  <div className="font-bold">See Live Deployments</div>
                  <div className={`text-xs font-normal ${isDark ? 'text-white/50' : 'text-n-5'}`}>Real client use cases</div>
                </div>
              </div>
              <FiArrowRight size={16} className={`shrink-0 group-hover:translate-x-1 transition-transform ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
            </Link>

            {/* Tertiary: chat */}
            <Link
              to="/contact"
              className={`group flex items-center gap-3 px-5 py-3.5 rounded-xl border text-sm transition-all hover:scale-[1.02] ${
                isDark
                  ? 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/20'
                  : 'bg-transparent border-gray-200 text-n-5 hover:text-n-8 hover:border-gray-300'
              }`}
            >
              <FiMessageSquare size={14} className="shrink-0" />
              <span>Ask us anything about {tech.name}</span>
              <FiArrowRight size={13} className="ml-auto shrink-0 group-hover:translate-x-1 transition-transform opacity-50" />
            </Link>

            {/* Social proof */}
            <div className={`flex items-center gap-2 px-2 pt-1 ${isDark ? 'text-white/30' : 'text-n-4'}`}>
              <div className="flex -space-x-1.5">
                {['#E9ED4C', '#FF9400', '#75A025', '#0279EE'].map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: c, borderColor: isDark ? '#1a1a2e' : '#fff' }}>
                    {['J','E','D','I'][i]}
                  </div>
                ))}
              </div>
              <span className="text-xs">Trusted by 40+ enterprise teams</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const TechDemoPanel = ({ tech, isDark }) => {
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showCode, setShowCode] = useState(true);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const logsEndRef = useRef(null);
  const isProcessingRef = useRef(false);

  // Stable content derived from tech metadata (computed once)
  const questions      = useRef(generateTechQuestions(tech)).current;
  const codeSnippet    = useRef(generateTechCodeSnippet(tech)).current;
  const flowSteps      = useRef(generateTechFlowSteps(tech)).current;
  const syntheticUseCase = useRef(buildSyntheticUseCase(tech)).current;
  const hasRichDetails = !isSlop(tech.additonalDetails);

  // Auto-scroll terminal
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [terminalLogs]);

  const addLog = useCallback((msg, type = 'info') => {
    setTerminalLogs(prev => [
      ...prev,
      { msg, type, time: new Date().toLocaleTimeString('en-US', { hour12: false }) },
    ]);
  }, []);

  // Keep a ref to the latest runSimulation so the mount effect always calls
  // the current version without needing it in the dep array.
  const runSimulationRef = useRef(null);

  const runSimulation = useCallback(async (query) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);
    setResult(null);
    setTerminalLogs([]);

    addLog(`> ${query}`, 'cmd');
    await new Promise(r => setTimeout(r, 400));

    // Stream flow steps into terminal
    for (const s of flowSteps) {
      addLog(`[${s.step}] ${s.description}`, 'sys');
      await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
    }

    // Tech module load
    addLog('matched components:', 'sys');
    await new Promise(r => setTimeout(r, 250));
    addLog({
      text: tech.name,
      iconUrl: getTechIconUrl(tech),
      status: 'ok',
    }, 'tech');
    await new Promise(r => setTimeout(r, 250));

    try {
      const response = await openAIService.generateResponse(syntheticUseCase, query);
      await new Promise(r => setTimeout(r, 300));
      addLog('response ready — matched Hygraph implementation record', 'success');

      const flowSection       = response.sections?.find(s => s.title === 'IMPLEMENTATION FLOW');
      const systemSection     = response.sections?.find(s => s.title === 'SYSTEM OVERVIEW');
      const capabilitySection = response.sections?.find(s => s.title === 'CAPABILITIES');
      const getContent = (section, subTitle) =>
        section?.subsections?.find(sub => sub.title === subTitle)?.content || [];

      setResult({
        rawResponse: response,
        directAnswer: response.directAnswer || null,
        relevantCapabilities: response.relevantCapabilities || [],
        architecture: {
          ...syntheticUseCase.architecture,
          components:     getContent(flowSection, 'Processing Steps'),
          coreComponents: getContent(systemSection, 'Core Components'),
          flow:           getContent(flowSection, 'Processing Steps'),
        },
        metrics:      getContent(flowSection, 'Key Metrics'),
        capabilities: getContent(capabilitySection, 'Key Features').map(c => c.description || c),
        technologies: getContent(systemSection, 'Technology Stack'),
      });
    } catch (err) {
      console.error('TechDemoPanel error:', err);
      addLog('error — no matching implementation record', 'error');
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, [tech, syntheticUseCase, flowSteps, addLog]);

  // Keep ref in sync with latest callback
  runSimulationRef.current = runSimulation;

  // Auto-run first question on mount — uses ref so closure is never stale
  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulationRef.current?.(questions[0]);
    }, 700);
    return () => clearTimeout(timer);
  }, []); // intentionally empty — fires once on mount

  return (
    <div className="space-y-8">

      {/* ── Interactive Demo ─────────────────────────────────────────────── */}
      <div className={`relative rounded-2xl border overflow-hidden flex flex-col shadow-2xl transition-colors duration-500 ${
        isDark
          ? 'bg-n-8 border-n-6 shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)]'
          : 'bg-gray-50 border-n-3 shadow-xl'
      }`}>

        {/* Header bar */}
        <div className={`h-14 border-b flex items-center justify-between px-6 z-20 shrink-0 ${
          isDark ? 'bg-n-9/80 border-n-7 backdrop-blur-md' : 'bg-white/80 border-n-3 backdrop-blur-md'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-primary-1/20 text-primary-1 ring-1 ring-primary-1/50' : 'bg-primary-1 text-white shadow-lg'
            }`}>
              <FiCpu size={16} />
            </div>
            <div>
              <div className={`text-xs font-mono uppercase tracking-[0.2em] font-bold ${isDark ? 'text-n-4' : 'text-n-5'}`}>
                Interactive Demo
              </div>
              <div className={`text-sm font-bold tracking-wide ${isDark ? 'text-n-1' : 'text-n-8'}`}>
                {tech.name}
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider ${
            isDark ? 'bg-n-8 border-n-7' : 'bg-white border-n-3'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-primary-1 animate-pulse' : 'bg-green-500'}`} />
            <span className={isDark ? 'text-n-3' : 'text-n-6'}>{isProcessing ? 'PROCESSING' : 'ONLINE'}</span>
          </div>
        </div>

        {/* Body: Controls (left) + HUD (right) */}
        <div className="flex flex-col lg:flex-row overflow-hidden relative z-10" style={{ minHeight: '520px' }}>

          {/* Control Panel */}
          <div className={`w-full lg:w-[340px] flex flex-col border-r shrink-0 ${
            isDark ? 'bg-n-9/30 border-n-7' : 'bg-white/50 border-n-3'
          }`}>
            <div className={`p-5 border-b ${isDark ? 'border-n-7' : 'border-n-3'}`}>
              <div className="text-xs font-mono text-n-4 tracking-wider uppercase mb-1">Try a query</div>
              <div className={`text-base font-bold ${isDark ? 'text-n-1' : 'text-n-7'}`}>Sample requests</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => runSimulation(q)}
                  disabled={isProcessing}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                    isProcessing
                      ? 'opacity-50 cursor-not-allowed'
                      : isDark
                        ? 'bg-n-8 border-n-6 hover:border-primary-1/50 hover:bg-n-7'
                        : 'bg-white border-n-3 hover:border-primary-1 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-3 relative z-10">
                    <div className={`shrink-0 w-7 h-7 rounded flex items-center justify-center text-xs font-mono border mt-0.5 ${
                      isDark
                        ? 'border-n-6 text-n-4 group-hover:border-primary-1 group-hover:text-primary-1'
                        : 'border-n-3 text-n-5 group-hover:border-primary-1 group-hover:text-primary-1'
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`text-sm font-medium leading-snug ${
                      isDark ? 'text-n-3 group-hover:text-n-1' : 'text-n-6 group-hover:text-n-8'
                    }`}>{q}</span>
                  </div>
                  {isProcessing && (
                    <div className="absolute bottom-0 left-0 h-0.5 bg-primary-1 animate-[loading_2s_ease-in-out_infinite] w-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Flow steps */}
            <div className={`p-4 border-t ${isDark ? 'border-n-7' : 'border-n-3'}`}>
              <div className="text-xs font-mono text-n-4 tracking-wider uppercase mb-3">System Flow</div>
              <FlowSteps steps={flowSteps} isDark={isDark} />
            </div>
          </div>

          {/* Dashboard HUD */}
          <div className={`flex-1 relative overflow-hidden flex flex-col ${isDark ? 'bg-n-8' : 'bg-gray-50/50'}`}>
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(${isDark ? '#333' : '#ccc'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#333' : '#ccc'} 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />
            <div className="flex-1 p-6 overflow-y-auto relative z-10">
              {result ? (
                <SimulationHUD result={result} loading={isProcessing} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
                  <div className={`w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center mb-6 animate-[spin_20s_linear_infinite] ${
                    isDark ? 'border-n-6' : 'border-n-4'
                  }`}>
                    <div className={`w-20 h-20 rounded-full border border-dotted flex items-center justify-center animate-[spin_10s_linear_infinite_reverse] ${
                      isDark ? 'border-n-6' : 'border-n-4'
                    }`}>
                      <FiActivity size={28} className={isDark ? 'text-n-4' : 'text-n-5'} />
                    </div>
                  </div>
                  <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-n-4">Pick a query to run</h3>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terminal Console */}
        <div className={`h-[240px] shrink-0 flex flex-col border-t relative overflow-hidden ${
          isDark ? 'bg-black border-n-7' : 'bg-n-8 border-n-6'
        }`}>
          <div className="h-10 flex items-center justify-between px-5 bg-primary-1/5 border-b border-primary-1/10 shrink-0">
            <span className="text-sm font-mono text-primary-1 uppercase tracking-wider flex items-center gap-2">
              <FiTerminal size={16} /> Response trace
            </span>
            <span className="hidden md:inline text-[10px] font-mono text-primary-1/60 uppercase tracking-wider">
              local_response_engine · v1.0
            </span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar leading-relaxed">
            <div className="text-n-4 mb-2 select-none opacity-40 text-xs">
              // pattern-matched from Hygraph — not a live LLM call<br />
              // module: {tech.name}
            </div>
            <AnimatePresence mode="popLayout">
              {terminalLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`mb-1.5 break-words font-mono text-xs flex items-center gap-2 ${
                    log.type === 'cmd'     ? 'text-primary-1 font-bold mt-2 mb-2' :
                    log.type === 'error'   ? 'text-red-400' :
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'tech'    ? 'text-blue-400' :
                    'text-n-3'
                  }`}
                >
                  <span className="opacity-40 mr-1 text-[10px] tracking-wider shrink-0 w-14">[{log.time}]</span>
                  {log.type === 'cmd' && <span className="mr-1 opacity-60">phylo&gt;</span>}
                  {typeof log.msg === 'object' ? (
                    <span className="flex items-center gap-2">
                      {log.msg.iconUrl && <img src={log.msg.iconUrl} alt="" className="w-4 h-4 object-contain inline" />}
                      <span>{log.msg.text}</span>
                      {log.msg.status && (
                        <span className="text-[10px] bg-white/10 px-1 rounded text-white/50">{log.msg.status}</span>
                      )}
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

      {/* ── Code Quickstart ──────────────────────────────────────────────── */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? 'border-n-6 bg-n-8/50' : 'border-gray-200 bg-white'
      }`}>
        <button
          onClick={() => setShowCode(v => !v)}
          className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${
            isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-yellow-400/10 text-yellow-400' : 'bg-yellow-500/10 text-yellow-600'
            }`}>
              <FiCode size={16} />
            </div>
            <div className="text-left">
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-n-8'}`}>{codeSnippet.title}</div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-white/45' : 'text-n-5'}`}>{codeSnippet.description}</div>
            </div>
          </div>
          {showCode
            ? <FiChevronUp className={isDark ? 'text-white/40' : 'text-gray-400'} />
            : <FiChevronDown className={isDark ? 'text-white/40' : 'text-gray-400'} />
          }
        </button>
        <AnimatePresence>
          {showCode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <CodeBlock code={codeSnippet.code} language={codeSnippet.language} isDark={isDark} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Deep Dive (only when Hygraph content is rich) ────────────────── */}
      {hasRichDetails && (
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? 'border-n-6 bg-n-8/50' : 'border-gray-200 bg-white'
        }`}>
          <button
            onClick={() => setShowDeepDive(v => !v)}
            className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${
              isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-1'
              }`}>
                <FiZap size={16} />
              </div>
              <div className="text-left">
                <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-n-8'}`}>Technical Deep Dive</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-white/45' : 'text-n-5'}`}>Full documentation and implementation details</div>
              </div>
            </div>
            {showDeepDive
              ? <FiChevronUp className={isDark ? 'text-white/40' : 'text-gray-400'} />
              : <FiChevronDown className={isDark ? 'text-white/40' : 'text-gray-400'} />
            }
          </button>
          <AnimatePresence>
            {showDeepDive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className={`px-6 pb-6 prose prose-sm max-w-none ${
                  isDark
                    ? 'prose-invert prose-headings:text-white prose-p:text-white/75 prose-li:text-white/75 prose-code:text-yellow-300 prose-code:bg-white/10 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-a:text-yellow-400 prose-strong:text-white'
                    : 'prose-headings:text-n-8 prose-p:text-n-6 prose-li:text-n-6 prose-code:text-primary-1 prose-code:bg-primary-1/10 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-a:text-primary-1 prose-strong:text-n-8'
                } prose-headings:font-semibold prose-code:px-1 prose-code:rounded prose-a:no-underline hover:prose-a:underline`}>
                  <ReactMarkdown>{tech.additonalDetails}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Lead-gen CTA ─────────────────────────────────────────────────── */}
      <TechCTA tech={tech} isDark={isDark} />

    </div>
  );
};

export default TechDemoPanel;
