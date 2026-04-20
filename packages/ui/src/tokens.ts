/**
 * Дизайн-токены бренда «Зона Ремонта» / 05auto.
 * Используются и в Tailwind config, и в компонентах.
 */
export const brand = {
  colors: {
    primary: '#E81224',
    primaryDark: '#B40E1C',
    primaryLight: '#FF3E4F',
    secondary: '#4A9FD9',
    secondaryDark: '#2F7AB0',
    ink: '#1C1C1E',
    ink70: 'rgba(28, 28, 30, 0.7)',
    ink50: 'rgba(28, 28, 30, 0.5)',
    ink10: 'rgba(28, 28, 30, 0.1)',
    surface: '#FFFFFF',
    surfaceMuted: '#F6F7F9',
    surfaceGlass: 'rgba(255, 255, 255, 0.7)',
    success: '#1F9D55',
    warning: '#E08E00',
    danger: '#D0021B',
  },
  radii: {
    sm: '6px',
    md: '12px',
    lg: '20px',
    xl: '28px',
    pill: '999px',
  },
  shadows: {
    soft: '0 4px 24px rgba(28, 28, 30, 0.06)',
    medium: '0 12px 40px rgba(28, 28, 30, 0.12)',
    lift: '0 24px 64px rgba(232, 18, 36, 0.15)',
  },
  gradients: {
    hero: 'radial-gradient(circle at 20% 10%, rgba(232,18,36,0.12), transparent 40%), radial-gradient(circle at 80% 90%, rgba(74,159,217,0.14), transparent 40%)',
    accent: 'linear-gradient(135deg, #E81224 0%, #FF3E4F 100%)',
  },
  fontFamily: {
    sans: '"Inter", "SF Pro Text", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    display: '"Geist", "Inter", system-ui, sans-serif',
  },
} as const;

export type Brand = typeof brand;
