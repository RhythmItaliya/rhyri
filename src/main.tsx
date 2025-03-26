import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import "./assets/globals.css"
import { Providers } from "./components/Providers.tsx"
import ErrorBoundary from "./components/ErrorBoundary.tsx"

// Add a version number to your app
const APP_VERSION = "1.0.0"

// Store the version in localStorage to check for updates
const storedVersion = localStorage.getItem("app_version")
if (storedVersion !== APP_VERSION) {
  // Clear any cached data
  if (caches) {
    // Delete all caches
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName)
      })
    })
  }

  // Update the stored version
  localStorage.setItem("app_version", APP_VERSION)

  // Force reload the page to ensure we get fresh content
  if (storedVersion) {
    // Only reload if there was a previous version (not first visit)
    window.location.reload()
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Providers>
          <App />
        </Providers>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful with scope: ", registration.scope)

        // Check if there's a waiting service worker
        if (registration.waiting) {
          // New content is available, notify user or update automatically
          registration.waiting.postMessage({ type: "SKIP_WAITING" })
          window.location.reload()
        }

        // Add listener for new service workers
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // New content is available, notify user or update automatically
                newWorker.postMessage({ type: "SKIP_WAITING" })
                window.location.reload()
              }
            })
          }
        })
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error)
      })
  })

  // Handle service worker updates
  let refreshing = false
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true
      window.location.reload()
    }
  })
}