import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Production pages are prerendered (scripts/prerender.ts); the dev server serves an empty root.
// Hydration waits for the first frame, so the browser paints the static HTML before running React.
if (container.firstElementChild) requestAnimationFrame(() => setTimeout(() => hydrateRoot(container, app), 0))
else createRoot(container).render(app)
