const CACHE_VERSION = "dream-poker-20260714-enemy-balance1";
const CORE_CACHE = `${CACHE_VERSION}-core`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const WARMUP_CACHE = CACHE_VERSION;

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./assets/app.css?v=20260714-enemy-balance1",
  "./assets/app.js?v=20260714-enemy-balance1",
  "./asset-warmup.js?v=20260714-enemy-balance1",
  "./assets/backgrounds/battle-common.jpg",
  "./assets/characters/holder-hero.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("dream-poker-") && !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  return /\.(?:css|js|jpg|jpeg|png|svg)$/i.test(url.pathname);
}

function cacheKeyFor(request) {
  const url = new URL(request.url);
  if (url.pathname.endsWith("/")) return new Request(url.origin + url.pathname, request);
  return request;
}

async function networkFirst(request) {
  const cache = await caches.open(CORE_CACHE);
  const key = cacheKeyFor(request);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(key, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(key) || await cache.match("./index.html");
    if (cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const warmupCache = await caches.open(WARMUP_CACHE);
  const cached = await cache.match(request) || await warmupCache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || refresh;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
