import type { Metadata } from 'next';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { Calculator } from '@/components/sections/Calculator';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Услуги и цены на установку ГБО',
  description:
    'Установка ГБО на 4, 6 и 8 цилиндров, на прямой и комбинированный впрыск. Lovato, BRC, Prins, OMVL.',
  alternates: { canonical: `${SITE.siteUrl}/services` },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesGrid />
      <Calculator />
      <Faq />
      <Contact />
    </>
  );
}
