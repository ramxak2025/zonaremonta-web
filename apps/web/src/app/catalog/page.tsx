import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Gauge, Fuel, Wrench as WrenchIcon, Cpu, Package, CircleDot, Wrench, Truck, Clock } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SITE } from '@/lib/site';
import { PRODUCT_CATEGORIES, PRODUCTS } from '@/data/products';

export const metadata: Metadata = {
  title: 'Каталог комплектующих ГБО — самовывоз и установка на месте',
  description:
    'Магазин ГБО в Махачкале: редукторы, форсунки, ЭБУ, баллоны. Самовывоз со склада + установка на месте со скидкой на работу.',
  alternates: { canonical: `${SITE.siteUrl}/catalog` },
};

const ICONS = {
  reducers: Gauge,
  injectors: Fuel,
  ecu: Cpu,
  cylinders: CircleDot,
  kits: Package,
  fittings: WrenchIcon,
} as const;

export default function CatalogPage() {
  return (
    <>
      <Section>
        <div className="max-w-3xl mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E4F]" />
            Магазин
          </div>
          <h1 className="font-display font-bold uppercase tracking-tight text-white text-[26px] sm:text-[30px] md:text-[36px] leading-tight mb-4 md:mb-5">
            Комплектующие ГБО со своего склада
          </h1>
          <p className="text-[15px] md:text-[17px] leading-relaxed text-white/70 max-w-[60ch]">
            Редукторы, форсунки, ЭБУ, баллоны и расходники. Самовывоз в Махачкале.
            По желанию — установим прямо на месте со скидкой на работу.
          </p>
        </div>

        {/* Фишка */}
        <div
          className="card flex flex-col md:flex-row md:items-center gap-5 mb-6"
          style={{
            background: 'linear-gradient(180deg, rgba(232,18,36,0.08), rgba(255,255,255,0.03))',
            borderColor: 'rgba(232,18,36,0.25)',
          }}
        >
          <span
            className="w-12 h-12 rounded-xl grid place-items-center flex-shrink-0"
            style={{ background: 'rgba(232,18,36,0.15)', border: '1px solid rgba(232,18,36,0.3)' }}
          >
            <Wrench className="w-6 h-6 text-[#FF3E4F]" strokeWidth={2.2} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-[15px] md:text-[16px] text-break">
              Купили деталь — поставим за час, со скидкой 25–30% на работу
            </div>
            <p className="text-[13px] text-white/65 leading-relaxed mt-1 text-break">
              На каждом товаре цена установки «под ключ». Если покупаете у нас — работа дешевле,
              потому что мы уверены в оригинальной детали и гарантируем результат.
            </p>
          </div>
        </div>

        {/* Преимущества */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {[
            { icon: Truck, title: 'Самовывоз сегодня', text: 'Склад в Махачкале, с 9 до 20' },
            { icon: Clock, title: 'Установка от 1 часа', text: 'Лёгкие детали — мультиклапаны, фильтры' },
            { icon: Wrench, title: 'Гарантия при установке', text: '1 год при покупке + установке у нас' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card flex gap-4 items-start">
              <span
                className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Icon className="w-5 h-5 text-white/70" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-white text-[14px] text-break">{title}</div>
                <div className="text-[12px] text-white/55 text-break mt-0.5">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Каталог" title="Категории товаров" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {PRODUCT_CATEGORIES.map((c) => {
            const Icon = ICONS[c.iconKey];
            const count = PRODUCTS.filter((p) => p.category === c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/catalog/${c.slug}`}
                className="card flex flex-col gap-4 group hover:-translate-y-0.5 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(232,18,36,0.22), rgba(232,18,36,0.05))',
                      border: '1px solid rgba(232,18,36,0.3)',
                    }}
                  >
                    <Icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-display font-semibold uppercase tracking-tight text-white text-[16px] md:text-[18px] leading-tight">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-[13px] text-white/60 leading-relaxed text-break">
                    {c.description}
                  </p>
                </div>
                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/65"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-white/40">
                    {count} {count === 1 ? 'товар' : count < 5 ? 'товара' : 'товаров'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
