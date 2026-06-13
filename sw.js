const CACHE_NAME = "marco-legendario-v5";
const BASE = "/marco-legendario/";
const CORE_ASSETS = [
  BASE,
  `${BASE}index.html`,
  `${BASE}styles.css?v=marco-5`,
  `${BASE}app.js?v=marco-5`,
  `${BASE}manifest.json`,
  `${BASE}icon-192.png`,
  `${BASE}icon-512.png`,
  `${BASE}character.png`,
  `${BASE}character-run2.png`,
  `${BASE}character-monkey.png`,
  `${BASE}character-monkey-run2.png`,
  `${BASE}monkey-pop.png`
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(BASE, copy));
          return response;
        })
        .catch(() => caches.match(BASE))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
