import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink:     '#0D1117',
        canvas:  '#FAFAF8',
        border:  '#E8E6E0',
        emerald: { DEFAULT: '#0F7B5F', light: '#E6F5F0' },
        amber:   { DEFAULT: '#D97706', light: '#FEF3C7' },
        rose:    { DEFAULT: '#BE123C', light: '#FFE4E6' },
        violet:  { DEFAULT: '#6D28D9', light: '#EDE9FE' },
        sky:     { DEFAULT: '#0369A1', light: '#E0F2FE' },
      },
      borderRadius: {
        sm:   '0.375rem',
        md:   '0.75rem',
        lg:   '1.25rem',
        xl:   '2rem',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(13,17,23,.06), 0 1px 2px rgba(13,17,23,.04)',
        md: '0 4px 16px rgba(13,17,23,.08), 0 2px 4px rgba(13,17,23,.04)',
        lg: '0 12px 40px rgba(13,17,23,.12), 0 4px 12px rgba(13,17,23,.06)',
        xl: '0 24px 64px rgba(13,17,23,.16)',
      },
    },
  },
  plugins: [],
}

export default config