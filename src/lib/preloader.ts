import { useEffect, useState } from 'react'

// Must match the CSS in index.html: the overlay starts fading out at 1.2 s.
const FADE_START_MS = 1200

/**
 * The preloader is plain HTML/CSS in index.html (so it runs before JS loads).
 * This resolves to true once it starts fading out, or was skipped, or never showed,
 * which is when the hero intro should play.
 */
export function useIntroReady(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    let timer = 0
    let frame = 0
    const go = () => {
      window.clearTimeout(timer)
      // One frame so the hero can measure itself before its intro plays.
      frame = requestAnimationFrame(() => setReady(true))
    }

    if (!root.classList.contains('ae-preload') || root.classList.contains('ae-preload-done')) {
      go()
      return () => cancelAnimationFrame(frame)
    }

    const elapsed = performance.now()
    timer = window.setTimeout(go, Math.max(0, FADE_START_MS - elapsed))
    // The skip handler in index.html adds this class.
    const observer = new MutationObserver(() => {
      if (root.classList.contains('ae-preload-done')) go()
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return ready
}
