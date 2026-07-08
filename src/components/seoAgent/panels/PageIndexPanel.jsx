import React, { useEffect, useState, useMemo } from 'react';
import { seoAgent } from '../lib/api';
import { Card, CardHeader, CardBody, Stat, Pill, Button } from '../ui/Card';

// Crawler view of the entire site the loop knows about.
// Answers: which routes exist, which are CMS-owned vs static, which have SEO flags.
export default function PageIndexPanel() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [filter, setFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('all'); // all | cms | static
  const [flagFilter, setFlagFilter] = useState('all'); // all | flagged | clean
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await seoAgent.aggregatePageIndex();
      setData(res);
    } catch (e) { setErr(e.body?.error || e.message); }
    setBusy(false);
  };

  useEffect(() => { load(); }, []);

  const rows = useMemo(() => {
    if (!data?.pages) return [];
    let list = data.pages;
    if (filter) list = list.filter((p) => p.route?.toLowerCase().includes(filter.toLowerCase()) || p.title?.toLowerCase().includes(filter.toLowerCase()));
    if (ownerFilter === 'cms') list = list.filter((p) => p.cms_owned);
    else if (ownerFilter === 'static') list = list.filter((p) => !p.cms_owned);
    if (flagFilter === 'flagged') list = list.filter((p) => p.flags && p.flags.length > 0);
    else if (flagFilter === 'clean') list = list.filter((p) => !p.flags || p.flags.length === 0);
    return list;
  }, [data, filter, ownerFilter, flagFilter]);

  if (err) return <Card><CardBody><div className="text-xs text-color-3">{err}</div></CardBody></Card>;
  if (!data) return <Card><CardHeader title="Page index" subtitle="Loading…" /></Card>;

  const s = data.summary || {};
  const bcm = s.by_cms_model || {};
  return (
    <Card>
      <CardHeader
        title="Page index"
        subtitle={
          <span>
            {s.total} routes · {s.cms_owned} CMS-owned · {s.static_owned} static · {s.flagged} flagged · source: <span className="font-mono">{data.source_run}</span>
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
          <Stat label="Total routes" value={s.total} />
          <Stat label="CMS-owned" value={s.cms_owned} tone="info" />
          <Stat label="Static-owned" value={s.static_owned} />
          <Stat label="With flags" value={s.flagged} tone={s.flagged > 0 ? 'warn' : 'good'} />
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <Pill tone="info">Post: {bcm.Post || 0}</Pill>
          <Pill tone="info">Technology: {bcm.Technology || 0}</Pill>
          <Pill tone="info">UseCase: {bcm.UseCase || 0}</Pill>
          <Pill tone="info">CaseStudy: {bcm.CaseStudy || 0}</Pill>
          <Pill tone="info">Industry: {bcm.Industry || 0}</Pill>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="Filter route or title…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-n-8 border border-n-6 rounded px-2 py-1 text-xs text-n-1 placeholder:text-n-4"
          />
          <div className="flex gap-1">
            {['all', 'cms', 'static'].map((v) => (
              <Button key={v} size="sm" tone={ownerFilter === v ? 'primary' : 'ghost'} onClick={() => setOwnerFilter(v)}>
                {v}
              </Button>
            ))}
          </div>
          <div className="flex gap-1">
            {['all', 'flagged', 'clean'].map((v) => (
              <Button key={v} size="sm" tone={flagFilter === v ? 'primary' : 'ghost'} onClick={() => setFlagFilter(v)}>
                {v}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-auto max-h-96 border border-n-6/50 rounded">
          <table className="w-full text-[11px] font-mono">
            <thead className="sticky top-0 bg-n-8 border-b border-n-6/60">
              <tr className="text-n-3">
                <th className="text-left px-2 py-1">Route</th>
                <th className="text-left px-2 py-1">Owner</th>
                <th className="text-left px-2 py-1">Title</th>
                <th className="text-right px-2 py-1">T len</th>
                <th className="text-right px-2 py-1">D len</th>
                <th className="text-left px-2 py-1">Flags</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={i} className="border-t border-n-7/60 hover:bg-n-7/40 align-top">
                  <td className="px-2 py-1 text-n-1 whitespace-nowrap">{p.route}</td>
                  <td className="px-2 py-1">
                    {p.cms_owned
                      ? <Pill tone="info">{p.cms_model}</Pill>
                      : <Pill tone="neutral">static</Pill>}
                  </td>
                  <td className="px-2 py-1 text-n-2 truncate max-w-xs">{p.title || <span className="text-color-3">no title</span>}</td>
                  <td className={`px-2 py-1 text-right ${p.title_length > 65 ? 'text-color-3' : p.title_length < 15 ? 'text-color-3' : 'text-color-4'}`}>
                    {p.title_length}
                  </td>
                  <td className={`px-2 py-1 text-right ${p.description_length > 160 ? 'text-color-3' : p.description_length < 50 ? 'text-color-3' : 'text-color-4'}`}>
                    {p.description_length}
                  </td>
                  <td className="px-2 py-1">
                    {p.flags && p.flags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {p.flags.map((f) => <Pill key={f} tone="warn">{f}</Pill>)}
                      </div>
                    ) : <span className="text-color-4">✓</span>}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-2 py-4 text-center text-n-4">No pages match filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
