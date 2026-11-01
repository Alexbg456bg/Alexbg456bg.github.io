import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand: only these two hues. Everything else is a navy-tinted neutral.
        navy: {
          DEFAULT: '#0B1F3A',
          950: '#07152A',
          900: '#0B1F3A',
          850: '#0F2647',
          800: '#132D54',
          700: '#1B3A66',
        },
        cyan: {
          DEFAULT: '#00C2FF',
          soft: '#7FE0FF',
        },
        ink: {
          DEFAULT: '#EAF1F8',
          muted: '#A3B5CA',
          faint: '#8399B5',
        },
        line: 'rgba(163, 181, 202, 0.16)',
      },
      fontFamily: {
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['clamp(2.75rem, 8.5vw, 6.5rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        h2: ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
        h3: ['clamp(1.375rem, 2.2vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
      },
      maxWidth: {
        content: '84rem',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      borderRadius: {
        card: '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config
