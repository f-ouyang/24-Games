const devMode = location.hostname === 'localhost';

const CACHE_NAME = 'pwa-cache-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'css/style.css',
  'js/script.js',
  'pages/model1.html',
  'pages/singleGroup.html',
  'manifest.json',
  'assets/icon-192.png',
  'assets/icon-512.png'
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

  const url = new URL(event.request.url);

  if (event.request.destination === 'document') {
    // Remove query string for HTML pages
    const cleanUrl = url.pathname;

    event.respondWith(
      caches.match(cleanUrl).then((response) => {
        return response || fetch(event.request);
      }).catch(() => {
        return caches.match('index.html');
      })
    );
  } else {
    // Normal cache-first for everything else
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
}
);