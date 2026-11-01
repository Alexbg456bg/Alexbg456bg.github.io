import { m } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { useReducedMotion } from '../../lib/media'
import { easeBrand } from '../../lib/motion'

type Props = {
  /** One string per visual line. */
  lines: string[]
  as?: ElementType
  id?: string
  className?: string
  lineClassName?: (index: number) => string
  delay?: number
  /** When given, animates once `play` turns true instead of on scroll into view. */
  play?: boolean
  stagger?: number
}

/**
 * Word-by-word reveal: each word slides up from behind a mask.
 * Screen readers get the plain text once; the animated words are aria-hidden.
 */
export function RevealText({
  lines,
  as: Tag = 'h2',
  id,
  className = '',
  lineClassName,
  delay = 0,
  play,
  stagger = 0.06,
}: Props) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName?.(i) ?? ''}`}>
            {line}
          </span>
        ))}
      </Tag>
    )
  }

  const trigger =
    play === undefined
      ? { initial: 'hidden', whileInView: 'shown', viewport: { once: true, margin: '0px 0px -12% 0px' } }
      : { initial: 'hidden', animate: play ? 'shown' : 'hidden' }

  let wordIndex = 0
  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{lines.join(' ')}</span>
      <m.span aria-hidden="true" className="block" {...trigger}>
        {lines.map((line, li) => {
          const words = line.split(' ')
          return (
            <span key={li} className={`block ${lineClassName?.(li) ?? ''}`}>
              {words.map((word, wi) => {
                const i = wordIndex++
                return (
                  <span key={wi} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                    <m.span
                      className="inline-block"
                      variants={{
                        hidden: { y: '115%' },
                        shown: { y: '0%', transition: { duration: 0.9, ease: easeBrand, delay: delay + i * stagger } },
                      }}
                    >
                      {word}
                    </m.span>
                    {wi < words.length - 1 ? ' ' : null}
                  </span>
                )
              })}
            </span>
          )
        })}
      </m.span>
    </Tag>
  )
}

/** Fade-and-rise for paragraphs and blocks. */
export function FadeIn({
  children,
  className = '',
  delay = 0,
  y = 24,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: easeBrand, delay }}
    >
      {children}
    </m.div>
  )
}
