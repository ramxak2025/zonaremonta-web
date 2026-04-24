import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Gauge, Fuel, Wrench, Cpu, Package, CircleDot, Wrench as WrenchIcon, Truck, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE, getContactLinks } from '@/lib/site';
import { PRODUCT_CATEGORIES, PRODUCTS } from '@/data/products';

export const metadata: Metadata = {
  title: 'Каталог комплектующих ГБО — самовывоз и установка на месте',
  description:
    'Магазин ГБО в Махачкале: редукторы, форсунки, ЭБУ, баллоны, мультиклапаны. Самовывоз со склада + установка на месте со скидкой на работу.',
  alternates: { canonical: `${SITE.siteUrl}/catalog` },
};

const ICON_MAP = {
  reducers: Gauge,
  injectors: Fuel,
  ecu: Cpu,
  cylinders: CircleDot,
  kits: Package,
  fittings: Wrench,
} as const;

export default function CatalogPage() {
  const l = getContactLinks();

  return (
    <>
      <Header />
      <main>
        {/* HERO магазина */}
        <section className="section pt-6 pb-6 md:pt-10 md:pb-10">
          <div className="section-head">
            <span className="chip"><span className="dot" />Магазин</span>
            <h1 className="h-1 text-white">Комплектующие ГБО со своего склада</h1>
            <p className="lead">
              Редукторы, форсунки, ЭБУ, баллоны и расходники.
              Самовывоз в Махачкале. По желанию — установим прямо на месте со скидкой на работу.
            </p>
          </div>

          {/* ФИШКА */}
          <div
            className="card flex flex-col md:flex-row md:items-center gap-5"
            style={{
              background:
                'linear-gradient(180deg, rgba(232,18,36,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              borderColor: 'rgba(232,18,36,0.25)',
            }}
          >
            <span className="icon-tile icon-tile-primary w-12 h-12">
              <WrenchIcon className="w-6 h-6 text-[#FF3E4F]" strokeWidth={2.2} />
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
            <Link href="/#contact" className="btn btn-ghost btn-sm flex-shrink-0">
              Условия
            </Link>
          </div>

          {/* Преимущества склада */}
          <div className="mt-4 md:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { icon: Truck, title: 'Самовывоз в день обращения', text: 'Склад в Махачкале, работаем с 9 до 20' },
              { icon: Clock, title: 'Установка от 1 часа', text: 'Легкие детали — мультиклапаны, фильтры' },
              { icon: WrenchIcon, title: 'Гарантия при установке', text: '1 год при покупке + установке у нас' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="card flex gap-4 items-start">
                <span className="icon-tile">
                  <Icon className="w-5 h-5 text-white/70" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-white text-[14px] text-break">{title}</div>
                  <div className="text-[12px] text-white/55 text-break mt-0.5">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Категории */}
        <section className="section pb-12 md:pb-16">
          <div className="section-head">
            <span className="eyebrow">Каталог</span>
            <h2 className="h-1 text-white">Категории товаров</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {PRODUCT_CATEGORIES.map((c) => {
              const Icon = ICON_MAP[c.iconKey];
              const count = PRODUCTS.filter((p) => p.category === c.slug).length;
              return (
                <Link
                  key={c.slug}
                  href={`/catalog/${c.slug}`}
                  className="card flex flex-col gap-4 group hover:-translate-y-1 active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <span className="icon-tile icon-tile-primary">
                      <Icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <h3 className="h-3 text-white">{c.name}</h3>
                    <p className="text-[13px] text-white/60 text-break leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5">
                      {c.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/65"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-white/40 font-semibold">
                      {count} товар{count === 1 ? '' : count < 5 ? 'а' : 'ов'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="text-[12px] text-white/45 mt-8 max-w-prose">
            Каталог дополняется. Если нужной позиции нет — уточните в{' '}
            <a href={l.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-white underline">
              WhatsApp
            </a>
            , привезём под заказ за 1–3 дня.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
