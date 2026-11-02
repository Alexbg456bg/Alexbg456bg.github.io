import { Bracket } from '../components/brand/Logo'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ServiceIcon } from '../components/ui/ServiceIcon'
import { about } from '../content'

/** The two people behind the studio, framed by the logo's brackets, and what working with them means. */
export function About() {
  return (
    <section id="za-nas" aria-labelledby="za-nas-title" className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
        <div className="relative order-2 lg:order-1">
          <Bracket side="left" strokeWidth={18} className="absolute left-0 top-1/2 hidden h-2/5 w-auto -translate-y-1/2 text-cyan/60 sm:block" />
          <Bracket side="right" strokeWidth={18} className="absolute right-0 top-1/2 hidden h-2/5 w-auto -translate-y-1/2 text-cyan/60 sm:block" />
          <ul className="grid grid-cols-2 gap-4 sm:mx-12 sm:gap-5">
            {about.people.map((person, i) => (
              <li key={person.name} className={i === 1 ? 'sm:mt-12' : ''}>
                <FadeIn delay={i * 0.1}>
                  <figure>
                    <div className="glass-border overflow-hidden rounded-card bg-navy-850">
                      <img
                        src={person.photo}
                        width={640}
                        height={800}
                        alt={person.alt}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/5] h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="mt-3 font-semibold">{person.name}</figcaption>
                  </figure>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeader as="h1" id="za-nas-title" eyebrow={about.eyebrow} title={about.title} intro={about.intro} />
          <ul className="mt-8 grid gap-3">
            {about.points.map((point, i) => (
              <li key={point.title}>
                <FadeIn delay={0.15 + i * 0.08}>
                  <div className="glass-border flex items-start gap-4 rounded-2xl bg-navy-850/50 p-5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan ring-1 ring-inset ring-cyan/20">
                      <ServiceIcon name={point.icon} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold">{point.title}</span>
                      <span className="mt-1 block text-ink-muted">{point.text}</span>
                    </span>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
