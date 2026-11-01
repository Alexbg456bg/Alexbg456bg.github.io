import { FadeIn } from '../components/ui/RevealText'
import { ParallaxBracket } from '../components/ui/ParallaxBracket'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ServiceIcon } from '../components/ui/ServiceIcon'
import { TiltCard } from '../components/ui/TiltCard'
import { services } from '../content'

export function Services() {
  return (
    <section id="uslugi" aria-labelledby="uslugi-title" className="relative py-24 sm:py-32 lg:py-40">
      <ParallaxBracket side="left" className="-left-24 top-24 hidden h-[34rem] lg:block" />

      <div className="container-x relative grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <SectionHeader
          id="uslugi-title"
          eyebrow={services.eyebrow}
          title={services.title}
          intro={services.intro}
          className="lg:sticky lg:top-32 lg:self-start"
        />

        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {services.items.map((item, i) => (
            <li key={item.title}>
              <FadeIn delay={(i % 2) * 0.1} className="h-full">
                <TiltCard className="flex flex-col p-7 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/10 text-cyan ring-1 ring-inset ring-cyan/20">
                      <ServiceIcon name={item.icon} className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="mt-10 text-h3 font-semibold">{item.title}</h3>
                  <p className="mt-3 text-pretty text-[0.95rem] leading-relaxed text-ink-muted">{item.text}</p>
                </TiltCard>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
