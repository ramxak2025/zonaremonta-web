import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { SITE } from '@/lib/site';
import { Providers } from './providers';
import { MobileTabBar } from '@/components/MobileTabBar';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' });

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
  themeColor: '#E81224',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <Providers>
          {children}
          <MobileTabBar />
          {/* Отступ под mobile tab bar, чтобы контент не залезал */}
          <div className="md:hidden h-24" aria-hidden />
        </Providers>
      </body>
    </html>
  );
}
