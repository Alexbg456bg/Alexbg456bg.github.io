import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { CtaBand } from './sections/CtaBand'
import { Facts } from './sections/Facts'
import { Faq } from './sections/Faq'
import { Hero } from './sections/Hero'
import { Portfolio } from './sections/Portfolio'
import { Pricing } from './sections/Pricing'
import { Process } from './sections/Process'
import { PricingTeaser } from './sections/PricingTeaser'
import { ProjectsTeaser } from './sections/ProjectsTeaser'
import { ServicesOverview } from './sections/ServicesOverview'
import { Testimonials } from './sections/Testimonials'
import { ServiceStrip } from './sections/ServiceStrip'
import { Services } from './sections/Services'
import type { ReactNode } from 'react'

/**
 * Inner pages start below the fixed header, over a quiet band (dot grid and a cyan glow)
 * that marks the top of every page the same way.
 */
function Inner({ children }: { children: ReactNode }) {
  return (
    <div className="relative pt-[var(--header-h)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] overflow-hidden" aria-hidden="true">
        <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,194,255,0.14),transparent_70%)]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}

/** What each route renders between the header and the footer. Paths match `pages` in content.ts. */
export const pageViews: Record<string, () => ReactNode> = {
  '/': () => (
    <>
      <Hero />
      <ServiceStrip />
      <ProjectsTeaser />
      <Testimonials />
      <Facts />
      <ServicesOverview />
      <Process />
      <PricingTeaser />
      <CtaBand />
    </>
  ),
  '/proekti': () => (
    <Inner>
      <Portfolio />
    </Inner>
  ),
  '/uslugi': () => (
    <Inner>
      <Services />
      <Process />
      <CtaBand />
    </Inner>
  ),
  '/ceni': () => (
    <Inner>
      <Pricing />
      <Faq />
    </Inner>
  ),
  '/za-nas': () => (
    <Inner>
      <About />
      <CtaBand />
    </Inner>
  ),
  '/kontakt': () => (
    <Inner>
      <Contact />
    </Inner>
  ),
}
