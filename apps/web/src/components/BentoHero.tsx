'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Fuel, ShieldCheck, Gauge, Wrench, MapPin } from 'lucide-react';
import type { PublicSettings } from '@05auto/shared';
import { HexIcon } from './HexIcon';
import { getContactLinks } from '@/lib/site';
import { PhoneFilledIcon, WhatsAppIcon, YandexMapsIcon, MaxIcon } from './BrandIcons';

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  settings: Required<PublicSettings>;
}

function Card({
  className = '',
  delay = 0,
  children,
  interactive = true,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
  interactive?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease }}
      whileHover={interactive ? { y: -4 } : undefined}
      className={`liquid-glass relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function BentoHero({ settings }: Props) {
  const l = getContactLinks();
  const badge = settings['hero.badge'].value;
  const title = settings['hero.title'].value;
  const subtitle = settings['hero.subtitle'].value;
  const ctaText = settings['hero.primaryCta'].value;
  const heroImage = settings['hero.imageUrl'].value;
  const address = settings['site.address'].value;
  const payback = settings['hero.stats.payback'];
  const savings = settings['hero.stats.savings'];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="blob bg-primary/45 w-[520px] h-[520px] -top-32 -left-20 float-slow" />
        <div className="blob bg-secondary/40 w-[600px] h-[600px] top-20 right-[-160px] float-slower" />
        <div className="blob bg-[#FF3E4F]/35 w-[420px] h-[420px] bottom-[-200px] left-1/3 float-slow" />
      </div>
      <div className="absolute inset-0 hex-grid opacity-70 pointer-events-none" aria-hidden />

      <div className="section relative pt-5 sm:pt-10 pb-10 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-4 sm:mb-6"
        >
          <span className="chip">
            <span className="dot" />
            {badge}
          </span>
        </motion.div>

        <div
          className="grid gap-2.5 sm:gap-4"
          style={{
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gridAutoRows: 'minmax(72px, auto)',
          }}
        >
          <Card
            className="col-span-6 lg:col-span-4 row-span-3 lg:row-span-4 flex flex-col justify-between p-6 sm:p-10"
            delay={0.05}
          >
            {heroImage ? (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(8,8,10,0.85), rgba(8,8,10,0.6)), url(${heroImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                aria-hidden
              />
            ) : null}
            <HexIcon
              size={360}
              filled={false}
              className="absolute -right-24 -top-20 text-white/[0.05] pointer-events-none"
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50">
                <span className="accent-bar w-8 sm:w-10" />
                Премиум установка
              </div>
              <h1
                className="font-display font-bold uppercase text-white mt-3 sm:mt-5 leading-[0.95]"
                style={{ fontSize: 'clamp(30px, 8vw, 72px)', letterSpacing: '-0.025em' }}
              >
                {title.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-4 sm:mt-5 text-[13px] sm:text-base text-white/70 max-w-xl leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2.5">
              <a
                href={l.phoneHref}
                className="btn btn-primary shine-hover !h-12 sm:!h-14 !text-[15px] sm:!text-base flex-1 sm:flex-none"
              >
                <PhoneFilledIcon className="w-5 h-5" />
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={l.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn !h-12 sm:!h-14 !text-[15px] sm:!text-base flex-1 sm:flex-none text-white"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(37,211,102,0.3) 0%, rgba(37,211,102,0.1) 100%)',
                  border: '1px solid rgba(37,211,102,0.45)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.1) inset',
                }}
              >
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </Card>

          <Card className="col-span-3 lg:col-span-2 row-span-2 flex flex-col justify-between p-4 sm:p-6" delay={0.12}>
            <div className="flex items-center justify-between">
              <span className="chip !py-0.5 !px-2 !text-[9px] !bg-primary/15 !border-primary/30 !text-white">
                <Clock className="w-3 h-3" />
                Окупается
              </span>
              <HexIcon size={24} className="text-primary/50 hidden sm:block" />
            </div>
            <div>
              <div
                className="font-display leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(48px, 12vw, 88px)',
                  backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,62,79,0.9) 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {payback.value}
              </div>
              <div className="text-white/60 text-[11px] sm:text-sm mt-1">
                {payback.suffix ?? ''}
              </div>
            </div>
          </Card>

          <Card className="col-span-3 lg:col-span-2 row-span-2 flex flex-col justify-between p-4 sm:p-6" delay={0.18}>
            <div className="flex items-center justify-between">
              <span className="chip !py-0.5 !px-2 !text-[9px] !bg-secondary/15 !border-secondary/30">
                <Fuel className="w-3 h-3" />
                Экономия
              </span>
              <HexIcon size={24} className="text-secondary/50 hidden sm:block" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span
                  className="font-display leading-none tracking-tight text-white"
                  style={{ fontSize: 'clamp(48px, 12vw, 88px)' }}
                >
                  {savings.value}
                </span>
                <span className="font-display text-2xl sm:text-3xl text-white/70">
                  {savings.suffix ?? ''}
                </span>
              </div>
              <div className="text-white/60 text-[11px] sm:text-sm mt-1">на топливе</div>
            </div>
          </Card>

          <Card className="hidden sm:flex col-span-2 row-span-1 items-center gap-3 p-4" delay={0.22}>
            <span className="relative w-10 h-10 grid place-items-center flex-none">
              <HexIcon size={40} className="text-primary/40 absolute" />
              <ShieldCheck className="w-4 h-4 text-primary relative" strokeWidth={2.4} />
            </span>
            <div>
              <div className="font-semibold text-sm">Гарантия 1 год</div>
              <div className="text-white/50 text-xs">на все работы</div>
            </div>
          </Card>
          <Card className="hidden sm:flex col-span-2 row-span-1 items-center gap-3 p-4" delay={0.26}>
            <span className="relative w-10 h-10 grid place-items-center flex-none">
              <HexIcon size={40} className="text-secondary/40 absolute" />
              <Gauge className="w-4 h-4 text-secondary relative" strokeWidth={2.4} />
            </span>
            <div>
              <div className="font-semibold text-sm">Стенд + ЭБУ</div>
              <div className="text-white/50 text-xs">точная диагностика</div>
            </div>
          </Card>
          <Card className="hidden sm:flex col-span-2 row-span-1 items-center gap-3 p-4" delay={0.3}>
            <span className="relative w-10 h-10 grid place-items-center flex-none">
              <HexIcon size={40} className="text-primary/40 absolute" />
              <Wrench className="w-4 h-4 text-primary relative" strokeWidth={2.4} />
            </span>
            <div>
              <div className="font-semibold text-sm">Свой склад</div>
              <div className="text-white/50 text-xs">запчасти в наличии</div>
            </div>
          </Card>

          <motion.a
            href={l.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="col-span-6 lg:col-span-3 row-span-2 liquid-glass relative overflow-hidden p-4 sm:p-6 flex flex-col justify-between group"
          >
            <HexIcon
              size={220}
              filled={false}
              className="absolute -right-14 -bottom-14 text-white/[0.05] group-hover:text-primary/20 transition-colors"
            />
            <div className="flex items-start justify-between relative">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl grid place-items-center"
                style={{
                  background: 'linear-gradient(135deg, #FFCC00 0%, #FF9500 100%)',
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.35) inset, 0 10px 24px -8px rgba(255,149,0,0.5)',
                }}
              >
                <YandexMapsIcon className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
              </div>
              <span className="chip !py-0.5 !px-2 !text-[9px]">
                <MapPin className="w-3 h-3" />
                Я.Карты
              </span>
            </div>
            <div className="relative mt-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">Мы находимся</div>
              <div className="font-display text-xl sm:text-2xl text-white mt-1 tracking-tight">
                {address}
              </div>
              <div className="text-white/50 text-xs mt-1">
                Нажмите → откроется Яндекс.Карты с маршрутом
              </div>
            </div>
          </motion.a>

          <motion.a
            href={l.maxHref}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36, ease }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="col-span-6 lg:col-span-3 row-span-2 relative overflow-hidden p-4 sm:p-6 flex flex-col justify-between group rounded-[28px]"
            style={{
              background:
                'linear-gradient(135deg, rgba(91,155,213,0.22) 0%, rgba(43,95,158,0.35) 100%)',
              border: '1px solid rgba(91,155,213,0.35)',
              boxShadow:
                '0 1px 0 rgba(255,255,255,0.1) inset, 0 20px 50px -20px rgba(91,155,213,0.4)',
            }}
          >
            <HexIcon size={220} filled={false} className="absolute -right-14 -bottom-14 text-white/[0.06]" />
            <div className="flex items-start justify-between relative">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl grid place-items-center"
                style={{
                  background: 'linear-gradient(135deg, #5B9BD5 0%, #2B5F9E 100%)',
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.35) inset, 0 10px 24px -8px rgba(91,155,213,0.55)',
                }}
              >
                <MaxIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <span className="chip !py-0.5 !px-2 !text-[9px]">Мессенджер</span>
            </div>
            <div className="relative mt-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">Напишите в MAX</div>
              <div className="font-display text-xl sm:text-2xl text-white mt-1 tracking-tight">
                Быстрый ответ от мастера
              </div>
              <div className="text-white/60 text-xs mt-1">Российский мессенджер от VK</div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
