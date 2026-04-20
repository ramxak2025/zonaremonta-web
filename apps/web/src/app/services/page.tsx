import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatWeInstall } from '@/components/sections/WhatWeInstall';
import { ChineseCars } from '@/components/sections/ChineseCars';
import { CalculatorPro } from '@/components/sections/CalculatorPro';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { getPublicSettings } from '@/lib/settings';
import { SITE } from '@/lib/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Услуги и цены на установку ГБО',
  description:
    'Установка ГБО 4-го поколения от 38 000 ₽ и ГБО 4+ для прямого впрыска от 95 000 ₽. Под ключ: оборудование, установка, регистрация в ГИБДД.',
  alternates: { canonical: `${SITE.siteUrl}/services` },
};

export default async function ServicesPage() {
  const settings = await getPublicSettings();
  return (
    <>
      <Header />
      <main className="pt-4 md:pt-8">
        <WhatWeInstall />
        <ChineseCars />
        <CalculatorPro settings={settings} />
        <Faq />
        <FinalCta settings={settings} />
      </main>
      <Footer />
    </>
  );
}
