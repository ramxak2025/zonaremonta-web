import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { WhatWeInstall } from '@/components/sections/WhatWeInstall';
import { SavingsCalculator } from '@/components/sections/SavingsCalculator';
import { WhyUs } from '@/components/sections/WhyUs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Reviews } from '@/components/sections/Reviews';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { StructuredData } from '@/components/StructuredData';
import { getPublicSettings } from '@/lib/settings';
import { SITE } from '@/lib/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Установка ГБО 4 и 4+ в Махачкале — Зона Ремонта',
  description:
    'Установка, ремонт и диагностика ГБО 4-го поколения и 4+ для прямого впрыска. Гарантия 1 год, регистрация в ГИБДД, сертифицированное оборудование. Махачкала.',
  alternates: { canonical: `${SITE.siteUrl}/` },
  openGraph: {
    title: 'ГБО 4 и 4+ в Махачкале — установка за 1 день',
    description:
      'Только современные системы: 4-е поколение для инжекторов и 4+ для прямого впрыска (TSI, GDI, FSI).',
    url: SITE.siteUrl,
    siteName: SITE.name,
    locale: 'ru_RU',
    type: 'website',
  },
};

export default async function Home() {
  const settings = await getPublicSettings();
  return (
    <>
      <StructuredData settings={settings} />
      <Header />
      <main>
        <Hero settings={settings} />
        <TrustBar />
        <WhatWeInstall />
        <SavingsCalculator settings={settings} />
        <WhyUs />
        <HowItWorks />
        <Reviews settings={settings} />
        <Faq />
        <FinalCta settings={settings} />
      </main>
      <Footer />
    </>
  );
}
