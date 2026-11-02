import { useEffect, useState, type RefObject } from 'react'

/**
 * One video at a time. Every project recording is a 1280×800 VP9 stream, and decoding
 * several at once (the home grid, or the projects page behind an open case study) makes
 * phones and laptops stutter. Elements register here; only the most visible one that is
 * not inside an `inert` subtree gets to play, and nothing plays while the tab is hidden.
 */
type Slot = { ratio: number; set: (on: boolean) => void }

const slots = new Map<Element, Slot>()
const MIN_RATIO = 0.3
let current: Element | null = null
let observer: IntersectionObserver | null = null

function pick() {
  let best: Element | null = null
  let bestRatio = MIN_RATIO
  if (document.visibilityState === 'visible') {
    // The one playing keeps its slot until another is clearly more visible.
    const cur = current && slots.get(current)
    if (current && cur && cur.ratio >= MIN_RATIO && !current.closest('[inert]')) {
      best = current
      bestRatio = cur.ratio + 0.15
    }
    slots.forEach((s, el) => {
      if (s.ratio > bestRatio && !el.closest('[inert]')) {
        best = el
        bestRatio = s.ratio
      }
    })
  }
  if (best === current) return
  if (current) slots.get(current)?.set(false)
  current = best
  if (best) slots.get(best)?.set(true)
}

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const s = slots.get(e.target)
          if (s) s.ratio = e.isIntersecting ? e.intersectionRatio : 0
        })
        pick()
      },
      { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1] },
    )
    document.addEventListener('visibilitychange', pick)
  }
  return observer
}

/** Re-check who plays, e.g. after part of the page became inert or stopped being inert. */
export const refreshPlaySlots = () => {
  if (observer) pick()
}

/** True while the element behind `ref` holds the single play slot. */
export function usePlaySlot(ref: RefObject<Element>, enabled = true): boolean {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return
    const obs = getObserver()
    slots.set(el, { ratio: 0, set: setOn })
    obs.observe(el)
    return () => {
      obs.unobserve(el)
      slots.delete(el)
      if (current === el) {
        current = null
        pick()
      }
      setOn(false)
    }
  }, [ref, enabled])
  return on
}
