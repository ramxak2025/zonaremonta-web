import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Блог о ГБО',
  description: 'Статьи для автовладельцев: обслуживание, расход, регистрация ГБО.',
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="section py-12 sm:py-20 relative">
        <div className="absolute inset-0 hex-grid opacity-60 pointer-events-none" aria-hidden />
        <div className="relative">
          <span className="chip"><span className="dot" />Полезное</span>
          <h1 className="h-hero mt-4 text-white">Блог</h1>
          <p className="text-white/65 mt-4 max-w-2xl">
            Статьи для владельцев авто с ГБО. CMS публикаций — в кабинете директора.
          </p>
          <div className="liquid-glass p-8 mt-10 text-white/60">
            Пока публикаций нет. Первые статьи появятся после наполнения из админки.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
