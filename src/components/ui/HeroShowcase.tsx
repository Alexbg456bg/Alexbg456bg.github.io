import { AnimatePresence, m, useInView, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { hero, portfolio } from '../../content'
import { useReducedMotion } from '../../lib/media'
import { easeBrand } from '../../lib/motion'
import { projectImage } from './ProjectShot'

const CYCLE_MS = 4200

const CODE_COLORS: Record<string, string> = {
  b: 'text-cyan',
  tag: 'text-ink',
  attr: 'text-ink-muted',
  p: 'text-ink-faint',
  str: 'text-cyan-soft',
}

/** Code editor card: lines appear one by one, then a blinking caret. Purely illustrative. */
function CodeCard({ play }: { play: boolean }) {
  const reduced = useReducedMotion()
  return (
    <div className="glass-border overflow-hidden rounded-2xl bg-navy-950/85 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-cyan" />
        <span className="font-mono text-[0.7rem] text-ink-muted">{hero.showcase.file}</span>
      </div>
      <pre className="px-4 py-4 font-mono text-[0.72rem] leading-[1.9] sm:text-[0.78rem]">
        {hero.showcase.code.map((line, i) => (
          <m.div
            key={i}
            className="flex"
            initial={reduced ? false : { opacity: 0, x: -8 }}
            animate={play ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: easeBrand, delay: 0.6 + i * 0.22 }}
          >
            <span className="mr-4 w-3 select-none text-right text-ink-faint/60">{i + 1}</span>
            <code>
              {line.map((tok, j) => (
                <span key={j} className={CODE_COLORS[tok.c]}>
                  {tok.t}
                </span>
              ))}
              {i === hero.showcase.code.length - 1 && (
                <span className="animate-blink ml-0.5 inline-block h-[1.1em] w-[0.5em] translate-y-[0.2em] bg-cyan" />
              )}
            </code>
          </m.div>
        ))}
      </pre>
    </div>
  )
}

/**
 * The hero "product shot": a browser window cycling through the live projects,
 * tilting flat as you scroll, with a code editor and a phone floating around it.
 */
export function HeroShowcase({ play }: { play: boolean }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' })
  const [index, setIndex] = useState(0)
  const project = portfolio.items[index]

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [24, 0])
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.86, 1])
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [60, 0])

  useEffect(() => {
    if (reduced || !inView) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % portfolio.items.length), CYCLE_MS)
    return () => window.clearInterval(id)
  }, [reduced, inView])

  return (
    <div ref={ref} className="relative mx-auto mt-16 w-full max-w-6xl sm:mt-20 [perspective:1600px]">
      <div
        className="pointer-events-none absolute -inset-x-[10%] top-[8%] h-[80%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,194,255,0.22),transparent_65%)]"
        aria-hidden="true"
      />

      <m.div style={{ rotateX, scale, y }} className="relative origin-top">
        <m.div
          initial={reduced ? false : { opacity: 0, y: 60 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.2, ease: easeBrand, delay: 0.5 }}
          className="glass-border overflow-hidden rounded-2xl bg-navy-850 shadow-[0_60px_140px_-40px_rgba(0,0,0,0.9)] sm:rounded-3xl"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
            </span>
            <div className="relative mx-auto flex h-7 w-full max-w-sm items-center justify-center overflow-hidden rounded-full bg-navy-950/70 px-3">
              <AnimatePresence mode="popLayout" initial={false}>
                <m.span
                  key={project.host}
                  className="truncate font-mono text-[0.7rem] text-ink-muted"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.4, ease: easeBrand }}
                >
                  {project.host}
                </m.span>
              </AnimatePresence>
            </div>
            <span className="hidden items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-ring absolute inset-0 rounded-full bg-cyan" />
                <span className="relative h-2 w-2 rounded-full bg-cyan" />
              </span>
              {hero.showcase.live}
            </span>
          </div>

          <div className="relative aspect-[16/10] bg-navy-950">
            {portfolio.items.map((p, i) => (
              <m.img
                key={p.slug}
                src={projectImage(p, 'desktop', 960)}
                srcSet={`${projectImage(p, 'desktop', 960)} 960w, ${projectImage(p, 'desktop')} 1440w`}
                sizes="(min-width: 1200px) 1150px, 96vw"
                width={1440}
                height={900}
                alt={i === index ? p.alt : ''}
                aria-hidden={i === index ? undefined : true}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top"
                initial={false}
                animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.04 }}
                transition={{ duration: 0.9, ease: easeBrand }}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/60 to-transparent" aria-hidden="true" />
            {!reduced && (
              <div className="absolute inset-x-4 bottom-4 flex gap-2 sm:inset-x-6 sm:bottom-5" aria-hidden="true">
                {portfolio.items.map((p, i) => (
                  <span key={p.slug} className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/20">
                    <m.span
                      key={i === index ? `on-${index}` : 'off'}
                      className="block h-full origin-left bg-cyan"
                      initial={{ scaleX: i < index ? 1 : 0 }}
                      animate={{ scaleX: i <= index ? 1 : 0 }}
                      transition={i === index ? { duration: CYCLE_MS / 1000, ease: 'linear' } : { duration: 0 }}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>
        </m.div>

        <m.div
          className="absolute -bottom-10 -left-4 hidden w-[19rem] md:block lg:-left-14 lg:w-[22rem]"
          initial={reduced ? false : { opacity: 0, x: -40 }}
          animate={play ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 1, ease: easeBrand, delay: 0.9 }}
        >
          <div className="animate-float">
            <CodeCard play={play} />
          </div>
        </m.div>

        <m.div
          className="absolute -bottom-14 -right-2 w-[24%] max-w-[11rem] sm:-right-6 lg:-right-12"
          initial={reduced ? false : { opacity: 0, y: 40 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: easeBrand, delay: 1.05 }}
        >
          <div className="animate-float [animation-delay:-3s]">
            <div className="relative aspect-[9/19] overflow-hidden rounded-[1.4rem] border-[5px] border-navy-700 bg-navy-950 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] sm:rounded-[1.8rem]">
              {portfolio.items.map((p, i) => (
                <m.img
                  key={p.slug}
                  src={projectImage(p, 'mobile')}
                  width={600}
                  height={1299}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  initial={false}
                  animate={{ opacity: i === index ? 1 : 0 }}
                  transition={{ duration: 0.9, ease: easeBrand, delay: 0.15 }}
                />
              ))}
            </div>
          </div>
        </m.div>
      </m.div>
    </div>
  )
}
