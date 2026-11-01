import { m, useSpring } from 'framer-motion'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { useFinePointer, useReducedMotion } from '../../lib/media'

const spring = { stiffness: 180, damping: 20, mass: 0.6 }

/**
 * Light 3D tilt toward the cursor (rotate only). Does nothing on touch devices or with
 * reduced motion, so the content renders exactly as without it.
 */
export function Tilt({ children, max = 3, className = '' }: { children: ReactNode; max?: number; className?: string }) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const active = fine && !reduced
  const ref = useRef<HTMLDivElement>(null)
  const rx = useSpring(0, spring)
  const ry = useSpring(0, spring)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  if (!active) return <div className={className}>{children}</div>
  return (
    <div className={`[perspective:1400px] ${className}`}>
      <m.div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} style={{ rotateX: rx, rotateY: ry }}>
        {children}
      </m.div>
    </div>
  )
}
