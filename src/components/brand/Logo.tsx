import { useId } from 'react'

// Geometry traced from assets/logo-source.png (see assets/logo.svg).
// Two rings of radius 176 share one vertical; every stroke is 76 units wide.
// The ~30-unit gaps where "a" and "e" cross are transparent masks, so the mark
// works on any background.

export const LOGO_VIEWBOX = '0 0 1240 700'
const STROKE = 76

const PATHS = {
  bracketL: 'M275 48L46 350L275 652',
  bracketR: 'M965 48L1194 350L965 652',
  // "a": starts at the shared vertical and runs counter-clockwise, like a pen would.
  aRing: 'M620 350A176 176 0 1 0 268 350A176 176 0 1 0 620 350',
  aStem: 'M620 350V564',
  eLower: 'M620 344V350A176 176 0 0 0 796 526A176 176 0 0 0 961.4 410.2',
  eUpper: 'M651.8 249.1A176 176 0 0 1 963.4 404.4',
  eBar: 'M972 350H650',
} as const

type Ink = 'navy' | 'white'

const INK: Record<Ink, string> = { navy: '#0B1F3A', white: '#FFFFFF' }
const CYAN = '#00C2FF'

type LogoProps = {
  className?: string
  /** Colour of the "a" and the lower half of "e". Use 'white' on dark backgrounds. */
  ink?: Ink
  /**
   * Draw the strokes in with a CSS animation (~1.2 s). Pure CSS, so it also runs in the
   * prerendered preloader before any JavaScript loads. Styles: `.ae-draw` in index.html.
   */
  draw?: boolean
  /** Accessible name. Pass null when the logo sits inside a labelled link. */
  title?: string | null
}

// [start, duration] in seconds. The whole draw takes ~1.2 s.
const TIMELINE: Record<keyof typeof PATHS, [number, number]> = {
  bracketL: [0, 0.6],
  bracketR: [0.05, 0.6],
  aRing: [0.15, 0.6],
  aStem: [0.6, 0.2],
  eLower: [0.7, 0.35],
  eUpper: [0.8, 0.35],
  eBar: [0.95, 0.25],
}

export function Logo({ className, ink = 'navy', draw = false, title = 'aecodezonebg' }: LogoProps) {
  const uid = useId().replace(/:/g, '')
  const ids = {
    aGap: `ae-a-gap-${uid}`,
    eGap: `ae-e-gap-${uid}`,
    eTop: `ae-e-top-${uid}`,
    eBottom: `ae-e-bottom-${uid}`,
  }
  const inkColor = INK[ink]

  const stroke = (key: keyof typeof PATHS) => {
    if (!draw) return { d: PATHS[key] }
    const [start, duration] = TIMELINE[key]
    return {
      d: PATHS[key],
      pathLength: 1,
      className: 'ae-draw',
      style: { animationDelay: `${start}s`, animationDuration: `${duration}s` },
    }
  }

  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <mask id={ids.aGap} maskUnits="userSpaceOnUse" x="0" y="0" width="1240" height="700">
          <rect width="1240" height="700" fill="#fff" />
          <path d="M552 350A244 244 0 0 0 1040 350Z" fill="#000" />
        </mask>
        <mask id={ids.eGap} maskUnits="userSpaceOnUse" x="0" y="0" width="1240" height="700">
          <rect width="1240" height="700" fill="#fff" />
          <circle cx="444" cy="350" r="244" fill="#000" />
        </mask>
        <clipPath id={ids.eTop}>
          <rect width="1240" height="388" />
        </clipPath>
        <clipPath id={ids.eBottom}>
          <path d="M0 344H796V441H1240V700H0Z" />
        </clipPath>
      </defs>
      <g fill="none" strokeWidth={STROKE}>
        <g stroke={CYAN} strokeLinecap="round" strokeLinejoin="round">
          <path {...stroke('bracketL')} />
          <path {...stroke('bracketR')} />
        </g>
        <g stroke={inkColor} mask={`url(#${ids.aGap})`}>
          <path {...stroke('aRing')} />
          <path {...stroke('aStem')} />
        </g>
        <path stroke={inkColor} clipPath={`url(#${ids.eBottom})`} {...stroke('eLower')} />
        <g stroke={CYAN} mask={`url(#${ids.eGap})`} clipPath={`url(#${ids.eTop})`}>
          <path {...stroke('eUpper')} />
          <path {...stroke('eBar')} />
        </g>
      </g>
    </svg>
  )
}

/** A single "<" or ">" in the logo's proportions, for frames and decorations. */
export function Bracket({
  side,
  className,
  strokeWidth = STROKE,
}: {
  side: 'left' | 'right'
  className?: string
  strokeWidth?: number
}) {
  // Bounding box of one bracket including its round caps.
  const pad = strokeWidth / 2
  const d = side === 'left' ? 'M229 0L0 302L229 604' : 'M0 0L229 302L0 604'
  return (
    <svg
      viewBox={`${-pad} ${-pad} ${229 + strokeWidth} ${604 + strokeWidth}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
