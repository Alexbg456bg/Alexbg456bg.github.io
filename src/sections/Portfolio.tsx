import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import live from '../generated/live.json'
import { Bracket } from '../components/brand/Logo'
import { ArrowIcon, MagneticButton } from '../components/ui/MagneticButton'
import { ProjectShot, projectImage } from '../components/ui/ProjectShot'
import { ProjectVideo } from '../components/ui/ProjectVideo'
import { Tilt } from '../components/ui/Tilt'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { cursor, portfolio, ui, type Project } from '../content'
import { useMinWidth, useReducedMotion } from '../lib/media'
import { easeBrand } from '../lib/motion'
import { useSmoothScroll } from '../lib/smooth-scroll'

const isLive = (slug: string) => (live as Record<string, boolean>)[slug] === true
const pad = (n: number) => String(n).padStart(2, '0')

function LiveDot({ slug }: { slug: string }) {
  if (!isLive(slug)) return null
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-muted">
      <span className="relative flex h-2 w-2">
        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-cyan" />
        <span className="relative h-2 w-2 rounded-full bg-cyan" />
      </span>
      {portfolio.live}
    </span>
  )
}

function ProjectText({ project, index }: { project: Project; index: number }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
          <span className="text-cyan">{pad(index + 1)}</span> / {pad(portfolio.items.length)} · {project.category}
        </p>
        <LiveDot slug={project.slug} />
      </div>
      <h3 id={`p-${project.slug}`} className="mt-5 text-[clamp(2rem,4vw,3.75rem)] font-bold leading-[1.02] tracking-tight">
        {project.title}
      </h3>
      <dl className="mt-6 grid max-w-md gap-4">
        {(
          [
            [portfolio.clientLabel, project.client],
            [portfolio.taskLabel, project.task],
            [portfolio.doneLabel, project.done],
          ] as const
        ).map(([label, value]) =>
          value ? (
            <div key={label}>
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint">{label}</dt>
              <dd className="mt-1 text-pretty leading-relaxed text-ink-muted">{value}</dd>
            </div>
          ) : null,
        )}
      </dl>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <MagneticButton href={project.url} target="_blank" strength={0.25}>
          {portfolio.openSite}
          <ArrowIcon className="-rotate-45" />
          <span className="sr-only">{ui.newTab}</span>
        </MagneticButton>
        <Link to={`/proekti/${project.slug}`} className="group inline-flex items-center gap-2 font-semibold text-ink-muted hover:text-cyan">
          <Bracket side="left" strokeWidth={70} className="h-3 w-auto transition-transform duration-300 ease-brand group-hover:-translate-x-1" />
          {portfolio.viewCase}
          <Bracket side="right" strokeWidth={70} className="h-3 w-auto transition-transform duration-300 ease-brand group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

/**
 * Signature moment 2. Desktop: the section pins and one laptop + phone frame stays put while
 * the projects wipe into it one by one (transform-only wipe, scrubbed by GSAP ScrollTrigger),
 * with the text beside it changing. Each project plays a scroll-through recording of the live
 * site. Phones, tablets and reduced motion get a plain list.
 */
export function Portfolio() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const scroll = useSmoothScroll()
  const wide = useMinWidth(1024)
  const reduced = useReducedMotion()
  const pinned = wide && !reduced
  const [active, setActive] = useState(0)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)

  // Load videos only once the section is close, play only while it is on screen.
  useEffect(() => {
    if (!pinned || !section.current) return
    const el = section.current
    const nearObs = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '100% 0px' })
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    nearObs.observe(el)
    visObs.observe(el)
    return () => {
      nearObs.disconnect()
      visObs.disconnect()
    }
  }, [pinned])

  useEffect(() => {
    if (!pinned) return
    let cleanup: (() => void) | undefined
    let cancelled = false

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled || !section.current || !stage.current) return
      gsap.registerPlugin(ScrollTrigger)
      const off = scroll.onScroll(() => ScrollTrigger.update())
      const n = portfolio.items.length
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut', duration: 0.7 },
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * (n - 1) * 0.9}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => setActive(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
          },
        })
        // Layer i wipes in from below: the window moves up while its content moves down
        // by the same amount, so the picture itself stays still.
        for (let i = 1; i < n; i++) {
          const at = i - 1 + 0.15
          // y: 0 clears the pre-hydration Tailwind offset, which GSAP would otherwise read as extra pixels.
          tl.fromTo(`[data-layer="${i}"]`, { y: 0, yPercent: 100 }, { y: 0, yPercent: 0 }, at)
          tl.fromTo(`[data-layer="${i}"] > [data-inner]`, { y: 0, yPercent: -100 }, { y: 0, yPercent: 0 }, at)
        }
        tl.to({}, { duration: 0.15 }, n - 1)
      }, stage)

      cleanup = () => {
        off()
        ctx.revert()
      }
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [scroll, pinned])

  const project = portfolio.items[active]

  if (!pinned) {
    return (
      <section ref={section} id="proekti" aria-labelledby="proekti-title" className="section">
        <div className="container-x">
          <SectionHeader id="proekti-title" eyebrow={portfolio.eyebrow} title={portfolio.title} intro={portfolio.intro} />
          <ul className="mt-14 grid gap-20 sm:mt-20 sm:gap-28">
            {portfolio.items.map((p, i) => (
              <li key={p.slug}>
                <article aria-labelledby={`p-${p.slug}`}>
                  <FadeIn className="grid items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
                    <Tilt>
                      <Link to={`/proekti/${p.slug}`} tabIndex={-1} aria-hidden="true" className="block">
                        <ProjectShot project={p} />
                      </Link>
                    </Tilt>
                    <ProjectText project={p} index={i} />
                  </FadeIn>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  return (
    <section ref={section} id="proekti" aria-labelledby="proekti-title" className="relative h-[100svh] overflow-hidden">
      <div ref={stage} className="container-x grid h-full grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-16 py-24">
        <div>
          <SectionHeader id="proekti-title" eyebrow={portfolio.eyebrow} title={portfolio.title} />
          <div className="relative mt-10 min-h-[24rem]">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: easeBrand }}
              >
                <ProjectText project={project} index={active} />
              </m.div>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex items-center gap-2" aria-hidden="true">
            {portfolio.items.map((p, i) => (
              <span key={p.slug} className="h-[3px] w-10 overflow-hidden rounded-full bg-ink/15">
                <m.span
                  className="block h-full origin-left bg-cyan"
                  animate={{ scaleX: i <= active ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: easeBrand }}
                />
              </span>
            ))}
          </div>
        </div>

        <Tilt max={2.5}>
          <div className="relative pb-10 pr-8">
            <Link
              to={`/proekti/${project.slug}`}
              tabIndex={-1}
              aria-hidden="true"
              data-cursor="view"
              data-cursor-label={cursor.view}
              className="block"
            >
              <div className="glass-border overflow-hidden rounded-2xl bg-navy-850 shadow-[0_60px_140px_-40px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
                  <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
                  </span>
                  <span className="mx-auto rounded-full bg-navy-950/70 px-4 py-1 font-mono text-[0.7rem] text-ink-muted">
                    {project.host}
                  </span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
                  {portfolio.items.map((p, i) => (
                    <div
                      key={p.slug}
                      data-layer={i}
                      className={`absolute inset-0 overflow-hidden ${i > 0 ? 'translate-y-full' : ''}`}
                    >
                      <div data-inner className={`h-full w-full ${i > 0 ? '-translate-y-full' : ''}`}>
                        <ProjectVideo project={p} load={near} playing={visible && i === active} reduced={reduced} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>

            <div className="absolute -bottom-2 right-0 w-[24%] overflow-hidden rounded-[1.6rem] border-[5px] border-navy-700 bg-navy-950 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
              <div className="relative aspect-[9/19] overflow-hidden">
                {portfolio.items.map((p, i) => (
                  <div
                    key={p.slug}
                    data-layer={i}
                    className={`absolute inset-0 overflow-hidden ${i > 0 ? 'translate-y-full' : ''}`}
                  >
                    <div data-inner className={`h-full w-full ${i > 0 ? '-translate-y-full' : ''}`}>
                      <img
                        src={projectImage(p, 'mobile')}
                        width={600}
                        height={1299}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tilt>
      </div>
    </section>
  )
}
