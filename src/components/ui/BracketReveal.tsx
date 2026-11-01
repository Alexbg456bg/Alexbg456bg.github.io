import { m } from 'framer-motion'
import type { ReactNode } from 'react'
import { Bracket } from '../brand/Logo'
import { useReducedMotion } from '../../lib/media'
import { easeBrand } from '../../lib/motion'

const open = { duration: 1.1, ease: easeBrand, delay: 0.1 }

/**
 * The site-wide section transition: two curtains meet in the middle as "< >",
 * then slide apart and reveal what is behind them. Transform only.
 * Without JS the curtains are hidden by a <noscript> rule in index.html.
 */
export function BracketReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <m.div
      className={`relative overflow-hidden ${className}`}
      initial="closed"
      whileInView="open"
      viewport={{ once: true, amount: 0.4 }}
    >
      {children}
      {!reduced && (
        <>
          <m.div
            className="bracket-cover pointer-events-none absolute inset-y-0 left-0 right-1/2 bg-navy-950"
            variants={{ closed: { x: '0%' }, open: { x: '-102%', transition: open } }}
            aria-hidden="true"
          >
            <Bracket side="left" strokeWidth={60} className="absolute right-2 top-1/2 h-14 w-auto -translate-y-1/2 text-cyan" />
          </m.div>
          <m.div
            className="bracket-cover pointer-events-none absolute inset-y-0 left-1/2 right-0 bg-navy-950"
            variants={{ closed: { x: '0%' }, open: { x: '102%', transition: open } }}
            aria-hidden="true"
          >
            <Bracket side="right" strokeWidth={60} className="absolute left-2 top-1/2 h-14 w-auto -translate-y-1/2 text-cyan" />
          </m.div>
        </>
      )}
    </m.div>
  )
}
