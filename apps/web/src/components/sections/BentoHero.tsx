import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Clock, Fuel, MapPin, ShieldCheck } from 'lucide-react';
import type { PublicSettings } from '@05auto/shared';
import { getContactLinks } from '@/lib/site';
import { PhoneFilledIcon, YandexLogoIcon, TwoGisLogoIcon, YandexMapsIcon } from '../BrandIcons';
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
    <section className="relative">
      <div className="section pt-6 pb-12 md:pt-10 md:pb-20">
        {/* Eyebrow-плашка */}
        <div className="mb-6 md:mb-8">
          <span className="chip">
            <span className="dot" />
            Сертифицированный сервис по ГБО в Махачкале
          </span>
        </div>

        {/*
          Современный bento-grid, 2026-style:
          - mobile: 2 колонки
          - tablet: 6 колонок
          - desktop: 12 колонок
          - Строгие aspect-ratios + единый gap
        */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4 auto-rows-auto">
          {/* ── HERO CARD (2×2 mobile / 4×2 desktop) ── */}
          <article className="col-span-2 md:col-span-6 lg:col-span-8 row-span-2 card-strong p-6 md:p-10 lg:p-12 relative overflow-hidden flex flex-col justify-between gap-8 md:gap-10">
            <HexIcon
              size={440}
              filled={false}
              className="absolute -right-28 -top-24 text-white/[0.04] pointer-events-none"
            />

            <div className="flex flex-col gap-5 md:gap-6 relative">
              <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-white/55 font-semibold">
                <span className="accent-bar" />
                Запись на установку открыта
              </div>

              <h1 className="h-display text-white">
                <span className="block sm:inline">Заправляйтесь</span>{' '}
                <span
                  className="block sm:inline"
                  style={{
                    background:
                      'linear-gradient(135deg, #FF3E4F 0%, #E81224 55%, #4A9FD9 140%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  в 2 раза дешевле
                </span>
                <span className="block">уже завтра</span>
              </h1>

              <p
                className="text-white/75 max-w-xl"
                style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', lineHeight: 1.65 }}
              >
                Установим за один рабочий день. Сертифицированное оборудование,
                регистрация в ГИБДД, гарантия 1 год на работы. Первая диагностика — бесплатно.
              </p>
            </div>

            {/* Нижний блок: CTA + trust-bar */}
            <div className="flex flex-col gap-5 md:gap-6 relative">
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/calculator" className="btn btn-primary btn-lg">
                  Записаться на установку
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#services"
                  className="inline-flex items-center gap-1.5 text-white/75 hover:text-white transition-colors text-[14px] font-medium"
                >
                  Подробно о 4 и 4+
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <RatingPill
                  logo={<YandexLogoIcon className="w-7 h-7" />}
                  source="Яндекс"
                  rating={yRating}
                  count={yCount}
                />
                <RatingPill
                  logo={<TwoGisLogoIcon className="w-7 h-7" />}
                  source="2ГИС"
                  rating={gRating}
                  count={gCount}
                />
              </div>
            </div>
          </article>

          {/* ── Окупаемость (1×1 mobile / 2×1 desktop) ── */}
          <Metric
            label="Окупаемость"
            icon={<Clock className="w-3 h-3" />}
            value="8"
            suffix="месяцев"
            tint="red"
          />

          {/* ── Экономия ── */}
          <Metric
            label="Экономия"
            icon={<Fuel className="w-3 h-3" />}
            value="55"
            suffix="%"
            tint="neutral"
          />

          {/* ── Средний чек со checklist (2×2 mobile / 4×2 desktop) ── */}
          <article className="col-span-2 md:col-span-6 lg:col-span-4 row-span-2 card-strong p-6 md:p-7 relative overflow-hidden flex flex-col gap-5 md:gap-6">
            <HexIcon
              size={200}
              filled={false}
              className="absolute -right-10 -bottom-10 text-white/[0.04] pointer-events-none"
            />
            <div className="flex items-center gap-4 relative">
              <div className="w-12 h-12 grid place-items-center relative flex-none">
                <HexIcon size={48} className="text-[#FF3E4F] absolute" />
                <span className="relative text-white font-display font-bold text-[11px]">4+</span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/55 font-semibold">
                  Под ключ от
                </div>
                <div className="font-display text-[28px] md:text-[32px] text-white leading-none mt-1.5">
                  38 000 ₽
                </div>
              </div>
            </div>

            <ul className="grid gap-2 relative">
              {[
                'Оборудование Lovato / BRC',
                'Диагностика на стенде',
                'Настройка ЭБУ и карт',
                'Регистрация в ГИБДД',
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[13px] text-white/85"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-none" strokeWidth={2.5} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* ── Телефон (mobile 1×1 / desktop 4×1) ── */}
          <a
            href={l.phoneHref}
            aria-label={`Позвонить ${phone}`}
            className="col-span-2 md:col-span-4 lg:col-span-4 card-strong p-5 md:p-6 flex items-center gap-4 min-h-[96px] hover:bg-white/[0.06] active:scale-[0.98] transition-all"
          >
            <span className="w-11 h-11 rounded-xl grid place-items-center bg-primary/20 border border-primary/30 flex-none">
              <PhoneFilledIcon className="w-5 h-5 text-[#FF3E4F]" />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/55 font-semibold">
                Позвонить
              </div>
              <div
                className="font-display text-white leading-tight mt-1"
                style={{ fontSize: 'clamp(15px, 2.4vw, 19px)' }}
              >
                {phone}
              </div>
            </div>
          </a>

          {/* ── Я.Карты ── */}
          <a
            href={l.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 md:col-span-2 lg:col-span-4 card-strong p-5 md:p-6 flex items-center gap-4 min-h-[96px] hover:bg-white/[0.06] active:scale-[0.98] transition-all"
          >
            <span className="w-11 h-11 rounded-xl grid place-items-center bg-[#FFCC00]/15 border border-[#FFCC00]/25 flex-none">
              <YandexMapsIcon className="w-5 h-5 text-[#FFCC00]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/55 font-semibold">
                Мы находимся
              </div>
              <div
                className="text-white leading-tight font-medium mt-1 line-clamp-2"
                style={{ fontSize: 'clamp(12px, 1.6vw, 14px)' }}
              >
                {address}
              </div>
            </div>
            <MapPin className="w-4 h-4 text-white/40 flex-none" />
          </a>

          {/* ── Гарантия ── */}
          <article className="col-span-2 md:col-span-6 lg:col-span-4 card-strong p-5 md:p-6 flex items-center gap-4 min-h-[96px]">
            <span className="w-12 h-12 rounded-xl grid place-items-center bg-white/[0.04] border border-white/[0.08] flex-none">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-[14px]">Гарантия 1 год</div>
              <div className="text-white/55 text-[12px] mt-0.5">на работы и оборудование</div>
            </div>
            <Link href="/#services" className="btn btn-ghost !h-9 !px-4 !text-[12px] flex-none">
              Подробнее
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label, icon, value, suffix, tint,
}: {
  label: string; icon: React.ReactNode; value: string; suffix: string; tint: 'red' | 'neutral';
}) {
  return (
    <article className="col-span-1 md:col-span-3 lg:col-span-2 card-strong p-5 md:p-6 flex flex-col justify-between min-h-[180px] md:min-h-[200px] gap-3">
      <span className="chip !py-1 !px-2.5 !text-[10px] self-start">
        {icon}
        {label}
      </span>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-1">
          <span
            className="font-display leading-none tracking-tight"
            style={{
              fontSize: 'clamp(48px, 6vw, 72px)',
              background:
                tint === 'red'
                  ? 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,62,79,0.9) 100%)'
                  : '#FFFFFF',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: tint === 'red' ? 'transparent' : '#FFFFFF',
            }}
          >
            {value}
          </span>
          <span className="font-display text-2xl text-white/65">{suffix}</span>
        </div>
      </div>
    </article>
  );
}

function RatingPill({
  logo, source, rating, count,
}: { logo: React.ReactNode; source: string; rating: number; count: number }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <span className="flex-none">{logo}</span>
      <span className="font-display text-[15px] text-white leading-none">{rating.toFixed(1)}</span>
      <span className="text-[12px] text-white/60">{source}</span>
      <span className="text-[11px] text-white/35">· {count}</span>
    </div>
  );
}
