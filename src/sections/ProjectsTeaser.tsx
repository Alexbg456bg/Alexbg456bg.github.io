import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/ui/MagneticButton'
import { InViewVideo } from '../components/ui/ProjectVideo'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Tilt } from '../components/ui/Tilt'
import { portfolio, teaser } from '../content'
import { PreviewPill } from './Portfolio'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Home page: the four live sites as cards. Each card plays a scroll-through recording of the
 * site while it is on screen, tilts toward the cursor and opens its case study.
 */
export function ProjectsTeaser() {
  return (
    <section aria-labelledby="teaser-title" className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader id="teaser-title" eyebrow={teaser.eyebrow} title={teaser.title} />
          <Link to="/proekti" className="group inline-flex items-center gap-2 font-semibold text-cyan">
            {teaser.cta}
            <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-x-6 gap-y-12 sm:mt-14 sm:grid-cols-2">
          {portfolio.items.map((p, i) => (
            <li key={p.slug} className={i % 2 === 1 ? 'sm:mt-16' : ''}>
              <FadeIn delay={(i % 2) * 0.1}>
                <Link to={`/proekti/${p.slug}`} className="group block">
                  <Tilt max={4}>
                    <span className="glass-border relative block overflow-hidden rounded-2xl bg-navy-850 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] transition-shadow duration-500 ease-brand group-hover:shadow-[0_40px_100px_-30px_rgba(0,194,255,0.35)]">
                      <span className="flex h-8 items-center gap-1.5 border-b border-line px-3" aria-hidden="true">
                        <span className="h-2 w-2 rounded-full bg-ink/20" />
                        <span className="h-2 w-2 rounded-full bg-ink/20" />
                        <span className="h-2 w-2 rounded-full bg-ink/20" />
                        <span className="ml-3 truncate font-mono text-[0.65rem] text-ink-faint">{p.host}</span>
                      </span>
                      <span className="relative block aspect-[16/10] overflow-hidden bg-navy-950">
                        <span className="block h-full w-full transition-transform duration-700 ease-brand group-hover:scale-[1.04]">
                          <InViewVideo project={p} />
                        </span>
                        <PreviewPill />
                      </span>
                    </span>
                  </Tilt>
                  <span className="mt-5 flex items-baseline justify-between gap-4">
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-cyan">{pad(i + 1)}</span>
                      <span className="text-xl font-semibold tracking-tight transition-colors group-hover:text-cyan sm:text-2xl">
                        {p.title}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm text-ink-muted">{p.category}</span>
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
