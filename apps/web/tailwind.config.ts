import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E81224',
          dark: '#B40E1C',
          light: '#FF3E4F',
        },
        secondary: {
          DEFAULT: '#4A9FD9',
          dark: '#2F7AB0',
        },
        ink: {
          DEFAULT: '#FFFFFF',
          70: 'rgba(255, 255, 255, 0.72)',
          50: 'rgba(255, 255, 255, 0.5)',
          30: 'rgba(255, 255, 255, 0.3)',
          10: 'rgba(255, 255, 255, 0.08)',
        },
        surface: {
          DEFAULT: '#08080A',
          muted: '#0E0E11',
        },
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0, 0, 0, 0.24)',
        medium: '0 12px 40px rgba(0, 0, 0, 0.32)',
        lift: '0 24px 64px rgba(232, 18, 36, 0.35)',
      },
      borderRadius: {
        xl: '20px',
        '2xl': '28px',
        '3xl': '36px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-oswald)', 'Oswald', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at 20% 10%, rgba(232,18,36,0.12), transparent 40%), radial-gradient(circle at 80% 90%, rgba(74,159,217,0.14), transparent 40%)',
        'accent-gradient': 'linear-gradient(135deg, #E81224 0%, #FF3E4F 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
