import type { CSSProperties, ReactNode } from 'react'

/** Slow-moving cyan/navy glow. Radial gradients (no blur filter), animated with transform only. */
export function Aurora({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="animate-aurora-1 absolute -left-[20%] -top-[30%] h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(circle,rgba(0,194,255,0.16),transparent_60%)]" />
      <div className="animate-aurora-2 absolute -right-[25%] top-[10%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(27,58,102,0.75),transparent_62%)]" />
      <div className="animate-aurora-3 absolute bottom-[-40%] left-[20%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(0,194,255,0.08),transparent_60%)]" />
    </div>
  )
}

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Fine film grain over the whole page; static, so it costs nothing after first paint. */
export function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.06] mix-blend-soft-light"
      style={{ backgroundImage: NOISE }}
      aria-hidden="true"
    />
  )
}

/** Endless horizontal strip. Content is duplicated once so the loop is seamless. Decorative. */
export function Marquee({
  items,
  className = '',
  itemClassName = '',
  separator,
  reverse = false,
  duration = 38,
}: {
  items: string[]
  className?: string
  itemClassName?: string
  separator?: ReactNode
  reverse?: boolean
  duration?: number
}) {
  const row = (copy: number) =>
    items.map((item, i) => (
      <span key={`${copy}-${i}`} className="flex shrink-0 items-center">
        <span className={itemClassName}>{item}</span>
        {separator}
      </span>
    ))
  return (
    <div className={`flex overflow-hidden ${className}`} aria-hidden="true">
      <div
        className={`flex w-max shrink-0 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        {row(0)}
        {row(1)}
      </div>
    </div>
  )
}

/** The ✦-style separator, drawn as the logo's two brackets. */
export function BracketSeparator({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={`mx-[0.6em] h-[0.5em] w-auto shrink-0 text-cyan ${className}`} aria-hidden="true">
      <path
        d="M14 3L4 12l10 9M26 3l10 9-10 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
