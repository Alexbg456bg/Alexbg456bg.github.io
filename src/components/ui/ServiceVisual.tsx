import type { CSSProperties } from 'react'
import type { ServiceIcon } from '../../content'

// Small looping illustrations for the service cards. Decorative; CSS keyframes on transform/opacity only.

const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` })

function Catalog() {
  return (
    <div className="grid h-full grid-cols-3 gap-2.5 p-6">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="animate-build flex flex-col gap-1.5 rounded-xl bg-navy-700/60 p-2" style={delay(i * 0.18)}>
          <div className={`flex-1 rounded-lg ${i === 1 || i === 5 ? 'bg-cyan/70' : 'bg-ink/10'}`} />
          <div className="h-1.5 w-3/4 rounded-full bg-ink/25" />
          <div className="h-1.5 w-1/2 rounded-full bg-ink/15" />
        </div>
      ))}
    </div>
  )
}

function Business() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-[22rem] overflow-hidden rounded-xl border border-line bg-navy-950/70">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-ink/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/25" />
          <span className="ml-auto h-1.5 w-16 rounded-full bg-ink/15" />
        </div>
        <div className="space-y-2.5 p-4">
          <div className="animate-build h-3 w-2/3 rounded-full bg-ink/70" style={delay(0)} />
          <div className="animate-build h-2 w-5/6 rounded-full bg-ink/25" style={delay(0.25)} />
          <div className="animate-build h-6 w-24 rounded-full bg-cyan" style={delay(0.5)} />
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-build h-12 rounded-lg bg-navy-700/80" style={delay(0.75 + i * 0.15)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Cms() {
  return (
    <div className="flex h-full items-center gap-4 p-6">
      <div className="flex-1 space-y-4 rounded-xl border border-line bg-navy-950/70 p-4">
        <div className="flex items-center justify-between">
          <span className="h-1.5 w-14 rounded-full bg-ink/30" />
          <span className="relative h-5 w-9 rounded-full bg-navy-700">
            <span className="absolute inset-0.5 w-4">
              <span className="animate-toggle block h-4 w-4 rounded-full bg-cyan" />
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="h-1.5 w-10 rounded-full bg-ink/30" />
          <span className="relative h-1 w-24 rounded-full bg-navy-700" style={{ '--knob-travel': '80px' } as CSSProperties}>
            <span className="animate-slide-knob absolute -top-1.5 left-0 h-4 w-4 rounded-full border-2 border-cyan bg-navy-950" />
          </span>
        </div>
        <div className="h-1.5 w-20 rounded-full bg-ink/15" />
      </div>
      <div className="relative flex-1 rounded-xl border border-line bg-navy-950/70 p-4">
        <div className="relative h-3">
          <span className="animate-swap-a absolute inset-y-0 left-0 w-4/5 rounded-full bg-ink/70" />
          <span className="animate-swap-b absolute inset-y-0 left-0 w-3/5 rounded-full bg-cyan" />
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-ink/20" />
          <div className="h-1.5 w-4/5 rounded-full bg-ink/20" />
        </div>
      </div>
    </div>
  )
}

function Hosting() {
  return (
    <div className="relative flex h-full items-center justify-center">
      {[0, 0.85, 1.7].map((d) => (
        <span
          key={d}
          className="animate-pulse-ring absolute h-32 w-32 rounded-full border border-cyan/50"
          style={delay(d)}
          aria-hidden="true"
        />
      ))}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan/40 bg-navy-950 shadow-[0_0_60px_-10px_rgba(0,194,255,0.6)]">
        <svg viewBox="0 0 24 24" className="h-9 w-9 text-cyan" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="6" rx="1.5" />
            <rect x="4" y="14" width="16" height="6" rx="1.5" />
            <path d="M8 7h.01M8 17h.01" />
          </g>
        </svg>
      </div>
    </div>
  )
}

const VISUALS: Record<ServiceIcon, () => JSX.Element> = {
  catalog: Catalog,
  business: Business,
  cms: Cms,
  hosting: Hosting,
}

export function ServiceVisual({ name }: { name: ServiceIcon }) {
  const Visual = VISUALS[name]
  return (
    <div className="dot-grid relative h-48 overflow-hidden rounded-2xl border border-line bg-navy-900/60 sm:h-56" aria-hidden="true">
      <Visual />
    </div>
  )
}
