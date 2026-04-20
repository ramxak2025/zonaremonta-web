import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Process } from '@/components/Process';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import { Faq } from '@/components/Faq';
import { Contacts } from '@/components/Contacts';
import { CallbackForm } from '@/components/CallbackForm';

export const revalidate = 3600; // ISR — главная перегенерируется раз в час

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
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
