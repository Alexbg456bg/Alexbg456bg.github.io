import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/ui/MagneticButton'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { pricing, pricingTeaser as t } from '../content'

/** Home page: the three prices at a glance; the full table lives on /ceni. */
export function PricingTeaser() {
  const [base, cms] = pricing.catalog.variants
  const rows = [
    { title: pricing.catalog.title, sub: base.label, price: `${pricing.from} ${base.price} ${pricing.currency}` },
    { title: pricing.catalog.title, sub: cms.label, price: `${pricing.from} ${cms.price} ${pricing.currency}` },
    { title: pricing.business.title, sub: pricing.business.text, price: pricing.onRequest },
  ]

  return (
    <section aria-labelledby="ceni-teaser-title" className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader id="ceni-teaser-title" eyebrow={t.eyebrow} title={t.title} />
          <Link to="/ceni" className="group inline-flex items-center gap-2 font-semibold text-cyan">
            {t.cta}
            <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-3">
          {rows.map((r, i) => (
            <li key={r.sub}>
              <FadeIn delay={i * 0.08} className="h-full">
                <Link
                  to="/ceni"
                  className="glass-border group flex h-full flex-col rounded-card bg-navy-850/50 p-7 transition-colors duration-300 hover:bg-navy-850"
                >
                  <span className="font-semibold">{r.title}</span>
                  <span className="mt-1 text-sm text-ink-muted">{r.sub}</span>
                  <span className="mt-8 text-3xl font-bold tracking-tight transition-colors group-hover:text-cyan">{r.price}</span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-ink-faint">{t.note}</p>
      </div>
    </section>
  )
}
