import type { MouseEvent } from 'react'
import { Logo } from '../components/brand/Logo'
import { ArrowIcon } from '../components/ui/MagneticButton'
import { siteConfig } from '../config'
import { footer, nav, tech, ui } from '../content'
import { useSmoothScroll } from '../lib/smooth-scroll'

export function Footer() {
  const scroll = useSmoothScroll()
  const { email, phone } = siteConfig.contact
  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scroll.scrollTo(id)
  }
  const heading = 'font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink-faint'
  const link = 'text-sm text-ink-muted transition-colors hover:text-cyan'

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,2fr)_minmax(0,3fr)_minmax(0,3fr)] lg:gap-10">
        <div className="flex flex-col gap-5">
          <a href="#top" onClick={go('top')} aria-label={ui.home} className="-m-2 w-fit rounded-lg p-2">
            <Logo ink="white" title={null} className="h-12 w-auto" />
          </a>
          <p className="max-w-xs text-pretty text-sm leading-relaxed text-ink-muted">{footer.tagline}</p>
          <p className="font-mono text-xs text-ink-faint">
            <span className="sr-only">{footer.techLabel}: </span>
            {tech.join(' · ')}
          </p>
        </div>

        <nav aria-label={ui.footerNav}>
          <p className={heading}>{footer.navTitle}</p>
          <ul className="mt-5 grid gap-3">
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={go(item.id)} className={link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={heading}>{footer.servicesTitle}</p>
          <ul className="mt-5 grid gap-3">
            {footer.services.map((s) => (
              <li key={s}>
                <a href="#uslugi" onClick={go('uslugi')} className={link}>
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={heading}>{footer.contactTitle}</p>
          <ul className="mt-5 grid gap-3">
            {email && (
              <li>
                <a href={`mailto:${email}`} className={link}>
                  {email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className={link}>
                  {phone}
                </a>
              </li>
            )}
            <li>
              <a href="#kontakt" onClick={go('kontakt')} className="group inline-flex items-center gap-2 text-sm font-semibold text-cyan">
                {footer.contactCta}
                <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
              </a>
            </li>
            <li className="pt-2 text-sm text-ink-faint">{footer.aboutLine}</li>
          </ul>
        </div>
      </div>

      <div className="container-x flex items-center justify-between border-t border-line py-6 text-sm text-ink-muted">
        <p>{footer.copyright}</p>
        <a href="#top" onClick={go('top')} className="font-medium transition-colors hover:text-cyan">
          {footer.toTop} ↑
        </a>
      </div>
    </footer>
  )
}
