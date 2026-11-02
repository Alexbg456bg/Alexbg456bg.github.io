import { Link } from 'react-router-dom'
import { Logo } from '../components/brand/Logo'
import { ArrowIcon } from '../components/ui/MagneticButton'
import { siteConfig } from '../config'
import { footer, nav, tech, ui } from '../content'

export function Footer() {
  const { email, phones } = siteConfig.contact
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const heading = 'font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink-faint'
  const link = 'text-sm text-ink-muted transition-colors hover:text-cyan'

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,2fr)_minmax(0,3fr)_minmax(0,3fr)] lg:gap-10">
        <div className="col-span-2 flex flex-col gap-5 lg:col-span-1">
          <Link to="/" aria-label={ui.home} className="-m-2 w-fit rounded-lg p-2">
            <Logo ink="white" title={null} className="h-12 w-auto" />
          </Link>
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
              <li key={item.to}>
                <Link to={item.to} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={heading}>{footer.servicesTitle}</p>
          <ul className="mt-5 grid gap-3">
            {footer.services.map((s) => (
              <li key={s}>
                <Link to="/uslugi" className={link}>
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <p className={heading}>{footer.contactTitle}</p>
          <ul className="mt-5 grid gap-3">
            {email && (
              <li>
                <a href={`mailto:${email}`} className={link}>
                  {email}
                </a>
              </li>
            )}
            {phones.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className={link}>
                  {p.display}
                </a>
                <span className="block text-xs text-ink-faint">{p.name}</span>
              </li>
            ))}
            <li>
              <Link to="/kontakt" className="group inline-flex items-center gap-2 text-sm font-semibold text-cyan">
                {footer.contactCta}
                <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
              </Link>
            </li>
            <li className="pt-2 text-sm text-ink-faint">{footer.aboutLine}</li>
          </ul>
        </div>
      </div>

      {/* Oversized wordmark that fades downward. SVG textLength stretches it to exactly the
          container width, so the whole name is visible on every screen size. */}
      <div className="container-x pointer-events-none select-none pb-4" aria-hidden="true">
        <svg viewBox="0 0 1200 182" className="block h-auto w-full overflow-visible" focusable="false">
          <defs>
            <linearGradient id="footer-wordmark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#EAF1F8" stopOpacity="0.16" />
              <stop offset="1" stopColor="#EAF1F8" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="140"
            textLength="1200"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#footer-wordmark)"
            fontSize="178"
            fontWeight="700"
            className="font-sans"
          >
            {footer.wordmark}
          </text>
        </svg>
      </div>

      {/* Right padding keeps "to top" clear of the floating call button. */}
      <div className="container-x flex items-center justify-between border-t border-line py-6 pr-20 text-sm text-ink-muted sm:pr-24 lg:pr-24">
        <p>
          {footer.wordmark} © {new Date().getFullYear()}
        </p>
        <button type="button" onClick={scrollTop} className="font-medium transition-colors hover:text-cyan">
          {footer.toTop} ↑
        </button>
      </div>
    </footer>
  )
}
