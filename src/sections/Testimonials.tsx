import { Link } from 'react-router-dom'
import { Bracket } from '../components/brand/Logo'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { testimonials as t } from '../content'

/** Home page: real client quotes. Renders nothing until the team adds approved quotes. */
export function Testimonials() {
  if (t.items.length === 0) return null

  return (
    <section aria-labelledby="otzivi-title" className="section">
      <div className="container-x">
        <SectionHeader id="otzivi-title" eyebrow={t.eyebrow} title={t.title} />
        <ul className={`mt-10 grid gap-4 sm:mt-14 ${t.items.length > 1 ? 'md:grid-cols-2' : ''}`}>
          {t.items.map((item, i) => (
            <li key={item.name}>
              <FadeIn delay={(i % 2) * 0.08} className="h-full">
                <figure className="glass-border flex h-full flex-col rounded-card bg-navy-850/50 p-7 sm:p-10">
                  <span className="flex items-center gap-1 text-cyan/70" aria-hidden="true">
                    <Bracket side="left" strokeWidth={60} className="h-6 w-auto" />
                    <Bracket side="right" strokeWidth={60} className="h-6 w-auto" />
                  </span>
                  <blockquote className="mt-6 flex-1 text-pretty text-lg leading-relaxed sm:text-xl">„{item.quote}“</blockquote>
                  <figcaption className="mt-8 border-t border-line pt-5">
                    <span className="block font-semibold">{item.name}</span>
                    <span className="block text-sm text-ink-muted">
                      {item.role},{' '}
                      {item.slug ? (
                        <Link to={`/proekti/${item.slug}`} className="text-cyan hover:underline">
                          {item.company}
                        </Link>
                      ) : (
                        item.company
                      )}
                    </span>
                  </figcaption>
                </figure>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
