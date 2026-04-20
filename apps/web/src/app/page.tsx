import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BentoHero } from '@/components/BentoHero';
import { QuickContact } from '@/components/QuickContact';
import { Services } from '@/components/Services';
import { Process } from '@/components/Process';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import { YandexReviews } from '@/components/YandexReviews';
import { Faq } from '@/components/Faq';
import { Contacts } from '@/components/Contacts';
import { getPublicSettings } from '@/lib/settings';

export const revalidate = 60;

export default async function Home() {
  const settings = await getPublicSettings();
  return (
    <>
      <Header />
      <main>
        <BentoHero settings={settings} />
        <QuickContact />
        <Services />
        <Process />
        <SavingsCalculator settings={settings} />
        <YandexReviews settings={settings} />
        <Faq />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
