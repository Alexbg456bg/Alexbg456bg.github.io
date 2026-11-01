import type { MouseEvent } from 'react'
import { BracketSeparator, Marquee } from '../components/ui/Atmosphere'
import { ArrowIcon } from '../components/ui/MagneticButton'
import { FadeIn, RevealText } from '../components/ui/RevealText'
import { cta } from '../content'
import { useSmoothScroll } from '../lib/smooth-scroll'

/** Big closing statement before the contact form: outlined marquee + rotating ring button. */
export function CallToAction() {
  const scroll = useSmoothScroll()
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scroll.scrollTo('kontakt')
  }

  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-y border-line py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,194,255,0.12),transparent_60%)]"
        aria-hidden="true"
      />
      <Marquee
        items={cta.strip}
        duration={46}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-60"
        itemClassName="text-outline whitespace-nowrap text-[clamp(5rem,14vw,13rem)] font-bold leading-none tracking-tight"
        separator={<BracketSeparator className="opacity-40" />}
      />

      <div className="container-x relative flex flex-col items-center gap-12 text-center lg:flex-row lg:justify-between lg:text-left">
        <div>
          <RevealText
            id="cta-title"
            lines={cta.lines}
            className="text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[0.98] tracking-tight"
            lineClassName={(i) => (i === 1 ? 'text-cyan' : '')}
          />
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-md text-pretty text-ink-muted sm:text-lg lg:mx-0">{cta.text}</p>
          </FadeIn>
        </div>

        <FadeIn delay={0.25}>
          <a
            href="#kontakt"
            onClick={go}
            className="group relative flex h-44 w-44 items-center justify-center rounded-full sm:h-52 sm:w-52"
            aria-label={cta.button}
          >
            <svg viewBox="0 0 200 200" className="animate-spin-slow absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <path id="cta-ring" d="M100 100m-82 0a82 82 0 1 1 164 0a82 82 0 1 1-164 0" />
              </defs>
              <text className="fill-ink-muted font-mono text-[13px] uppercase tracking-[0.32em]">
                <textPath href="#cta-ring">{cta.ring}</textPath>
              </text>
            </svg>
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-cyan text-navy-950 shadow-[0_0_60px_-5px_rgba(0,194,255,0.7)] transition-transform duration-500 ease-brand group-hover:scale-110 sm:h-28 sm:w-28">
              <ArrowIcon className="h-7 w-7 -rotate-45 transition-transform duration-500 ease-brand group-hover:rotate-0" />
            </span>
          </a>
        </FadeIn>
      </div>
    </section>
  )
}
