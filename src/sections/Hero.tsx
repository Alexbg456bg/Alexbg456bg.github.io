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
      className="relative overflow-hidden pb-20 pt-[calc(var(--header-h)+3.5rem)] sm:pb-28 sm:pt-[calc(var(--header-h)+5rem)]"
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
          lineClassName={(i) => `md:whitespace-nowrap ${i === 1 ? 'text-cyan' : '[&_span_span]:text-gradient'}`}
        />

        <m.p className="mt-7 max-w-xl text-pretty text-lg text-ink-muted sm:text-xl" {...rise(0.6)}>
          {hero.subtitle}
        </m.p>

        <m.div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4" {...fadeUp(0.75)}>
          <MagneticButton href="#proekti" onClick={go('proekti')}>
            {hero.primaryCta}
            <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton href="#kontakt" onClick={go('kontakt')} variant="ghost">
            {hero.secondaryCta}
          </MagneticButton>
        </m.div>

        <HeroScene play={play} />
      </div>
    </section>
  )
}
