import { m } from 'framer-motion'
import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { Bracket } from '../components/brand/Logo'
import { CursorGrid } from '../components/ui/CursorGrid'
import { ArrowIcon, MagneticButton } from '../components/ui/MagneticButton'
import { RevealText } from '../components/ui/RevealText'
import { hero } from '../content'
import { useReducedMotion } from '../lib/media'
import { easeBrand } from '../lib/motion'
import { useSmoothScroll } from '../lib/smooth-scroll'

/**
 * The two brackets start side by side in the middle (like the logo),
 * then open outwards and become the frame around the headline.
 */
export function Hero({ ready }: { ready: boolean }) {
  const reduced = useReducedMotion()
  const scroll = useSmoothScroll()
  const titleRef = useRef<HTMLDivElement>(null)
  const [closed, setClosed] = useState(0)

  useLayoutEffect(() => {
    const el = titleRef.current
    if (!el) return
    const measure = () => setClosed(el.offsetWidth / 2)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scroll.scrollTo(id)
  }

  const play = ready || reduced
  // Until `play`, the brackets sit closed in the middle (re-measured on resize, no animation).
  const bracket = (dir: 1 | -1) => ({
    initial: reduced ? false : { opacity: 0 },
    animate: play ? { x: 0, opacity: 1 } : { x: dir * closed, opacity: 0 },
    transition: play
      ? { x: { duration: 1.1, ease: easeBrand, delay: 0.15 }, opacity: { duration: 0.3, delay: 0.1 } }
      : { duration: 0 },
  })

  // Rise only (no fade) so the subtitle paints immediately and counts as the page's LCP early.
  const rise = (delay: number) => ({
    initial: reduced ? false : { y: 20 },
    animate: play ? { y: 0 } : undefined,
    transition: { duration: 0.9, ease: easeBrand, delay },
  })

  const fadeUp = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 20 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: easeBrand, delay },
  })

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-[calc(var(--header-h)+3rem)]"
    >
      <CursorGrid />
      <div
        className="pointer-events-none absolute left-1/2 top-[-20%] h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,194,255,0.13),transparent_62%)]"
        aria-hidden="true"
      />

      <div className="container-x relative flex flex-col items-center text-center">
        <m.p className="eyebrow flex items-center gap-2" {...fadeUp(0.1)}>
          <Bracket side="left" strokeWidth={70} className="h-3 w-auto" />
          {hero.eyebrow}
          <Bracket side="right" strokeWidth={70} className="h-3 w-auto" />
        </m.p>

        <div className="mt-6 flex items-center justify-center gap-4 sm:mt-8 md:gap-8 lg:gap-12">
          <m.div className="hidden shrink-0 text-cyan md:block" {...bracket(1)}>
            <Bracket side="left" className="h-[clamp(7rem,15vw,15rem)] w-auto" />
          </m.div>

          <div ref={titleRef}>
            <RevealText
              as="h1"
              id="hero-title"
              lines={hero.titleLines}
              play={play}
              delay={0.25}
              stagger={0.08}
              className="text-display font-bold"
              lineClassName={(i) => `md:whitespace-nowrap ${i === 1 ? 'text-cyan' : ''}`}
            />
          </div>

          <m.div className="hidden shrink-0 text-cyan md:block" {...bracket(-1)}>
            <Bracket side="right" className="h-[clamp(7rem,15vw,15rem)] w-auto" />
          </m.div>
        </div>

        <m.p className="mt-8 max-w-xl text-pretty text-base text-ink-muted sm:text-lg" {...rise(0.75)}>
          {hero.subtitle}
        </m.p>

        <m.div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4" {...fadeUp(0.9)}>
          <MagneticButton href="#proekti" onClick={go('proekti')}>
            {hero.primaryCta}
            <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton href="#kontakt" onClick={go('kontakt')} variant="ghost">
            {hero.secondaryCta}
          </MagneticButton>
        </m.div>
      </div>

      <m.div
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
        {...fadeUp(1.3)}
        aria-hidden="true"
      >
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-faint">{hero.scrollHint}</span>
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          {!reduced && (
            <m.span
              className="absolute inset-x-0 top-0 block h-1/2 bg-cyan"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </span>
      </m.div>
    </section>
  )
}
