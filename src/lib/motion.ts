import type { Transition } from 'framer-motion'

export const easeBrand = [0.22, 1, 0.36, 1] as const

export const springSoft: Transition = { type: 'spring', stiffness: 220, damping: 26, mass: 0.8 }

export const reveal: Transition = { duration: 0.9, ease: easeBrand }
