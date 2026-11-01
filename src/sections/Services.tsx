import { FadeIn, RevealText } from '../components/ui/RevealText'
import { ParallaxBracket } from '../components/ui/ParallaxBracket'
import { ServiceIcon } from '../components/ui/ServiceIcon'
import { ServiceVisual } from '../components/ui/ServiceVisual'
import { TiltCard } from '../components/ui/TiltCard'
import { services } from '../content'

// Bento layout: wide/narrow cards alternate per row on large screens.
const SPANS = ['lg:col-span-5', 'lg:col-span-7', 'lg:col-span-7', 'lg:col-span-5']

export function Services() {
  return (
    <section id="uslugi" aria-labelledby="uslugi-title" className="relative py-24 sm:py-32 lg:py-40">
      <ParallaxBracket side="left" className="-left-24 top-24 hidden h-[34rem] lg:block" />

      <div className="container-x relative">
        <div className="grid items-end gap-8 lg:grid-cols-2">
          <div>
            <FadeIn>
              <p className="eyebrow">{services.eyebrow}</p>
            </FadeIn>
            <RevealText id="uslugi-title" lines={[services.title]} className="mt-4 text-h2 font-bold" />
          </div>
          <FadeIn delay={0.15}>
            <p className="max-w-md text-pretty text-ink-muted sm:text-lg lg:ml-auto">{services.intro}</p>
          </FadeIn>
        </div>

        <ul className="mt-14 grid gap-4 sm:mt-20 sm:gap-5 lg:grid-cols-12">
          {services.items.map((item, i) => (
            <li key={item.title} className={SPANS[i]}>
              <FadeIn delay={(i % 2) * 0.1} className="h-full">
                <TiltCard className="flex h-full flex-col p-3 sm:p-4">
                  <ServiceVisual name={item.icon} />
                  <div className="flex flex-1 flex-col px-3 pb-4 pt-6 sm:px-4 sm:pb-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan ring-1 ring-inset ring-cyan/20">
                          <ServiceIcon name={item.icon} className="h-5 w-5" />
                        </span>
                        <h3 className="text-h3 font-semibold">{item.title}</h3>
                      </span>
                      <span className="hidden font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint sm:block">
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-4 max-w-lg text-pretty leading-relaxed text-ink-muted">{item.text}</p>
                  </div>
                </TiltCard>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
