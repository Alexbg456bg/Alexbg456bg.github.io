import type { PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/ui/MagneticButton'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ServiceIcon } from '../components/ui/ServiceIcon'
import { servicesOverview as t } from '../content'

const pad = (n: number) => String(n).padStart(2, '0')

// The card's glow follows the pointer through two CSS variables; nothing re-renders.
const trackPointer = (e: PointerEvent<HTMLAnchorElement>) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/** Home page: the four things we do, as cards with a pointer-following glow. Leads to /uslugi. */
export function ServicesOverview() {
  return (
    <section aria-labelledby="services-overview-title" className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader id="services-overview-title" eyebrow={t.eyebrow} title={t.title} />
          <Link to="/uslugi" className="group inline-flex items-center gap-2 font-semibold text-cyan">
            {t.cta}
            <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((s, i) => (
            <li key={s.title}>
              <FadeIn delay={i * 0.08} className="h-full">
                <Link
                  to="/uslugi"
                  onPointerMove={trackPointer}
                  className="glass-border group relative flex h-full flex-col overflow-hidden rounded-card bg-navy-850/50 p-7 transition-transform duration-500 ease-brand hover:-translate-y-1"
                >
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: 'radial-gradient(320px circle at var(--mx, 50%) var(--my, 0%), rgba(0,194,255,0.14), transparent 70%)' }}
                    aria-hidden="true"
                  />
                  <span className="relative flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/10 text-cyan ring-1 ring-inset ring-cyan/20 transition-colors duration-500 group-hover:bg-cyan group-hover:text-navy-950">
                      <ServiceIcon name={s.icon} className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-xs text-ink-faint">{pad(i + 1)}</span>
                  </span>
                  <span className="relative mt-8 text-xl font-semibold tracking-tight">{s.title}</span>
                  <span className="relative mt-2 text-pretty leading-relaxed text-ink-muted">{s.text}</span>
                  <span className="relative mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-cyan opacity-0 transition duration-500 ease-brand group-hover:opacity-100">
                    {t.more}
                    <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
