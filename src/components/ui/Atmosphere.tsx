import type { CSSProperties, ReactNode } from 'react'

/**
 * Static gradient mesh behind the whole page: navy and cyan only, very low contrast,
 * plus a faint grid. Painted once; nothing animates.
 */
export function GradientMesh() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_0%,rgba(0,194,255,0.10),transparent_70%),radial-gradient(50%_60%_at_100%_30%,rgba(27,58,102,0.55),transparent_70%),radial-gradient(60%_50%_at_30%_100%,rgba(19,45,84,0.6),transparent_70%)]" />
      <div className="absolute inset-0 hidden bg-[linear-gradient(rgba(163,181,202,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(163,181,202,0.035)_1px,transparent_1px)] bg-[size:96px_96px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)] lg:block" />
    </div>
  )
}

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Fine film grain over the whole page. Desktop only: blending a fixed layer is costly on phones. */
export function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] hidden opacity-[0.06] mix-blend-soft-light lg:block"
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
