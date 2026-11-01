import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Bracket } from '../components/brand/Logo'
import { ArrowIcon } from '../components/ui/MagneticButton'
import { ProjectShot } from '../components/ui/ProjectShot'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { cursor, portfolio, ui, type Project } from '../content'
import { useMinWidth, useReducedMotion } from '../lib/media'
import { useSmoothScroll } from '../lib/smooth-scroll'

function ProjectText({ project, index }: { project: Project; index: number }) {
  const total = String(portfolio.items.length).padStart(2, '0')
  return (
    <div className="flex flex-col">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
        <span className="text-cyan">{String(index + 1).padStart(2, '0')}</span> / {total} · {project.category}
      </p>
      <h3 id={`p-${project.slug}`} className="mt-4 text-[clamp(1.75rem,3.2vw,3rem)] font-bold leading-[1.05] tracking-tight">{project.title}</h3>
      <p className="mt-4 max-w-md text-pretty leading-relaxed text-ink-muted">{project.summary}</p>
      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link
          to={`/proekti/${project.slug}`}
          className="group inline-flex items-center gap-2 font-semibold text-cyan"
        >
          <Bracket side="left" strokeWidth={70} className="h-3 w-auto transition-transform duration-300 ease-brand group-hover:-translate-x-1" />
          {portfolio.viewCase}
          <Bracket side="right" strokeWidth={70} className="h-3 w-auto transition-transform duration-300 ease-brand group-hover:translate-x-1" />
        </Link>
        <a
          href={project.url}
          target="_blank"
          rel="noopener"
          className="group inline-flex items-center gap-2 font-medium text-ink-muted transition-colors hover:text-ink"
        >
          {portfolio.openSite}
          <ArrowIcon className="-rotate-45 transition-transform duration-300 ease-brand group-hover:translate-x-0.5" />
          <span className="sr-only">{ui.newTab}</span>
        </a>
      </div>
    </div>
  )
}

/**
 * Desktop: the section pins and the projects scroll sideways, one per screen (GSAP ScrollTrigger,
 * loaded on demand). Mobile, tablet and reduced motion: a plain vertical list.
 */
export function Portfolio() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLSpanElement>(null)
  const scroll = useSmoothScroll()
  const wide = useMinWidth(1024)
  const reduced = useReducedMotion()
  const pinned = wide && !reduced

  useEffect(() => {
    if (!pinned) return
    let cleanup: (() => void) | undefined
    let cancelled = false

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled || !section.current || !track.current) return
      gsap.registerPlugin(ScrollTrigger)
      const off = scroll.onScroll(() => ScrollTrigger.update())
      const el = track.current
      const distance = () => el.scrollWidth - window.innerWidth
      const ctx = gsap.context(() => {
        const slide = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`
            },
          },
        })
        // Inside the horizontal track: screenshots drift against the movement, numbers with it.
        el.querySelectorAll<HTMLElement>('[data-panel]').forEach((panel) => {
          const trigger = { trigger: panel, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true }
          gsap.fromTo(panel.querySelector('[data-parallax]'), { x: 90 }, { x: -90, ease: 'none', scrollTrigger: trigger })
          gsap.fromTo(panel.querySelector('[data-number]'), { x: -160 }, { x: 160, ease: 'none', scrollTrigger: trigger })
        })
      }, section)

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

  return (
    <section
      ref={section}
      id="proekti"
      aria-labelledby="proekti-title"
      className={`relative overflow-hidden ${pinned ? 'h-[100svh]' : ''}`}
    >
      {pinned ? (
        <>
          <div ref={track} className="flex h-full w-max items-center">
            <div className="flex h-full w-[38vw] shrink-0 flex-col justify-center pl-12 pr-8 xl:pl-[max(3rem,calc((100vw-84rem)/2+3rem))]">
              <SectionHeader id="proekti-title" eyebrow={portfolio.eyebrow} title={portfolio.title} intro={portfolio.intro} />
            </div>
            {portfolio.items.map((p, i) => (
              <article
                key={p.slug}
                data-panel
                aria-labelledby={`p-${p.slug}`}
                className="relative grid h-full w-[86vw] shrink-0 grid-cols-[minmax(0,7fr)_minmax(0,4fr)] items-center gap-12 px-12 xl:w-[80vw]"
              >
                <span
                  data-number
                  className="text-outline pointer-events-none absolute -top-[0.08em] right-[6%] select-none font-mono text-[clamp(10rem,24vw,24rem)] font-medium leading-none opacity-60"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Link
                  to={`/proekti/${p.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  data-cursor="view"
                  data-cursor-label={cursor.view}
                  className="group relative block"
                >
                  <div data-parallax>
                    <ProjectShot project={p} className="transition-transform duration-700 ease-brand group-hover:scale-[1.02]" />
                  </div>
                </Link>
                <div className="relative">
                  <ProjectText project={p} index={i} />
                </div>
              </article>
            ))}
            <div className="w-[8vw] shrink-0" aria-hidden="true" />
          </div>
          <div className="absolute inset-x-12 bottom-10 h-px bg-line" aria-hidden="true">
            <span ref={progress} className="block h-full origin-left scale-x-0 bg-cyan" />
          </div>
        </>
      ) : (
        <div className="container-x py-24 sm:py-32">
          <SectionHeader id="proekti-title" eyebrow={portfolio.eyebrow} title={portfolio.title} intro={portfolio.intro} />
          <ul className="mt-14 grid gap-20 sm:mt-20 sm:gap-28">
            {portfolio.items.map((p, i) => (
              <li key={p.slug}>
                <article aria-labelledby={`p-${p.slug}`}>
                  <FadeIn className="grid items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-14">
                    <Link
                      to={`/proekti/${p.slug}`}
                      tabIndex={-1}
                      aria-hidden="true"
                      data-cursor="view"
                      data-cursor-label={cursor.view}
                      className="block"
                    >
                      <ProjectShot project={p} />
                    </Link>
                    <ProjectText project={p} index={i} />
                  </FadeIn>
                </article>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
