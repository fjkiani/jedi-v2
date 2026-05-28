/**
 * TechDemoPanel.jsx
 *
 * Interactive demo panel for every technology detail page.
 * Mirrors ZetaSimulation's UX: question cards (left) + HUD (right) + terminal (bottom).
 * Below the demo: Code Quickstart section + optional rich markdown deep-dive.
 *
 * Props:
 *   tech  — full technology object from Hygraph
 *   isDark — boolean from parent (EnhancedTechnologyDetail)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiCpu, FiTerminal, FiActivity, FiCode, FiZap,
  FiChevronDown, FiChevronUp, FiCopy, FiCheck,
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

// ─── Syntax-highlight shim (no extra deps) ───────────────────────────────────
// We render code in a styled <pre> with line numbers; no Prism needed.

const CodeBlock = ({ code, language, isDark }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lines = code.split('\n');

  return (
    <div className={`relative rounded-xl overflow-hidden border text-sm font-mono ${
      isDark ? 'bg-[#0d1117] border-white/10' : 'bg-[#0d1117] border-gray-700'
    }`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs text-white/40 ml-2 uppercase tracking-wider">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors px-2 py-1 rounded hover:bg-white/10"
        >
          {copied ? <FiCheck size={12} className="text-green-400" /> : <FiCopy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code lines */}
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

// ─── Flow step visualizer ─────────────────────────────────────────────────────

