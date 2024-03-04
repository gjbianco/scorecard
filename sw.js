const VERSION = "v1";
const CACHE_NAME = `scorecard-${VERSION}`;
const APP_STATIC_RESOURCES = [
  "./",
  "./index.html",
  "./notepad.svg",
  "./manifest.json",
  "sw.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(async () => {
    const cache = await caches.open("cacheName_identifier");
    cache.addAll(APP_STATIC_RESOURCES);
  });
});

self.addEventListener("activate", (e) => {
  e.waitUntil(async () => {
    const names = await caches.keys();
    await Promise.all(
      names.map((name) => {
        if (name !== CACHE_NAME) {
          return caches.delete(name);
        }
      }),
    );
    await clients.claim();
  });
});

self.addEventListener("fetch", (e) => {
  // when seeking an HTML page
  if (e.request.mode === "navigate") {
    // return to the index.html page
    e.respondWith(caches.match("./"));
  } else {
    e.respondWith(async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(e.request.url);

      if (cachedResponse) {
        // return the cached response if it's available
        return cachedResponse;
      } else {
        // respond with an HTTP 404 response status
        return new Response(null, { status: 404 });
      }
    });
  }
});
