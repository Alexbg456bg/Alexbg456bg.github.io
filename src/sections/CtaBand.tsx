import type { MouseEvent } from 'react'
import { Bracket } from '../components/brand/Logo'
import { ArrowIcon, MagneticButton } from '../components/ui/MagneticButton'
import { FadeIn } from '../components/ui/RevealText'
import { cta } from '../content'
import { useSmoothScroll } from '../lib/smooth-scroll'

/** Mid-page call to action between the portfolio and the services. */
export function CtaBand() {
  const scroll = useSmoothScroll()
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scroll.scrollTo('kontakt')
  }

  return (
    <section aria-labelledby="cta-title" className="relative py-12 sm:py-16">
      <div className="container-x">
        <FadeIn>
          <div className="glass-border relative overflow-hidden rounded-card bg-gradient-to-br from-navy-800 via-navy-850 to-navy-950 px-6 py-12 sm:px-12 sm:py-16">
            <div
              className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_right,black_10%,transparent_65%)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="flex items-center gap-5">
                <span className="hidden items-center gap-1 text-cyan sm:flex" aria-hidden="true">
                  <Bracket side="left" className="h-12 w-auto" />
                  <Bracket side="right" className="h-12 w-auto" />
                </span>
                <div>
                  <h2 id="cta-title" className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-tight tracking-tight">
                    {cta.title}
                  </h2>
                  <p className="mt-2 max-w-xl text-pretty text-lg text-ink-muted">{cta.text}</p>
                </div>
              </div>
              <MagneticButton href="#kontakt" onClick={go} className="shrink-0">
                {cta.button}
                <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
              </MagneticButton>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
