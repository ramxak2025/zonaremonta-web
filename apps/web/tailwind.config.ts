import type { Config } from 'tailwindcss';

export default {
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
          DEFAULT: '#1C1C1E',
          70: 'rgba(28, 28, 30, 0.7)',
          50: 'rgba(28, 28, 30, 0.5)',
          10: 'rgba(28, 28, 30, 0.1)',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F6F7F9',
        },
      },
      boxShadow: {
        soft: '0 4px 24px rgba(28, 28, 30, 0.06)',
        medium: '0 12px 40px rgba(28, 28, 30, 0.12)',
        lift: '0 24px 64px rgba(232, 18, 36, 0.15)',
      },
      borderRadius: {
        xl: '20px',
        '2xl': '28px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist)', 'Geist', 'Inter', 'sans-serif'],
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
