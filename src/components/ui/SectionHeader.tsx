import { BracketReveal } from './BracketReveal'
import { FadeIn, RevealText } from './RevealText'

type Props = {
  id: string
  eyebrow: string
  title: string
  intro?: string
  className?: string
  /** Puts the intro next to the title on large screens. */
  split?: boolean
  /** h1 when the section opens its own page. */
  as?: 'h1' | 'h2'
}

/** Section opening: the curtains part as "< >", then eyebrow, title and intro rise in. */
export function SectionHeader({ id, eyebrow, title, intro, className = '', split = false, as = 'h2' }: Props) {
  return (
    <BracketReveal className={`-mx-4 px-4 py-2 ${className}`}>
      <div className={split ? 'grid items-end gap-6 lg:grid-cols-2 lg:gap-12' : ''}>
        <div>
          <FadeIn>
            <p className="eyebrow">{eyebrow}</p>
          </FadeIn>
          <RevealText as={as} id={id} lines={[title]} className="mt-4 text-h2 font-bold" delay={0.35} />
        </div>
        {intro && (
          <FadeIn delay={0.5}>
            <p className={`max-w-md text-pretty text-lg text-ink-muted ${split ? 'lg:ml-auto' : 'mt-5'}`}>{intro}</p>
          </FadeIn>
        )}
      </div>
    </BracketReveal>
  )
}
