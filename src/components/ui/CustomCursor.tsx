import { AnimatePresence, m, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useFinePointer, useReducedMotion } from '../../lib/media'

type Mode = 'default' | 'link' | 'view'

/**
 * A dot that tracks the pointer exactly and a ring that follows with a spring.
 * Over links the ring grows; over elements with data-cursor="view" it becomes a
 * filled disc with a label (data-cursor-label). Desktop with a fine pointer only.
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
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 })

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
      } else if (target?.closest('a, button, [role="button"], label, input, textarea')) {
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

  const ringScale = mode === 'view' ? 2.6 : mode === 'link' ? 1.6 : 1

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden="true">
      <m.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <m.div
          className={`-ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${
            mode === 'view' ? 'border-cyan bg-cyan' : 'border-ink/40 bg-transparent'
          }`}
          animate={{ scale: ringScale, opacity: visible ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <AnimatePresence>
            {mode === 'view' && label && (
              <m.span
                className="text-[0.38rem] font-bold uppercase tracking-[0.12em] text-navy-950"
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
      </m.div>
      <m.div className="absolute left-0 top-0" style={{ x, y }}>
        <m.div
          className="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-cyan"
          animate={{ opacity: visible && mode !== 'view' ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        />
      </m.div>
    </div>
  )
}
