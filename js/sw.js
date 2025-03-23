const devMode = location.hostname === 'localhost';

const CACHE_NAME = 'pwa-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/pages/model1.html',
  '/pages/singleGroup.html',
  '/assets/manifest.json'
];

self.addEventListener('install', (event) => {
  if (devMode) {
    console.log('[SW] Dev mode: skipping cache');
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (devMode) return;
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});