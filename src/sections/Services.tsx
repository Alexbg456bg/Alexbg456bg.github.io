import { AnimatePresence, m } from 'framer-motion'
import { useState } from 'react'
import { Bracket } from '../components/brand/Logo'
import { ArrowIcon, MagneticButton } from '../components/ui/MagneticButton'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ServiceIcon } from '../components/ui/ServiceIcon'
import { ServiceVisual } from '../components/ui/ServiceVisual'
import { configurator as c } from '../content'
import { useReducedMotion } from '../lib/media'
import { easeBrand } from '../lib/motion'
import { useSmoothScroll } from '../lib/smooth-scroll'

export const PREFILL_EVENT = 'ae:prefill'

const STEPS = c.steps.length

/**
 * Signature moment 3 — "Какъв сайт ви трябва?". Three quick choices; the list of what the
 * site includes builds up next to them. The last step hands the summary to the contact form.
 */
export function Services() {
  const reduced = useReducedMotion()
  const scroll = useSmoothScroll()
  const [step, setStep] = useState(0)
  const [choices, setChoices] = useState<Record<string, string>>({})

  const chosen = c.steps.flatMap((s) => s.options.filter((o) => choices[s.id] === o.id))
  const includes = [...c.base, ...chosen.flatMap((o) => o.includes)]
  const done = step >= STEPS

  const pick = (stepId: string, optionId: string) => {
    setChoices((prev) => ({ ...prev, [stepId]: optionId }))
    window.setTimeout(() => setStep((s) => Math.min(STEPS, s + 1)), reduced ? 0 : 280)
  }

  const send = () => {
    const message = [c.messageIntro, ...includes.map((i) => `— ${i}`)].join('\n')
    window.dispatchEvent(new CustomEvent<string>(PREFILL_EVENT, { detail: message }))
    scroll.scrollTo('kontakt')
  }

  const current = c.steps[step]
  const slide = {
    initial: { opacity: 0, x: reduced ? 0 : 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: reduced ? 0 : -40 },
    transition: { duration: 0.45, ease: easeBrand },
  }

  return (
    <section id="uslugi" aria-labelledby="uslugi-title" className="section">
      <div className="container-x">
        <SectionHeader id="uslugi-title" eyebrow={c.eyebrow} title={c.title} intro={c.intro} split />

        <div className="mt-14 grid gap-6 sm:mt-20 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-8">
          <div className="glass-border relative overflow-hidden rounded-card bg-navy-850/50 p-5 sm:p-8">
            {/* Step indicator */}
            <ol className="flex items-center gap-2" aria-label={c.stepLabel}>
              {c.steps.map((s, i) => (
                <li key={s.id} className="flex flex-1 items-center gap-2">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs transition-colors duration-500 ${
                      i < step ? 'bg-cyan text-navy-950' : i === step ? 'text-cyan ring-1 ring-cyan' : 'text-ink-faint ring-1 ring-line'
                    }`}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {i < STEPS - 1 && (
                    <span className="h-px flex-1 overflow-hidden bg-line" aria-hidden="true">
                      <m.span
                        className="block h-full origin-left bg-cyan"
                        animate={{ scaleX: i < step ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: easeBrand }}
                      />
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <div className="relative mt-8 min-h-[30rem] sm:min-h-[26rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                {!done ? (
                  <m.div key={current.id} {...slide}>
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
                      {c.stepLabel} {step + 1} / {STEPS}
                    </p>
                    <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight tracking-tight">{current.question}</h3>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      {current.options.map((o) => {
                        const selected = choices[current.id] === o.id
                        return (
                          <button
                            key={o.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => pick(current.id, o.id)}
                            className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-colors duration-300 ${
                              selected ? 'border-cyan bg-cyan/10' : 'border-line bg-navy-950/40 hover:border-cyan/50'
                            }`}
                          >
                            <ServiceVisual name={o.icon} />
                            <span className="mt-5 flex items-center gap-3 px-2">
                              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan ring-1 ring-inset ring-cyan/20">
                                <ServiceIcon name={o.icon} className="h-5 w-5" />
                              </span>
                              <span className="text-xl font-semibold">{o.title}</span>
                            </span>
                            <span className="mt-2 block px-2 pb-2 text-ink-muted">{o.text}</span>
                          </button>
                        )
                      })}
                    </div>
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s - 1)}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink"
                      >
                        <ArrowIcon className="rotate-180" />
                        {c.back}
                      </button>
                    )}
                  </m.div>
                ) : (
                  <m.div key="done" {...slide} className="flex min-h-[26rem] flex-col items-center justify-center text-center">
                    <span className="flex items-center gap-4 text-cyan" aria-hidden="true">
                      <m.span initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, ease: easeBrand }}>
                        <Bracket side="left" className="h-16 w-auto" />
                      </m.span>
                      <m.span initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, ease: easeBrand }}>
                        <Bracket side="right" className="h-16 w-auto" />
                      </m.span>
                    </span>
                    <h3 className="mt-8 text-[clamp(1.75rem,3.4vw,2.6rem)] font-bold tracking-tight">{c.summaryTitle}</h3>
                    <p className="mt-3 max-w-md text-lg text-ink-muted">{c.summaryText}</p>
                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
                      <MagneticButton onClick={send}>
                        {c.submit}
                        <ArrowIcon />
                      </MagneticButton>
                      <button
                        type="button"
                        onClick={() => {
                          setChoices({})
                          setStep(0)
                        }}
                        className="text-sm font-semibold text-ink-muted hover:text-ink"
                      >
                        {c.restart}
                      </button>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <aside className="glass-border h-fit rounded-card bg-navy-850/50 p-6 sm:p-8 lg:sticky lg:top-28">
            <p className="eyebrow">{c.includesTitle}</p>
            <ul className="mt-6 space-y-3">
              <AnimatePresence initial={false}>
                {includes.map((item) => (
                  <m.li
                    key={item}
                    layout={!reduced}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: easeBrand }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan">
                      <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" aria-hidden="true">
                        <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </m.li>
                ))}
              </AnimatePresence>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
