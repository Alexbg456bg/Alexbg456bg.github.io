import { m } from 'framer-motion'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bracket, Logo } from '../components/brand/Logo'
import { ArrowIcon } from '../components/ui/MagneticButton'
import { meta, notFound } from '../content'
import { useReducedMotion } from '../lib/media'
import { easeBrand } from '../lib/motion'

/** 404: the brackets keep "searching" for the missing page; the logo draws in between. */
export function NotFound() {
  const reduced = useReducedMotion()

  useEffect(() => {
    document.title = `404 — ${notFound.title} | aecodezonebg`
    return () => {
      document.title = meta.title
    }
  }, [])

  const sway = (dir: 1 | -1) =>
    reduced
      ? {}
      : {
          animate: { x: [0, dir * -18, 0] },
          transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const },
        }

  return (
    <main id="main" className="flex min-h-[100svh] flex-col items-center justify-center px-4 text-center">
      <div className="flex items-center gap-4 font-mono text-[clamp(5rem,18vw,12rem)] font-medium leading-none sm:gap-8" aria-hidden="true">
        <m.span className="text-outline [-webkit-text-stroke-color:rgba(0,194,255,0.75)] [-webkit-text-stroke-width:2px]">4</m.span>
        <m.span className="text-cyan" {...sway(-1)}>
          <Bracket side="left" className="h-[0.8em] w-auto" />
        </m.span>
        <Logo ink="white" draw title={null} className="h-[0.55em] w-auto" />
        <m.span className="text-cyan" {...sway(1)}>
          <Bracket side="right" className="h-[0.8em] w-auto" />
        </m.span>
        <m.span className="text-outline [-webkit-text-stroke-color:rgba(0,194,255,0.75)] [-webkit-text-stroke-width:2px]">4</m.span>
      </div>
      <m.h1
        className="mt-12 text-h2 font-bold"
        initial={{ opacity: 0, y: reduced ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeBrand, delay: 0.6 }}
      >
        {notFound.title}
      </m.h1>
      <p className="mt-4 max-w-md text-lg text-ink-muted">{notFound.text}</p>
      <Link to="/" className="mt-10 inline-flex min-h-12 items-center gap-3 rounded-full bg-cyan px-7 font-semibold text-navy-950 hover:bg-cyan-soft">
        {notFound.home}
        <ArrowIcon />
      </Link>
    </main>
  )
}
