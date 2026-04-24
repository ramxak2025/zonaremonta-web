import Link from 'next/link';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { getContactLinks } from '@/lib/site';

interface Kit {
  id: string;
  cylinders?: string;
  title: string;
  type: string;
  forWho: string;
  brands: string;
  priceFrom: number;
  durationHrs: number;
  features: readonly string[];
  featured?: boolean;
}

const KITS: readonly Kit[] = [
  {
    id: 'i4',
    cylinders: '4',
    title: 'На 4 цилиндра',
    type: 'Распределённый впрыск (MPI)',
    forWho:
      'Классические инжекторные моторы: Lada, Toyota, Hyundai, Kia, VW и большинство массовых авто 2005+ года.',
    brands: 'Lovato · BRC · Digitronic · KME',
    priceFrom: 38000,
    durationHrs: 5,
    features: [
      '4 газовые форсунки',
      'Редуктор с электроклапаном',
      'ЭБУ с картами расхода',
      'Баллон на выбор',
      'Гарантия 1 год на работы',
    ],
  },
  {
    id: 'i6',
    cylinders: '6',
    title: 'На 6 цилиндров',
    type: 'Распределённый впрыск (MPI)',
    forWho:
      'V6 и рядные 6-цилиндровые: Toyota Camry V6, Hyundai Grandeur, BMW, премиум-седаны и кроссоверы.',
    brands: 'Lovato · BRC · Digitronic',
    priceFrom: 48000,
    durationHrs: 6,
    features: [
      '6 газовых форсунок',
      'Усиленный редуктор',
      'ЭБУ под 6-цилиндровую конфигурацию',
      'Баллон увеличенного объёма',
      'Гарантия 1 год на работы',
    ],
  },
  {
    id: 'v8',
    cylinders: '8',
    title: 'На 8 цилиндров (V8)',
    type: 'Распределённый впрыск (MPI)',
    forWho:
      'V8 для крупных внедорожников и пикапов: Toyota Land Cruiser 200, Lexus LX, GMC, Ford F-150.',
    brands: 'Lovato · BRC',
    priceFrom: 65000,
    durationHrs: 8,
    features: [
      '8 газовых форсунок',
      'Два редуктора (левый / правый)',
      'Расширенный блок управления',
      'Баллон 90–120 литров',
      'Гарантия 1 год на работы',
    ],
  },
  {
    id: 'gdi',
    title: 'На прямой впрыск',
    type: 'GDI · FSI · TSI · D-4S',
    forWho:
      'Современные турбомоторы: VW TSI, Mercedes CGI, Kia GDI, Mazda SkyActiv, новые китайские TGDI.',
    brands: 'Prins VSI-DI · OMVL DREAM',
    priceFrom: 95000,
    durationHrs: 8,
    features: [
      'Работа с впрыском в цилиндр',
      'Защита бензиновых форсунок от закокса',
      'Адаптивное управление газом',
      'Сохранение ресурса турбомотора',
      'Гарантия 1 год на работы',
    ],
    featured: true,
  },
  {
    id: 'combi',
    title: 'На комбинированный впрыск',
    type: 'GDI + Port Injection',
    forWho:
      'Двойной впрыск: Toyota D-4S (Camry, RAV4, Land Cruiser Prado), Volvo VEA, Audi TFSI нового поколения.',
    brands: 'Prins VSI-DI · OMVL DREAM XXI',
    priceFrom: 110000,
    durationHrs: 9,
    features: [
      'Работа одновременно с двумя системами',
      'Автоматическое переключение режимов',
      'Сохранение заводских прошивок',
      'Полная диагностика при ТО',
      'Гарантия 1 год на работы',
    ],
    featured: true,
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
        <h2 className="h-1 text-white">Комплекты ГБО под любой двигатель</h2>
        <p className="lead">
          Ставим на распределённый впрыск (4 / 6 / 8 цилиндров), на прямой впрыск и на комбинированные
          системы. Для прямого и комбинированного — оборудование{' '}
          <span className="text-white">Prins</span> и <span className="text-white">OMVL</span>.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {KITS.map((k) => (
          <article
            key={k.id}
            className="card flex flex-col gap-5"
            style={
              k.featured
                ? {
                    background:
                      'linear-gradient(180deg, rgba(232,18,36,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                    border: '1px solid rgba(232,18,36,0.25)',
                  }
                : undefined
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-3 min-w-0">
                {k.cylinders ? (
                  <span className="num-2xl text-gradient">{k.cylinders}</span>
                ) : (
                  <span className="num-lg text-gradient">
                    {k.id === 'gdi' ? 'DI' : 'DUAL'}
                  </span>
                )}
                <div className="flex flex-col gap-1.5 min-w-0">
                  <h3 className="h-3 text-white text-break">{k.title}</h3>
                  <p className="eyebrow eyebrow-mute text-break">{k.type}</p>
                </div>
              </div>
              {k.featured && (
                <span
                  className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(232, 18, 36, 0.15)',
                    color: '#FF3E4F',
                    border: '1px solid rgba(232, 18, 36, 0.3)',
                  }}
                >
                  Флагман
                </span>
              )}
            </div>

            <p className="text-[13px] text-white/70 leading-relaxed text-break">{k.forWho}</p>

            <div className="flex flex-col gap-2">
              <div className="eyebrow eyebrow-mute">Оборудование</div>
              <p className="text-[13px] text-white/85 text-break">{k.brands}</p>
            </div>

            <ul className="flex flex-col gap-1.5">
              {k.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-white/75">
                  <Check className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" strokeWidth={2.4} />
                  <span className="text-break">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between gap-3">
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="eyebrow eyebrow-mute">Под ключ от</div>
                <div className="num-lg text-white">
                  {k.priceFrom.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-[11px] text-white/50">~ {k.durationHrs} ч работы</div>
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
      <div className="mt-5 card flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="icon-tile">
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
        Цена «под ключ» включает оборудование, установку и настройку.
        Точная цифра — после диагностики двигателя.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
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
