const SW_VERSION = "medpath-no-cache-round110";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", () => {
  // Intentionally do not intercept requests. GitHub Pages must always serve
  // the latest static build instead of a stale cached demo shell.
});
