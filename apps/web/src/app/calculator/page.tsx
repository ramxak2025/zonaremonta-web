import type { Metadata } from 'next';
import { Calculator } from '@/components/sections/Calculator';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Калькулятор экономии на ГБО',
  description: 'Посчитайте свою выгоду от перехода на газ за 30 секунд.',
  alternates: { canonical: `${SITE.siteUrl}/calculator` },
};

export default function CalculatorPage() {
  return (
    <>
      <Calculator />
      <Faq />
      <Contact />
    </>
  );
}
