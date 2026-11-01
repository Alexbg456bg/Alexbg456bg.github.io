import { m, useScroll, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { process } from '../content'
import { useReducedMotion } from '../lib/media'
import { easeBrand } from '../lib/motion'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/** Odometer-style number: each digit rolls up to its value when it enters the viewport. */
function RollingNumber({ value, active }: { value: string; active: boolean }) {
  const reduced = useReducedMotion()
  return (
    <span
      className={`inline-flex font-mono text-4xl font-medium leading-none tabular-nums transition-colors duration-500 sm:text-5xl ${
        active ? 'text-cyan' : 'text-ink-faint'
      }`}
      aria-hidden="true"
    >
      {value.split('').map((d, i) =>
        reduced ? (
          <span key={i}>{d}</span>
        ) : (
          <span key={i} className="relative inline-block h-[1em] overflow-hidden">
            <m.span
              className="flex flex-col"
              initial={{ y: '0%' }}
              whileInView={{ y: `-${Number(d) * 10}%` }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.1, ease: easeBrand, delay: 0.1 + i * 0.12 }}
            >
              {DIGITS.map((n) => (
                <span key={n} className="block h-[1em]">
                  {n}
                </span>
              ))}
            </m.span>
          </span>
        ),
      )}
    </span>
  )
}

function Step({ index, title, text }: { index: number; title: string; text: string }) {
  const [active, setActive] = useState(false)
  const number = String(index + 1).padStart(2, '0')
  return (
    <m.li
      className="relative grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-5 py-10 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-x-8"
      onViewportEnter={() => setActive(true)}
      onViewportLeave={() => setActive(false)}
      viewport={{ margin: '-45% 0px -45% 0px' }}
    >
      <span
        className={`absolute -left-[5px] top-12 hidden h-2.5 w-2.5 rounded-full ring-4 ring-navy-950 transition-colors duration-500 sm:block ${
          active ? 'bg-cyan' : 'bg-navy-700'
        }`}
        aria-hidden="true"
      />
      <div className="sm:pl-8">
        <RollingNumber value={number} active={active} />
      </div>
      <FadeIn>
        <h3 className="text-h3 font-semibold">
          <span className="sr-only">{number}. </span>
          {title}
        </h3>
        <p className="mt-3 max-w-md text-pretty leading-relaxed text-ink-muted">{text}</p>
      </FadeIn>
    </m.li>
  )
}

export function Process() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 60%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section id="proces" aria-labelledby="proces-title" className="relative py-24 sm:py-32 lg:py-40">
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <SectionHeader
          id="proces-title"
          eyebrow={process.eyebrow}
          title={process.title}
          className="lg:sticky lg:top-32 lg:self-start"
        />

        <ol ref={listRef} className="relative sm:border-l sm:border-line">
          {!reduced && (
            <m.span
              className="absolute -left-px top-0 hidden h-full w-px origin-top bg-cyan sm:block"
              style={{ scaleY: progress }}
              aria-hidden="true"
            />
          )}
          {process.steps.map((step, i) => (
            <Step key={step.title} index={i} title={step.title} text={step.text} />
          ))}
        </ol>
      </div>
    </section>
  )
}
