import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import { DEFAULT_SERVICES } from '@05auto/shared';

export const metadata: Metadata = {
  title: 'Услуги и цены',
  description: 'Установка ГБО 2/4/6 поколения, диагностика, ремонт, поверка баллона.',
};

export const revalidate = 3600;

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section py-16">
          <span className="chip">Услуги</span>
          <h1 className="h-section mt-3">Полный спектр работ по ГБО</h1>
          <p className="text-ink-70 mt-3 max-w-2xl">
            Цены ниже — стартовые, итоговая стоимость зависит от комплектации, состояния авто и двигателя.
            Точную цену даём после бесплатной диагностики.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-10">
            {DEFAULT_SERVICES.map((s) => (
              <article key={s.slug} className="card">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-xl">{s.name}</h2>
                  <span className="chip">{Math.round(s.durationMin / 60)} ч</span>
                </div>
                <p className="text-ink-70 text-sm mt-2">{s.description}</p>
                <div className="mt-4 text-sm text-ink-50">от</div>
                <div className="font-display text-3xl text-primary">{s.basePrice.toLocaleString('ru-RU')} ₽</div>
              </article>
            ))}
          </div>
        </section>
        <SavingsCalculator />
      </main>
      <Footer />
    </>
  );
}
