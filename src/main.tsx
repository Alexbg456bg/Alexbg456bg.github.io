import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { portfolio } from './content'
import { consoleGreeting } from './lib/console-greeting'
import './styles/index.css'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Which prerendered page belongs to this URL (see scripts/prerender.ts).
const path = location.pathname.replace(/\/+$/, '') || '/'
const known = path === '/' || portfolio.items.some((p) => path === `/proekti/${p.slug}`)
const route = known ? path : '/404'

// Hydrate only markup that was rendered for this route. A server that answers every URL with
// the home page (e.g. `vite preview`) or the dev server's empty root gets a fresh client render.
// Hydration waits one frame so the browser paints the static HTML before React runs.
if (container.firstElementChild && container.dataset.route === route)
  requestAnimationFrame(() => setTimeout(() => hydrateRoot(container, app), 0))
else createRoot(container).render(app)

consoleGreeting()
