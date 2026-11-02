import { useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import videos from '../../generated/videos.json'
import type { Project } from '../../content'
import { useReducedMotion } from '../../lib/media'
import { projectImage } from './ProjectShot'

/**
 * ProjectVideo that manages itself: loads once it is about a screen away,
 * plays only while it is actually visible. Fills its parent.
 */
export function InViewVideo({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const near = useInView(ref, { once: true, margin: '60% 0px' })
  const visible = useInView(ref, { amount: 0.3 })
  return (
    <div ref={ref} className="h-full w-full">
      <ProjectVideo project={project} load={near} playing={visible} reduced={reduced} />
    </div>
  )
}

const manifest = videos as Record<string, { video: string } | null>

/**
 * Scroll-through recording of a live project. Loads nothing until `load` turns true,
 * plays only while `playing`. Without a recording (or with reduced motion), the
 * screenshot slowly pans instead — transform only.
 */
export function ProjectVideo({
  project,
  load,
  playing,
  reduced,
}: {
  project: Project
  load: boolean
  playing: boolean
  reduced: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const entry = manifest[project.slug]
  const poster = projectImage(project, 'desktop', 960)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (playing && load) void v.play().catch(() => undefined)
    else v.pause()
  }, [playing, load])

  if (!entry || reduced) {
    return (
      <img
        src={poster}
        srcSet={`${poster} 960w, ${projectImage(project, 'desktop')} 1440w`}
        sizes="(min-width: 1024px) 55vw, 92vw"
        width={1440}
        height={900}
        alt={project.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    )
  }

  return (
    <video
      ref={ref}
      src={load ? entry.video : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={project.alt}
      className="h-full w-full object-cover object-top"
    />
  )
}
