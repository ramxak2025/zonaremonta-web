import type { Metadata, Viewport } from 'next';
import { Inter, Oswald } from 'next/font/google';
import '../styles/globals.css';
import { SITE } from '@/lib/site';
import { Providers } from './providers';
import { MobileTabBar } from '@/components/MobileTabBar';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: {
    default: 'Установка ГБО в Махачкале — Зона Ремонта / 05auto',
    template: '%s — Зона Ремонта',
  },
  description:
    'Автосервис ГБО в Махачкале. Ставим на 4, 6, 8 цилиндров, на прямой и комбинированный впрыск. Оборудование Lovato, BRC, Prins, OMVL. Гарантия 1 год на работы.',
  keywords: [
    'ГБО Махачкала',
    'установка ГБО',
    'ГБО на прямой впрыск',
    'ГБО Prins',
    'ГБО OMVL',
    'ГБО TSI',
    'ГБО GDI',
    'ГБО FSI',
    'ГБО D-4S',
    'пропан на авто',
    '05auto',
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE.siteUrl,
    siteName: SITE.name,
    title: 'Установка ГБО в Махачкале — Зона Ремонта',
    description:
      'Комплекты на 4/6/8 цилиндров и на прямой/комбинированный впрыск (Prins, OMVL). Гарантия 1 год на работы.',
  },
  twitter: { card: 'summary_large_image', title: SITE.name, description: SITE.description },
  icons: { icon: '/favicon.svg' },
  alternates: { canonical: SITE.siteUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'automotive',
};

export const viewport: Viewport = {
  themeColor: '#0A0A10',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${oswald.variable} dark`}>
      <body className="min-h-dvh">
        <AnimatedBackground />
        <div className="relative z-10 min-h-dvh flex flex-col pb-safe-tabbar">
          <Providers>
            <div className="flex-1">{children}</div>
            <MobileTabBar />
          </Providers>
        </div>
      </body>
    </html>
  );
}
