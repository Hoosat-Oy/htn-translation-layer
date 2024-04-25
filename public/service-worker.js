importScripts('service-worker-urls.js');

const CACHE_NAME = `hoosat-${nonce}`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      if (
        event.request.url.startsWith('http') ||
        event.request.url.startsWith('https')
      ) {
        return fetch(event.request)
          .then((networkResponse) => {
            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type !== 'basic'
            ) {
              return networkResponse;
            }
            if (event.request.method !== "GET") {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME).then((cache) => {
              const requestUrl = new URL(event.request.url);

              const isCompressed =
                requestUrl.pathname.endsWith('.gz') ||
                requestUrl.pathname.endsWith('.br') ||
                requestUrl.pathname.endsWith('.deflate');

              let contentType = networkResponse.headers.get('Content-Type');
              let contentEncoding = networkResponse.headers.get('Content-Encoding');

              if (isCompressed) {
                contentType = 'application/javascript';
                contentEncoding = 'gzip'; // Adjust based on the actual encoding
              }

              const headers = new Headers({
                ...networkResponse.headers,
                'Content-Type': contentType,
                'Content-Encoding': contentEncoding,
              });
              cache.put(
                event.request,
                new Response(responseToCache.body, {
                  headers,
                })
              );
            });

            return networkResponse;
          })
          .catch(() => {
            // Handle fetch errors, if needed
          });
      }
    })
  );
});
