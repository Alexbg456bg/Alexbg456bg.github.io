import { useEffect, useLayoutEffect, useState } from 'react'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Starts from `fallback` so the prerendered HTML and the first client render match,
 * then syncs with the real media query before the browser paints.
 */
function useMediaQuery(query: string, fallback = false): boolean {
  const [matches, setMatches] = useState(fallback)

  useIsoLayoutEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY)

/** True only on devices with a real cursor — cursor effects are off on touch. */
export const useFinePointer = () => useMediaQuery(FINE_POINTER_QUERY)

export const useMinWidth = (px: number) => useMediaQuery(`(min-width: ${px}px)`)
