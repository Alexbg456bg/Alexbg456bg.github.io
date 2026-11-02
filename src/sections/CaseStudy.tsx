import { m } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bracket } from '../components/brand/Logo'
import { ArrowIcon, MagneticButton } from '../components/ui/MagneticButton'
import { ProjectShot, projectImage } from '../components/ui/ProjectShot'
import { meta, pages, portfolio, ui, type Project } from '../content'
import { useReducedMotion } from '../lib/media'
import { easeBrand } from '../lib/motion'
import { useSmoothScroll } from '../lib/smooth-scroll'
import { LiveDot } from './Portfolio'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
const pad = (n: number) => String(n).padStart(2, '0')

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

  const close = () => navigate('/proekti', { preventScrollReset: true })

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
      document.title = pages.find((p) => p.path === '/proekti')?.title ?? meta.title
    }
  }, [project.slug])

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, transition: { duration: 0.2 } },
    transition: { duration: 0.7, ease: easeBrand, delay },
  })
  // Blocks further down the dialog rise in as they scroll into view (the dialog is the scroller).
  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: reduced ? 0 : 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { root: dialog, once: true, margin: '0px 0px -10% 0px' },
    transition: { duration: 0.8, ease: easeBrand, delay },
  })

  const details = (
    [
      [project.client ? portfolio.clientLabel : portfolio.kindLabel, project.client ?? portfolio.ownProject],
      [portfolio.taskLabel, project.task],
      [portfolio.doneLabel, project.done],
    ] as const
  ).filter(([, value]) => value)

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
        className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain"
      >
        {/* Quiet glow at the top, like the inner pages. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] overflow-hidden" aria-hidden="true">
          <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-48 left-1/2 h-96 w-[70rem] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,194,255,0.16),transparent_70%)]" />
        </div>

        <div className="container-x relative pb-24 pt-6 sm:pt-10">
          <m.div className="flex items-center justify-between gap-4" {...rise(0.1)}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
                <span className="text-cyan">{pad(index + 1)}</span> / {pad(portfolio.items.length)} · {project.category}
              </p>
              <LiveDot slug={project.slug} />
            </div>
            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink ring-1 ring-inset ring-ink/25 transition-colors hover:text-cyan hover:ring-cyan"
            >
              {portfolio.close}
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </m.div>

          {/* Title, summary and the way out to the live site. */}
          <div className="mt-12 grid items-end gap-8 sm:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <div>
              <m.h2 id="case-title" className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.98] tracking-tight" {...rise(0.15)}>
                {project.title}
              </m.h2>
              <m.p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-muted sm:text-xl" {...rise(0.22)}>
                {project.summary}
              </m.p>
            </div>
            <m.div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:justify-end" {...rise(0.3)}>
              <MagneticButton href={project.url} target="_blank">
                {portfolio.openSite}
                <ArrowIcon className="-rotate-45" />
                <span className="sr-only">{ui.newTab}</span>
              </MagneticButton>
              <span className="font-mono text-xs text-ink-faint">{project.host}</span>
            </m.div>
          </div>

          {/* The live site, playing. */}
          <div className="mt-12 sm:mt-16">
            <ProjectShot project={project} priority video sizes="92vw" />
          </div>

          {/* Client / task / what we did as three numbered cards. */}
          <ul className={`mt-24 grid gap-4 sm:mt-32 ${details.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {details.map(([label, value], i) => (
              <m.li key={label} className="glass-border rounded-card bg-navy-850/60 p-6 sm:p-8" {...reveal(i * 0.08)}>
                <p className="font-mono text-xs text-cyan">{pad(i + 1)}</p>
                <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint">{label}</p>
                <p className="mt-2 text-pretty text-lg leading-relaxed">{value}</p>
              </m.li>
            ))}
          </ul>

          {/* Responsive: the phone version floats in front of the desktop one. */}
          <div className="mt-24 grid items-center gap-14 sm:mt-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            <m.div {...reveal()}>
              <p className="eyebrow">{portfolio.mobileLabel}</p>
              <h3 className="mt-4 text-h2 font-bold">{portfolio.devicesTitle}</h3>
              <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-ink-muted">{portfolio.devicesText}</p>
            </m.div>
            <m.div className="relative mx-auto w-full max-w-xl" {...reveal(0.1)}>
              <span className="absolute inset-y-0 -left-2 hidden items-center text-cyan/50 sm:flex" aria-hidden="true">
                <Bracket side="left" strokeWidth={30} className="h-1/2 w-auto" />
              </span>
              <span className="absolute inset-y-0 -right-2 hidden items-center text-cyan/50 sm:flex" aria-hidden="true">
                <Bracket side="right" strokeWidth={30} className="h-1/2 w-auto" />
              </span>
              <div className="relative sm:mx-12">
                <img
                  src={projectImage(project, 'desktop', 960)}
                  width={960}
                  height={600}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-xl border border-line opacity-80 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
                />
                <div className="absolute -bottom-12 right-[4%] w-[32%]">
                  <div className="animate-float overflow-hidden rounded-[1.75rem] border-[6px] border-navy-700 bg-navy-950 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.9),0_0_60px_-10px_rgba(0,194,255,0.35)]">
                    <img
                      src={projectImage(project, 'mobile')}
                      width={600}
                      height={1299}
                      alt={`${project.alt} — мобилна версия`}
                      loading="lazy"
                      decoding="async"
                      className="block aspect-[9/19] w-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </m.div>
          </div>

          {/* Next project, with a preview that grows on hover. */}
          <m.div className="mt-36 border-t border-line pt-10" {...reveal()}>
            <Link to={`/proekti/${next.slug}`} replace className="group grid items-center gap-6 rounded-2xl sm:grid-cols-[minmax(0,1fr)_16rem]">
              <span>
                <span className="eyebrow">{portfolio.next}</span>
                <span className="mt-3 flex items-center gap-4">
                  <span className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight transition-colors group-hover:text-cyan">
                    {next.title}
                  </span>
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-ink/25 transition-colors group-hover:bg-cyan group-hover:text-navy-950 group-hover:ring-cyan">
                    <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-0.5" />
                  </span>
                </span>
                <span className="mt-2 block text-ink-muted">{next.category}</span>
              </span>
              <span className="glass-border block overflow-hidden rounded-xl bg-navy-850">
                <img
                  src={projectImage(next, 'desktop', 960)}
                  width={960}
                  height={600}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-brand group-hover:scale-[1.06]"
                />
              </span>
            </Link>
          </m.div>
        </div>
      </div>
    </m.div>
  )
}
