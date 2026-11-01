import { FadeIn, RevealText } from './RevealText'

type Props = {
  id: string
  eyebrow: string
  title: string
  intro?: string
  className?: string
}

export function SectionHeader({ id, eyebrow, title, intro, className = '' }: Props) {
  return (
    <div className={className}>
      <FadeIn>
        <p className="eyebrow">{eyebrow}</p>
      </FadeIn>
      <RevealText id={id} lines={[title]} className="mt-4 text-h2 font-bold" />
      {intro && (
        <FadeIn delay={0.15}>
          <p className="mt-5 max-w-md text-pretty text-ink-muted sm:text-lg">{intro}</p>
        </FadeIn>
      )}
    </div>
  )
}
