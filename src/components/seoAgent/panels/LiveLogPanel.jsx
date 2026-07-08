import React, { useEffect, useRef, useState } from 'react';
import { openLogStream, seoAgent } from '../lib/api';
import { Card, CardHeader, CardBody, Button, Pill } from '../ui/Card';

export default function LiveLogPanel() {
  const [streamKey, setStreamKey] = useState('orchestrator');
  const [lines, setLines] = useState([]);
  const [filter, setFilter] = useState('');
  const [autoscroll, setAutoscroll] = useState(true);
  const [availableKeys, setAvailableKeys] = useState(['orchestrator']);
  const esRef = useRef(null);
  const scrollerRef = useRef(null);

  const refreshKeys = async () => {
    try {
      const st = await seoAgent.status();
      const keys = new Set(['orchestrator']);
      (st.active || []).forEach((a) => keys.add(a.key));
      setAvailableKeys(Array.from(keys));
    } catch { /* ignore */ }
  };

  useEffect(() => {
    refreshKeys();
    const iv = setInterval(refreshKeys, 5_000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    setLines([]);
    if (esRef.current) esRef.current.close();
    const es = openLogStream(streamKey, (evt) => {
      setLines((prev) => {
        const next = prev.length > 3000 ? prev.slice(-2500) : prev;
        return [...next, evt];
      });
    });
    esRef.current = es;
    return () => { es.close(); };
  }, [streamKey]);

  useEffect(() => {
    if (!autoscroll) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines, autoscroll]);

  const filtered = filter ? lines.filter((l) => l.line?.toLowerCase().includes(filter.toLowerCase())) : lines;

  return (
    <Card>
      <CardHeader
        title="Live logs"
        subtitle={`SSE stream from ${streamKey}`}
        right={
          <>
            <select
              value={streamKey}
              onChange={(e) => setStreamKey(e.target.value)}
              className="text-xs bg-n-8 border border-n-6 rounded px-2 py-1 font-mono"
            >
              {availableKeys.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
              {['worker:analyst','worker:perf-fixer','worker:content-injector','worker:page-scaffolder','worker:cms-injector']
                .filter((k) => !availableKeys.includes(k))
                .map((k) => (<option key={k} value={k}>{k}</option>))}
            </select>
            <Button tone="ghost" onClick={() => setLines([])}>Clear</Button>
            <label className="text-xs text-n-2 flex items-center gap-1.5">
              <input type="checkbox" checked={autoscroll} onChange={(e) => setAutoscroll(e.target.checked)} />
              autoscroll
            </label>
          </>
        }
      />
      <CardBody className="p-0">
        <div className="px-3 py-2 border-b border-n-6/60 flex gap-2 items-center">
          <input
            placeholder="filter (grep-style, case-insensitive)…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 text-xs bg-n-8 border border-n-6 rounded px-2 py-1 font-mono"
          />
          <span className="text-[11px] text-n-3 whitespace-nowrap">{filtered.length} / {lines.length} lines</span>
        </div>
        <div
          ref={scrollerRef}
          className="font-mono text-[11px] leading-[1.4] max-h-[420px] overflow-auto p-3 bg-n-8"
        >
          {filtered.length === 0 && (
            <div className="text-n-4 italic">No logs yet. Kick a worker or the orchestrator to see live stdout/stderr here.</div>
          )}
          {filtered.map((evt, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              <span className="text-n-4 mr-2">{(evt.ts || '').slice(11, 19)}</span>
              <span className={evt.stream === 'stderr' ? 'text-color-3' : evt.stream === 'system' ? 'text-color-2' : 'text-n-2'}>{evt.line}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
