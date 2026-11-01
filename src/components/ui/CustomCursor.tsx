import { AnimatePresence, m, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Bracket } from '../brand/Logo'
import { useFinePointer, useReducedMotion } from '../../lib/media'

type Mode = 'default' | 'link' | 'view'

// How far each bracket sits from the pointer, per mode (px).
const SPREAD: Record<Mode, number> = { default: 11, link: 20, view: 34 }

/**
 * The logo's brackets around the pointer: they spread apart over anything clickable and
 * frame a label over elements with data-cursor="view" (data-cursor-label).
 * Desktop with a fine pointer only; the native cursor is hidden only while this is active.
 */
export function CustomCursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const active = fine && !reduced
  const [mode, setMode] = useState<Mode>('default')
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 36, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 36, mass: 0.4 })

  useEffect(() => {
    if (!active) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = e.target instanceof Element ? e.target : null
      const view = target?.closest<HTMLElement>('[data-cursor="view"]')
      if (view) {
        setMode('view')
        setLabel(view.dataset.cursorLabel ?? '')
      } else if (target?.closest('a, button, [role="button"], label, input, textarea, select')) {
        setMode('link')
      } else {
        setMode('default')
      }
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [active, x, y])

  if (!active) return null

  const spread = SPREAD[mode]
  const spring = { type: 'spring', stiffness: 420, damping: 28 } as const

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden="true">
      <m.div className="absolute left-0 top-0" style={{ x: sx, y: sy }} animate={{ opacity: visible ? 1 : 0 }}>
        <m.span className="absolute -top-2.5 block text-cyan" animate={{ x: -spread - 7 }} transition={spring}>
          <Bracket side="left" strokeWidth={80} className="h-5 w-auto" />
        </m.span>
        <m.span className="absolute -top-2.5 block text-cyan" animate={{ x: spread - 1 }} transition={spring}>
          <Bracket side="right" strokeWidth={80} className="h-5 w-auto" />
        </m.span>
        <AnimatePresence>
          {mode === 'view' && label && (
            <m.span
              className="absolute -top-2.5 block -translate-x-1/2 whitespace-nowrap font-mono text-xs font-medium uppercase tracking-[0.14em] text-cyan"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </m.span>
          )}
        </AnimatePresence>
      </m.div>
      <m.div className="absolute left-0 top-0" style={{ x, y }}>
        <m.span
          className="-ml-[3px] -mt-[3px] block h-1.5 w-1.5 rounded-full bg-cyan"
          animate={{ opacity: visible && mode !== 'view' ? 1 : 0, scale: mode === 'link' ? 0.5 : 1 }}
          transition={{ duration: 0.15 }}
        />
      </m.div>
    </div>
  )
}
