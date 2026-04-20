import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HexIcon } from '@/components/HexIcon';
import { PART_CATEGORIES } from '@05auto/shared';

export const metadata: Metadata = {
  title: 'Каталог комплектующих ГБО',
  description: 'Редукторы, форсунки, баллоны, клапаны и расходники со склада в Махачкале.',
};

export default function CatalogPage() {
  return (
    <>
      <Header />
      <main className="section py-12 sm:py-20 relative">
        <div className="absolute inset-0 hex-grid opacity-60 pointer-events-none" aria-hidden />
        <div className="relative">
          <span className="chip"><span className="dot" />Комплектующие</span>
          <h1 className="h-hero mt-4 text-white">Каталог</h1>
          <p className="text-white/65 mt-4 max-w-2xl leading-relaxed">
            Склад в Махачкале. Оригинальные комплектующие для ГБО от ведущих производителей.
          </p>
          <div
            className="grid gap-3 sm:gap-4 mt-10"
            style={{
              gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
              gridAutoRows: 'minmax(160px, auto)',
            }}
          >
            {PART_CATEGORIES.map((c, i) => {
              const sizes = [
                'col-span-6 sm:col-span-3 lg:col-span-2',
                'col-span-6 sm:col-span-3 lg:col-span-2',
                'col-span-6 sm:col-span-6 lg:col-span-2',
                'col-span-6 sm:col-span-2',
                'col-span-6 sm:col-span-4',
                'col-span-6 sm:col-span-3',
                'col-span-6 sm:col-span-3',
                'col-span-6 sm:col-span-2',
                'col-span-6 sm:col-span-2',
                'col-span-6 sm:col-span-2',
              ];
              return (
                <a
                  key={c.slug}
                  href={`/catalog/${c.slug}`}
                  className={`${sizes[i % sizes.length]} liquid-glass relative overflow-hidden p-6 group hover:-translate-y-1 transition-transform`}
                >
                  <HexIcon size={180} filled={false} className="absolute -right-8 -bottom-8 text-white/[0.04] group-hover:text-primary/30 transition-colors" />
                  <div className="flex items-start justify-between relative">
                    <HexIcon size={32} className="text-primary/60" />
                    <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:rotate-12 transition-all" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl mt-5 text-white tracking-tight">{c.name}</h2>
                  <p className="text-white/50 text-sm mt-1">Перейти к категории →</p>
                </a>
              );
            })}
          </div>
          <p className="text-white/50 text-sm mt-10">
            Онлайн-оплата появится во второй итерации. Сейчас можно оставить заявку.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
