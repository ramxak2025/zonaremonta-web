import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BentoHero } from '@/components/BentoHero';
import { Services } from '@/components/Services';
import { Process } from '@/components/Process';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import { Faq } from '@/components/Faq';
import { Contacts } from '@/components/Contacts';
import { CallbackForm } from '@/components/CallbackForm';

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <BentoHero />
        <Services />
        <Process />
        <SavingsCalculator />
        <CallbackForm />
        <Faq />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
