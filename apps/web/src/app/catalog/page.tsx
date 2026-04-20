import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PART_CATEGORIES } from '@05auto/shared';

export const metadata: Metadata = {
  title: 'Каталог комплектующих ГБО',
  description: 'Редукторы, форсунки, баллоны, клапаны и расходники со склада в Махачкале.',
};

export default function CatalogPage() {
  return (
    <>
      <Header />
      <main className="section py-16">
        <span className="chip">Комплектующие</span>
        <h1 className="h-section mt-3">Каталог</h1>
        <p className="text-ink-70 mt-3 max-w-2xl">
          Склад в Махачкале. Оригинальные комплектующие для ГБО от ведущих производителей.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {PART_CATEGORIES.map((c) => (
            <a
              key={c.slug}
              href={`/catalog/${c.slug}`}
              className="card hover:shadow-medium transition-shadow group"
            >
              <h2 className="font-display text-xl group-hover:text-primary transition-colors">{c.name}</h2>
              <p className="text-ink-50 text-sm mt-2">Перейти к категории →</p>
            </a>
          ))}
        </div>
        <p className="text-ink-50 text-sm mt-10">
          Онлайн-оплата появится во второй итерации. Сейчас можно оставить заявку —
          мы свяжемся и согласуем, «заберёте сами» или «установка у нас».
        </p>
      </main>
      <Footer />
    </>
  );
}
