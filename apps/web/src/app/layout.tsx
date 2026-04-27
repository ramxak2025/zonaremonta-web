import type { Metadata, Viewport } from 'next';
import { Inter, Oswald } from 'next/font/google';
import '../styles/globals.css';
import { SITE } from '@/lib/site';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' });
const oswald = Oswald({
  subsets: ['latin', 'cyrillic'], weight: ['500', '600', '700'],
  variable: '--font-oswald', display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: {
    default: 'Установка ГБО в Махачкале — Зона Ремонта',
    template: '%s — Зона Ремонта',
  },
  description: SITE.description,
  keywords: ['ГБО Махачкала', 'установка ГБО', 'ГБО Prins', 'ГБО OMVL', 'Lovato', 'BRC', '05auto'],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: 'website', locale: 'ru_RU',
    url: SITE.siteUrl, siteName: SITE.name,
    title: 'Установка ГБО в Махачкале — Зона Ремонта',
    description: SITE.description,
  },
  twitter: { card: 'summary_large_image', title: SITE.name, description: SITE.description },
  icons: { icon: '/favicon.svg' },
  alternates: { canonical: SITE.siteUrl },
  robots: { index: true, follow: true },
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
      <body>
        <div className="page-bg" aria-hidden />
        <Providers>
          <Header />
          {/*
            Header теперь fixed (не занимает место в потоке).
            pt-[68px]/pt-[80px] компенсирует высоту шапки для всех страниц.
            Hero использует mt-[-68px]/-mt-[-80px], чтобы фото шло из-под шапки.
          */}
          <main className="pb-tabbar pt-[68px] md:pt-[80px]">{children}</main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
