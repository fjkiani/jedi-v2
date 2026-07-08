// /seo-command-center — internal ops app for the agentic-seo-loop.
//
// Wraps the whole thing in Clerk auth (AuthGate).
// Backend: scripts/seo-agent-server/server.mjs — run via `npm run seo:agent`.
// Vite dev proxies /api/* to :5175 (see vite.config.js).

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AuthGate from '@/components/seoAgent/AuthGate';
import HeaderBar from '@/components/seoAgent/panels/HeaderBar';
import AuditPanel from '@/components/seoAgent/panels/AuditPanel';
import OrchestratorPanel from '@/components/seoAgent/panels/OrchestratorPanel';
import LiveLogPanel from '@/components/seoAgent/panels/LiveLogPanel';
import WorkersGrid from '@/components/seoAgent/panels/WorkersGrid';
import RunsPanel from '@/components/seoAgent/panels/RunsPanel';
import RunDetailPanel from '@/components/seoAgent/panels/RunDetailPanel';
import HygraphPanel from '@/components/seoAgent/panels/HygraphPanel';
import KeywordsPanel from '@/components/seoAgent/panels/KeywordsPanel';
import PageIndexPanel from '@/components/seoAgent/panels/PageIndexPanel';

export default function SeoCommandCenter() {
  const [selectedRun, setSelectedRun] = useState(null); // {run_id, path}
  const [session, setSession] = useState(null);

  return (
    <div className="min-h-screen bg-n-8 text-n-1 pb-24">
      <Helmet>
        <title>SEO Command Center | JEDI Labs</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <AuthGate onSignedIn={setSession}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
          <HeaderBar userId={session?.userId} />

          <section className="grid grid-cols-1 gap-4 mb-4">
            <AuditPanel />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <OrchestratorPanel onRunKicked={() => {}} />
            <LiveLogPanel />
          </section>

          <section className="grid grid-cols-1 gap-4 mb-4">
            <RunsPanel
              onSelectRun={(r) => setSelectedRun(r)}
              selectedRunId={selectedRun?.run_id}
            />
            <RunDetailPanel runId={selectedRun?.run_id} onRunFetched={() => {}} />
          </section>

          <section className="grid grid-cols-1 gap-4 mb-4">
            <WorkersGrid latestRunId={selectedRun?.path} />
          </section>

          <section className="grid grid-cols-1 gap-4 mb-4">
            <HygraphPanel />
          </section>

          <section className="grid grid-cols-1 gap-4 mb-4">
            <KeywordsPanel />
          </section>

          <section className="grid grid-cols-1 gap-4 mb-4">
            <PageIndexPanel />
          </section>

          <footer className="text-[11px] text-n-4 mt-8 border-t border-n-6/60 pt-3">
            Skill: <span className="font-mono">agentic-seo-loop</span> ·{' '}
            Backend: <span className="font-mono">scripts/seo-agent-server/</span> ·{' '}
            All actions are audit-logged in the run directory under <span className="font-mono">/mnt/shared-workspace/agentic-seo-loop/</span>.
          </footer>
        </div>
      </AuthGate>
    </div>
  );
}
