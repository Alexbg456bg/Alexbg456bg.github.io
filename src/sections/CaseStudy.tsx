import { m } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowIcon, MagneticButton } from '../components/ui/MagneticButton'
import { ProjectShot, projectImage } from '../components/ui/ProjectShot'
import { meta, portfolio, ui, type Project } from '../content'
import { useReducedMotion } from '../lib/media'
import { easeBrand } from '../lib/motion'
import { useSmoothScroll } from '../lib/smooth-scroll'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Case study shown over the page at /proekti/:slug. The screenshot morphs out of
 * the portfolio card (shared layoutId); the page underneath keeps its scroll position.
 */
export function CaseStudy({ project }: { project: Project }) {
  const navigate = useNavigate()
  const scroll = useSmoothScroll()
  const reduced = useReducedMotion()
  const dialog = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const index = portfolio.items.findIndex((p) => p.slug === project.slug)
  const next = portfolio.items[(index + 1) % portfolio.items.length]

  const close = () => navigate('/', { preventScrollReset: true })

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    scroll.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      scroll.start()
      document.body.style.overflow = prevOverflow
      opener?.focus({ preventScroll: true })
    }
  }, [scroll])

  // Per-project title, focus on open, Esc to close, Tab kept inside the dialog.
  useEffect(() => {
    document.title = `${project.title} — ${portfolio.title} | aecodezonebg`
    closeBtn.current?.focus({ preventScroll: true })
    dialog.current?.scrollTo({ top: 0 })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
      if (e.key !== 'Tab' || !dialog.current) return
      const items = Array.from(dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.title = meta.title
    }
  }, [project.slug])

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, transition: { duration: 0.2 } },
    transition: { duration: 0.7, ease: easeBrand, delay },
  })

  return (
    <m.div
      className="fixed inset-0 z-[60]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1, transition: { duration: 0.5 } }}
    >
      <m.div
        className="absolute inset-0 bg-navy-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        data-lenis-prevent
        className="absolute inset-0 overflow-y-auto overscroll-contain"
      >
        <div className="container-x relative pb-24 pt-6 sm:pt-10">
          <m.div className="flex items-center justify-between" {...rise(0.1)}>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              <span className="text-cyan">{String(index + 1).padStart(2, '0')}</span> / {String(portfolio.items.length).padStart(2, '0')} ·{' '}
              {project.category}
            </p>
            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink ring-1 ring-inset ring-ink/25 transition-colors hover:text-cyan hover:ring-cyan"
            >
              {portfolio.close}
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </m.div>

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
            <div className="lg:sticky lg:top-10 lg:self-start">
              <m.h2 id="case-title" className="text-h2 font-bold" {...rise(0.15)}>
                {project.title}
              </m.h2>
              <m.p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-ink-muted" {...rise(0.22)}>
                {project.summary}
              </m.p>
              <m.div className="mt-8 flex flex-wrap gap-3" {...rise(0.3)}>
                <MagneticButton href={project.url} target="_blank">
                  {portfolio.openSite}
                  <ArrowIcon className="-rotate-45" />
                  <span className="sr-only">{ui.newTab}</span>
                </MagneticButton>
              </m.div>
              <m.p className="mt-6 font-mono text-xs text-ink-faint" {...rise(0.35)}>
                {project.host}
              </m.p>
            </div>

            <div>
              <ProjectShot project={project} priority sizes="(min-width: 1024px) 64vw, 92vw" />

              <m.figure className="mt-20 sm:mt-24" {...rise(0.45)}>
                <figcaption className="eyebrow">{portfolio.mobileLabel}</figcaption>
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <img
                    src={projectImage(project, 'mobile')}
                    width={600}
                    height={1299}
                    alt={`${project.alt} — мобилна версия`}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-2xl border border-line"
                  />
                </div>
              </m.figure>
            </div>
          </div>

          <m.div className="mt-24 border-t border-line pt-10" {...rise(0.5)}>
            <Link
              to={`/proekti/${next.slug}`}
              replace
              className="group flex items-center justify-between gap-6 rounded-2xl"
            >
              <span>
                <span className="eyebrow">{portfolio.next}</span>
                <span className="mt-3 block text-h3 font-semibold transition-colors group-hover:text-cyan">{next.title}</span>
              </span>
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-ink/25 transition-colors group-hover:text-cyan group-hover:ring-cyan">
                <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-0.5" />
              </span>
            </Link>
          </m.div>
        </div>
      </div>
    </m.div>
  )
}
