import { m, useSpring } from 'framer-motion'
import { useRef, type MouseEvent, type ReactNode } from 'react'
import { useFinePointer, useReducedMotion } from '../../lib/media'

type Variant = 'primary' | 'ghost'

type Common = {
  children: ReactNode
  variant?: Variant
  className?: string
  /** How far (0–1) the button follows the cursor. */
  strength?: number
}

type Props = Common &
  (
    | {
        href: string
        target?: '_blank'
        onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
        type?: never
        disabled?: never
      }
    | { href?: never; target?: never; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }
  )

const base =
  'group relative inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-7 py-3 text-[0.95rem] font-semibold tracking-tight transition-colors duration-300 ease-brand disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-cyan text-navy-950 hover:bg-cyan-soft',
  ghost: 'text-ink ring-1 ring-inset ring-ink/25 hover:text-cyan hover:ring-cyan',
}

const spring = { stiffness: 260, damping: 18, mass: 0.6 }

export function MagneticButton({ children, variant = 'primary', className = '', strength = 0.35, ...rest }: Props) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const active = fine && !reduced
  const ref = useRef<HTMLElement | null>(null)

  const x = useSpring(0, spring)
  const y = useSpring(0, spring)
  const lx = useSpring(0, spring)
  const ly = useSpring(0, spring)

  const onMove = (e: MouseEvent) => {
    if (!active || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    x.set(dx * strength)
    y.set(dy * strength)
    lx.set(dx * strength * 0.35)
    ly.set(dy * strength * 0.35)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
    lx.set(0)
    ly.set(0)
  }

  const cls = `${base} ${variants[variant]} ${className}`
  const label = (
    <m.span className="relative z-10 inline-flex items-center gap-3" style={{ x: lx, y: ly }}>
      {children}
    </m.span>
  )

  if (rest.href !== undefined) {
    return (
      <m.a
        ref={(el: HTMLAnchorElement | null) => {
          ref.current = el
        }}
        href={rest.href}
        target={rest.target}
        rel={rest.target === '_blank' ? 'noopener' : undefined}
        onClick={rest.onClick}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ x, y }}
        className={cls}
      >
        {label}
      </m.a>
    )
  }

  return (
    <m.button
      ref={(el: HTMLButtonElement | null) => {
        ref.current = el
      }}
      type={rest.type ?? 'button'}
      disabled={rest.disabled}
      onClick={rest.onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className={cls}
    >
      {label}
    </m.button>
  )
}

export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} aria-hidden="true" focusable="false">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
