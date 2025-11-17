import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './sections/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19', // Deep Space Navy
        text: '#FFFFFF', // Bright White
        'text-secondary': '#D1D5DB', // Off-White
        'text-muted': '#8B949E',
        border: 'rgba(255, 255, 255, 0.10)', // Glass Border
        ring: '#00A9FF', // Electric Blue
        primary: {
          DEFAULT: '#00A9FF', // Electric Blue
          foreground: '#FFFFFF',
          hover: '#40CFFF', // Sky Blue
        },
        secondary: {
          DEFAULT: '#4F46E5', // Cyber Indigo
          dark: '#2522A0',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#00FFAB', // Neon Mint
          foreground: '#000000',
          pink: '#FF007A', // Hyper Pink
        },
      },
      fontFamily: {
        sans: ['var(--font-lexend)', 'sans-serif'],
        heading: ['var(--font-exo2)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
