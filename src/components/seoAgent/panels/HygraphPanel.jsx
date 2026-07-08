import React, { useEffect, useState } from 'react';
import { seoAgent } from '../lib/api';
import { Card, CardHeader, CardBody, Button, Pill } from '../ui/Card';

export default function HygraphPanel() {
  const [config, setConfig] = useState(null);
  const [posts, setPosts] = useState(null);
  const [techs, setTechs] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    (async () => { try { setConfig(await seoAgent.hygraphConfig()); } catch (e) { setErr(e.message); } })();
  }, []);

  const loadPosts = async () => {
    setLoading((l) => ({ ...l, posts: true }));
    try { setPosts(await seoAgent.hygraphPosts()); } catch (e) { setErr(e.body?.error || e.message); }
    finally { setLoading((l) => ({ ...l, posts: false })); }
  };
  const loadTechs = async () => {
    setLoading((l) => ({ ...l, techs: true }));
    try { setTechs(await seoAgent.hygraphTechnologies()); } catch (e) { setErr(e.body?.error || e.message); }
    finally { setLoading((l) => ({ ...l, techs: false })); }
  };

  return (
    <Card>
      <CardHeader
        title="Hygraph"
        subtitle="Live connection to the JEDI Labs CMS. Reads = CDN. Writes require HYGRAPH_MANAGEMENT_TOKEN + operator confirm."
        right={
          <>
            <Pill tone={config?.cdn_token_present ? 'good' : 'bad'}>CDN {config?.cdn_token_present ? 'ok' : 'missing'}</Pill>
            <Pill tone={config?.management_token_present ? 'good' : 'warn'}>MGMT {config?.management_token_present ? 'ok' : 'not set (preview only)'}</Pill>
          </>
        }
      />
      <CardBody>
        {err && <div className="text-xs text-color-3 bg-color-3/10 border border-color-3/25 rounded p-2 mb-3">{err}</div>}
        <div className="text-[11px] font-mono text-n-3 mb-3">
          endpoint: {config?.cdn_endpoint || '—'}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-n-6/60 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-n-1">Posts</div>
              <Button tone="secondary" size="sm" onClick={loadPosts} disabled={loading.posts}>
                {loading.posts ? 'Loading…' : 'Fetch'}
              </Button>
            </div>
            {posts?.posts && (
              <div className="text-[11px] max-h-56 overflow-auto space-y-1">
                <div className="text-n-3">{posts.count} post{posts.count === 1 ? '' : 's'}</div>
                {posts.posts.map((p) => (
                  <div key={p.id} className="font-mono">
                    <span className="text-color-5">{p.slug}</span> — <span className="text-n-2">{p.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border border-n-6/60 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-n-1">Technologies</div>
              <Button tone="secondary" size="sm" onClick={loadTechs} disabled={loading.techs}>
                {loading.techs ? 'Loading…' : 'Fetch'}
              </Button>
            </div>
            {techs?.technologies && (
              <div className="text-[11px] max-h-56 overflow-auto space-y-1">
                <div className="text-n-3">{techs.count} technolog{techs.count === 1 ? 'y' : 'ies'}</div>
                {techs.technologies.map((t, i) => (
                  <div key={t.id || t.slug || i} className="font-mono">
                    <span className="text-color-5">{t.slug}</span> — <span className="text-n-2">{t.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
