import { AnimatePresence, animate, m, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowIcon, MagneticButton } from '../components/ui/MagneticButton'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { pricing as p } from '../content'
import { useReducedMotion } from '../lib/media'
import { easeBrand } from '../lib/motion'
import { useGo } from '../lib/nav'

function Check() {
  return (
    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan" aria-hidden="true">
      <svg viewBox="0 0 16 16" className="h-2.5 w-2.5">
        <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

/** Price that counts to its new value when it changes; readable at once on first paint. */
function CountingPrice({ value }: { value: number }) {
  const reduced = useReducedMotion()
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString('bg-BG'))
  useEffect(() => {
    if (reduced) {
      mv.set(value)
      return
    }
    const controls = animate(mv, value, { duration: 0.6, ease: easeBrand })
    return () => controls.stop()
  }, [value, reduced, mv])
  return (
    <>
      <span className="sr-only">{value}</span>
      <m.span aria-hidden="true" className="tabular-nums">
        {text}
      </m.span>
    </>
  )
}

function Card({ children, delay, featured = false }: { children: React.ReactNode; delay: number; featured?: boolean }) {
  return (
    <FadeIn delay={delay} className="h-full">
      <div
        className={`glass-border flex h-full flex-col rounded-card p-7 sm:p-8 ${
          featured ? 'bg-gradient-to-b from-navy-800 to-navy-850' : 'bg-navy-850/50'
        }`}
      >
        {children}
      </div>
    </FadeIn>
  )
}

/** Prices "from", in EUR. The catalog card switches between plain and with an admin panel. */
export function Pricing() {
  const reduced = useReducedMotion()
  const go = useGo()
  const [variantId, setVariantId] = useState(p.catalog.variants[0].id)
  const variant = p.catalog.variants.find((v) => v.id === variantId) ?? p.catalog.variants[0]

  return (
    <section id="ceni" aria-labelledby="ceni-title" className="section">
      <div className="container-x">
        <SectionHeader as="h1" id="ceni-title" eyebrow={p.eyebrow} title={p.title} intro={p.intro} split />

        <div className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-3">
          <Card delay={0} featured>
            <h2 className="text-xl font-semibold tracking-tight">{p.catalog.title}</h2>
            <p className="mt-2 text-ink-muted">{p.catalog.text}</p>

            <div role="group" aria-label={p.catalog.toggleLabel} className="mt-6 grid grid-cols-2 rounded-full bg-navy-950/70 p-1 ring-1 ring-inset ring-line">
              {p.catalog.variants.map((v) => {
                const on = v.id === variantId
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setVariantId(v.id)}
                    className={`relative whitespace-nowrap rounded-full px-2 py-2 text-xs font-semibold sm:px-3 sm:text-sm transition-colors duration-300 ${
                      on ? 'text-navy-950' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {on && (
                      <m.span
                        layoutId="price-toggle"
                        className="absolute inset-0 rounded-full bg-cyan"
                        transition={{ duration: reduced ? 0 : 0.4, ease: easeBrand }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative">{v.label}</span>
                  </button>
                )
              })}
            </div>

            <p className="mt-7 flex items-baseline gap-2" aria-live="polite">
              <span className="text-ink-muted">{p.from}</span>
              <span className="text-5xl font-bold tracking-tight">
                <CountingPrice value={variant.price} />
              </span>
              <span className="text-2xl font-semibold text-ink-muted">{p.currency}</span>
            </p>

            <ul className="mt-7 space-y-3 border-t border-line pt-6">
              <AnimatePresence initial={false} mode="popLayout">
                {variant.includes.map((item) => (
                  <m.li
                    key={item}
                    layout={!reduced}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: easeBrand }}
                    className="flex items-start gap-3"
                  >
                    <Check />
                    <span>{item}</span>
                  </m.li>
                ))}
              </AnimatePresence>
            </ul>
          </Card>

          <Card delay={0.08}>
            <h2 className="text-xl font-semibold tracking-tight">{p.business.title}</h2>
            <p className="mt-2 text-ink-muted">{p.business.text}</p>
            <p className="mt-6 text-3xl font-bold tracking-tight lg:mt-[5.6rem] lg:text-4xl">{p.onRequest}</p>
            <ul className="mt-7 space-y-3 border-t border-line pt-6">
              {p.business.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card delay={0.16}>
            <h2 className="eyebrow">{p.extrasTitle}</h2>
            <dl className="mt-5 divide-y divide-line">
              {p.extras.map((x) => (
                <div key={x.label} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-ink-muted">
                    {x.label}
                    {x.note && <span className="block text-sm text-ink-faint">{x.note}</span>}
                  </dt>
                  <dd className="shrink-0 text-right font-semibold">{x.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto rounded-2xl bg-navy-950/60 p-4 text-sm">
              <p className="font-semibold">{p.smallChange.title}</p>
              <p className="mt-1 leading-relaxed text-ink-muted">{p.smallChange.text}</p>
            </div>
          </Card>
        </div>

        <FadeIn delay={0.2} className="mt-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:gap-6">
          <MagneticButton href="/kontakt" onClick={go('/kontakt')}>
            {p.cta}
            <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </MagneticButton>
          <p className="flex items-center gap-2 text-sm text-ink-muted">
            <span className="h-2 w-2 rounded-full bg-cyan" aria-hidden="true" />
            {p.offer}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
