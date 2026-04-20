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
      <div aria-hidden className="absolute inset-0 hex-grid pointer-events-none opacity-70" />

      <div className="section relative pt-6 pb-10 md:pt-10 md:pb-20">
        <div className="mb-5 md:mb-7">
          <span className="chip">
            <span className="dot" />
            ГБО 4-е и 4+ · Махачкала
          </span>
        </div>

        <div
          className="grid gap-3 md:gap-4"
          style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}
        >
          {/* ── Большая hero-карточка (без CTA-кнопок) ── */}
          <article className="liquid-glass p-6 md:p-10 col-span-6 lg:col-span-4 lg:row-span-2 relative overflow-hidden flex flex-col">
            <HexIcon
              size={360}
              filled={false}
              className="absolute -right-24 -top-20 text-white/[0.05] pointer-events-none"
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/55">
                <span className="accent-bar" />
                Специализация
              </div>
              <h1
                className="font-display font-bold uppercase text-white mt-4 leading-[0.95]"
                style={{ fontSize: 'clamp(34px, 7vw, 76px)', letterSpacing: '-0.03em' }}
              >
                Установка{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #FF3E4F 0%, #E81224 60%, #4A9FD9 140%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  ГБО 4 и 4+
                </span>
                <br />
                в Махачкале
              </h1>
              <p className="mt-5 text-[14px] md:text-[17px] text-white/75 leading-relaxed max-w-xl">
                Только современные системы: 4-е поколение для обычных инжекторных авто и 4+ для
                двигателей с прямым впрыском (TSI, GDI, FSI, D-4S). Под ключ за 1 день,
                гарантия 1 год, регистрация в ГИБДД.
              </p>
            </div>

            {/* Trust-row с двумя рейтингами */}
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <RatingBadge
                source="Яндекс"
                rating={yRating}
                count={yCount}
                color="#FFCC00"
              />
              <RatingBadge
                source="2GIS"
                rating={gRating}
                count={gCount}
                color="#5FBA47"
              />
              <span className="hidden md:inline text-white/45">·</span>
              <span className="text-[13px] text-white/65 hidden md:inline">
                Гарантия 1 год · Регистрация в ГИБДД
              </span>
            </div>

            {/* Вторичные ссылки на ключевые действия */}
            <div className="mt-7 flex flex-wrap gap-3 text-[13px]">
              <Link href="/calculator" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white">
                Рассчитать экономию <ArrowUpRight className="w-4 h-4" />
              </Link>
              <span className="text-white/20">·</span>
              <Link href="/#services" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white">
                Подробно об услугах <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </article>

          {/* ── Окупаемость ── */}
          <article className="liquid-glass p-5 md:p-6 col-span-3 lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[170px] lg:min-h-[200px]">
            <div className="flex items-center justify-between">
              <span className="chip !py-1 !px-2.5 !text-[10px]">
                <Clock className="w-3 h-3" />
                Окупается
              </span>
            </div>
            <div>
              <div
                className="font-display leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(48px, 9vw, 72px)',
                  background: 'linear-gradient(180deg, #FFFFFF, rgba(255,62,79,0.9))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                ~8
              </div>
              <div className="text-white/60 text-[12px] mt-1.5">месяцев</div>
            </div>
          </article>

          {/* ── Экономия ── */}
          <article className="liquid-glass p-5 md:p-6 col-span-3 lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[170px] lg:min-h-[200px]">
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
                  style={{ fontSize: 'clamp(48px, 9vw, 72px)' }}
                >
                  55
                </span>
                <span className="font-display text-2xl md:text-3xl text-white/70">%</span>
              </div>
              <div className="text-white/60 text-[12px] mt-1.5">на топливе</div>
            </div>
          </article>

          {/* ── Средний чек со списком ── */}
          <article className="liquid-glass p-5 md:p-7 col-span-6 lg:col-span-4 relative overflow-hidden">
            <HexIcon
              size={200}
              filled={false}
              className="absolute -right-10 -bottom-10 text-white/[0.05] pointer-events-none"
            />
            <div className="flex items-center gap-3 relative">
              <div className="w-11 h-11 grid place-items-center relative flex-none">
                <HexIcon size={44} className="text-primary absolute" />
                <span className="relative text-white font-display font-bold text-xs">4+</span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">
                  Средний чек
                </div>
                <div className="font-display text-[28px] md:text-[32px] text-white leading-none mt-1">
                  от 38 000 ₽
                </div>
              </div>
            </div>
            <ul className="mt-5 grid sm:grid-cols-2 gap-2 relative">
              {[
                'Установка ГБО 4-го поколения',
                'Диагностика на стенде',
                'Настройка ЭБУ и карт',
                'Регистрация в ГИБДД',
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/85"
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
            className="liquid-glass p-5 col-span-3 lg:col-span-1 relative overflow-hidden flex flex-col justify-between min-h-[140px] active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary/20 border border-primary/30 flex-none">
                <PhoneFilledIcon className="w-4 h-4 text-[#FF3E4F]" />
              </span>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45">Позвонить</div>
              <div
                className="font-display text-white mt-1 leading-tight"
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
            className="liquid-glass p-5 col-span-3 lg:col-span-1 relative overflow-hidden flex flex-col justify-between min-h-[140px] active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl grid place-items-center bg-[#FFCC00]/15 border border-[#FFCC00]/25 flex-none">
                <YandexMapsIcon className="w-4 h-4 text-[#FFCC00]" />
              </span>
              <MapPin className="w-4 h-4 text-white/35" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45">
                Мы находимся
              </div>
              <div
                className="text-white mt-1 leading-tight font-medium line-clamp-2"
                style={{ fontSize: 'clamp(12px, 2.8vw, 14px)' }}
              >
                {address}
              </div>
            </div>
          </a>

          {/* ── Гарантия ── */}
          <article className="liquid-glass p-5 col-span-6 lg:col-span-2 relative overflow-hidden flex items-center gap-3 min-h-[90px]">
            <span className="w-11 h-11 rounded-xl grid place-items-center bg-white/[0.04] border border-white/10 flex-none">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-[14px]">Гарантия 1 год</div>
              <div className="text-white/60 text-[12px]">на все работы</div>
            </div>
            <Link href="#services" className="btn btn-ghost !h-9 !px-4 !text-[12px] flex-none">
              Услуги
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
      className="inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <span
        className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-full text-black text-[11px] font-bold"
        style={{ background: color }}
      >
        <Star width={11} height={11} fill="currentColor" strokeWidth={0} />
        {rating.toFixed(1)}
      </span>
      <span className="text-[12px] text-white/75 font-medium">
        {source}
      </span>
      <span className="text-[11px] text-white/40">· {count}</span>
    </div>
  );
}
