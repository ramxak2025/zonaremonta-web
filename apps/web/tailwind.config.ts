import type { Config } from 'tailwindcss';

/**
 * Breakpoints по спецификации проекта: 320 / 640 / 768 / 1024 / 1280 / 1440
 * (соответствует Tailwind'у + кастомные xs и 3xl)
 */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        primary: { DEFAULT: '#E81224', dark: '#B40E1C', light: '#FF3E4F' },
        secondary: { DEFAULT: '#4A9FD9', dark: '#2F7AB0' },
        ink: {
          DEFAULT: '#FFFFFF',
          80: 'rgba(255, 255, 255, 0.8)',
          60: 'rgba(255, 255, 255, 0.6)',
          40: 'rgba(255, 255, 255, 0.4)',
        },
        surface: { DEFAULT: '#0A0A10', muted: '#14141A' },
      },
      /* Spacing scale: кратные 4px */
      spacing: {
        '18': '4.5rem',  // 72
        '22': '5.5rem',  // 88
        '26': '6.5rem',  // 104
        '30': '7.5rem',  // 120
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0, 0, 0, 0.28)',
        medium: '0 12px 40px rgba(0, 0, 0, 0.38)',
        lift: '0 24px 64px rgba(232, 18, 36, 0.35)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-oswald)', 'Oswald', 'Inter', 'sans-serif'],
      },
      maxWidth: {
        prose: '65ch',
      },
    },
  },
  plugins: [],
} satisfies Config;
