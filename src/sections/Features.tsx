import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ServiceIcon } from '../components/ui/ServiceIcon'
import { features } from '../content'

/** "Защо нас": four cards with what every site includes. */
export function Features() {
  return (
    <section id="predimstva" aria-labelledby="predimstva-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader id="predimstva-title" eyebrow={features.eyebrow} title={features.title} intro={features.intro} split />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {features.items.map((item, i) => (
            <li key={item.title} className="bg-navy-950">
              <FadeIn delay={i * 0.08} className="group flex h-full flex-col p-7 transition-colors duration-500 hover:bg-navy-900 sm:p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 text-cyan ring-1 ring-inset ring-cyan/20 transition-colors duration-500 group-hover:bg-cyan group-hover:text-navy-950">
                  <ServiceIcon name={item.icon} className="h-6 w-6" />
                </span>
                <p className="mt-8 font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-pretty leading-relaxed text-ink-muted">{item.text}</p>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
