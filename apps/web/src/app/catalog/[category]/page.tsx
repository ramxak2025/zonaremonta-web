import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { ProductCard } from '@/components/shop/ProductCard';
import { SITE } from '@/lib/site';
import { getCategory, getProductsByCategory, PRODUCT_CATEGORIES } from '@/data/products';

interface Params {
  category: string;
}

export function generateStaticParams(): Params[] {
  return PRODUCT_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return { title: 'Категория не найдена' };
  return {
    title: `${c.name} — каталог ГБО`,
    description: `${c.description}. Самовывоз в Махачкале, установка на месте со скидкой.`,
    alternates: { canonical: `${SITE.siteUrl}/catalog/${c.slug}` },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<Params> },
) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();

  const products = getProductsByCategory(category);

  return (
    <Section>
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-[13px] text-white/60 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Все категории
      </Link>

      <div className="max-w-3xl mb-10 md:mb-12">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3E4F] mb-3">
          Каталог
        </div>
        <h1 className="font-display font-bold uppercase tracking-tight text-white text-[26px] sm:text-[30px] md:text-[36px] leading-tight mb-4 md:mb-5">
          {c.name}
        </h1>
        <p className="text-[15px] md:text-[17px] leading-relaxed text-white/70 max-w-[60ch]">
          {c.description}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="card text-center text-white/60">
          В этой категории пока нет товаров. Загляните позже.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <div
        className="mt-10 card flex flex-col md:flex-row md:items-center gap-4"
        style={{ background: 'rgba(74,159,217,0.06)', borderColor: 'rgba(74,159,217,0.2)' }}
      >
        <div className="flex-1">
          <div className="font-semibold text-white text-[14px]">Как работает «купил + установил»</div>
          <p className="text-[13px] text-white/65 mt-1 text-break">
            Поставьте галочку «Установить на месте» — работа учтётся сразу и по сниженной цене.
            Приезжаете в удобное время, детали уже на складе.
          </p>
        </div>
        <Link href="/cart" className="btn btn-primary btn-sm flex-shrink-0">
          Перейти в корзину
        </Link>
      </div>
    </Section>
  );
}
