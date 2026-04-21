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
  features: string[];
  notForWho?: string;
  badge?: string;
}

const TIERS: readonly Tier[] = [
  {
    code: '4',
    title: 'ГБО 4-е поколение',
    subtitle: 'Инжекторный распределённый впрыск',
    forWho:
      'Современные бензиновые авто с обычным инжектором: большинство машин 2005+ года выпуска.',
    brands: 'Lovato · BRC · Digitronic · KME · Alpha',
    priceFrom: 38000,
    durationHrs: 6,
    features: [
      'Электронный блок управления газом (ЭБУ)',
      'Форсунки по числу цилиндров',
      'Редуктор с электроклапаном',
      'Баллон на выбор (тороидальный или цилиндр)',
      'Настройка и калибровка карт расхода',
      'Регистрация в ГИБДД',
    ],
  },
  {
    code: '4+',
    title: 'ГБО 4+ поколение',
    subtitle: 'Непосредственный впрыск (GDI / FSI / TSI / DI)',
    forWho:
      'Авто с прямым впрыском топлива в камеру сгорания: VW TSI, Mercedes CGI, Toyota D-4S, Mazda SkyActiv, Kia GDI и пр.',
    brands: 'Prins VSI-DI · BRC Sequent DI · Landi Renzo Direct',
    priceFrom: 95000,
    durationHrs: 8,
    features: [
      'Работа с прямым впрыском без замены форсунок',
      'Защита бензиновых форсунок от закоксовывания',
      'Адаптивная система впрыска газа',
      'Поддержка высоких степеней сжатия',
      'Сохранение динамики и ресурса двигателя',
      'Регистрация в ГИБДД',
    ],
    badge: 'Топовое оборудование',
  },
];

const NOT_INSTALLING = [
  { title: 'ГБО 2-го поколения', reason: 'устарело, не регистрируется в ГИБДД' },
  { title: 'На карбюраторные авто', reason: 'невыгодно экономически' },
  { title: 'Метан (КПГ)', reason: 'не работаем — только пропан-бутан (СУГ)' },
];

export function WhatWeInstall() {
  const l = getContactLinks();
  return (
    <section id="services" className="section section-y">
      <div className="max-w-3xl stack-6 mb-12 md:mb-16">
        <span className="eyebrow">Услуги</span>
        <h2 className="h-1 text-white">Два поколения ГБО — под любой двигатель</h2>
        <p className="lead">
          4-е поколение для обычных инжекторов и 4+ для прямого впрыска.
          Это всё, что нужно современному автомобилю.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {TIERS.map((t) => (
          <article key={t.code} className="card p-6 md:p-8 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[56px] md:text-[72px] leading-none text-gradient tracking-tight">
                    {t.code}
                  </span>
                  {t.code === '4+' && (
                    <span className="text-white/40 text-xs uppercase tracking-widest">DI</span>
                  )}
                </div>
                <h3 className="h-2 text-white mt-3">{t.title}</h3>
                <p className="text-white/60 text-sm mt-1">{t.subtitle}</p>
              </div>
              {t.badge && (
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,62,79,0.2), rgba(232,18,36,0.15))',
                    color: '#FF3E4F',
                    border: '1px solid rgba(232,18,36,0.35)',
                  }}
                >
                  {t.badge}
                </span>
              )}
            </div>

            <p className="text-white/70 text-sm mt-5 leading-relaxed">{t.forWho}</p>

            <div className="mt-4 text-[11px] uppercase tracking-[0.2em] text-white/40">
              Оборудование
            </div>
            <p className="text-sm text-white/80 mt-1">{t.brands}</p>

            <ul className="mt-6 space-y-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-white/80">
                  <Check className="w-4 h-4 text-[#22C55E] mt-0.5 flex-none" strokeWidth={2.5} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8 flex items-end justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Под ключ от
                </div>
                <div className="font-display text-[40px] md:text-[48px] leading-none text-white tracking-tight mt-1">
                  {t.priceFrom.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-xs text-white/50 mt-1">~ {t.durationHrs} часов работы</div>
              </div>
              <a
                href={l.phoneHref}
                className="btn btn-primary"
                aria-label={`Позвонить и записаться на ${t.title}`}
              >
                Записаться
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Что НЕ делаем — честность повышает доверие */}
      <div className="mt-6 card p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-white/5 grid place-items-center flex-none">
            <X className="w-5 h-5 text-white/60" />
          </span>
          <div className="font-semibold text-white">Чем мы не занимаемся</div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
          {NOT_INSTALLING.map((n) => (
            <span key={n.title}>
              <span className="text-white/80">{n.title}</span> — {n.reason}
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/45 mt-4">
        Цена «под ключ» включает оборудование, установку, настройку, паспорт ГБО и помощь с регистрацией
        в ГИБДД. Точная цифра — после бесплатной диагностики двигателя на стенде.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/calculator" className="btn btn-primary btn-lg">
          Рассчитать экономию под моё авто
        </Link>
        <a
          href={l.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-lg"
        >
          Проконсультироваться в WhatsApp
        </a>
      </div>
    </section>
  );
}
