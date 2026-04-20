import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, Fuel, MapPin, ShieldCheck, Star } from 'lucide-react';
import type { PublicSettings } from '@05auto/shared';
import { getContactLinks } from '@/lib/site';
import { PhoneFilledIcon, WhatsAppIcon, YandexMapsIcon } from '../BrandIcons';
import { HexIcon } from '../HexIcon';

interface Props {
  settings: Required<PublicSettings>;
}

export function BentoHero({ settings }: Props) {
  const l = getContactLinks();
  const phone = settings['site.phone'].value;
  const address = settings['site.address'].value;
  const rating = settings['reviews.yandex.rating'].value;
  const reviews = settings['reviews.yandex.count'].value;

  return (
    <section className="relative overflow-hidden">
      {/* Фон: мягкие radial-градиенты + hex-grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(900px 560px at 85% -5%, rgba(232,18,36,0.18), transparent 60%), radial-gradient(700px 500px at -10% 30%, rgba(74,159,217,0.1), transparent 60%)',
        }}
      />
      <div aria-hidden className="absolute inset-0 hex-grid pointer-events-none opacity-70" />

      <div className="section relative pt-6 pb-10 md:pt-12 md:pb-20">
        {/* Eyebrow-плашка */}
        <div className="mb-5 md:mb-7">
          <span className="chip">
            <span className="dot" />
            ГБО 4-е и 4+ · Махачкала
          </span>
        </div>

        {/* BENTO GRID — 6 колонок, разнокалиберные */}
        <div
          className="grid gap-3 md:gap-4"
          style={{
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          }}
        >
          {/* ── HERO-карточка (большая) ── */}
          <article className="liquid-glass p-6 md:p-10 col-span-6 lg:col-span-4 lg:row-span-2 relative overflow-hidden flex flex-col">
            <HexIcon
              size={360}
              filled={false}
              className="absolute -right-24 -top-20 text-white/[0.04] pointer-events-none"
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50">
                <span className="accent-bar" />
                Специализация
              </div>
              <h1
                className="font-display font-bold uppercase text-white mt-4 leading-[0.95]"
                style={{ fontSize: 'clamp(32px, 7vw, 72px)', letterSpacing: '-0.03em' }}
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
              <p className="mt-5 text-[14px] md:text-[17px] text-white/70 leading-relaxed max-w-xl">
                Только современные системы: 4-е поколение для инжекторов и 4+ для прямого впрыска
                (TSI, GDI, FSI, D-4S). Под ключ за 1 день, гарантия 1 год, регистрация в ГИБДД.
              </p>
            </div>

            {/* 2 CTA — stacked на mobile, в ряд на sm+ */}
            <div className="mt-7 flex flex-col sm:flex-row gap-2.5">
              <a href={l.phoneHref} className="btn btn-primary btn-lg flex-1 sm:flex-none">
                <PhoneFilledIcon className="w-5 h-5" />
                Позвонить сейчас
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={l.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg text-white flex-1 sm:flex-none"
                style={{
                  background: 'linear-gradient(180deg, #25D366 0%, #128C7E 100%)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 8px 22px -6px rgba(37,211,102,0.5)',
                }}
              >
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp
              </a>
            </div>

            {/* Trust-row прямо в hero */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-white/55">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      width={14}
                      height={14}
                      strokeWidth={1.5}
                      fill={i <= Math.floor(rating) ? '#FFCC00' : 'none'}
                      className="text-[#FFCC00]"
                    />
                  ))}
                </div>
                <span className="text-white font-semibold">{rating.toFixed(1)}</span>
                <span>· {reviews} отзывов</span>
              </div>
              <div className="h-3 w-px bg-white/10 hidden sm:block" />
              <span>Гарантия 1 год</span>
              <div className="h-3 w-px bg-white/10 hidden sm:block" />
              <span>Регистрация в ГИБДД</span>
            </div>
          </article>

          {/* ── Окупаемость ── */}
          <article className="liquid-glass p-5 md:p-6 col-span-3 lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[160px] lg:min-h-[200px]">
            <div className="flex items-center justify-between">
              <span className="chip !py-1 !px-2.5 !text-[10px]">
                <Clock className="w-3 h-3" />
                Окупается
              </span>
              <HexIcon size={24} className="text-primary/40" />
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
              <div className="text-white/55 text-[12px] mt-1.5">месяцев</div>
            </div>
          </article>

          {/* ── Экономия ── */}
          <article className="liquid-glass p-5 md:p-6 col-span-3 lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[160px] lg:min-h-[200px]">
            <div className="flex items-center justify-between">
              <span className="chip !py-1 !px-2.5 !text-[10px]">
                <Fuel className="w-3 h-3" />
                Экономия
              </span>
              <HexIcon size={24} className="text-[#4A9FD9]/50" />
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
              <div className="text-white/55 text-[12px] mt-1.5">на топливе</div>
            </div>
          </article>

          {/* ── Средний чек со списком ── */}
          <article className="liquid-glass p-5 md:p-7 col-span-6 lg:col-span-4 relative overflow-hidden">
            <HexIcon
              size={200}
              filled={false}
              className="absolute -right-10 -bottom-10 text-white/[0.04] pointer-events-none"
            />
            <div className="flex items-center gap-3 relative">
              <div className="w-11 h-11 grid place-items-center relative flex-none">
                <HexIcon size={44} className="text-primary absolute" />
                <span className="relative text-white font-display font-bold text-xs">4+</span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">
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
                'Настройка ЭБУ и карты',
                'Регистрация в ГИБДД',
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[13px] text-white/85"
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
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/40">Позвонить</div>
              <div
                className="font-display text-white mt-1 leading-tight"
                style={{ fontSize: 'clamp(14px, 3.2vw, 18px)' }}
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
              <span className="w-10 h-10 rounded-xl grid place-items-center bg-[#4A9FD9]/15 border border-[#4A9FD9]/25 flex-none">
                <YandexMapsIcon className="w-4 h-4 text-[#FFCC00]" />
              </span>
              <MapPin className="w-4 h-4 text-white/30" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/40">
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
            <div className="min-w-0">
              <div className="text-white font-semibold text-[14px]">Гарантия 1 год</div>
              <div className="text-white/55 text-[12px]">на все работы</div>
            </div>
            <Link href="#services" className="ml-auto btn-ghost btn !h-9 !px-4 !text-[12px]">
              Услуги
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
