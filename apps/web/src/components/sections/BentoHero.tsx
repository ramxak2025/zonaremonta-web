import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Clock, Fuel, MapPin, ShieldCheck } from 'lucide-react';
import type { PublicSettings } from '@05auto/shared';
import { getContactLinks } from '@/lib/site';
import {
  PhoneFilledIcon, YandexLogoIcon, TwoGisLogoIcon, YandexMapsIcon,
} from '../BrandIcons';
import { HexIcon } from '../HexIcon';

interface Props {
  settings: Required<PublicSettings>;
}

export function BentoHero({ settings }: Props) {
  const l = getContactLinks();
  const phone = settings['site.phone'].value;
  const address = settings['site.address'].value;
  const yRating = settings['reviews.yandex.rating'].value;
  const yCount = settings['reviews.yandex.count'].value;
  const gRating = settings['reviews.twogis.rating'].value;
  const gCount = settings['reviews.twogis.count'].value;

  return (
    <section className="section pt-6 pb-10 md:pt-10 md:pb-16">
      <div className="mb-6 md:mb-8">
        <span className="chip">
          <span className="dot" />
          Сертифицированный сервис по ГБО в Махачкале
        </span>
      </div>

      {/* BENTO GRID: 2 cols mobile / 6 tablet / 12 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4">
        {/* ── HERO CARD ── */}
        <article className="col-span-2 md:col-span-6 lg:col-span-8 lg:row-span-2 card-strong-lg relative overflow-hidden flex flex-col justify-between gap-8 md:gap-10 min-h-[320px] md:min-h-[420px]">
          <HexIcon
            size={240}
            filled={false}
            className="absolute -right-12 -top-10 text-white/[0.04] pointer-events-none"
          />

          <div className="relative">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/55 font-semibold mb-5">
              <span className="accent-bar" />
              <span>Запись открыта</span>
            </div>

            <h1 className="h-display text-white mb-5">
              Заправляйтесь
              <br />
              <span className="text-gradient">в 2 раза дешевле</span>
              <br />
              уже завтра
            </h1>

            <p className="lead max-w-prose">
              Установим за один рабочий день. Сертифицированное оборудование
              Lovato, BRC, Prins, OMVL. Гарантия 1 год на работы.
            </p>
          </div>

          <div className="relative flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/calculator" className="btn btn-primary btn-lg">
                Записаться на установку
                <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
              </Link>
              <Link
                href="/#services"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white/75 hover:text-white transition-colors"
              >
                Все комплекты
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <RatingPill logo={<YandexLogoIcon className="w-6 h-6" />} source="Яндекс" rating={yRating} count={yCount} />
              <RatingPill logo={<TwoGisLogoIcon className="w-6 h-6" />} source="2ГИС" rating={gRating} count={gCount} />
            </div>
          </div>
        </article>

        {/* ── МЕТРИКИ ── */}
        <Metric
          label="Окупаемость"
          icon={<Clock className="w-3 h-3" />}
          value="8"
          unit="мес"
          hint="и ГБО в плюсе"
        />
        <Metric
          label="Экономия"
          icon={<Fuel className="w-3 h-3" />}
          value="55"
          unit="%"
          hint="на топливе"
        />

        {/* ── ЧТО ВКЛЮЧАЕТ ЦЕНА ── */}
        <article className="col-span-2 md:col-span-6 lg:col-span-4 card-strong-lg relative overflow-hidden flex flex-col gap-5">
          <HexIcon
            size={140}
            filled={false}
            className="absolute -right-6 -bottom-6 text-white/[0.04] pointer-events-none"
          />

          <div className="relative flex items-center gap-4">
            <span className="icon-tile icon-tile-primary">
              <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.4} />
            </span>
            <div className="min-w-0">
              <div className="eyebrow eyebrow-mute">Под ключ от</div>
              <div className="num-xl text-white mt-2">38 000 ₽</div>
            </div>
          </div>

          <ul className="relative grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Оборудование Lovato · BRC · Prins · OMVL',
              'Диагностика двигателя на стенде',
              'Настройка ЭБУ и карт расхода',
              'Гарантия 1 год на работы',
            ].map((t) => (
              <li
                key={t}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[13px] text-white/85"
              >
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" strokeWidth={2.4} />
                <span className="text-break">{t}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* ── ТЕЛЕФОН ── */}
        <a
          href={l.phoneHref}
          aria-label={`Позвонить ${phone}`}
          className="col-span-2 md:col-span-3 lg:col-span-4 card-strong flex items-center gap-4 min-h-[88px] hover:bg-white/[0.06] active:scale-[0.98] transition-all"
        >
          <span className="icon-tile icon-tile-primary">
            <PhoneFilledIcon className="w-5 h-5 text-[#FF3E4F]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="eyebrow eyebrow-mute">Позвонить</div>
            <div className="font-display text-[17px] md:text-[18px] text-white leading-tight mt-1.5 text-break">
              {phone}
            </div>
          </div>
        </a>

        {/* ── Я.КАРТЫ ── */}
        <a
          href={l.mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 md:col-span-3 lg:col-span-4 card-strong flex items-center gap-4 min-h-[88px] hover:bg-white/[0.06] active:scale-[0.98] transition-all"
        >
          <span
            className="icon-tile"
            style={{ background: 'rgba(255,204,0,0.15)', borderColor: 'rgba(255,204,0,0.25)' }}
          >
            <YandexMapsIcon className="w-5 h-5 text-[#FFCC00]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="eyebrow eyebrow-mute">Мы находимся</div>
            <div className="text-[13px] md:text-sm font-medium text-white leading-snug mt-1.5 clamp-2 text-break">
              {address}
            </div>
          </div>
          <MapPin className="w-4 h-4 text-white/40 flex-shrink-0" />
        </a>

        {/* ── ГАРАНТИЯ ── */}
        <article className="col-span-2 md:col-span-6 lg:col-span-4 card-strong flex items-center gap-4 min-h-[88px]">
          <span className="icon-tile">
            <ShieldCheck className="w-5 h-5 text-[#22C55E]" strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-white text-[14px]">Гарантия 1 год</div>
            <div className="text-[12px] text-white/55 mt-0.5">на работы и оборудование</div>
          </div>
          <Link href="/#services" className="btn btn-sm btn-ghost flex-shrink-0">
            Услуги
          </Link>
        </article>
      </div>
    </section>
  );
}

function Metric({
  label, icon, value, unit, hint,
}: {
  label: string; icon: React.ReactNode; value: string; unit: string; hint: string;
}) {
  return (
    <article className="col-span-1 md:col-span-3 lg:col-span-2 card-strong flex flex-col justify-between gap-4 min-h-[180px] md:min-h-[200px]">
      <span className="chip self-start">
        {icon}
        <span>{label}</span>
      </span>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-1.5">
          <span className="num-2xl text-white">{value}</span>
          <span className="font-display text-[20px] md:text-[24px] text-white/65 leading-none">
            {unit}
          </span>
        </div>
        <div className="text-[12px] text-white/55 text-break">{hint}</div>
      </div>
    </article>
  );
}

function RatingPill({
  logo, source, rating, count,
}: { logo: React.ReactNode; source: string; rating: number; count: number }) {
  return (
    <div className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
      <span className="flex-shrink-0">{logo}</span>
      <span className="font-display text-[14px] text-white leading-none">{rating.toFixed(1)}</span>
      <span className="text-[12px] text-white/60">{source}</span>
      <span className="text-[11px] text-white/35 hidden sm:inline">· {count}</span>
    </div>
  );
}
