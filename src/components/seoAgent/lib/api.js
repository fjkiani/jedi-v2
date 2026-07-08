// Small fetch wrapper for the SEO agent backend.
// In dev, Vite proxies /api/* to http://localhost:5175 (see vite.config.js).

const BASE = import.meta.env.VITE_SEO_AGENT_BASE || '';

async function api(path, opts = {}) {
  const headers = { 'content-type': 'application/json', ...(opts.headers || {}) };
  // Attach Clerk token if we're in the browser and have a getter
  if (typeof window !== 'undefined' && window.__seoAgentGetToken) {
    try {
      const token = await window.__seoAgentGetToken();
      if (token) headers.authorization = `Bearer ${token}`;
    } catch { /* ignore */ }
  }
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    const err = new Error(json?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

export const seoAgent = {
  health: () => api('/api/health'),
  authMode: () => api('/api/auth-mode'),

  // Orchestrator
  runOrchestrator: (body) => api('/api/orchestrator/run', { method: 'POST', body: JSON.stringify(body || {}) }),
  killOrchestrator: () => api('/api/orchestrator/kill', { method: 'POST' }),
  status: () => api('/api/orchestrator/status'),
  listRuns: () => api('/api/orchestrator/runs'),
  getRun: (id) => api(`/api/orchestrator/runs/${encodeURIComponent(id)}`),

  // Workers
  listWorkers: () => api('/api/workers'),
  runWorker: (name, body) => api(`/api/workers/${name}/run`, { method: 'POST', body: JSON.stringify(body || {}) }),
  killWorker: (name) => api(`/api/workers/${name}/kill`, { method: 'POST' }),

  // Audit
  auditDist: () => api('/api/audit/dist'),

  // Hygraph
  hygraphConfig: () => api('/api/hygraph/config'),
  hygraphIntrospect: () => api('/api/hygraph/introspect'),
  hygraphPosts: () => api('/api/hygraph/posts'),
  hygraphTechnologies: () => api('/api/hygraph/technologies'),
  hygraphLookup: (slug, model) => api(`/api/hygraph/lookup?slug=${encodeURIComponent(slug)}&model=${encodeURIComponent(model || 'Technology')}`),

  // Repo
  repoStatus: () => api('/api/repo/status'),
  repoBranches: () => api('/api/repo/branches'),

  // Aggregates (cross-run views)
  aggregateKeywords: () => api('/api/aggregate/keywords'),
  aggregatePageIndex: () => api('/api/aggregate/page-index'),
};

// SSE helper
export function openLogStream(key, onEvent) {
  const url = `${BASE}/api/orchestrator/stream?key=${encodeURIComponent(key)}`;
  const es = new EventSource(url, { withCredentials: false });
  es.onmessage = (msg) => {
    try {
      const evt = JSON.parse(msg.data);
      onEvent(evt);
    } catch { /* ignore */ }
  };
  es.onerror = () => {
    // Let the caller close/re-open; EventSource will auto-retry
  };
  return es;
}
