const CACHE_NAME = "marco-legendario-v33";
const BASE = new URL("./", self.location.href).pathname;
const CORE_ASSETS = [
  BASE,
  `${BASE}index.html`,
  `${BASE}styles.css?v=marco-31`,
  `${BASE}app.js?v=marco-33`,
  `${BASE}monkey-box-sound.mp4`,
  `${BASE}world1-complete-video.mp4`,
  `${BASE}world2-complete-video.mp4`,
  `${BASE}world3-complete-video.mp4`,
  `${BASE}character-run-sheet.png`,
  `${BASE}character-monkey-run-sheet.png`,
  `${BASE}world3-jacket-run-sheet.png`,
  `${BASE}ending-video.mp4`,
  `${BASE}perfect-ending-video.mp4`,
  `${BASE}intro-art-v2.jpg`,
  `${BASE}world3-jacket.png`,
  `${BASE}world3-jacket-run2.png`,
  `${BASE}intro-marco.mp3`,
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
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(CORE_ASSETS.map(asset => cache.add(asset)))
    )
  );
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
        .catch(() => caches.match(BASE).then(cached => cached || caches.match(`${BASE}index.html`)))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
