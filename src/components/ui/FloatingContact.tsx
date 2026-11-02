import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { siteConfig } from '../../config'
import { contactFab } from '../../content'
import { useReducedMotion } from '../../lib/media'
import { easeBrand } from '../../lib/motion'

function PhoneIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Round call button in the bottom-right corner. Opens a small card with both phones,
 * the email and a link to the form. Shows once the visitor scrolls; hidden on /kontakt.
 */
export function FloatingContact() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const { phones, email } = siteConfig.contact

  useMotionValueEvent(scrollY, 'change', (y) => setShown(y > 320))
  useEffect(() => setOpen(false), [pathname])

  // Close on Esc or a click anywhere else.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  if (pathname.startsWith('/kontakt')) return null
  const visible = shown || open

  return (
    <div ref={root} className="fixed bottom-4 right-4 z-[45] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <m.div
            id="fab-panel"
            className="glass-border w-72 origin-bottom-right rounded-card bg-navy-850/95 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md"
            initial={{ opacity: 0, scale: reduced ? 1 : 0.9, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.95, y: reduced ? 0 : 8 }}
            transition={{ duration: 0.3, ease: easeBrand }}
          >
            <p className="eyebrow">{contactFab.call}</p>
            <ul className="mt-3 grid gap-2">
              {phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="group flex items-center gap-3 rounded-xl bg-navy-950/60 px-3 py-2.5 transition-colors hover:bg-cyan/10">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan/10 text-cyan ring-1 ring-inset ring-cyan/25">
                      <PhoneIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold group-hover:text-cyan">{p.name}</span>
                      <span className="block font-mono text-xs text-ink-muted">{p.display}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {email && (
              <a href={`mailto:${email}`} className="mt-4 block truncate text-sm text-ink-muted hover:text-cyan">
                {email}
              </a>
            )}
            <Link to="/kontakt" className="mt-3 inline-flex text-sm font-semibold text-cyan underline-offset-4 hover:underline">
              {contactFab.form} →
            </Link>
          </m.div>
        )}
      </AnimatePresence>

      <m.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="fab-panel"
        aria-label={open ? contactFab.close : contactFab.open}
        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan text-navy-950 shadow-[0_12px_40px_-8px_rgba(0,194,255,0.7)] transition-colors hover:bg-cyan-soft"
        initial={false}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6, pointerEvents: visible ? 'auto' : 'none' }}
        transition={{ duration: reduced ? 0 : 0.35, ease: easeBrand }}
        tabIndex={visible ? 0 : -1}
      >
        {!open && <span className="animate-pulse-ring absolute inset-0 rounded-full bg-cyan/50" aria-hidden="true" />}
        {open ? (
          <svg viewBox="0 0 24 24" className="relative h-5 w-5" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
        ) : (
          <PhoneIcon className="animate-wiggle relative h-6 w-6" />
        )}
      </m.button>
    </div>
  )
}
