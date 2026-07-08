// Clerk-based auth gate for the SEO command center.
// - If Clerk publishable key is missing, we render a config notice, not a broken page.
// - If configured but user is signed out, show sign-in.
// - If signed in, render children and wire the Clerk session token onto window
//   so the API client (src/components/seoAgent/lib/api.js) can attach it.

import React, { useEffect } from 'react';
import { SignedIn, SignedOut, SignIn, UserButton, useAuth } from '@clerk/clerk-react';

function TokenPropagator({ onReady }) {
  const { isLoaded, getToken, userId, sessionId } = useAuth();
  useEffect(() => {
    if (!isLoaded) return;
    window.__seoAgentGetToken = async () => {
      try { return await getToken(); } catch { return null; }
    };
    onReady?.({ userId, sessionId });
  }, [isLoaded, getToken, userId, sessionId, onReady]);
  return null;
}

export default function AuthGate({ children, onSignedIn }) {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!clerkKey) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-lg rounded-2xl border border-color-2/40 bg-color-2/5 p-6 text-n-1">
          <h2 className="text-lg font-semibold mb-2">Clerk not configured</h2>
          <p className="text-sm text-n-2 mb-4">
            The SEO command center requires Clerk auth to gate operator actions. Add
            <code className="mx-1 px-1 rounded bg-n-8">VITE_CLERK_PUBLISHABLE_KEY</code>
            to your <code>.env.local</code> and reload.
          </p>
          <p className="text-xs text-n-3">
            To temporarily bypass auth for local demo, set <code>SEO_AGENT_AUTH=demo</code>
            on the backend and reload with any Clerk key — auth is enforced server-side.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <TokenPropagator onReady={onSignedIn} />
        {children}
      </SignedIn>
      <SignedOut>
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="text-xs uppercase tracking-widest text-color-5 mb-2">JEDI Labs — Internal Ops</div>
              <h1 className="text-2xl font-semibold text-n-1">SEO Command Center</h1>
              <p className="text-sm text-n-3 mt-2">
                Auth-gated demo of the agentic-seo-loop. Sign in to run the workers against jedi-v2 in real time.
              </p>
            </div>
            <SignIn afterSignInUrl="/seo-command-center" routing="virtual" />
          </div>
        </div>
      </SignedOut>
    </>
  );
}

export function UserButtonBadge() {
  return (
    <div className="flex items-center gap-3">
      <UserButton afterSignOutUrl="/seo-command-center" />
    </div>
  );
}
