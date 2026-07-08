import React, { useEffect, useState } from 'react';
import { seoAgent } from '../lib/api';
import { Card, CardHeader, CardBody, Button, Pill } from '../ui/Card';

const DESCRIPTIONS = {
  analyst: 'w1 · seeds → Semrush → LLM proposals. Kickable alone as smoke test.',
  'perf-fixer': 'w2 · deterministic non-LLM fixes (postdetail-h1-demote today).',
  'content-injector': 'w3 · patches <SEO> attrs + <h1> on editable routes only. Hands off CMS-owned proposals.',
  'page-scaffolder': 'w4 · creates /topics/<slug>/index.jsx pages + registers them in App.jsx / sitemap / enumerator.',
  'cms-injector': 'w5 · consumes cms-proposals-not-applied.jsonl, drafts Hygraph mutations (preview by default).',
};

export default function WorkersGrid({ latestRunId }) {
  const [workers, setWorkers] = useState({});
  const [busy, setBusy] = useState({});
  const [err, setErr] = useState(null);

  const refresh = async () => {
    try { const res = await seoAgent.listWorkers(); setWorkers(res.workers || {}); } catch (e) { setErr(e.message); }
  };
  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 5_000);
    return () => clearInterval(iv);
  }, []);

  const run = async (name, extraBody = {}) => {
    setBusy((b) => ({ ...b, [name]: true }));
    setErr(null);
    try {
      const body = { ...extraBody };
      if (name !== 'analyst' && latestRunId) body.runDir = latestRunId; // pass full path is done server-side
      // Actually we send runDir as a directory PATH — panel passes just the id here.
      // Server-side workers.mjs treats runDir as a full path — so we need to prefix.
      if (name !== 'analyst') {
        if (!latestRunId) {
          throw new Error('This worker needs a latestRunId. Kick the analyst or orchestrator first.');
        }
        body.runDir = latestRunId; // panel expects a full path here
      }
      const res = await seoAgent.runWorker(name, body);
      refresh();
      return res;
    } catch (e) { setErr(e.body?.error || e.message); }
    finally { setBusy((b) => ({ ...b, [name]: false })); }
  };

  return (
    <Card>
      <CardHeader
        title="Workers (individual triggers)"
        subtitle={
          <>
            Each card runs a single worker script.{' '}
            {latestRunId ? <span className="text-color-4 font-mono">run: {latestRunId.split('/').pop()}</span> : <span className="text-color-2">Pick a run below to hand this to non-analyst workers.</span>}
          </>
        }
      />
      <CardBody>
        {err && <div className="text-xs text-color-3 bg-color-3/10 border border-color-3/25 rounded p-2 mb-3">{err}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(workers).map(([name, info]) => (
            <div key={name} className="border border-n-6/60 rounded-xl p-3 bg-n-7/50">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="min-w-0">
                  <div className="font-mono text-sm text-n-1">{name}</div>
                  <div className="text-[11px] text-n-3 mt-0.5">{DESCRIPTIONS[name] || info.script}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {info.running && <Pill tone="warn">running</Pill>}
                  <Pill tone={info.exists ? 'good' : 'bad'}>{info.exists ? 'ready' : 'missing'}</Pill>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button tone="secondary" size="sm" onClick={() => run(name)} disabled={!info.exists || busy[name] || info.running}>
                  {busy[name] ? 'Kicking…' : 'Run'}
                </Button>
                {name === 'analyst' && (
                  <Button tone="ghost" size="sm" onClick={() => run(name, { smoke: true })} disabled={busy[name]}>
                    Smoke test
                  </Button>
                )}
                {name === 'cms-injector' && (
                  <Button tone="ghost" size="sm" onClick={() => run(name, { previewOnly: true })} disabled={busy[name]}>
                    Preview only
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
