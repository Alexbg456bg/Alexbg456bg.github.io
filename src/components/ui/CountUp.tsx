import { animate, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../lib/media'

/**
 * A number that counts up from 0 once it scrolls into view. The final value is in the
 * markup (prerender, no JS, reduced motion); only the text content is animated.
 */
export function CountUp({ value, duration = 1.6 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  useEffect(() => {
    if (!inView || reduced || !ref.current) return
    const el = ref.current
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [inView, reduced, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  )
}