const FlowSteps = ({ steps, isDark }) => (
  <div className="space-y-3">
    {steps.map((s, i) => (
      <div key={i} className="flex gap-3 items-start">
        <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
          isDark
            ? 'bg-primary-1/20 border-primary-1/40 text-primary-1'
            : 'bg-primary-1/10 border-primary-1/30 text-primary-1'
        }`}>
          {i + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-n-8'}`}>{s.step}</div>
          <div className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-white/55' : 'text-n-5'}`}>{s.description}</div>
        </div>
        {i < steps.length - 1 && (
          <div className={`absolute left-3.5 mt-7 w-px h-3 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
        )}
      </div>
    ))}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const TechDemoPanel = ({ tech, isDark }) => {
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showCode, setShowCode] = useState(true);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const logsEndRef = useRef(null);
  const isProcessingRef = useRef(false);

  // Generate content from tech metadata
  const questions = generateTechQuestions(tech);
  const codeSnippet = generateTechCodeSnippet(tech);
  const flowSteps = generateTechFlowSteps(tech);
  const syntheticUseCase = buildSyntheticUseCase(tech);
  const hasRichDetails = !isSlop(tech.additonalDetails);

  // Auto-scroll terminal
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [terminalLogs]);

  const addLog = useCallback((msg, type = 'info') => {
    setTerminalLogs(prev => [
      ...prev,
      { msg, type, time: new Date().toLocaleTimeString('en-US', { hour12: false }) },
    ]);
  }, []);

  const runSimulation = useCallback(async (query) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);
    setResult(null);
    setTerminalLogs([]);

    addLog(`COMMAND RECEIVED: ${query}`, 'cmd');
    await new Promise(r => setTimeout(r, 500));

    // Flow steps as terminal logs
    const dynamics = flowSteps.map(s => ({
      msg: `[${s.step}] ${s.description}`,
      delay: 350 + Math.random() * 500,
    }));

    for (const step of dynamics) {
      addLog(step.msg, 'sys');
      await new Promise(r => setTimeout(r, step.delay));
    }

    // Show tech module load
    addLog('LOADING_CORE_MODULES...', 'sys');
    await new Promise(r => setTimeout(r, 300));
    addLog({
      text: `MODULE_LOAD: ${tech.name.toUpperCase()}`,
      iconUrl: getTechIconUrl(tech),
      status: 'OK',
    }, 'tech');
    await new Promise(r => setTimeout(r, 300));

    try {
      const response = await openAIService.generateResponse(syntheticUseCase, query);
      await new Promise(r => setTimeout(r, 400));
      addLog('Analysis Complete. Telemetry Loaded.', 'success');

      const flowSection = response.sections?.find(s => s.title === 'IMPLEMENTATION FLOW');
      const systemSection = response.sections?.find(s => s.title === 'SYSTEM OVERVIEW');
      const capabilitySection = response.sections?.find(s => s.title === 'CAPABILITIES');
      const getContent = (section, subTitle) =>
        section?.subsections?.find(sub => sub.title === subTitle)?.content || [];

      setResult({
        rawResponse: response,
        directAnswer: response.directAnswer || null,
        relevantCapabilities: response.relevantCapabilities || [],
        architecture: {
          ...syntheticUseCase.architecture,
          components: getContent(flowSection, 'Processing Steps'),
          coreComponents: getContent(systemSection, 'Core Components'),
          flow: getContent(flowSection, 'Processing Steps'),
        },
        metrics: getContent(flowSection, 'Key Metrics'),
        capabilities: getContent(capabilitySection, 'Key Features').map(c => c.description || c),
        technologies: getContent(systemSection, 'Technology Stack'),
      });
    } catch (err) {
      console.error('TechDemoPanel error:', err);
      addLog('CRITICAL ERROR: Connection Failed.', 'error');
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, [tech, syntheticUseCase, flowSteps, addLog]);

  // Auto-run first question on mount
  useEffect(() => {
    const timer = setTimeout(() => runSimulation(questions[0]), 600);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-8">

      {/* ── Interactive Demo ─────────────────────────────────────────────── */}
      <div className={`relative rounded-2xl border overflow-hidden flex flex-col shadow-2xl transition-colors duration-500 ${
        isDark
          ? 'bg-n-8 border-n-6 shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)]'
          : 'bg-gray-50 border-n-3 shadow-xl'
      }`}>

        {/* Header */}
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
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider ${
              isDark ? 'bg-n-8 border-n-7' : 'bg-white border-n-3'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-primary-1 animate-pulse' : 'bg-green-500'}`} />
              <span className={isDark ? 'text-n-3' : 'text-n-6'}>{isProcessing ? 'PROCESSING' : 'ONLINE'}</span>
            </div>
          </div>
        </div>

        {/* Body: Controls (left) + HUD (right) */}
        <div className="flex flex-col lg:flex-row overflow-hidden relative z-10" style={{ minHeight: '520px' }}>

          {/* Control Panel */}
          <div className={`w-full lg:w-[340px] flex flex-col border-r shrink-0 ${
            isDark ? 'bg-n-9/30 border-n-7' : 'bg-white/50 border-n-3'
          }`}>
            <div className={`p-5 border-b ${isDark ? 'border-n-7' : 'border-n-3'}`}>
              <div className="text-xs font-mono text-n-4 tracking-wider uppercase mb-1">Control Deck</div>
              <div className={`text-base font-bold ${isDark ? 'text-n-1' : 'text-n-7'}`}>Available Protocols</div>
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
                        ? 'bg-n-8 border-n-6 hover:border-primary-1/50 hover:bg-n-7 hover:shadow-[0_4px_20px_-10px_rgba(var(--color-primary-1-rgb),0.3)]'
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

            {/* Flow steps sidebar */}
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
                  <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-n-4">Awaiting Protocol</h3>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terminal Console */}
        <div className={`h-[260px] shrink-0 flex flex-col border-t relative overflow-hidden ${
          isDark ? 'bg-black border-n-7' : 'bg-n-8 border-n-6'
        }`}>
          <div className="h-10 flex items-center justify-between px-5 bg-primary-1/5 border-b border-primary-1/10 shrink-0">
            <span className="text-sm font-mono text-primary-1 uppercase tracking-wider flex items-center gap-2">
              <FiTerminal size={16} /> Console Output
            </span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar leading-relaxed">
            <div className="text-n-4 mb-2 select-none opacity-40 text-xs">
              // JEDI.KERNEL.INIT<br />
              // TECH_MODULE: {tech.slug?.toUpperCase() || tech.name?.toUpperCase()}
            </div>
            <AnimatePresence mode="popLayout">
              {terminalLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-1.5 break-words font-mono text-xs flex items-center gap-2 ${
                    log.type === 'cmd'     ? 'text-primary-1 font-bold mt-2 mb-2' :
                    log.type === 'error'   ? 'text-red-400' :
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'tech'    ? 'text-blue-400' :
                    'text-n-3'
                  }`}
                >
                  <span className="opacity-40 mr-1 text-[10px] tracking-wider shrink-0 w-14">[{log.time}]</span>
                  {log.type === 'cmd' && <span className="mr-1">root@jedi:~$</span>}
                  {typeof log.msg === 'object' ? (
                    <span className="flex items-center gap-2">
                      {log.msg.iconUrl
                        ? <img src={log.msg.iconUrl} alt="" className="w-4 h-4 object-contain inline" />
                        : log.msg.icon && <span>{log.msg.icon}</span>
                      }
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
              isDark ? 'bg-yellow-400/10 text-yellow-400' : 'bg-yellow-400/10 text-yellow-600'
            }`}>
              <FiCode size={16} />
            </div>
            <div className="text-left">
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-n-8'}`}>
                {codeSnippet.title}
              </div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-white/45' : 'text-n-5'}`}>
                {codeSnippet.description}
              </div>
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
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <CodeBlock
                  code={codeSnippet.code}
                  language={codeSnippet.language}
                  isDark={isDark}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Deep Dive (only if rich Hygraph content exists) ──────────────── */}
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
                <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-n-8'}`}>
                  Technical Deep Dive
                </div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-white/45' : 'text-n-5'}`}>
                  Full documentation and implementation details
                </div>
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
                transition={{ duration: 0.25 }}
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
    </div>
  );
};

export default TechDemoPanel;
