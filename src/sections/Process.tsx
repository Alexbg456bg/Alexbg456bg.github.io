import { m, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { process } from '../content'
import { useReducedMotion } from '../lib/media'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Five short steps on one line (desktop) or one column (phones). The connecting line
 * draws itself as the section scrolls past; transform only (scaleX / scaleY).
 */
export function Process() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 85%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section id="proces" aria-labelledby="proces-title" className="section">
      <div className="container-x">
        <SectionHeader id="proces-title" eyebrow={process.eyebrow} title={process.title} />

        <ol ref={listRef} className="relative mt-12 grid gap-8 pl-8 sm:mt-16 lg:grid-cols-5 lg:gap-6 lg:pl-0 lg:pt-10">
          {/* Track and drawn line: vertical on phones, horizontal on desktop. */}
          <span className="absolute bottom-2 left-[5px] top-2 w-px bg-line lg:hidden" aria-hidden="true" />
          <span className="absolute left-0 right-0 top-[5px] hidden h-px bg-line lg:block" aria-hidden="true" />
          {!reduced && (
            <>
              <m.span
                className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-cyan lg:hidden"
                style={{ scaleY: progress }}
                aria-hidden="true"
              />
              <m.span
                className="absolute left-0 right-0 top-[5px] hidden h-px origin-left bg-cyan lg:block"
                style={{ scaleX: progress }}
                aria-hidden="true"
              />
            </>
          )}
          {process.steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span
                className="absolute -left-8 top-1.5 h-[11px] w-[11px] rounded-full bg-cyan ring-4 ring-navy-950 lg:-top-10 lg:left-0"
                aria-hidden="true"
              />
              <FadeIn delay={i * 0.08}>
                <p className="font-mono text-sm text-cyan">{pad(i + 1)}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-pretty leading-relaxed text-ink-muted">{step.text}</p>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
