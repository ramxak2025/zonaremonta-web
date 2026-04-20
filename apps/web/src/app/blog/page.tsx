import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Блог о ГБО',
  description: 'Статьи для автовладельцев: обслуживание, расход, регистрация ГБО, типовые проблемы.',
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="section py-16">
        <span className="chip">Полезное</span>
        <h1 className="h-section mt-3">Блог</h1>
        <p className="text-ink-70 mt-3 max-w-2xl">
          Статьи для владельцев авто с ГБО. CMS для публикаций — в личном кабинете директора.
        </p>
        <p className="text-ink-50 text-sm mt-10">
          Пока публикаций нет. Первые статьи появятся после наполнения из админки.
        </p>
      </main>
      <Footer />
    </>
  );
}
