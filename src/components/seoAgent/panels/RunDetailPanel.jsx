import React, { useEffect, useState } from 'react';
import { seoAgent } from '../lib/api';
import { Card, CardHeader, CardBody, Stat, Pill, Button } from '../ui/Card';

export default function RunDetailPanel({ runId, onRunFetched }) {
  const [detail, setDetail] = useState(null);
  const [err, setErr] = useState(null);
  const [tab, setTab] = useState('summary');

  useEffect(() => {
    if (!runId) { setDetail(null); return; }
    let alive = true;
    (async () => {
      try {
        const res = await seoAgent.getRun(runId);
        if (!alive) return;
        setDetail(res); setErr(null);
        onRunFetched?.(res);
      } catch (e) { setErr(e.body?.error || e.message); }
    })();
    return () => { alive = false; };
  }, [runId, onRunFetched]);

  if (!runId) {
    return (
      <Card>
        <CardHeader title="Run detail" subtitle="Pick a row above to inspect a specific pass." />
      </Card>
    );
  }

  if (err) return <Card><CardBody><div className="text-xs text-color-3">{err}</div></CardBody></Card>;
  if (!detail) return <Card><CardBody><div className="text-xs text-n-3">Loading…</div></CardBody></Card>;

  const diff = detail.audit_diff;
  const counts = detail.counts || {};
  const runShortId = runId.split('/').pop();

  const tabs = [
    { key: 'summary',   label: 'Summary' },
    { key: 'diff',      label: 'Audit diff' },
    { key: 'proposals', label: `Edit proposals (${counts.edit_proposals || 0})` },
    { key: 'newpages',  label: `New pages (${counts.new_page_proposals || 0})` },
    { key: 'applied',   label: `Applied (${(counts.edits_applied || 0) + (counts.perf_applied || 0) + (counts.pages_scaffolded || 0)})` },
    { key: 'cms',       label: `CMS hand-off (${counts.cms_handoff || 0})` },
  ];

  return (
    <Card>
      <CardHeader
        title={<span>Run <span className="font-mono text-color-5">{runShortId}</span></span>}
        subtitle={
          <span className="font-mono text-[11px]">
            {detail.manifest?.commit_sha?.slice(0, 7) || '—'} · {detail.manifest?.agent_branch || '—'}
          </span>
        }
        right={
          <div className="flex flex-wrap gap-1">
            {tabs.map((t) => (
              <Button key={t.key} tone={tab === t.key ? 'primary' : 'ghost'} size="sm" onClick={() => setTab(t.key)}>
                {t.label}
              </Button>
            ))}
          </div>
        }
      />
      <CardBody>
        {tab === 'summary' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Seeds" value={detail.manifest?.seed_count ?? '—'} />
            <Stat label="Edit proposals" value={counts.edit_proposals ?? 0} />
            <Stat label="Edits applied" value={counts.edits_applied ?? 0} tone={counts.edits_applied > 0 ? 'good' : 'neutral'} />
            <Stat label="CMS hand-off" value={counts.cms_handoff ?? 0} tone={counts.cms_handoff > 0 ? 'info' : 'neutral'} />
            <Stat label="Perf fixes applied" value={counts.perf_applied ?? 0} tone={counts.perf_applied > 0 ? 'good' : 'neutral'} />
            <Stat label="New pages" value={counts.pages_scaffolded ?? 0} />
            <Stat label="Multi-h1 Δ" value={diff ? `${diff.multi_h1_offenders?.before_count} → ${diff.multi_h1_offenders?.after_count}` : '—'} tone={diff?.multi_h1_offenders?.after_count === 0 && diff?.multi_h1_offenders?.before_count > 0 ? 'good' : 'neutral'} />
            <Stat label="Routes" value={detail.audit_after?.total_routes ?? '—'} />
          </div>
        )}
        {tab === 'diff' && (
          <pre className="text-[11px] font-mono bg-n-8 rounded p-3 max-h-96 overflow-auto whitespace-pre-wrap">
            {JSON.stringify(diff, null, 2)}
          </pre>
        )}
        {tab === 'proposals' && (
          <div className="space-y-2 max-h-96 overflow-auto">
            {(detail.edit_proposals || []).length === 0 && <div className="text-xs text-n-4">No edit proposals in this run.</div>}
            {(detail.edit_proposals || []).map((p, i) => (
              <div key={i} className="border border-n-6/60 rounded-lg p-3 bg-n-7/40">
                <div className="flex items-center gap-2 mb-1 text-xs">
                  <Pill tone="info"><span className="font-mono">{p.route}</span></Pill>
                  <Pill tone="warn">kw: {p.target_keyword} · vol {p.keyword_stats?.volume_us} · KD {p.keyword_stats?.kd_pct}%</Pill>
                  <Pill tone={p.confidence >= 0.9 ? 'good' : p.confidence >= 0.6 ? 'warn' : 'bad'}>conf {p.confidence?.toFixed?.(2)}</Pill>
                </div>
                <div className="text-[11px] text-n-3">Title</div>
                <div className="text-xs text-n-4 line-through">{p.current_title}</div>
                <div className="text-xs text-color-4">→ {p.proposed_title}</div>
                <div className="text-[11px] text-n-3 mt-2">Description</div>
                <div className="text-xs text-n-4 line-through">{p.current_desc}</div>
                <div className="text-xs text-color-4">→ {p.proposed_desc}</div>
                <div className="text-[11px] text-n-3 mt-2">H1</div>
                <div className="text-xs text-n-4 line-through">{p.current_h1}</div>
                <div className="text-xs text-color-4">→ {p.proposed_h1}</div>
              </div>
            ))}
          </div>
        )}
        {tab === 'newpages' && (
          <div className="space-y-2 max-h-96 overflow-auto">
            {(detail.new_page_proposals || []).length === 0 && <div className="text-xs text-n-4">No new-page proposals in this run.</div>}
            {(detail.new_page_proposals || []).map((p, i) => (
              <pre key={i} className="text-[11px] font-mono bg-n-8 rounded p-2 whitespace-pre-wrap">{JSON.stringify(p, null, 2)}</pre>
            ))}
          </div>
        )}
        {tab === 'applied' && (
          <div className="space-y-3 max-h-96 overflow-auto">
            <div>
              <div className="text-xs text-n-3 mb-1">Content injector — edits applied</div>
              {(detail.edits_applied || []).length === 0 && <div className="text-[11px] text-n-4">none</div>}
              {(detail.edits_applied || []).map((e, i) => (
                <pre key={i} className="text-[11px] font-mono bg-n-8 rounded p-2 whitespace-pre-wrap mb-1">{JSON.stringify(e, null, 2)}</pre>
              ))}
            </div>
            <div>
              <div className="text-xs text-n-3 mb-1">Perf-fixer — fixes applied</div>
              {(detail.perf_applied || []).length === 0 && <div className="text-[11px] text-n-4">none</div>}
              {(detail.perf_applied || []).map((e, i) => (
                <pre key={i} className="text-[11px] font-mono bg-n-8 rounded p-2 whitespace-pre-wrap mb-1">{JSON.stringify(e, null, 2)}</pre>
              ))}
            </div>
            <div>
              <div className="text-xs text-n-3 mb-1">Page scaffolder — pages created</div>
              {(detail.pages_scaffolded || []).length === 0 && <div className="text-[11px] text-n-4">none</div>}
              {(detail.pages_scaffolded || []).map((e, i) => (
                <pre key={i} className="text-[11px] font-mono bg-n-8 rounded p-2 whitespace-pre-wrap mb-1">{JSON.stringify(e, null, 2)}</pre>
              ))}
            </div>
          </div>
        )}
        {tab === 'cms' && (
          <div className="space-y-2 max-h-96 overflow-auto">
            {(detail.cms_handoff || []).length === 0 && <div className="text-xs text-n-4">No CMS hand-off proposals in this run.</div>}
            {(detail.cms_handoff || []).map((p, i) => (
              <div key={i} className="border border-color-5/30 bg-color-5/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1 text-xs">
                  <Pill tone="info"><span className="font-mono">{p.route}</span></Pill>
                  <Pill tone="warn">kw: {p.target_keyword} · vol {p.keyword_stats?.volume_us} · KD {p.keyword_stats?.kd_pct}%</Pill>
                </div>
                <div className="text-[11px] text-n-3">Proposed title</div>
                <div className="text-xs text-color-4">{p.proposed_title}</div>
                <div className="text-[11px] text-n-3 mt-1">Proposed description</div>
                <div className="text-xs text-color-4">{p.proposed_desc}</div>
                <div className="text-[11px] text-n-3 mt-2">
                  This route is CMS-owned. Run the <span className="font-mono">cms-injector</span> worker on this run to draft a Hygraph mutation.
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
