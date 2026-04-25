import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { PathChoice } from '@/components/sections/PathChoice';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { Calculator } from '@/components/sections/Calculator';
import { WhyUs } from '@/components/sections/WhyUs';
import { Steps } from '@/components/sections/Steps';
import { Reviews } from '@/components/sections/Reviews';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';
import { Reveal } from '@/components/ui/Reveal';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Установка и ремонт ГБО в Махачкале — Зона Ремонта',
  description:
    'Установка ГБО (Lovato, BRC, Prins, OMVL), диагностика и ремонт. Гарантия 1 год. 2500+ установок. Окупаемость от 6 месяцев.',
  alternates: { canonical: `${SITE.siteUrl}/` },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <PathChoice />
      <Reveal><ServicesGrid /></Reveal>
      <Reveal><Calculator /></Reveal>
      <Reveal><WhyUs /></Reveal>
      <Reveal><Steps /></Reveal>
      <Reveal><Reviews /></Reveal>
      <Reveal><Faq /></Reveal>
      <Reveal><Contact /></Reveal>
    </>
  );
}
