const CACHE_NAME = "medpath-research-companion-v71";
const CORE_ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "static/styles.css",
  "static/app.js",
  "static/icons/medpath-icon.svg",
  "static/vendor/three.module.min.js",
  "static-data/method_universe.json",
  "static-data/article_skill_workflows.json",
  "static-data/plot_gallery_taxonomy.json",
  "static-data/open_source_catalog.json",
  "static-data/research_island_buildings.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => undefined);
        return response;
      }).catch(() => caches.match("./"));
    })
  );
});
