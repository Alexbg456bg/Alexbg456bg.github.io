import { m, useMotionValue, useSpring } from 'framer-motion'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { Bracket } from '../brand/Logo'
import { useFinePointer, useReducedMotion } from '../../lib/media'

const spring = { stiffness: 200, damping: 20, mass: 0.6 }
const MAX_TILT = 4 // degrees
const GLOW = 460 // spotlight diameter in px

/**
 * Card with a cursor-following spotlight, the logo's brackets sliding in on hover/focus
 * and a light 3D tilt. Pointer effects only on devices with a real cursor.
 */
export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const active = fine && !reduced
  const ref = useRef<HTMLDivElement>(null)
  const rx = useSpring(0, spring)
  const ry = useSpring(0, spring)
  const gx = useMotionValue(0)
  const gy = useMotionValue(0)
  const glow = useSpring(0, { stiffness: 120, damping: 20 })

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * MAX_TILT * 2)
    rx.set(-py * MAX_TILT * 2)
    gx.set(e.clientX - r.left - GLOW / 2)
    gy.set(e.clientY - r.top - GLOW / 2)
    glow.set(1)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    glow.set(0)
  }

  return (
    <div className="h-full [perspective:1200px]">
      <m.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry }}
        className={`glass-border group relative h-full overflow-hidden rounded-card bg-navy-850/60 transition-colors duration-500 ease-brand hover:bg-navy-850/90 ${className}`}
      >
        {active && (
          <m.div
            className="pointer-events-none absolute left-0 top-0 rounded-full bg-[radial-gradient(circle,rgba(0,194,255,0.16),transparent_65%)]"
            style={{ x: gx, y: gy, width: GLOW, height: GLOW, opacity: glow }}
            aria-hidden="true"
          />
        )}
        <Bracket
          side="left"
          strokeWidth={56}
          className="pointer-events-none absolute left-3 top-1/2 h-12 w-auto -translate-y-1/2 translate-x-3 text-cyan opacity-0 transition duration-500 ease-brand group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
        />
        <Bracket
          side="right"
          strokeWidth={56}
          className="pointer-events-none absolute right-3 top-1/2 h-12 w-auto -translate-x-3 -translate-y-1/2 text-cyan opacity-0 transition duration-500 ease-brand group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
        />
        <div className="relative">{children}</div>
      </m.div>
    </div>
  )
}
