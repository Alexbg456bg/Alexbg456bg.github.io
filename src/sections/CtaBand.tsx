import { Bracket } from '../components/brand/Logo'
import { ArrowIcon, MagneticButton } from '../components/ui/MagneticButton'
import { FadeIn } from '../components/ui/RevealText'
import { cta } from '../content'
import { useGo } from '../lib/nav'

/** Closing call to action on pages that do not end with the contact form. */
export function CtaBand() {
  const go = useGo()
  return (
    <section aria-labelledby="cta-title" className="pb-16 sm:pb-24">
      <div className="container-x">
        <FadeIn>
          <div className="glass-border relative overflow-hidden rounded-card bg-gradient-to-br from-navy-800 via-navy-850 to-navy-950 px-6 py-10 sm:px-12 sm:py-14">
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="flex items-center gap-5">
                <span className="hidden items-center gap-1 text-cyan sm:flex">
                  <Bracket side="left" className="h-12 w-auto" />
                  <Bracket side="right" className="h-12 w-auto" />
                </span>
                <div>
                  <h2 id="cta-title" className="text-[clamp(1.6rem,3.2vw,2.5rem)] font-bold leading-tight tracking-tight">
                    {cta.title}
                  </h2>
                  <p className="mt-2 max-w-xl text-pretty text-lg text-ink-muted">{cta.text}</p>
                </div>
              </div>
              <MagneticButton href="/kontakt" onClick={go('/kontakt')} className="shrink-0">
                {cta.button}
                <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
              </MagneticButton>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
