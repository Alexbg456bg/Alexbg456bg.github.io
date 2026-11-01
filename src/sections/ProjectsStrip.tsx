import type { MouseEvent } from 'react'
import { ArrowIcon } from '../components/ui/MagneticButton'
import { projectImage } from '../components/ui/ProjectShot'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { portfolio, strip } from '../content'
import { useSmoothScroll } from '../lib/smooth-scroll'

/** Compact row of the four projects right under the hero; everything leads to the portfolio. */
export function ProjectsStrip() {
  const scroll = useSmoothScroll()
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scroll.scrollTo('proekti')
  }

  return (
    <section id="nashi-proekti" aria-labelledby="nashi-proekti-title" className="relative border-y border-line bg-navy-950/40 py-14 sm:py-16">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader id="nashi-proekti-title" eyebrow={strip.eyebrow} title={strip.title} />
          <a href="#proekti" onClick={go} className="group inline-flex items-center gap-2 font-semibold text-cyan">
            {strip.cta}
            <ArrowIcon className="rotate-90 transition-transform duration-300 ease-brand group-hover:translate-y-0.5" />
          </a>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {portfolio.items.map((p, i) => (
            <li key={p.slug}>
              <FadeIn delay={i * 0.08}>
                <a
                  href="#proekti"
                  onClick={go}
                  className="glass-border group flex items-center gap-4 rounded-2xl bg-navy-850/50 p-3 transition-colors duration-300 hover:bg-navy-850"
                >
                  <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-navy-950">
                    <img
                      src={projectImage(p, 'desktop', 960)}
                      width={960}
                      height={600}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-brand group-hover:scale-110"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{p.title}</span>
                    <span className="block truncate text-sm text-ink-muted">{p.category}</span>
                  </span>
                </a>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
