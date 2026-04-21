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
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 hex-grid pointer-events-none opacity-[0.55]" />

      <div className="section relative pt-8 pb-10 md:pt-14 md:pb-24">
        {/* Eyebrow-плашка */}
        <div className="mb-7 md:mb-10">
          <span className="chip">
            <span className="dot" />
            Сертифицированный сервис по ГБО в Махачкале
          </span>
        </div>

        {/* BENTO GRID */}
        <div
          className="grid gap-3 md:gap-4"
          style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}
        >
          {/* ── Главная карточка ── */}
          <article className="liquid-glass col-span-6 lg:col-span-4 lg:row-span-2 relative overflow-hidden p-7 md:p-12">
            <HexIcon
              size={440}
              filled={false}
              className="absolute -right-28 -top-24 text-white/[0.05] pointer-events-none"
            />

            <div className="relative stack-6">
              <div className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.24em] text-white/60 font-semibold">
                <span className="accent-bar" />
                Запись на установку открыта
              </div>

              <h1 className="h-display text-white">
                <span className="block sm:inline">Заправляйтесь</span>
                <span className="hidden sm:inline"> </span>
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
                className="text-white/80 max-w-xl"
                style={{ fontSize: 'clamp(15px, 1.55vw, 18px)', lineHeight: 1.6 }}
              >
                Установим за один рабочий день. Сертифицированное оборудование,
                регистрация в ГИБДД, гарантия 1 год на работы. Первая диагностика — бесплатно.
              </p>
            </div>

            {/* Trust row — 2 рейтинга */}
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-2.5">
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

            {/* CTA + secondary link */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/calculator"
                className="btn btn-primary btn-lg"
              >
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
          </article>

          {/* ── Окупаемость ── */}
          <article className="card-strong col-span-3 lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[200px] lg:min-h-[230px] p-6 md:p-7">
            <span className="chip !py-1 !px-2.5 !text-[10px] self-start">
              <Clock className="w-3 h-3" />
              Окупаемость
            </span>
            <div className="stack-2">
              <div
                className="font-display leading-[0.95] tracking-tight"
                style={{
                  fontSize: 'clamp(52px, 10vw, 84px)',
                  background:
                    'linear-gradient(180deg, #FFFFFF 0%, rgba(255,62,79,0.95) 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                8
              </div>
              <div className="text-white/65 text-[13px]">месяцев — и в плюсе</div>
            </div>
          </article>

          {/* ── Экономия ── */}
          <article className="card-strong col-span-3 lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[200px] lg:min-h-[230px] p-6 md:p-7">
            <span className="chip !py-1 !px-2.5 !text-[10px] self-start">
              <Fuel className="w-3 h-3" />
              Экономия
            </span>
            <div className="stack-2">
              <div className="flex items-baseline gap-1">
                <span
                  className="font-display leading-[0.95] tracking-tight text-white"
                  style={{ fontSize: 'clamp(52px, 10vw, 84px)' }}
                >
                  55
                </span>
                <span className="font-display text-3xl md:text-4xl text-white/70">%</span>
              </div>
              <div className="text-white/65 text-[13px]">на топливе от пробега</div>
            </div>
          </article>

          {/* ── Средний чек ── */}
          <article className="card-strong col-span-6 lg:col-span-4 relative overflow-hidden p-7 md:p-9">
            <HexIcon
              size={220}
              filled={false}
              className="absolute -right-12 -bottom-12 text-white/[0.05] pointer-events-none"
            />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 grid place-items-center relative flex-none">
                <HexIcon size={48} className="text-[#FF3E4F] absolute" />
                <span className="relative text-white font-display font-bold text-[11px]">
                  4+
                </span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/55 font-semibold">
                  Под ключ от
                </div>
                <div className="font-display text-[32px] md:text-[38px] text-white leading-none mt-2">
                  38 000 ₽
                </div>
              </div>
            </div>
            <ul className="mt-8 grid sm:grid-cols-2 gap-2.5 relative">
              {[
                'Оборудование Lovato / BRC / Prins',
                'Диагностика двигателя на стенде',
                'Настройка ЭБУ и карт расхода',
                'Паспорт ГБО и регистрация в ГИБДД',
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-white/85"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-none" strokeWidth={2.5} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* ── Телефон ── */}
          <a
            href={l.phoneHref}
            aria-label={`Позвонить ${phone}`}
            className="card-strong col-span-3 lg:col-span-1 relative overflow-hidden flex flex-col justify-between min-h-[160px] p-6 active:scale-[0.98] transition-transform group"
          >
            <span className="w-11 h-11 rounded-2xl grid place-items-center bg-primary/20 border border-primary/30 flex-none group-hover:bg-primary/30 transition-colors">
              <PhoneFilledIcon className="w-5 h-5 text-[#FF3E4F]" />
            </span>
            <div className="stack-2">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 font-semibold">
                Позвонить
              </div>
              <div
                className="font-display text-white leading-tight"
                style={{ fontSize: 'clamp(15px, 3.2vw, 18px)' }}
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
            className="card-strong col-span-3 lg:col-span-1 relative overflow-hidden flex flex-col justify-between min-h-[160px] p-6 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <span className="w-11 h-11 rounded-2xl grid place-items-center bg-[#FFCC00]/15 border border-[#FFCC00]/30 flex-none">
                <YandexMapsIcon className="w-5 h-5 text-[#FFCC00]" />
              </span>
              <MapPin className="w-4 h-4 text-white/40" />
            </div>
            <div className="stack-2">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 font-semibold">
                Мы находимся
              </div>
              <div
                className="text-white leading-[1.3] font-medium line-clamp-2"
                style={{ fontSize: 'clamp(12px, 2.8vw, 14px)' }}
              >
                {address}
              </div>
            </div>
          </a>

          {/* ── Гарантия ── */}
          <article className="card-strong col-span-6 lg:col-span-2 relative overflow-hidden flex items-center gap-4 min-h-[96px] p-6">
            <span className="w-12 h-12 rounded-2xl grid place-items-center bg-white/[0.05] border border-white/10 flex-none">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-[14px]">Гарантия 1 год</div>
              <div className="text-white/60 text-[12px] mt-0.5">на работы и оборудование</div>
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

function RatingPill({
  logo, source, rating, count,
}: { logo: React.ReactNode; source: string; rating: number; count: number }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full"
      style={{
        background: 'rgba(255,255,255,0.055)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span className="flex-none">{logo}</span>
      <span className="font-display text-[15px] text-white leading-none">
        {rating.toFixed(1)}
      </span>
      <span className="text-[12px] text-white/55">{source}</span>
      <span className="text-[11px] text-white/35">· {count}</span>
    </div>
  );
}
