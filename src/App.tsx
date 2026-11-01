import { AnimatePresence, LazyMotion, MotionConfig } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useLocation, useMatch } from 'react-router-dom'
import { GradientMesh, Grain } from './components/ui/Atmosphere'
import { CustomCursor } from './components/ui/CustomCursor'
import { SideProgress } from './components/ui/SideProgress'
import { portfolio, ui } from './content'
import { useReducedMotion } from './lib/media'
import { useIntroReady } from './lib/preloader'
import { SmoothScrollProvider } from './lib/smooth-scroll'
import { CaseStudy } from './sections/CaseStudy'
import { Contact } from './sections/Contact'
import { CtaBand } from './sections/CtaBand'
import { Faq } from './sections/Faq'
import { Features } from './sections/Features'
import { Footer } from './sections/Footer'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { NotFound } from './sections/NotFound'
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
  const missing = location.pathname !== '/' && !project

  // While a case study is open, the page behind it is inert (no focus, no clicks, hidden from AT).
  // React 18 has no typed `inert` prop, so it is set directly.
  useEffect(() => {
    page.current?.toggleAttribute('inert', !!project)
  }, [project])

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
        <SmoothScrollProvider>
          <GradientMesh />
          {missing ? (
            <NotFound />
          ) : (
            <>
              <a href="#main" className="skip-link">
                {ui.skipToContent}
              </a>
              <div ref={page}>
                <Header />
                <main id="main" tabIndex={-1} className="outline-none">
                  <Hero ready={ready} />
                  <Features />
                  <Portfolio />
                  <CtaBand />
                  <Services />
                  <Process />
                  <Faq />
                  <Contact />
                </main>
                <Footer />
              </div>
              <SideProgress />
              <AnimatePresence>{project && <CaseStudy key={project.slug} project={project} />}</AnimatePresence>
            </>
          )}
          <CustomCursor />
          <Grain />
        </SmoothScrollProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
