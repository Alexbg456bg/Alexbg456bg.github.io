import type { MouseEvent } from 'react'
import { Logo } from '../components/brand/Logo'
import { BracketSeparator, Marquee } from '../components/ui/Atmosphere'
import { FadeIn } from '../components/ui/RevealText'
import { footer, nav, tech, ui } from '../content'
import { useSmoothScroll } from '../lib/smooth-scroll'

export function Footer() {
  const scroll = useSmoothScroll()
  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scroll.scrollTo(id)
  }

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="border-b border-line py-6">
        <p className="sr-only">
          {footer.techLabel}: {tech.join(', ')}
        </p>
        <Marquee
          items={[...tech, ...tech]}
          duration={30}
          itemClassName="whitespace-nowrap font-mono text-lg font-medium uppercase tracking-[0.12em] text-ink-muted sm:text-xl"
          separator={<BracketSeparator className="opacity-70" />}
        />
      </div>
      <div className="container-x flex flex-col gap-10 py-14 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4">
          <a href="#top" onClick={go('top')} aria-label={ui.home} className="-m-2 w-fit rounded-lg p-2">
            <Logo ink="white" title={null} className="h-12 w-auto" />
          </a>
          <p className="text-sm text-ink-muted">{footer.tagline}</p>
        </div>

        <nav aria-label={ui.footerNav}>
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  className="text-sm font-medium text-ink-muted transition-colors hover:text-cyan"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <FadeIn y={80} className="pointer-events-none select-none overflow-hidden">
        <p
          className="text-gradient -mb-[0.18em] text-center text-[14vw] font-bold leading-[0.85] tracking-[-0.06em] opacity-30"
          aria-hidden="true"
        >
          {footer.wordmark}
        </p>
      </FadeIn>
      <div className="container-x flex items-center justify-between border-t border-line py-6 text-sm text-ink-muted">
        <p>{footer.copyright}</p>
        <a href="#top" onClick={go('top')} className="font-medium transition-colors hover:text-cyan">
          {footer.toTop} ↑
        </a>
      </div>
    </footer>
  )
}
