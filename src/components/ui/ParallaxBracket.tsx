import { m, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Bracket } from '../brand/Logo'
import { useReducedMotion } from '../../lib/media'

/** Large faint bracket that drifts against the scroll, framing a section. */
export function ParallaxBracket({
  side,
  className = '',
  distance = 160,
}: {
  side: 'left' | 'right'
  className?: string
  distance?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [distance, -distance])

  return (
    <div ref={ref} className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <m.div style={{ y }}>
        <Bracket side={side} className="h-full w-auto text-cyan/[0.07]" />
      </m.div>
    </div>
  )
}
