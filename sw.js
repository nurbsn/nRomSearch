const CACHE_NAME = 'nromsearch-shell-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './styles/main.css',
  './js/app.js',
  './js/api.js',
  './js/ui.js',
  './assets/icons/icon.svg'
];

// Install: Cache core App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Zewnętrzne boxarty (Libretro) i katalogi gier z GitHuba
  if (url.hostname === 'raw.githubusercontent.com') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const resClone = response.clone();
            caches.open('nromsearch-catalog-v1').then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // 2. Internet Archive (miniaturki vs bezpośrednie API/download)
  if (url.hostname.includes('archive.org')) {
    if (url.pathname.startsWith('/services/img/')) {
      event.respondWith(
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const resClone = response.clone();
              caches.open('nromsearch-covers-v1').then((cache) => {
                cache.put(event.request, resClone);
              });
            }
            return response;
          }).catch(() => cached);
        })
      );
      return;
    }

    // Advanced search & metadata API & pliki ROM -> świeże z sieci
    event.respondWith(fetch(event.request));
    return;
  }

  // 3. App Shell: Cache-first z fallbackiem do sieci
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        return networkResponse;
      });
    }).catch(() => {
      if (event.request.headers.get('accept')?.includes('text/html')) {
        return caches.match('./index.html');
      }
    })
  );
});
