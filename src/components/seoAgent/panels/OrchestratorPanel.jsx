import React, { useEffect, useMemo, useRef, useState } from 'react';
import { seoAgent, openLogStream } from '../lib/api';
import { Card, CardHeader, CardBody, Button, Pill } from '../ui/Card';

export default function OrchestratorPanel({ onRunKicked }) {
  const [dryRun, setDryRun] = useState(false);
  const [skipRebuild, setSkipRebuild] = useState(true);
  const [maxEdits, setMaxEdits] = useState(10);
  const [maxNew, setMaxNew] = useState(0);
  const [baseBranch, setBaseBranch] = useState('agent/seo-command-center-2026-07-07T1930');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [active, setActive] = useState([]);

  const refreshActive = async () => {
    try {
      const st = await seoAgent.status();
      setActive(st.active || []);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    refreshActive();
    const iv = setInterval(refreshActive, 5_000);
    return () => clearInterval(iv);
  }, []);

  const kickRun = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await seoAgent.runOrchestrator({
        dryRun, skipRebuild, maxEdits, maxNew, baseBranch: baseBranch || undefined,
      });
      onRunKicked?.(res);
      refreshActive();
    } catch (e) { setErr(e.body?.error || e.message); }
    finally { setBusy(false); }
  };

  const kill = async () => {
    try { await seoAgent.killOrchestrator(); } catch (e) { setErr(e.message); }
    refreshActive();
  };

  const isRunning = active.some((a) => a.key === 'orchestrator' && a.running);

  return (
    <Card>
      <CardHeader
        title="Orchestrator (w0)"
        subtitle="Kick the full 5-worker pass — seeds → Semrush → LLM → workers → rebuild → audit → commit"
        right={
          <>
            {isRunning && <Pill tone="warn">running</Pill>}
            {isRunning ? (
              <Button tone="danger" onClick={kill}>Kill</Button>
            ) : (
              <Button tone="primary" onClick={kickRun} disabled={busy}>
                {busy ? 'Kicking…' : 'Run pass'}
              </Button>
            )}
          </>
        }
      />
      <CardBody>
        {err && (
          <div className="text-xs text-color-3 bg-color-3/10 border border-color-3/25 rounded p-2 mb-3">{err}</div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label className="text-xs text-n-2 flex items-center gap-2">
            <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} />
            <span>--dry-run</span>
          </label>
          <label className="text-xs text-n-2 flex items-center gap-2">
            <input type="checkbox" checked={skipRebuild} onChange={(e) => setSkipRebuild(e.target.checked)} />
            <span>--skip-rebuild <span className="text-n-4">(fast demo)</span></span>
          </label>
          <label className="text-xs text-n-2 flex flex-col gap-1">
            <span>max-edits</span>
            <input
              type="number" min={0} max={50} value={maxEdits}
              onChange={(e) => setMaxEdits(Number(e.target.value))}
              className="bg-n-8 border border-n-6 rounded px-2 py-1 font-mono"
            />
          </label>
          <label className="text-xs text-n-2 flex flex-col gap-1">
            <span>max-new</span>
            <input
              type="number" min={0} max={20} value={maxNew}
              onChange={(e) => setMaxNew(Number(e.target.value))}
              className="bg-n-8 border border-n-6 rounded px-2 py-1 font-mono"
            />
          </label>
          <label className="text-xs text-n-2 flex flex-col gap-1 col-span-2 md:col-span-4">
            <span>base-branch <span className="text-n-4">(cut new agent branch off this)</span></span>
            <input
              type="text" value={baseBranch} onChange={(e) => setBaseBranch(e.target.value)}
              className="bg-n-8 border border-n-6 rounded px-2 py-1 font-mono"
            />
          </label>
        </div>
        <div className="mt-3 text-[11px] text-n-3">
          <span className="font-mono">POST /api/orchestrator/run</span> spawns
          {' '}<span className="font-mono">scripts/agentic-seo-loop/scripts/orchestrator.mjs</span>.
          Logs stream live to the panel below. This actually mutates the git repo.
        </div>
      </CardBody>
    </Card>
  );
}
