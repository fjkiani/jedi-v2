import React, { useEffect, useState } from 'react';
import { seoAgent } from '../lib/api';
import { Card, CardHeader, CardBody, Pill, Button } from '../ui/Card';

export default function RunsPanel({ onSelectRun, selectedRunId }) {
  const [runs, setRuns] = useState([]);
  const [err, setErr] = useState(null);

  const load = async () => {
    try { const res = await seoAgent.listRuns(); setRuns(res.runs || []); } catch (e) { setErr(e.message); }
  };
  useEffect(() => {
    load();
    const iv = setInterval(load, 10_000);
    return () => clearInterval(iv);
  }, []);

  return (
    <Card>
      <CardHeader
        title="Runs"
        subtitle={`${runs.length} pass${runs.length === 1 ? '' : 'es'} on disk. Click a row to hand it to workers below.`}
        right={<Button tone="ghost" onClick={load}>Refresh</Button>}
      />
      <CardBody className="p-0">
        {err && <div className="p-3 text-xs text-color-3 bg-color-3/10">{err}</div>}
        <div className="max-h-72 overflow-auto">
          <table className="w-full text-xs">
            <thead className="text-n-3 uppercase text-[10px] sticky top-0 bg-n-7/95 backdrop-blur">
              <tr>
                <th className="text-left px-3 py-2">Run ID</th>
                <th className="text-left px-3 py-2">Branch</th>
                <th className="text-left px-3 py-2">Commit</th>
                <th className="text-left px-3 py-2">Seeds</th>
                <th className="text-left px-3 py-2">Multi-h1 Δ</th>
                <th className="text-left px-3 py-2">Ended</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-6 text-center text-n-4">No runs yet. Kick the orchestrator.</td></tr>
              )}
              {runs.map((r) => (
                <tr
                  key={r.run_id}
                  onClick={() => onSelectRun?.(r)}
                  className={`cursor-pointer border-t border-n-6/40 hover:bg-n-6/30 ${selectedRunId === r.run_id ? 'bg-color-5/10' : ''}`}
                >
                  <td className="px-3 py-2 font-mono text-n-1">{r.run_id}</td>
                  <td className="px-3 py-2 font-mono text-n-2 truncate max-w-[220px]">{r.agent_branch || '—'}</td>
                  <td className="px-3 py-2 font-mono text-color-5">{r.commit_sha ? r.commit_sha.slice(0, 7) : '—'}</td>
                  <td className="px-3 py-2 text-n-2">{r.seed_count ?? '—'}</td>
                  <td className="px-3 py-2">
                    {r.multi_h1_delta ? (
                      <Pill tone={r.multi_h1_delta[1] < r.multi_h1_delta[0] ? 'good' : (r.multi_h1_delta[1] > r.multi_h1_delta[0] ? 'bad' : 'neutral')}>
                        {r.multi_h1_delta[0]} → {r.multi_h1_delta[1]}
                      </Pill>
                    ) : '—'}
                  </td>
                  <td className="px-3 py-2 text-n-3">{r.ended_at?.slice(11, 19) || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
