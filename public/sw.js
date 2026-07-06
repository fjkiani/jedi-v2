/**
 * Jedi Labs — minimal service worker
 * -------------------------------------
 * Goals (in order):
 *   1. Do NOT break dev / non-HTTPS. Only registers on https:.
 *   2. Do NOT get in the way of prerendered HTML being fresh. HTML is
 *      always fetched network-first with a short cache fallback.
 *   3. Cache immutable Vite assets under /assets/ (they have a content
 *      hash in the filename) with cache-first for instant repeat visits.
 *   4. Provide an offline fallback for the top prerendered routes so
 *      the site is usable on flaky mobile networks.
 *
 * This is intentionally small. If you need workbox, add it explicitly.
 */

const VERSION = 'v1';
const RUNTIME_CACHE = `jedi-runtime-${VERSION}`;
const PRECACHE = `jedi-precache-${VERSION}`;

/** Top prerendered routes to keep available offline. */
const PRECACHE_URLS = [
  '/',
  '/benchmarks',
  '/glossary',
  '/industries',
  '/blog',
  '/about',
  '/contact',
  '/manifest.webmanifest',
  '/og/og-home.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      // addAll is atomic; if any fetch fails the whole install fails,
      // so we do them individually and swallow 404s (prerender may
      // rename routes over time).
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const res = await fetch(url, { credentials: 'same-origin' });
            if (res && res.ok) await cache.put(url, res);
          } catch (_) {
            // network unavailable at install-time; skip
          }
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Wipe old caches so we don't leak versions
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== RUNTIME_CACHE && k !== PRECACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

/**
 * Is this a request we should try to cache at all?
 * Only same-origin GETs.
 */
function isCacheable(request) {
  if (request.method !== 'GET') return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  return true;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (!isCacheable(request)) return;

  const url = new URL(request.url);

  // 1) Immutable hashed assets under /assets/ — cache-first, long-lived
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const res = await fetch(request);
          if (res && res.ok) cache.put(request, res.clone());
          return res;
        } catch (err) {
          if (cached) return cached;
          throw err;
        }
      })
    );
    return;
  }

  // 2) HTML / navigation — network-first with cache + offline fallback
  const isHTML =
    request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        try {
          const network = await fetch(request);
          if (network && network.ok) cache.put(request, network.clone());
          return network;
        } catch (_) {
          const cached = await cache.match(request);
          if (cached) return cached;
          const home = await caches.match('/');
          if (home) return home;
          return new Response(
            '<!doctype html><meta charset=utf-8><title>Offline</title><h1>Offline</h1><p>Reconnect to view Jedi Labs.</p>',
            { headers: { 'content-type': 'text/html; charset=utf-8' }, status: 503 }
          );
        }
      })()
    );
    return;
  }

  // 3) Everything else (images, JSON, fonts) — stale-while-revalidate
  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);
      const fetchPromise = fetch(request)
        .then((res) => {
          if (res && res.ok) cache.put(request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })()
  );
});

/** Allow client-triggered skip-waiting after deploy */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
