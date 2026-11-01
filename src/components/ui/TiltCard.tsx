import { m, useSpring } from 'framer-motion'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { Bracket } from '../brand/Logo'
import { useFinePointer, useReducedMotion } from '../../lib/media'

const spring = { stiffness: 200, damping: 20, mass: 0.6 }
const MAX_TILT = 6 // degrees

/**
 * Card with the logo's brackets sliding in on hover/focus and a light 3D tilt
 * that follows the cursor (only on devices with a real pointer).
 */
export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const active = fine && !reduced
  const ref = useRef<HTMLDivElement>(null)
  const rx = useSpring(0, spring)
  const ry = useSpring(0, spring)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * MAX_TILT * 2)
    rx.set(-py * MAX_TILT * 2)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <div className="h-full [perspective:1000px]">
      <m.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry }}
        className={`group relative h-full rounded-card border border-line bg-navy-850/70 transition-colors duration-500 ease-brand focus-within:border-cyan/40 hover:border-cyan/40 ${className}`}
      >
        <Bracket
          side="left"
          strokeWidth={56}
          className="pointer-events-none absolute -left-3 top-1/2 h-14 w-auto -translate-y-1/2 translate-x-3 text-cyan opacity-0 transition duration-500 ease-brand group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
        />
        <Bracket
          side="right"
          strokeWidth={56}
          className="pointer-events-none absolute -right-3 top-1/2 h-14 w-auto -translate-x-3 -translate-y-1/2 text-cyan opacity-0 transition duration-500 ease-brand group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
        />
        {children}
      </m.div>
    </div>
  )
}
