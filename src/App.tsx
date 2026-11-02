import { AnimatePresence, LazyMotion, MotionConfig, domMax, m } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useLocation, useMatch } from 'react-router-dom'
import { GradientMesh, Grain } from './components/ui/Atmosphere'
import { FloatingContact } from './components/ui/FloatingContact'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { pages, portfolio, ui } from './content'
import { useReducedMotion } from './lib/media'
import { easeBrand } from './lib/motion'
import { SmoothScrollProvider, useSmoothScroll } from './lib/smooth-scroll'
import { pageViews } from './pages'
import { CaseStudy } from './sections/CaseStudy'
import { Footer } from './sections/Footer'
import { Header } from './sections/Header'
import { NotFound } from './sections/NotFound'

/** Which page a URL shows. A case study (/proekti/:slug) opens over the projects page. */
function resolve(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const slug = path.match(/^\/proekti\/([^/]+)$/)?.[1]
  const project = slug ? portfolio.items.find((p) => p.slug === slug) : undefined
  const page = pages.find((p) => p.path === (project ? '/proekti' : path))
  return { path, project, page }
}

/** New page: jump to the top, set the title and move focus to the content (not on first load). */
function usePageChange(path: string, title: string | undefined) {
  const scroll = useSmoothScroll()
  const first = useRef(true)
  useEffect(() => {
    if (title) document.title = title
    if (first.current) {
      first.current = false
      return
    }
    scroll.reset()
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [path, title, scroll])
}

function Site() {
  const location = useLocation()
  const match = useMatch('/proekti/:slug')
  const { project, page } = resolve(location.pathname)
  const pageRef = useRef<HTMLDivElement>(null)
  // True until the first page has rendered, so the initial (prerendered) page does not animate in.
  const first = useRef(true)
  useEffect(() => {
    first.current = false
  }, [])
  // A case study keeps the projects page behind it, so only the base page counts as a page change.
  usePageChange(page?.path ?? location.pathname, project ? undefined : page?.title)

  // While a case study is open, the page behind it is inert (no focus, no clicks, hidden from AT).
  // React 18 has no typed `inert` prop, so it is set directly.
  useEffect(() => {
    pageRef.current?.toggleAttribute('inert', !!project)
  }, [project])

  if (!page || (match && !project)) return <NotFound />

  const View = pageViews[page.path]
  return (
    <>
      <a href="#main" className="skip-link">
        {ui.skipToContent}
      </a>
      <div ref={pageRef}>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {/* Page change: the new page rises in (transform/opacity). Not on first load. */}
          <m.div
            key={page.path}
            initial={first.current ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeBrand }}
          >
            <View />
          </m.div>
        </main>
        <Footer />
      </div>
      <AnimatePresence>{project && <CaseStudy key={project.slug} project={project} />}</AnimatePresence>
    </>
  )
}

export default function App() {
  const reduced = useReducedMotion()
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
        <SmoothScrollProvider>
          <GradientMesh />
          <Site />
          <ScrollProgress />
          <FloatingContact />
          <Grain />
        </SmoothScrollProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
