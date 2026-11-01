import { Bracket } from '../components/brand/Logo'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { about } from '../content'

/** The two people behind the studio, framed by the logo's brackets. */
export function About() {
  return (
    <section id="za-nas" aria-labelledby="za-nas-title" className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
        <div className="relative order-2 lg:order-1">
          <Bracket side="left" strokeWidth={28} className="absolute -left-1 top-1/2 hidden h-1/2 w-auto -translate-y-1/2 text-cyan/50 sm:block" />
          <Bracket side="right" strokeWidth={28} className="absolute -right-1 top-1/2 hidden h-1/2 w-auto -translate-y-1/2 text-cyan/50 sm:block" />
          <ul className="grid grid-cols-2 gap-4 sm:mx-14 sm:gap-5">
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
          <SectionHeader id="za-nas-title" eyebrow={about.eyebrow} title={about.title} />
          <FadeIn delay={0.2}>
            <ul className="mt-8 space-y-4 text-lg text-ink-muted">
              {about.text.map((t) => (
                <li key={t} className="text-pretty">
                  {t}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
