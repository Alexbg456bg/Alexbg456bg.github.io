import { m } from 'framer-motion'
import { useEffect, useState, type MouseEvent } from 'react'
import { sections, ui } from '../../content'
import { easeBrand } from '../../lib/motion'
import { useSmoothScroll } from '../../lib/smooth-scroll'

/** Quiet section indicator on the right edge (01–06). Only on screens wide enough that it never overlaps content. */
export function SideProgress() {
  const [active, setActive] = useState(0)
  const scroll = useSmoothScroll()

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(sections.findIndex((s) => s.id === e.target.id))
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scroll.scrollTo(id)
  }

  return (
    <nav aria-label={ui.sectionNav} className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 min-[1500px]:block">
      <ol className="flex flex-col items-end gap-3">
        {sections.map((s, i) => {
          const on = i === active
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={go(s.id)}
                aria-current={on ? 'true' : undefined}
                className="group flex items-center gap-3 py-0.5"
              >
                <m.span
                  className="whitespace-nowrap font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-muted"
                  animate={{ opacity: on ? 1 : 0, x: on ? 0 : 8 }}
                  transition={{ duration: 0.4, ease: easeBrand }}
                >
                  {s.label}
                </m.span>
                <span
                  className={`font-mono text-[0.7rem] tabular-nums transition-colors duration-300 ${
                    on ? 'text-cyan' : 'text-ink-faint group-hover:text-ink'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative h-px w-6 overflow-hidden bg-line" aria-hidden="true">
                  <m.span
                    className="absolute inset-0 origin-right bg-cyan"
                    animate={{ scaleX: on ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: easeBrand }}
                  />
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
