import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-dm)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-courier)', '"Courier New"', 'monospace'],
        gothic: ['var(--font-gothic)', 'serif'],
      },
      colors: {
        parchment: '#e6edf3',
        ink: '#0d1117',
        surface: '#161b22',
        border: '#30363d',
        muted: '#6e7681',
        aged: '#6e7681',
        bloodred: '#f85149',
      },
      keyframes: {
        'fade-in-scale': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'stamp-in': {
          '0%': { opacity: '0', transform: 'rotate(-15deg) scale(1.4)' },
          '100%': { opacity: '1', transform: 'rotate(-15deg) scale(1)' },
        },
        'stamp-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in-scale': 'fade-in-scale 0.4s ease-out forwards',
        'stamp-in': 'stamp-in 0.2s ease-out forwards',
        'stamp-out': 'stamp-out 0.3s ease-in forwards',
      },
    },
  },
  plugins: [],
};
export default config;
