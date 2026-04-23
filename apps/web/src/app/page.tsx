import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { BentoHero } from '@/components/sections/BentoHero';
import { TrustBar } from '@/components/sections/TrustBar';
import { WhatWeInstall } from '@/components/sections/WhatWeInstall';
import { CalculatorPro } from '@/components/sections/CalculatorPro';
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
  title: 'Установка ГБО в Махачкале — Зона Ремонта',
  description:
    'Ставим на 4 / 6 / 8 цилиндров и на прямой впрыск (GDI, FSI, TSI, D-4S). Оборудование Prins и OMVL. Гарантия 1 год. Рейтинг 4.9 Яндекс · 5.0 2ГИС.',
  alternates: { canonical: `${SITE.siteUrl}/` },
  openGraph: {
    title: 'Газ вместо бензина. В два раза дешевле.',
    description:
      'Комплекты ГБО на распределённый, прямой и комбинированный впрыск. Lovato · BRC · Prins · OMVL.',
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
        <BentoHero settings={settings} />
        <Reveal><TrustBar settings={settings} /></Reveal>
        <Reveal><WhatWeInstall /></Reveal>
        <Reveal><CalculatorPro settings={settings} /></Reveal>
        <Reveal><WhyUs /></Reveal>
        <Reveal><HowItWorks /></Reveal>
        <Reveal><Reviews settings={settings} /></Reveal>
        <Reveal><Faq /></Reveal>
        <Reveal><FinalCta settings={settings} /></Reveal>
      </main>
      <Footer />
    </>
  );
}
