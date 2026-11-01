import { m } from 'framer-motion'
import type { Project } from '../../content'

const src = (p: Project, variant: 'desktop' | 'mobile', w?: number) =>
  `/projects/${p.image}-${variant}${w ? `-${w}` : ''}.webp`

/**
 * Desktop screenshot in a minimal browser frame, with the mobile screenshot
 * overlapping it. `layoutId` lets the case-study view morph out of the card.
 */
export function ProjectShot({
  project,
  priority = false,
  sizes = '(min-width: 1024px) 60vw, 92vw',
  className = '',
}: {
  project: Project
  priority?: boolean
  sizes?: string
  className?: string
}) {
  return (
    <m.div layoutId={`shot-${project.slug}`} className={`relative ${className}`}>
      <div className="overflow-hidden rounded-xl border border-line bg-navy-850 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:rounded-2xl">
        <div className="flex h-7 items-center gap-1.5 border-b border-line px-3 sm:h-8" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-ink/20" />
          <span className="h-2 w-2 rounded-full bg-ink/20" />
          <span className="h-2 w-2 rounded-full bg-ink/20" />
          <span className="ml-3 truncate font-mono text-[0.65rem] text-ink-faint">{project.host}</span>
        </div>
        <img
          src={src(project, 'desktop', 960)}
          srcSet={`${src(project, 'desktop', 960)} 960w, ${src(project, 'desktop')} 1440w`}
          sizes={sizes}
          width={1440}
          height={900}
          alt={project.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="block aspect-[16/10] w-full object-cover object-top"
        />
      </div>
      <div className="absolute -bottom-6 right-3 w-[22%] overflow-hidden rounded-[0.9rem] border-[3px] border-navy-700 bg-navy-850 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] sm:-bottom-8 sm:right-6 sm:rounded-[1.25rem] sm:border-4">
        <img
          src={src(project, 'mobile')}
          width={600}
          height={1299}
          alt=""
          loading="lazy"
          decoding="async"
          className="block aspect-[9/17] w-full object-cover object-top"
        />
      </div>
    </m.div>
  )
}

export const projectImage = src
