import { CountUp } from '../components/ui/CountUp'
import { FadeIn } from '../components/ui/RevealText'
import { facts } from '../content'

/** Four confirmed facts as large counting numbers, plus the companies we have built for. */
export function Facts() {
  return (
    <section aria-label={facts.label} className="py-12 sm:py-16">
      <div className="container-x">
        <div className="glass-border relative overflow-hidden rounded-card bg-navy-850/50">
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true" />
          <dl className="relative grid grid-cols-2 lg:grid-cols-4">
            {facts.items.map((f, i) => (
              <FadeIn
                key={f.label}
                delay={i * 0.08}
                className={`border-line p-6 sm:p-10 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
              >
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block whitespace-nowrap text-[clamp(2rem,4vw,3.5rem)] font-bold leading-none tracking-tight">
                    {f.prefix && <span className="text-[0.5em] font-semibold text-ink-muted">{f.prefix} </span>}
                    <CountUp value={f.value} />
                    {f.suffix && <span className="text-cyan">{f.suffix}</span>}
                  </span>
                  <span className="mt-3 block text-pretty text-sm text-ink-muted sm:text-base" aria-hidden="true">
                    {f.label}
                  </span>
                </dd>
              </FadeIn>
            ))}
          </dl>
          <div className="relative flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line px-6 py-5 sm:px-10">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">{facts.clientsLabel}</span>
            {facts.clients.map((c) => (
              <span key={c} className="text-lg font-bold tracking-tight text-ink/80">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
