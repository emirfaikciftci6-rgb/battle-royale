// Battle Royale 2D — Service Worker (v1)
// Caches core assets for offline play.

const CACHE_NAME = 'br2d-v1';
const ASSETS = [
  './battle-royale.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
];

// Install: cache all listed assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: remove any old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
