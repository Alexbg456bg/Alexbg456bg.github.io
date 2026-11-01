// Site-wide settings. Values marked TODO are unknown and must come from the team —
// anything left as null is simply not rendered.

export const siteConfig = {
  name: 'aecodezonebg',
  // Production address (canonical URL, Open Graph, sitemap.xml). Update if a custom domain is added.
  url: 'https://alexbg456bg.github.io',
  locale: 'bg_BG',

  contact: {
    email: 'aecodezonebg@gmail.com' as string | null,
    // TODO: public phone number, in international format (+359...).
    phone: null as string | null,
  },

  // Formspree form ID (the part after /f/ in the endpoint), set via .env as VITE_FORMSPREE_ID.
  // TODO: create the form in Formspree and add the ID to .env / Vercel env vars.
  formspreeId: (import.meta.env?.VITE_FORMSPREE_ID as string | undefined) ?? null,
} as const

export const formEndpoint = siteConfig.formspreeId
  ? `https://formspree.io/f/${siteConfig.formspreeId}`
  : null
