import { m, useScroll, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { FadeIn, RevealText } from '../components/ui/RevealText'
import { process } from '../content'
import { useReducedMotion } from '../lib/media'
import { easeBrand } from '../lib/motion'

const pad = (n: number) => String(n).padStart(2, '0')

/** Huge outlined step number that rolls to the active step. */
function BigCounter({ active }: { active: number }) {
  return (
    <div className="relative h-[1em] overflow-hidden font-mono text-[clamp(6rem,14vw,13rem)] font-medium leading-none" aria-hidden="true">
      <m.div animate={{ y: `-${active * 100}%` }} transition={{ duration: 0.8, ease: easeBrand }}>
        {process.steps.map((_, i) => (
          <div key={i} className="text-outline h-[1em] [-webkit-text-stroke-color:rgba(0,194,255,0.6)]">
            {pad(i + 1)}
          </div>
        ))}
      </m.div>
    </div>
  )
}

function Step({
  index,
  title,
  text,
  active,
  onActive,
}: {
  index: number
  title: string
  text: string
  active: boolean
  onActive: (i: number) => void
}) {
  return (
    <m.li
      className="relative py-12 sm:py-16 sm:pl-12"
      onViewportEnter={() => onActive(index)}
      viewport={{ margin: '-45% 0px -45% 0px' }}
    >
      <span
        className={`absolute -left-[6px] top-[4.4rem] hidden h-3 w-3 rounded-full ring-4 ring-navy-950 transition-colors duration-500 sm:block ${
          active ? 'bg-cyan shadow-[0_0_20px_rgba(0,194,255,0.8)]' : 'bg-navy-700'
        }`}
        aria-hidden="true"
      />
      <FadeIn>
        <p className={`font-mono text-sm transition-colors duration-500 ${active ? 'text-cyan' : 'text-ink-faint'}`}>
          {pad(index + 1)} / {pad(process.steps.length)}
        </p>
        <h3
          className={`mt-3 text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-tight tracking-tight transition-colors duration-500 ${
            active ? 'text-ink' : 'text-ink/45'
          }`}
        >
          {title}
        </h3>
        <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-ink-muted">{text}</p>
      </FadeIn>
    </m.li>
  )
}

export function Process() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 55%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section id="proces" aria-labelledby="proces-title" className="relative py-24 sm:py-32 lg:py-40">
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <FadeIn>
            <p className="eyebrow">{process.eyebrow}</p>
          </FadeIn>
          <RevealText id="proces-title" lines={[process.title]} className="mt-4 text-h2 font-bold" />
          <div className="mt-10 hidden lg:block">
            <BigCounter active={active} />
          </div>
        </div>

        <ol ref={listRef} className="relative sm:border-l sm:border-line">
          {!reduced && (
            <m.span
              className="absolute -left-px top-0 hidden h-full w-px origin-top bg-gradient-to-b from-cyan to-cyan/40 sm:block"
              style={{ scaleY: progress }}
              aria-hidden="true"
            />
          )}
          {process.steps.map((step, i) => (
            <Step
              key={step.title}
              index={i}
              title={step.title}
              text={step.text}
              active={active === i || reduced}
              onActive={setActive}
            />
          ))}
        </ol>
      </div>
    </section>
  )
}
