'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Package, Gauge, Fuel, Wrench, Cpu, CircleDot, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HexIcon } from '@/components/HexIcon';
import { getContactLinks } from '@/lib/site';
import { WhatsAppIcon } from '@/components/BrandIcons';

interface Category {
  slug: string;
  name: string;
  description: string;
  icon: typeof Package;
  tags: readonly string[];
}

const CATEGORIES: readonly Category[] = [
  {
    slug: 'reducers',
    name: 'Редукторы',
    description: 'Испарители газа Lovato, BRC, Tomasetto, OMVL',
    icon: Gauge,
    tags: ['Lovato', 'BRC', 'Tomasetto', 'OMVL'],
  },
  {
    slug: 'injectors',
    name: 'Форсунки',
    description: 'Газовые форсунки 3/4 Ом для всех поколений ГБО',
    icon: Fuel,
    tags: ['Hana H2000', 'Valtek', 'Barracuda', 'Rail IG1/IG5'],
  },
  {
    slug: 'ecu',
    name: 'Электронные блоки (ЭБУ)',
    description: 'Блоки управления 4-го поколения и 4+ для прямого впрыска',
    icon: Cpu,
    tags: ['Digitronic DGI', 'Lovato Smart', 'Prins VSI-DI'],
  },
  {
    slug: 'cylinders',
    name: 'Баллоны',
    description: 'Тороидальные, цилиндрические — металл и композит',
    icon: CircleDot,
    tags: ['Атикер', 'Европолис', 'Stako'],
  },
  {
    slug: 'kits',
    name: 'Комплекты ГБО',
    description: 'Готовые комплекты под ваш двигатель: 4 и 4+ поколения',
    icon: Package,
    tags: ['4-цилиндровый', '6-цилиндровый', 'Direct Injection'],
  },
  {
    slug: 'fittings',
    name: 'Фитинги и арматура',
    description: 'Тройники, переходники, шланги, хомуты, электроклапаны',
    icon: Wrench,
    tags: ['Omega', 'Мультиклапаны', 'ВЗУ'],
  },
];

export default function CatalogPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => {
      const haystack = [c.name, c.description, ...c.tags].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const l = getContactLinks();

  return (
    <>
      <Header />
      <main className="section pt-4 pb-12 md:pt-10 md:pb-20">
        <div className="max-w-3xl">
          <span className="chip"><span className="dot" />Каталог</span>
          <h1 className="h-1 mt-4 text-white">Комплектующие для ГБО</h1>
          <p className="lead mt-4">
            Склад в Махачкале. Оригинальные компоненты для установки 4-го поколения и 4+
            на прямой впрыск. Каталог пополняется — сейчас можно уточнить наличие по телефону
            или через WhatsApp.
          </p>
        </div>

        {/* Поиск */}
        <div
          className="mt-8 md:mt-10 flex items-center gap-3 h-14 pl-5 pr-2 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <Search className="w-5 h-5 text-white/55 flex-none" strokeWidth={2} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по артикулу, бренду, категории..."
            className="flex-1 h-full bg-transparent text-white placeholder:text-white/35 outline-none text-[15px]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="btn btn-ghost !h-10 !px-3 !text-[12px] flex-none"
            >
              Очистить
            </button>
          )}
        </div>

        {/* Категории */}
        {filtered.length === 0 ? (
          <div className="mt-10 liquid-glass p-10 text-center relative overflow-hidden">
            <HexIcon size={200} filled={false} className="absolute -right-10 -top-10 text-white/[0.04]" />
            <div className="relative">
              <div className="text-white/70">Ничего не нашли по запросу «{query}».</div>
              <a
                href={l.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-6"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Написать — уточнить наличие
              </a>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-8 md:mt-10">
            {filtered.map((c) => (
              <Link
                key={c.slug}
                href={`/catalog/${c.slug}`}
                className="card p-6 relative overflow-hidden group hover:-translate-y-1 active:scale-[0.98] transition-transform"
              >
                <HexIcon size={180} filled={false} className="absolute -right-8 -bottom-8 text-white/[0.04] group-hover:text-primary/30 transition-colors" />
                <div className="flex items-center justify-between relative">
                  <span className="w-11 h-11 rounded-xl grid place-items-center bg-primary/15 border border-primary/25 flex-none">
                    <c.icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="h-3 text-white mt-5">{c.name}</h3>
                <p className="text-sm text-white/60 mt-1.5 leading-relaxed">{c.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded-full text-[10px] font-semibold text-white/65"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state notice */}
        <div
          className="mt-10 p-5 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4"
          style={{
            background: 'rgba(74,159,217,0.08)',
            border: '1px solid rgba(74,159,217,0.2)',
          }}
        >
          <div className="flex-1">
            <div className="text-white font-semibold">Каталог товаров в разработке</div>
            <p className="text-sm text-white/65 mt-1 max-w-2xl">
              Сейчас мы подбираем запчасти под заказ — в наличии всегда есть базовые редукторы, форсунки,
              баллоны. Позвоните или напишите в WhatsApp, уточним наличие за 5 минут.
            </p>
          </div>
          <a
            href={l.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex-none"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Уточнить в WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
