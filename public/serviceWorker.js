// Service Worker version - change this number when you deploy a new version
const CACHE_VERSION = "v1.1.2"
const CACHE_NAME = `rhyri-cache-${CACHE_VERSION}`

// Files to cache
const STATIC_ASSETS = ["/", "/manifest.json"]

// Install event - cache important files
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: clearing old cache", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  // Ensure the service worker takes control immediately
  return self.clients.claim()
})

// Fetch event - network first, then cache
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests and non-GET requests
  if (!event.request.url.startsWith(self.location.origin) || event.request.method !== "GET") {
    return
  }

  // Skip requests for module scripts - let the browser handle them directly
  if (event.request.destination === "script" && event.request.mode === "cors") {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If we got a valid response, clone it and store it in the cache
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // If network request fails, try to get it from the cache
        return caches.match(event.request)
      }),
  )
})

// Listen for messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

