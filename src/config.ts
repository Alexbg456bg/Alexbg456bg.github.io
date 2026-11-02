// Site-wide settings. Values marked TODO are unknown and must come from the team —
// anything left as null is simply not rendered.

export const siteConfig = {
  name: 'aecodezonebg',
  // Production address (canonical URL, Open Graph, sitemap.xml). Update if a custom domain is added.
  url: 'https://alexbg456bg.github.io',
  locale: 'bg_BG',

  contact: {
    email: 'aecodezonebg@gmail.com' as string | null,
    /** Each person answers their own phone. `tel` is the dialable form, `display` how it is shown. */
    phones: [
      { name: 'Александър Цветков', display: '0892 318 486', tel: '+359892318486' },
      { name: 'Емил Цонков', display: '0899 895 667', tel: '+359899895667' },
    ] as { name: string; display: string; tel: string }[],
  },

  // Formspree form ID (the part after /f/ in the endpoint), set via .env as VITE_FORMSPREE_ID.
  // TODO: create the form in Formspree and add the ID to .env / Vercel env vars.
  formspreeId: (import.meta.env?.VITE_FORMSPREE_ID as string | undefined) ?? null,
} as const

export const formEndpoint = siteConfig.formspreeId
  ? `https://formspree.io/f/${siteConfig.formspreeId}`
  : null
