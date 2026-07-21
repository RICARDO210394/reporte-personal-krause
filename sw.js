// Service Worker - Registro de Comportamiento de Personal
// Estrategia: network-first (siempre intenta traer la versión más nueva de la red;
// si no hay conexión, usa lo último que tenga guardado en caché).

const CACHE_NAME = 'registro-personal-cache-v1';

self.addEventListener('install', (event) => {
  // Activarse de inmediato, sin esperar a que se cierren las demás pestañas abiertas.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
  // Tomar control de las páginas ya abiertas sin necesidad de recargar manualmente.
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
