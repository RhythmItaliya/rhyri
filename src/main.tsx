import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import "./assets/globals.css"
import { Providers } from "./components/Providers.tsx"
import ErrorBoundary from "./components/ErrorBoundary.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Providers>
          <App />
        </Providers>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)
