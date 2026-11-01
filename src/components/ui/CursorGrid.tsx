import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useFinePointer, useReducedMotion } from '../../lib/media'

const SPOT = 520 // diameter of the highlighted area in px

/**
 * Dot grid with a cyan "spotlight" that follows the cursor.
 * The spotlight window moves with translate; its contents counter-translate,
 * so the bright dots stay aligned with the static grid. Transform/opacity only.
 */
export function CursorGrid({ className = '' }: { className?: string }) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const active = fine && !reduced
  const root = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(-SPOT)
  const my = useMotionValue(-SPOT)
  const x = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.5 })
  const y = useSpring(my, { stiffness: 120, damping: 20, mass: 0.5 })
  const ix = useTransform(x, (v) => -v)
  const iy = useTransform(y, (v) => -v)
  const target = useMotionValue(0)
  const opacity = useSpring(target, { stiffness: 80, damping: 20 })

  useEffect(() => {
    if (!active) return
    const el = root.current
    const host = el?.parentElement
    if (!el || !host) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mx.set(e.clientX - r.left - SPOT / 2)
      my.set(e.clientY - r.top - SPOT / 2)
      target.set(1)
    }
    const onLeave = () => target.set(0)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [active, mx, my, target])

  return (
    <div ref={root} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      {active && (
        <m.div
          className="absolute left-0 top-0 overflow-hidden rounded-full [mask-image:radial-gradient(circle,black_0%,transparent_68%)]"
          style={{ x, y, width: SPOT, height: SPOT, opacity }}
        >
          <m.div className="dot-grid-accent absolute left-0 top-0 h-[300vh] w-[300vw]" style={{ x: ix, y: iy }} />
        </m.div>
      )}
    </div>
  )
}
