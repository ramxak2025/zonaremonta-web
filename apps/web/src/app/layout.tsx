import type { Metadata, Viewport } from 'next';
import { Inter, Oswald } from 'next/font/google';
import '../styles/globals.css';
import { SITE } from '@/lib/site';
import { Providers } from './providers';
import { MobileTabBar } from '@/components/MobileTabBar';
import { ScrollProgress } from '@/components/ScrollProgress';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: {
    default: `${SITE.name} — установка и ремонт ГБО в Махачкале`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE.siteUrl,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#08080A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${oswald.variable} dark`}>
      <body>
        <Providers>
          <ScrollProgress />
          {children}
          <MobileTabBar />
          <div className="md:hidden h-28" aria-hidden />
        </Providers>
      </body>
    </html>
  );
}
