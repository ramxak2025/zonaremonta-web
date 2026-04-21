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
    default: 'Установка ГБО 4 и 4+ в Махачкале — Зона Ремонта / 05auto',
    template: '%s — Зона Ремонта',
  },
  description:
    'Специализированный автосервис ГБО в Махачкале. Установка 4-го поколения и 4+ для прямого впрыска (TSI, GDI, FSI). Гарантия 1 год, регистрация в ГИБДД, установка за 1 день.',
  keywords: [
    'ГБО Махачкала',
    'установка ГБО',
    'ГБО 4 поколение',
    'ГБО 4+',
    'ГБО прямой впрыск',
    'ГБО TSI',
    'ГБО GDI',
    'ГБО FSI',
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
    title: 'Установка ГБО 4 и 4+ в Махачкале — Зона Ремонта',
    description:
      'Только современные системы: 4-е поколение и 4+ для прямого впрыска. Гарантия 1 год, регистрация в ГИБДД.',
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
  themeColor: '#0A0A0C',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${oswald.variable} dark`}>
      <body>
        <AnimatedBackground />
        <div className="relative z-10">
          <Providers>
            {children}
            <MobileTabBar />
            <div className="md:hidden h-24" aria-hidden />
          </Providers>
        </div>
      </body>
    </html>
  );
}
