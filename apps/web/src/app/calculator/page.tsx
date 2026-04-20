import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CalculatorPro } from '@/components/sections/CalculatorPro';
import { Faq } from '@/components/sections/Faq';
import { getPublicSettings } from '@/lib/settings';
import { SITE } from '@/lib/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Калькулятор экономии на ГБО',
  description:
    'Рассчитайте за 30 секунд, сколько вы сэкономите на газе вместо бензина. Актуальные цены топлива по Махачкале.',
  alternates: { canonical: `${SITE.siteUrl}/calculator` },
};

export default async function CalculatorPage() {
  const settings = await getPublicSettings();
  return (
    <>
      <Header />
      <main className="pt-4">
        <CalculatorPro settings={settings} />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
