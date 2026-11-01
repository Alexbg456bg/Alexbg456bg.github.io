import { AnimatePresence, m, useSpring } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Bracket, Logo } from '../brand/Logo'
import { ServiceIcon } from './ServiceIcon'
import { hero, type BuildPart, type CodeToken } from '../../content'
import { useFinePointer, useMinWidth, useReducedMotion } from '../../lib/media'
import { easeBrand } from '../../lib/motion'

const scene = hero.scene
const CHAR_MS = 22
const LINE_PAUSE_MS = 260

const TOKEN_CLASS: Record<CodeToken['c'], string> = {
  kw: 'text-cyan',
  fn: 'font-semibold text-ink',
  tag: 'text-cyan-soft',
  attr: 'text-ink-muted',
  str: 'text-cyan',
  p: 'text-ink-faint',
  txt: 'text-ink',
}

type Line = (typeof scene.code)[number]

/** Types the given lines one character at a time; returns how far it got. */
function useTypewriter(lines: Line[], play: boolean, instant: boolean) {
  const [pos, setPos] = useState({ line: 0, char: 0 })
  const lengths = useMemo(() => lines.map((l) => l.tokens.reduce((n, t) => n + t.t.length, 0)), [lines])

  useEffect(() => {
    if (instant) {
      setPos({ line: lines.length, char: 0 })
      return
    }
    if (!play) return
    let timer = 0
    let line = 0
    let char = 0
    const tick = () => {
      if (line >= lines.length) return
      if (char < lengths[line]) {
        char += 1
        setPos({ line, char })
        timer = window.setTimeout(tick, CHAR_MS)
      } else {
        line += 1
        char = 0
        setPos({ line, char })
        timer = window.setTimeout(tick, LINE_PAUSE_MS)
      }
    }
    timer = window.setTimeout(tick, 500)
    return () => window.clearTimeout(timer)
  }, [play, instant, lines, lengths])

  return pos
}

function CodeLine({ tokens, chars }: { tokens: CodeToken[]; chars: number }) {
  let left = chars
  return (
    <>
      {tokens.map((tok, i) => {
        if (left <= 0) return null
        const text = tok.t.slice(0, left)
        left -= tok.t.length
        return (
          <span key={i} className={TOKEN_CLASS[tok.c]}>
            {text}
          </span>
        )
      })}
    </>
  )
}

const rise = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: easeBrand } }

