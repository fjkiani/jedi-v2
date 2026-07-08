import React, { useEffect, useState } from 'react';
import { seoAgent } from '../lib/api';
import { Pill, Button } from '../ui/Card';
import { UserButtonBadge } from '../AuthGate';

export default function HeaderBar({ userId }) {
  const [health, setHealth] = useState(null);
  const [repo, setRepo] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [h, r] = await Promise.all([seoAgent.health(), seoAgent.repoStatus().catch(() => null)]);
        if (!alive) return;
        setHealth(h); setRepo(r);
      } catch (e) { /* backend unreachable, that's fine — show it */ }
    })();
    const iv = setInterval(async () => {
      try {
        const [h, r] = await Promise.all([seoAgent.health(), seoAgent.repoStatus().catch(() => null)]);
        if (!alive) return;
        setHealth(h); setRepo(r);
      } catch {}
    }, 30_000);
    return () => { alive = false; clearInterval(iv); };
  }, []);

  const env = health?.env_present || {};

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-color-5">JEDI Labs — Internal Ops</div>
        <h1 className="text-xl md:text-2xl font-semibold text-n-1">SEO Command Center</h1>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <Pill tone={health?.ok ? 'good' : 'bad'}>backend {health?.ok ? 'up' : 'down'}</Pill>
          <Pill tone={env.semrush ? 'good' : 'bad'}>semrush {env.semrush ? 'ok' : 'missing'}</Pill>
          <Pill tone={env.gemma ? 'good' : 'bad'}>gemini {env.gemma ? 'ok' : 'missing'}</Pill>
          <Pill tone={env.hygraph_cdn ? 'good' : 'bad'}>hygraph {env.hygraph_cdn ? 'ok' : 'missing'}</Pill>
          <Pill tone={env.clerk_secret ? 'good' : 'warn'}>clerk {env.clerk_secret ? 'server-ok' : 'demo-mode'}</Pill>
          {repo?.branch && (
            <Pill tone="info">
              <span className="font-mono">{repo.branch}</span> @ <span className="font-mono">{(repo.head_sha || '').slice(0, 7)}</span>
            </Pill>
          )}
          {repo?.dirty_files?.length > 0 && (
            <Pill tone="warn">dirty: {repo.dirty_files.length} file{repo.dirty_files.length === 1 ? '' : 's'}</Pill>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button tone="ghost" onClick={() => window.location.reload()}>Refresh</Button>
        <UserButtonBadge />
      </div>
    </div>
  );
}
