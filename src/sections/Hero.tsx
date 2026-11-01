import { m } from 'framer-motion'
import type { MouseEvent } from 'react'
import { Bracket } from '../components/brand/Logo'
import { CursorGrid } from '../components/ui/CursorGrid'
import { HeroScene } from '../components/ui/HeroScene'
import { ArrowIcon, MagneticButton } from '../components/ui/MagneticButton'
import { RevealText } from '../components/ui/RevealText'
import { hero } from '../content'
import { useReducedMotion } from '../lib/media'
import { easeBrand } from '../lib/motion'
import { useSmoothScroll } from '../lib/smooth-scroll'

/** Headline, two calls to action, then the "from code to site" scene. */
export function Hero({ ready }: { ready: boolean }) {
  const reduced = useReducedMotion()
  const scroll = useSmoothScroll()
  const play = ready || reduced

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scroll.scrollTo(id)
  }

  const fadeUp = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 20 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: easeBrand, delay },
  })
  // Rise only (no fade) so the subtitle paints immediately and counts as the page's LCP early.
  const rise = (delay: number) => ({
    initial: reduced ? false : { y: 20 },
    animate: play ? { y: 0 } : undefined,
    transition: { duration: 0.9, ease: easeBrand, delay },
  })

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pb-16 pt-[calc(var(--header-h)+3rem)] sm:pb-24 sm:pt-[calc(var(--header-h)+5rem)]"
    >
      <CursorGrid />

      <div className="container-x relative flex flex-col items-center text-center">
        <m.p
          className="glass-border eyebrow flex items-center gap-2.5 rounded-full bg-navy-850/60 px-4 py-2 backdrop-blur"
          {...fadeUp(0.1)}
        >
          <Bracket side="left" strokeWidth={70} className="h-3 w-auto" />
          {hero.eyebrow}
          <Bracket side="right" strokeWidth={70} className="h-3 w-auto" />
        </m.p>

        <RevealText
          as="h1"
          id="hero-title"
          lines={hero.titleLines}
          play={play}
          delay={0.2}
          stagger={0.08}
          className="mt-7 text-display font-bold sm:mt-9"
          lineClassName={(i) => `md:whitespace-nowrap ${i === 1 ? 'text-cyan' : '[&>span]:text-gradient'}`}
        />

        <m.p className="mt-7 max-w-xl text-pretty text-lg text-ink-muted sm:text-xl" {...rise(0.6)}>
          {hero.subtitle}
        </m.p>

        <m.div className="mt-10 flex w-full max-w-xs flex-col items-center gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4" {...fadeUp(0.75)}>
          <MagneticButton href="#kontakt" onClick={go('kontakt')} className="w-full sm:w-auto">
            {hero.primaryCta}
            <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton href="#proekti" onClick={go('proekti')} variant="ghost" className="w-full sm:w-auto">
            {hero.secondaryCta}
          </MagneticButton>
        </m.div>

        <m.ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-muted" {...fadeUp(0.9)}>
          {hero.points.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" className="h-4 w-4 text-cyan" aria-hidden="true">
                <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {point}
            </li>
          ))}
        </m.ul>

        <HeroScene play={play} />
      </div>
    </section>
  )
}
