import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Click handler for internal links rendered as plain <a href> (e.g. MagneticButton):
 * navigates inside the app, but leaves new-tab and modified clicks to the browser.
 */
export function useGo() {
  const navigate = useNavigate()
  return (to: string, state?: unknown) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to, { state })
  }
}
