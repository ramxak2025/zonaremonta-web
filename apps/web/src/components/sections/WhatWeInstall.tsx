import Link from 'next/link';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { getContactLinks } from '@/lib/site';

interface Tier {
  code: '4' | '4+';
  title: string;
  subtitle: string;
  forWho: string;
  brands: string;
  priceFrom: number;
  durationHrs: number;
  features: readonly string[];
  badge?: string;
}

const TIERS: readonly Tier[] = [
  {
    code: '4',
    title: 'ГБО 4-е поколение',
    subtitle: 'Инжекторный распределённый впрыск',
    forWho:
      'Современные бензиновые авто с обычным инжектором — большинство машин 2005+ года выпуска.',
    brands: 'Lovato · BRC · Digitronic · KME · Alpha',
    priceFrom: 38000,
    durationHrs: 6,
    features: [
      'Электронный блок управления (ЭБУ)',
      'Форсунки по числу цилиндров',
      'Редуктор с электроклапаном',
      'Баллон на выбор',
      'Настройка карт расхода',
      'Регистрация в ГИБДД',
    ],
  },
  {
    code: '4+',
    title: 'ГБО 4+ поколение',
    subtitle: 'Непосредственный впрыск (GDI / FSI / TSI / DI)',
    forWho:
      'Авто с прямым впрыском топлива в камеру сгорания: VW TSI, Mercedes CGI, Toyota D-4S, Mazda SkyActiv, Kia GDI и др.',
    brands: 'Prins VSI-DI · BRC Sequent DI · Landi Renzo Direct',
    priceFrom: 95000,
    durationHrs: 8,
    features: [
      'Работа с прямым впрыском',
      'Защита бензиновых форсунок',
      'Адаптивная система впрыска',
      'Поддержка высоких степеней сжатия',
      'Сохранение ресурса двигателя',
      'Регистрация в ГИБДД',
    ],
    badge: 'Топовое оборудование',
  },
];

const NOT_INSTALLING = [
  { title: 'ГБО 2-го поколения', reason: 'не регистрируется в ГИБДД' },
  { title: 'Карбюратор', reason: 'невыгодно' },
  { title: 'Метан (КПГ)', reason: 'работаем только с пропан-бутаном' },
] as const;

export function WhatWeInstall() {
  const l = getContactLinks();
  return (
    <section id="services" className="section section-y">
      <div className="section-head">
        <span className="eyebrow">Услуги</span>
        <h2 className="h-1 text-white">Два поколения ГБО — под любой двигатель</h2>
        <p className="lead">
          4-е поколение для обычных инжекторов и 4+ для прямого впрыска.
          Это всё, что нужно современному автомобилю.
        </p>
      </div>

      {/* Две карточки — стек на mobile, 2 колонки на tablet+ */}
      <div className="grid md:grid-cols-2 gap-3 md:gap-4">
        {TIERS.map((t) => (
          <article key={t.code} className="card p-6 md:p-8 flex flex-col gap-6">
            {/* Шапка карточки */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-3 min-w-0">
                <span
                  className="font-display font-bold leading-none text-gradient"
                  style={{ fontSize: 'clamp(44px, 8vw, 64px)', paddingBottom: '0.04em' }}
                >
                  {t.code}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="h-2 text-white">{t.title}</h3>
                  <p className="text-[13px] text-white/60 leading-relaxed">{t.subtitle}</p>
                </div>
              </div>
              {t.badge && (
                <span
                  className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(232, 18, 36, 0.15)',
                    color: '#FF3E4F',
                    border: '1px solid rgba(232, 18, 36, 0.3)',
                  }}
                >
                  {t.badge}
                </span>
              )}
            </div>

            <p className="text-[14px] text-white/70 leading-relaxed text-break">{t.forWho}</p>

            <div className="flex flex-col gap-2">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold">
                Оборудование
              </div>
              <p className="text-[14px] text-white/80 text-break">{t.brands}</p>
            </div>

            <ul className="flex flex-col gap-2">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-white/80">
                  <Check className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" strokeWidth={2.4} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold">
                  Под ключ от
                </div>
                <div
                  className="font-display text-white leading-none tracking-tight"
                  style={{ fontSize: 'clamp(28px, 5vw, 40px)', paddingBottom: '0.04em' }}
                >
                  {t.priceFrom.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-[12px] text-white/50">~ {t.durationHrs} часов работы</div>
              </div>
              <a href={l.phoneHref} className="btn btn-primary btn-sm flex-shrink-0">
                Записаться
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Что НЕ делаем */}
      <div className="mt-4 card p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="w-10 h-10 rounded-lg grid place-items-center bg-white/5 flex-shrink-0">
            <X className="w-5 h-5 text-white/60" />
          </span>
          <div className="font-semibold text-white">Чем мы не занимаемся</div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/60">
          {NOT_INSTALLING.map((n) => (
            <span key={n.title} className="text-break">
              <span className="text-white/85">{n.title}</span> — {n.reason}
            </span>
          ))}
        </div>
      </div>

      <p className="text-[12px] text-white/45 mt-5 max-w-prose">
        Цена «под ключ» включает оборудование, установку, настройку, паспорт ГБО и помощь
        с регистрацией в ГИБДД. Точная цифра — после бесплатной диагностики.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/calculator" className="btn btn-primary btn-lg">
          Рассчитать экономию под моё авто
        </Link>
        <a href={l.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
          Проконсультироваться в WhatsApp
        </a>
      </div>
    </section>
  );
}
