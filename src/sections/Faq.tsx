import { AnimatePresence, m } from 'framer-motion'
import { useId, useState } from 'react'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { faq } from '../content'
import { easeBrand } from '../lib/motion'

/** Accordion of common questions; one answer open at a time. */
export function Faq() {
  const uid = useId()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="vaprosi" aria-labelledby="vaprosi-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader id="vaprosi-title" eyebrow={faq.eyebrow} title={faq.title} intro={faq.intro} />
        </div>

        <ul className="border-t border-line">
          {faq.items.map((item, i) => {
            const isOpen = open === i
            const panel = `${uid}-a${i}`
            return (
              <li key={item.q} className="border-b border-line">
                <FadeIn delay={i * 0.05}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panel}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold tracking-tight transition-colors hover:text-cyan sm:text-xl"
                    >
                      {item.q}
                      <span
                        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 transition-colors duration-300 ${
                          isOpen ? 'bg-cyan text-navy-950 ring-cyan' : 'text-ink-muted ring-line group-hover:ring-cyan/50'
                        }`}
                        aria-hidden="true"
                      >
                        <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                        <span
                          className={`absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-300 ease-brand ${isOpen ? 'scale-y-0' : ''}`}
                        />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        id={panel}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: easeBrand }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 pr-12 text-pretty leading-relaxed text-ink-muted">{item.a}</p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </FadeIn>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
