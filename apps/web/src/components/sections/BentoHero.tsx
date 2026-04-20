import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Clock, Fuel, MapPin, ShieldCheck, Star } from 'lucide-react';
import type { PublicSettings } from '@05auto/shared';
import { getContactLinks } from '@/lib/site';
import { PhoneFilledIcon, YandexMapsIcon } from '../BrandIcons';
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
        {/* Eyebrow */}
        <div className="mb-6 md:mb-8">
          <span className="chip">
            <span className="dot" />
            <span className="hidden sm:inline">Специализированный сервис ГБО</span>
            <span className="sm:hidden">ГБО 4 и 4+</span>
            <span className="mx-1 opacity-50">·</span>
            Махачкала
          </span>
        </div>

        {/* BENTO GRID */}
        <div
          className="grid gap-3 md:gap-4"
          style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}
        >
          {/* ── Главная hero-карточка ── */}
          <article className="liquid-glass col-span-6 lg:col-span-4 lg:row-span-2 relative overflow-hidden flex flex-col p-7 md:p-12">
            <HexIcon
              size={420}
              filled={false}
              className="absolute -right-28 -top-24 text-white/[0.05] pointer-events-none"
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2.5 text-[10px] md:text-xs uppercase tracking-[0.28em] text-white/55 font-semibold">
                <span className="accent-bar" />
                Газ вместо бензина
              </div>
              <h1
                className="font-display font-bold uppercase text-white mt-5 leading-[0.92]"
                style={{ fontSize: 'clamp(36px, 7.8vw, 80px)', letterSpacing: '-0.03em' }}
              >
                Минус 50%{' '}
                <br className="hidden sm:block" />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #FF3E4F 0%, #E81224 55%, #4A9FD9 140%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  на каждой заправке
                </span>
              </h1>
              <p className="mt-6 text-[15px] md:text-[18px] text-white/75 leading-relaxed max-w-xl">
                Устанавливаем ГБО 4-го и 4+ поколения в Махачкале. За 1 день. С гарантией 1 год.
                С регистрацией в ГИБДД. Экономия начинается с первого километра.
              </p>
            </div>

            {/* Trust-row — 2 рейтинга */}
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-2.5">
              <RatingBadge source="Яндекс" rating={yRating} count={yCount} color="#FFCC00" />
              <RatingBadge source="2GIS" rating={gRating} count={gCount} color="#5FBA47" />
            </div>

            {/* CTA-ссылки */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-1.5 text-white font-semibold hover:text-[#FF3E4F] transition-colors group"
              >
                Рассчитать мою экономию
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </Link>
              <span className="text-white/20">·</span>
              <Link
                href="/#services"
                className="inline-flex items-center gap-1.5 text-white/75 hover:text-white transition-colors"
              >
                Что мы устанавливаем
              </Link>
            </div>
          </article>

          {/* ── Окупаемость ── */}
          <article className="liquid-glass col-span-3 lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[180px] lg:min-h-[220px] p-5 md:p-7">
            <div className="flex items-center justify-between">
              <span className="chip !py-1 !px-2.5 !text-[10px]">
                <Clock className="w-3 h-3" />
                Окупаемость
              </span>
            </div>
            <div>
              <div
                className="font-display leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(52px, 10vw, 80px)',
                  background: 'linear-gradient(180deg, #FFFFFF 10%, #FF3E4F 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                8
              </div>
              <div className="text-white/65 text-[13px] mt-2">месяцев — и ГБО в плюсе</div>
            </div>
          </article>

          {/* ── Экономия ── */}
          <article className="liquid-glass col-span-3 lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[180px] lg:min-h-[220px] p-5 md:p-7">
            <div className="flex items-center justify-between">
              <span className="chip !py-1 !px-2.5 !text-[10px]">
                <Fuel className="w-3 h-3" />
                Экономия
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span
                  className="font-display leading-none tracking-tight text-white"
                  style={{ fontSize: 'clamp(52px, 10vw, 80px)' }}
                >
                  55
                </span>
                <span className="font-display text-3xl md:text-4xl text-white/70">%</span>
              </div>
              <div className="text-white/65 text-[13px] mt-2">на топливе от пробега</div>
            </div>
          </article>

          {/* ── Что входит в цену (средний чек) ── */}
          <article className="liquid-glass col-span-6 lg:col-span-4 relative overflow-hidden p-6 md:p-8">
            <HexIcon
              size={220}
              filled={false}
              className="absolute -right-12 -bottom-12 text-white/[0.05] pointer-events-none"
            />
            <div className="flex items-center gap-4 relative">
              <div className="w-12 h-12 grid place-items-center relative flex-none">
                <HexIcon size={48} className="text-[#FF3E4F] absolute" />
                <span className="relative text-white font-display font-bold text-[11px]">4+</span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/55 font-semibold">
                  Под ключ от
                </div>
                <div className="font-display text-[30px] md:text-[36px] text-white leading-none mt-1.5">
                  38 000 ₽
                </div>
              </div>
            </div>
            <ul className="mt-7 grid sm:grid-cols-2 gap-2.5 relative">
              {[
                'Оборудование Lovato / BRC / Prins',
                'Диагностика двигателя на стенде',
                'Настройка ЭБУ и калибровка карт',
                'Паспорт ГБО и регистрация в ГИБДД',
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-white/85"
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
            className="liquid-glass col-span-3 lg:col-span-1 relative overflow-hidden flex flex-col justify-between min-h-[150px] p-5 md:p-6 active:scale-[0.98] transition-transform group"
          >
            <span className="w-11 h-11 rounded-2xl grid place-items-center bg-primary/20 border border-primary/30 flex-none group-hover:bg-primary/30 transition-colors">
              <PhoneFilledIcon className="w-5 h-5 text-[#FF3E4F]" />
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 font-semibold">
                Позвонить
              </div>
              <div
                className="font-display text-white mt-1.5 leading-tight"
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
            className="liquid-glass col-span-3 lg:col-span-1 relative overflow-hidden flex flex-col justify-between min-h-[150px] p-5 md:p-6 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <span className="w-11 h-11 rounded-2xl grid place-items-center bg-[#FFCC00]/15 border border-[#FFCC00]/30 flex-none">
                <YandexMapsIcon className="w-5 h-5 text-[#FFCC00]" />
              </span>
              <MapPin className="w-4 h-4 text-white/40" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 font-semibold">
                Мы находимся
              </div>
              <div
                className="text-white mt-1.5 leading-[1.3] font-medium line-clamp-2"
                style={{ fontSize: 'clamp(12px, 2.8vw, 14px)' }}
              >
                {address}
              </div>
            </div>
          </a>

          {/* ── Гарантия ── */}
          <article className="liquid-glass col-span-6 lg:col-span-2 relative overflow-hidden flex items-center gap-4 min-h-[96px] p-5">
            <span className="w-12 h-12 rounded-2xl grid place-items-center bg-white/[0.05] border border-white/10 flex-none">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-[14px]">Гарантия 1 год</div>
              <div className="text-white/60 text-[12px] mt-0.5">на все работы и оборудование</div>
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

function RatingBadge({
  source, rating, count, color,
}: { source: string; rating: number; count: number; color: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full"
      style={{
        background: 'rgba(255,255,255,0.055)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span
        className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-full text-black text-[12px] font-bold"
        style={{ background: color }}
      >
        <Star width={11} height={11} fill="currentColor" strokeWidth={0} />
        {rating.toFixed(1)}
      </span>
      <span className="text-[13px] text-white/85 font-semibold">{source}</span>
      <span className="text-[12px] text-white/40">· {count}</span>
    </div>
  );
}
