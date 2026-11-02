import Lenis from 'lenis'
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useReducedMotion } from './media'

type ScrollApi = {
  scrollTo: (target: string | HTMLElement | number) => void
  stop: () => void
  start: () => void
  /** Jump to the top at once (new page). */
  reset: () => void
  /** Subscribe to scroll updates (used to keep GSAP ScrollTrigger in sync). */
  onScroll: (cb: () => void) => () => void
}

const ScrollContext = createContext<ScrollApi | null>(null)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const listeners = useRef(new Set<() => void>())

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12, anchors: false })
    lenis.on('scroll', () => listeners.current.forEach((cb) => cb()))
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo: (target) => {
        const el =
          typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target
        if (el === null) return
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { offset: 0, duration: 1.2 })
        } else if (typeof el === 'number') {
          window.scrollTo({ top: el })
        } else {
          el.scrollIntoView()
        }
      },
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      reset: () => {
        if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true })
        else window.scrollTo(0, 0)
      },
      onScroll: (cb) => {
        listeners.current.add(cb)
        return () => listeners.current.delete(cb)
      },
    }),
    [],
  )

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
}

export function useSmoothScroll(): ScrollApi {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useSmoothScroll must be used inside SmoothScrollProvider')
  return ctx
}
