import { BracketSeparator, Marquee } from '../components/ui/Atmosphere'
import { strip } from '../content'

/** Two endless strips of what we do, moving in opposite directions, slightly tilted. Decorative. */
export function ServiceStrip() {
  return (
    <div className="relative overflow-hidden py-6 sm:py-10" aria-hidden="true">
      <div className="-mx-4 -rotate-[1.5deg] border-y border-line bg-navy-900/70 py-4 backdrop-blur-sm sm:py-5">
        <Marquee
          items={strip}
          separator={<BracketSeparator />}
          itemClassName="whitespace-nowrap text-2xl font-bold tracking-tight sm:text-4xl"
          duration={42}
        />
      </div>
      <div className="-mx-4 mt-3 rotate-[1deg] py-2">
        <Marquee
          items={strip}
          reverse
          separator={<BracketSeparator className="opacity-60" />}
          itemClassName="text-outline whitespace-nowrap text-2xl font-bold tracking-tight sm:text-4xl"
          duration={50}
        />
      </div>
    </div>
  )
}
