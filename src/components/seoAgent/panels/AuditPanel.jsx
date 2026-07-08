import React, { useEffect, useState } from 'react';
import { seoAgent } from '../lib/api';
import { Card, CardHeader, CardBody, Stat, Pill, Button } from '../ui/Card';

export default function AuditPanel() {
  const [audit, setAudit] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await seoAgent.auditDist();
      if (!res.ok) setErr(res.error || 'unknown error');
      setAudit(res);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const s = audit?.summary;
  const multiH1Routes = s?.multi_h1_offenders || [];

  return (
    <Card>
      <CardHeader
        title="Live audit — current dist"
        subtitle={audit?.ok ? 'Snapshot of what /dist looks like right now' : 'Backend or dist unavailable'}
        right={
          <Button tone="secondary" onClick={load} disabled={loading}>
            {loading ? 'Scanning…' : 'Re-scan'}
          </Button>
        }
      />
      <CardBody>
        {err && (
          <div className="text-xs text-color-3 bg-color-3/10 border border-color-3/25 rounded p-2 mb-3">
            {err}
          </div>
        )}
        {s && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Routes" value={s.total_routes ?? '—'} />
            <Stat label="Unique titles" value={s.unique_titles ?? '—'} sublabel={s.total_routes ? `${s.total_routes - (s.unique_titles || 0)} duplicate${s.total_routes - (s.unique_titles || 0) === 1 ? '' : 's'}` : null} />
            <Stat label="Title avg len" value={s.title_length?.avg ?? '—'} sublabel={s.title_length ? `min ${s.title_length.min} · max ${s.title_length.max}` : null} />
            <Stat label="Desc avg len" value={s.description_length?.avg ?? '—'} sublabel={s.description_length ? `min ${s.description_length.min} · max ${s.description_length.max}` : null} />
            <Stat label="Has canonical" value={s.has_canonical ?? '—'} tone={s.total_routes === s.has_canonical ? 'good' : 'warn'} />
            <Stat label="Has og:image" value={s.has_og_image ?? '—'} tone={s.total_routes === s.has_og_image ? 'good' : 'warn'} />
            <Stat label="Has JSON-LD" value={s.has_json_ld_routes ?? '—'} tone={s.total_routes === s.has_json_ld_routes ? 'good' : 'warn'} />
            <Stat
              label="Multi-h1"
              value={multiH1Routes.length}
              tone={multiH1Routes.length === 0 ? 'good' : 'bad'}
              sublabel={multiH1Routes.length === 0 ? 'clean' : 'need fix'}
            />
          </div>
        )}
        {multiH1Routes.length > 0 && (
          <div className="mt-4 border-t border-n-6/60 pt-3">
            <div className="text-xs text-n-3 mb-2">Routes with multiple &lt;h1&gt; tags:</div>
            <div className="flex flex-wrap gap-1.5">
              {multiH1Routes.map((r) => (
                <Pill key={r.route} tone="bad">
                  <span className="font-mono">{r.route}</span> — {r.count}
                </Pill>
              ))}
            </div>
          </div>
        )}
        {audit?.top_long_titles?.length > 0 && (
          <div className="mt-4 border-t border-n-6/60 pt-3">
            <div className="text-xs text-n-3 mb-2">Longest titles (SEO risk if &gt; 60 chars):</div>
            <div className="space-y-1 max-h-40 overflow-auto">
              {audit.top_long_titles.map((r) => (
                <div key={r.route} className="text-[11px] font-mono flex gap-3 items-baseline">
                  <span className={r.len > 60 ? 'text-color-3' : 'text-n-2'}>{r.len}</span>
                  <span className="text-color-5">{r.route}</span>
                  <span className="text-n-2 truncate">{r.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
