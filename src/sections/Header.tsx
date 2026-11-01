import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Bracket, Logo } from '../components/brand/Logo'
import { MagneticButton } from '../components/ui/MagneticButton'
import { hero, nav, ui } from '../content'
import { useReducedMotion } from '../lib/media'
import { easeBrand } from '../lib/motion'
import { useSmoothScroll } from '../lib/smooth-scroll'

export function Header() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const last = useRef(0)
  const reduced = useReducedMotion()
  const scroll = useSmoothScroll()
  const menuButton = useRef<HTMLButtonElement>(null)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 24)
    // Hide while scrolling down past the hero, reveal on any upward scroll.
    setHidden(y > last.current && y > 480)
    last.current = y
  })

  useEffect(() => {
    if (!open) return
    scroll.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      scroll.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, scroll])

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setOpen(false)
    scroll.scrollTo(id)
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <>
    <m.header
      className="fixed inset-x-0 top-0 z-50"
      animate={{ y: hidden && !open ? '-100%' : '0%' }}
      transition={{ duration: reduced ? 0 : 0.45, ease: easeBrand }}
    >
      <div
        className={`absolute inset-0 border-b bg-navy-950/80 backdrop-blur-md transition-opacity duration-500 ${
          scrolled || open ? 'border-line opacity-100' : 'border-transparent opacity-0'
        }`}
        aria-hidden="true"
      />
      <div className="container-x relative flex h-[var(--header-h)] items-center justify-between gap-6">
        <a href="#top" onClick={go('top')} aria-label={ui.home} className="-m-2 rounded-lg p-2">
          <Logo ink="white" title={null} className="h-9 w-auto sm:h-10" />
        </a>

        <nav aria-label={ui.mainNav} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  className="group relative inline-flex items-center px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  <Bracket
                    side="left"
                    strokeWidth={60}
                    className="h-3 w-auto -translate-x-1 text-cyan opacity-0 transition duration-300 ease-brand group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                  <span className="px-1.5">{item.label}</span>
                  <Bracket
                    side="right"
                    strokeWidth={60}
                    className="h-3 w-auto translate-x-1 text-cyan opacity-0 transition duration-300 ease-brand group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <MagneticButton href="#kontakt" onClick={go('kontakt')} className="!min-h-10 !px-5 !py-2 text-sm">
            {hero.primaryCta}
          </MagneticButton>
        </div>

        <button
          ref={menuButton}
          type="button"
          className="relative -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? ui.closeMenu : ui.menu}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-6" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 rounded-full bg-ink transition-transform duration-300 ease-brand ${
                open ? 'translate-y-[5px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-6 rounded-full bg-ink transition-transform duration-300 ease-brand ${
                open ? '-translate-y-[5px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

    </m.header>
      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-menu"
            aria-label={ui.mainNav}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 bg-navy-950 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
          >
            <ul className="container-x flex flex-col gap-2 pt-10">
              {nav.map((item, i) => (
                <m.li
                  key={item.id}
                  initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: easeBrand, delay: reduced ? 0 : 0.05 + i * 0.06 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    className="flex items-baseline gap-4 border-b border-line py-4 text-3xl font-semibold tracking-tight"
                  >
                    <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                    {item.label}
                  </a>
                </m.li>
              ))}
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </>
  )
}
