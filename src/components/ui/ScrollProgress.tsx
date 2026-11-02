import { m, useScroll, useSpring } from 'framer-motion'
import { useReducedMotion } from '../../lib/media'

/** Thin cyan line at the very top that fills as the page scrolls. Transform only (scaleX). */
export function ScrollProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  if (reduced) return null
  return (
    <m.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-cyan/40 via-cyan to-cyan-soft"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}
