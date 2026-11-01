import { AnimatePresence, LazyMotion, MotionConfig } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Navigate, useLocation, useMatch } from 'react-router-dom'
import { portfolio, ui } from './content'
import { useReducedMotion } from './lib/media'
import { useIntroReady } from './lib/preloader'
import { SmoothScrollProvider } from './lib/smooth-scroll'
import { CaseStudy } from './sections/CaseStudy'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Portfolio } from './sections/Portfolio'
import { Process } from './sections/Process'
import { Services } from './sections/Services'

// Animation features are fetched after first render, keeping them out of the critical bundle.
const loadMotionFeatures = () => import('./lib/motion-features').then((mod) => mod.default)

export default function App() {
  const reduced = useReducedMotion()
  const location = useLocation()
  const match = useMatch('/proekti/:slug')
  const project = match ? portfolio.items.find((p) => p.slug === match.params.slug) : undefined
  const ready = useIntroReady()
  const page = useRef<HTMLDivElement>(null)

  // While a case study is open, the page behind it is inert (no focus, no clicks, hidden from AT).
  // React 18 has no typed `inert` prop, so it is set directly.
  useEffect(() => {
    page.current?.toggleAttribute('inert', !!project)
  }, [project])

  // The whole site is one page; the only other route is a case study shown over it.
  if (location.pathname !== '/' && !project) return <Navigate to="/" replace />

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
        <SmoothScrollProvider>
          <a href="#main" className="skip-link">
            {ui.skipToContent}
          </a>
          <div ref={page}>
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              <Hero ready={ready} />
              <Services />
              <Portfolio />
              <Process />
              <Contact />
            </main>
            <Footer />
          </div>
          <AnimatePresence>{project && <CaseStudy key={project.slug} project={project} />}</AnimatePresence>
        </SmoothScrollProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
