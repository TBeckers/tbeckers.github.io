const filesToCache = [
  'index.html',
  'stylesheet.css',
  'trash.png',
  'scripts/d3.min.js',
  'scripts/gpr.js',
  'scripts/math_and_opt.js',
  'scripts/script.js',
  'manifest.json',
  'icon192.png',
  'icon512.png'
];

const staticCacheName = 'tbeckers_gpr_catch_v1.91';

self.addEventListener('install', event => {
  //console.log('Attempting to install service worker and cache static assets');
  self.skipWaiting();
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  //console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        //console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      //console.log('Network request for ', event.request.url);
      return fetch(event.request)

      // TODO 4 - Add fetched files to the cache

    }).catch(error => {

      // TODO 6 - Respond with custom offline page

    })
  );
});

self.addEventListener('activate', event => {
  //console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (staticCacheName !== cacheName && cacheName.startsWith("tbeckers_gpr_catch")) {
                       return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
