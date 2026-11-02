import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/ui/MagneticButton'
import { projectImage } from '../components/ui/ProjectShot'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { portfolio, teaser } from '../content'

/** Home page: the four live sites as cards; each opens its case study, the link opens /proekti. */
export function ProjectsTeaser() {
  return (
    <section aria-labelledby="teaser-title" className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader id="teaser-title" eyebrow={teaser.eyebrow} title={teaser.title} />
          <Link to="/proekti" className="group inline-flex items-center gap-2 font-semibold text-cyan">
            {teaser.cta}
            <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2">
          {portfolio.items.map((p, i) => (
            <li key={p.slug}>
              <FadeIn delay={(i % 2) * 0.08}>
                <Link to={`/proekti/${p.slug}`} className="group block">
                  <span className="glass-border block overflow-hidden rounded-2xl bg-navy-850">
                    <img
                      src={projectImage(p, 'desktop', 960)}
                      width={960}
                      height={600}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
                    />
                  </span>
                  <span className="mt-4 flex items-baseline justify-between gap-4">
                    <span className="text-xl font-semibold tracking-tight transition-colors group-hover:text-cyan">{p.title}</span>
                    <span className="shrink-0 text-sm text-ink-muted">{p.category}</span>
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
