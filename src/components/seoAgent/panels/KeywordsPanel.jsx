import React, { useEffect, useState, useMemo } from 'react';
import { seoAgent } from '../lib/api';
import { Card, CardHeader, CardBody, Stat, Pill, Button } from '../ui/Card';

// Aggregated Semrush harvest across every run stored in the runs dir.
// Answers: what has the loop asked about, how competitive is it, and which
// keywords have room to run?
export default function KeywordsPanel() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [sortBy, setSortBy] = useState('opportunity');
  const [filter, setFilter] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await seoAgent.aggregateKeywords();
      setData(res);
    } catch (e) { setErr(e.body?.error || e.message); }
    setBusy(false);
  };

  useEffect(() => { load(); }, []);

  const rows = useMemo(() => {
    if (!data?.keywords) return [];
    const filtered = filter
      ? data.keywords.filter((k) => (k.keyword || '').toLowerCase().includes(filter.toLowerCase()))
      : data.keywords;
    const sorted = [...filtered].sort((a, b) => {
      const av = a[sortBy] ?? 0; const bv = b[sortBy] ?? 0;
      if (typeof av === 'number') return bv - av;
      return String(bv).localeCompare(String(av));
    });
    return showAll ? sorted : sorted.slice(0, 25);
  }, [data, filter, sortBy, showAll]);

  if (err) return <Card><CardBody><div className="text-xs text-color-3">{err}</div></CardBody></Card>;
  if (!data) return <Card><CardHeader title="Keyword harvest" subtitle="Loading…" /></Card>;

  const s = data.summary || {};
  return (
    <Card>
      <CardHeader
        title="Keyword harvest"
        subtitle={
          <span>
            {s.total} unique · {s.volume_gt_0} with volume · avg KD {s.avg_kd}% · total volume {s.total_volume?.toLocaleString?.() ?? s.total_volume}
          </span>
        }
        right={
          <Button size="sm" tone="ghost" onClick={load} disabled={busy}>
            {busy ? 'Refreshing…' : 'Refresh'}
          </Button>
        }
      />
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Stat label="Unique keywords" value={s.total} />
          <Stat label="With search volume" value={s.volume_gt_0} tone={s.volume_gt_0 > 0 ? 'good' : 'neutral'} />
          <Stat label="Average KD" value={`${s.avg_kd || 0}%`} tone={(s.avg_kd || 0) < 40 ? 'good' : (s.avg_kd || 0) < 65 ? 'warn' : 'bad'} />
          <Stat label="Total volume" value={s.total_volume?.toLocaleString?.() ?? s.total_volume} />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="Filter…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-n-8 border border-n-6 rounded px-2 py-1 text-xs text-n-1 placeholder:text-n-4"
          />
          {['opportunity', 'volume', 'kdPct', 'monetization'].map((k) => (
            <Button key={k} size="sm" tone={sortBy === k ? 'primary' : 'ghost'} onClick={() => setSortBy(k)}>
              {k}
            </Button>
          ))}
          <Button size="sm" tone="ghost" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Top 25' : 'All'}
          </Button>
        </div>

        <div className="overflow-auto max-h-96 border border-n-6/50 rounded">
          <table className="w-full text-[11px] font-mono">
            <thead className="sticky top-0 bg-n-8 border-b border-n-6/60">
              <tr className="text-n-3">
                <th className="text-left px-2 py-1">Keyword</th>
                <th className="text-right px-2 py-1">Volume</th>
                <th className="text-right px-2 py-1">KD</th>
                <th className="text-right px-2 py-1">CPC</th>
                <th className="text-left px-2 py-1">Intent</th>
                <th className="text-right px-2 py-1">Monetization</th>
                <th className="text-right px-2 py-1">Opportunity</th>
                <th className="text-left px-2 py-1">Last run</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((k, i) => (
                <tr key={i} className="border-t border-n-7/60 hover:bg-n-7/40">
                  <td className="px-2 py-1 text-n-1">{k.keyword}</td>
                  <td className="px-2 py-1 text-right text-n-1">{k.volume?.toLocaleString?.() ?? k.volume ?? 0}</td>
                  <td className={`px-2 py-1 text-right ${k.kdPct < 40 ? 'text-color-4' : k.kdPct < 65 ? 'text-color-2' : 'text-color-3'}`}>
                    {k.kdPct ?? '—'}%
                  </td>
                  <td className="px-2 py-1 text-right text-n-3">{k.cpc || '—'}</td>
                  <td className="px-2 py-1 text-n-2">{k.intent || '—'}</td>
                  <td className="px-2 py-1 text-right text-n-3">{k.monetization ?? '—'}</td>
                  <td className="px-2 py-1 text-right text-color-4 font-bold">
                    {k.opportunity ? Math.round(k.opportunity) : 0}
                  </td>
                  <td className="px-2 py-1 text-n-4 text-[10px]">{k.lastSeenRunId || '—'}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={8} className="px-2 py-4 text-center text-n-4">No keywords match filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {!showAll && data.keywords.length > 25 && (
          <div className="text-[10px] text-n-4 mt-2">
            Showing top 25 of {data.keywords.length}. Click "All" to see the rest.
          </div>
        )}
      </CardBody>
    </Card>
  );
}
