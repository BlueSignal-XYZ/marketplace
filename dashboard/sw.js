const CACHE = 'bluesignal-v2';

// On install: skip waiting, don't pre-cache (network-first)
self.addEventListener('install', e => {
  self.skipWaiting();
});

// On activate: delete ALL old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first: always try fresh content, fall back to cache only if offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
