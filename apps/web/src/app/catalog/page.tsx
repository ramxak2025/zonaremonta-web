import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Каталог комплектующих для ГБО',
  description:
    'Оригинальные комплектующие для ГБО 4 и 4+ от Lovato, BRC, Prins, Digitronic. Склад в Махачкале.',
  alternates: { canonical: `${SITE.siteUrl}/catalog` },
};

export default function CatalogPage() {
  return (
    <>
      <Header />
      <main className="section section-y">
        <span className="eyebrow">Комплектующие</span>
        <h1 className="h-1 mt-3 text-white">Склад в Махачкале</h1>
        <p className="lead mt-4 max-w-2xl">
          Оригинальные редукторы, форсунки, баллоны, фитинги от Lovato, BRC, Prins, Digitronic.
          Каталог с ценами — во второй итерации. Пока нужное оборудование подбираем под ваш заказ.
        </p>
        <a href={`tel:${SITE.phone.replace(/[^\d+]/g, '')}`} className="btn btn-primary mt-8">
          Уточнить наличие
        </a>
      </main>
      <Footer />
    </>
  );
}