/** The page that "builds itself" from the code next to it. A mock-up, not a real client site. */
function Preview({ built }: { built: Set<BuildPart> }) {
  const has = (p: BuildPart) => built.has(p)
  return (
    <div className="glass-border flex h-full min-h-[17rem] flex-col overflow-hidden rounded-2xl bg-navy-850/80">
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-ink/20" />
          <span className="h-2 w-2 rounded-full bg-ink/20" />
          <span className="h-2 w-2 rounded-full bg-ink/20" />
        </span>
        <span className="mx-auto rounded-full bg-navy-950/70 px-4 py-1 font-mono text-[0.68rem] text-ink-muted">{scene.url}</span>
      </div>

      <div className="relative flex-1 p-4 sm:p-5">
        <AnimatePresence>
          {has('page') && (
            <m.div key="page" className="absolute inset-3 rounded-xl border border-dashed border-ink/10" {...rise} aria-hidden="true" />
          )}
        </AnimatePresence>
        <div className="relative flex h-full flex-col gap-4">
          <AnimatePresence>
            {has('header') && (
              <m.div key="header" className="flex items-center justify-between rounded-lg bg-navy-950/60 px-3 py-2" {...rise}>
                <span className="flex h-5 w-9 items-center">
                  {has('done') ? (
                    <Logo ink="white" draw title={null} className="h-5 w-auto" />
                  ) : (
                    <span className="h-1.5 w-8 rounded-full bg-ink/20" />
                  )}
                </span>
                <span className="flex gap-2" aria-hidden="true">
                  <span className="h-1.5 w-7 rounded-full bg-ink/25" />
                  <span className="h-1.5 w-7 rounded-full bg-ink/25" />
                  <span className="h-1.5 w-7 rounded-full bg-ink/25" />
                </span>
              </m.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {has('hero') && (
              <m.div key="hero" className="px-1 pt-2" {...rise}>
                <p className="text-[clamp(1.1rem,2.2vw,1.6rem)] font-bold leading-tight tracking-tight">{scene.preview.title}</p>
                <p className="mt-1.5 text-xs text-ink-muted sm:text-sm">{scene.preview.text}</p>
                <AnimatePresence>
                  {has('button') && (
                    <m.span
                      key="btn"
                      className="mt-3 inline-flex rounded-full bg-cyan px-4 py-1.5 text-xs font-semibold text-navy-950"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                    >
                      {scene.preview.button}
                    </m.span>
                  )}
                </AnimatePresence>
              </m.div>
            )}
          </AnimatePresence>

          <div className="mt-auto grid grid-cols-3 gap-2.5">
            {scene.preview.cards.map((label, i) => (
              <AnimatePresence key={i}>
                {has('cards') && (
                  <m.div
                    className="rounded-lg border border-line bg-navy-950/60 p-2.5"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: easeBrand, delay: i * 0.1 }}
                  >
                    <ServiceIcon name={(['catalog', 'business', 'hosting'] as const)[i]} className="h-4 w-4 text-cyan" />
                    <p className="mt-2 text-[0.7rem] font-semibold">{label}</p>
                    <span className="mt-1.5 block h-1 w-3/4 rounded-full bg-ink/15" aria-hidden="true" />
                  </m.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Signature moment 1 — "from code to site". The code on the left types itself and each
 * finished line builds part of the page on the right. When the last line lands, the
 * logo's brackets close around the scene and the logo draws in the page header.
 */
export function HeroScene({ play }: { play: boolean }) {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const wide = useMinWidth(640)
  const ref = useRef<HTMLDivElement>(null)

  // Phones get the short version: only the lines that build something visible.
  const lines = useMemo(
    () => (wide ? scene.code : scene.code.filter((l) => l.build && l.build !== 'page')),
    [wide],
  )
  const pos = useTypewriter(lines, play, reduced)
  const built = useMemo(() => {
    const s = new Set<BuildPart>(wide ? [] : ['page'])
    lines.slice(0, pos.line).forEach((l) => l.build && s.add(l.build))
    return s
  }, [lines, pos.line, wide])
  const done = built.has('done')

  // Gentle tilt toward the cursor (devices with a real pointer only).
  const rx = useSpring(0, { stiffness: 120, damping: 20 })
  const ry = useSpring(0, { stiffness: 120, damping: 20 })
  useEffect(() => {
    if (!fine || reduced) return
    const host = ref.current?.closest('section')
    if (!host) return
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      ry.set(((e.clientX - r.left) / r.width - 0.5) * 8)
      rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5)
    }
    const onLeave = () => {
      rx.set(0)
      ry.set(0)
    }
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [fine, reduced, rx, ry])

  const bracket = (dir: 1 | -1) => ({
    initial: reduced ? false : { opacity: 0, x: dir * 70 },
    animate: done ? { opacity: 1, x: 0 } : { opacity: 0, x: dir * 70 },
    transition: { duration: 0.9, ease: easeBrand },
  })

  return (
    <div ref={ref} className="relative mx-auto mt-14 w-full max-w-6xl text-left sm:mt-20 [perspective:1800px]" aria-hidden="true">
      <div className="pointer-events-none absolute -inset-x-[8%] -top-[10%] bottom-0 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,194,255,0.16),transparent_65%)]" />

      <div className="absolute inset-y-0 -left-2 hidden items-center md:flex lg:-left-16">
        <m.div className="text-cyan" {...bracket(-1)}>
          <Bracket side="left" className="h-[min(24rem,55vh)] w-auto" strokeWidth={56} />
        </m.div>
      </div>
      <div className="absolute inset-y-0 -right-2 hidden items-center md:flex lg:-right-16">
        <m.div className="text-cyan" {...bracket(1)}>
          <Bracket side="right" className="h-[min(24rem,55vh)] w-auto" strokeWidth={56} />
        </m.div>
      </div>

      <m.div
        style={{ rotateX: rx, rotateY: ry }}
        initial={reduced ? false : { opacity: 0, y: 40 }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, ease: easeBrand, delay: 0.3 }}
        className="relative grid gap-4 md:mx-12 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:mx-0"
      >
        <div className="glass-border overflow-hidden rounded-2xl bg-navy-950/85 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-cyan" />
            <span className="font-mono text-[0.7rem] text-ink-muted">{scene.file}</span>
          </div>
          <pre className="min-h-[9rem] overflow-hidden px-4 py-4 font-mono text-[0.62rem] leading-[1.95] sm:min-h-[17rem] sm:text-[0.8rem]">
            {lines.map((l, i) => {
              if (i > pos.line) return null
              const chars = i < pos.line ? Infinity : pos.char
              return (
                <div key={i} className="flex whitespace-pre">
                  <span className="mr-3 w-3 shrink-0 sm:mr-4 sm:w-4 select-none text-right text-ink-faint/50">{i + 1}</span>
                  <code>
                    <CodeLine tokens={l.tokens} chars={chars} />
                    {i === Math.min(pos.line, lines.length - 1) && !done && (
                      <span className="animate-blink ml-px inline-block h-[1.1em] w-[0.5em] translate-y-[0.2em] bg-cyan" />
                    )}
                  </code>
                </div>
              )
            })}
          </pre>
        </div>

        <div className="shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
          <Preview built={built} />
        </div>
      </m.div>
    </div>
  )
}
