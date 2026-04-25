import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { Calculator } from '@/components/sections/Calculator';
import { WhyUs } from '@/components/sections/WhyUs';
import { Steps } from '@/components/sections/Steps';
import { Reviews } from '@/components/sections/Reviews';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Установка ГБО в Махачкале — Зона Ремонта',
  description:
    'Установим ГБО на 4, 6, 8 цилиндров и на прямой/комбинированный впрыск. Lovato, BRC, Prins, OMVL. Гарантия 1 год.',
  alternates: { canonical: `${SITE.siteUrl}/` },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Calculator />
      <WhyUs />
      <Steps />
      <Reviews />
      <Faq />
      <Contact />
    </>
  );
}
