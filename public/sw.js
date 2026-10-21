/*
 * PyPath service worker — offline hardening (M5, R-ARC-01/R-ARC-07).
 * Strategy:
 *  - Navigation requests (the single app shell): network-first with cache
 *    fallback → deploys land immediately, offline reloads still boot.
 *  - Static assets (hashed chunks, vendored Pyodide, py-modules, data JSON):
 *    cache-first (immutable by nature; manifest/coverage are re-fetched in the
 *    background on every boot via the network-first shell data path).
 * The cache is versioned; stale caches are purged on activate.
 * Privacy: same-origin only — nothing is sent anywhere (R-ARC-10).
 */
const VERSION = 'pypath-v2';
const SHELL = `${VERSION}-shell`;
const ASSETS = `${VERSION}-assets`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((cache) => cache.addAll(['/', '/data/manifest.json', '/data/coverage.json'])).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Cache successful shells ONLY — a 502/412 from an outage must
          // never poison the offline fallback (v1 cached every response).
          if (res.ok) {
            const copy = res.clone();
            caches.open(SHELL).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('/'))),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok && (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/vendor/') || url.pathname.startsWith('/py-modules/') || url.pathname.startsWith('/data/'))) {
            const copy = res.clone();
            caches.open(ASSETS).then((c) => c.put(req, copy));
          }
          return res;
        }),
    ),
  );
});
