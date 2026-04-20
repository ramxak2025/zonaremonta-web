'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Fuel,
  Gauge,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Wrench,
  Flame,
} from 'lucide-react';
import { HexIcon } from './HexIcon';
import { SITE } from '@/lib/site';

const ease = [0.22, 1, 0.36, 1] as const;

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
      className={`liquid-glass relative overflow-hidden p-5 sm:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function BentoHero() {
  const phoneDigits = SITE.phone.replace(/[^\d+]/g, '');

  return (
    <section className="relative overflow-hidden">
      {/* Background blobs + hex grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="blob bg-primary/40 w-[520px] h-[520px] -top-32 -left-20 float-slow" />
        <div className="blob bg-secondary/40 w-[600px] h-[600px] top-20 right-[-160px] float-slower" />
        <div className="blob bg-[#FF3E4F]/35 w-[420px] h-[420px] bottom-[-180px] left-1/3 float-slow" />
      </div>
      <div className="absolute inset-0 hex-grid opacity-70 pointer-events-none" aria-hidden />

      <div className="section relative pt-6 sm:pt-8 pb-12 sm:pb-20">
        {/* Top chip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-5 sm:mb-6"
        >
          <span className="chip">
            <span className="dot" />
            <Sparkles className="w-3 h-3" />
            ГБО 2/4/6 поколения · Махачкала
          </span>
        </motion.div>

        {/* BENTO GRID */}
        <div
          className="grid gap-3 sm:gap-4"
          style={{
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gridAutoRows: 'minmax(90px, auto)',
          }}
        >
          {/* --- HERO TITLE (большая левая карточка) --- */}
          <Card className="col-span-6 lg:col-span-4 row-span-3 lg:row-span-4 flex flex-col justify-between !p-7 sm:!p-10" delay={0.05}>
            <HexIcon
              size={360}
              filled={false}
              className="absolute -right-28 -top-24 text-white/[0.04] pointer-events-none"
            />
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
                <span className="accent-bar w-10" />
                Премиум установка
              </div>
              <h1 className="h-hero mt-4 text-white">
                Переводим<br />
                <span className="text-brand-gradient">авто на газ</span><br />
                <span className="text-white/85">с гарантией.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
                Установка, ремонт и диагностика ГБО в Махачкале. Собственный склад,
                сертифицированные мастера, гарантия 1 год на работы.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#calc" className="btn btn-primary shine-hover">
                Рассчитать экономию
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="btn btn-glass">Услуги и цены</Link>
            </div>
          </Card>

          {/* --- ОКУПАЕМОСТЬ (статистика) --- */}
          <Card className="col-span-3 lg:col-span-2 row-span-2 flex flex-col justify-between" delay={0.12}>
            <div className="flex items-center justify-between">
              <span className="chip !bg-primary/15 !border-primary/30 !text-white">
                <Clock className="w-3 h-3" />
                Окупаемость
              </span>
              <HexIcon size={28} className="text-primary/50" />
            </div>
            <div>
              <div
                className="font-display text-[64px] sm:text-[88px] leading-none tracking-tight"
                style={{
                  backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,62,79,0.9) 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                ~8
              </div>
              <div className="text-white/60 text-sm mt-1">месяцев до полной окупаемости</div>
            </div>
          </Card>

          {/* --- ЭКОНОМИЯ % --- */}
          <Card className="col-span-3 lg:col-span-2 row-span-2 flex flex-col justify-between" delay={0.18}>
            <div className="flex items-center justify-between">
              <span className="chip !bg-secondary/15 !border-secondary/30">
                <Fuel className="w-3 h-3" />
                Экономия
              </span>
              <HexIcon size={28} className="text-secondary/50" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span
                  className="font-display text-[64px] sm:text-[88px] leading-none tracking-tight text-white"
                >
                  55
                </span>
                <span className="font-display text-3xl text-white/70">%</span>
              </div>
              <div className="text-white/60 text-sm mt-1">на топливе vs бензин</div>
            </div>
          </Card>

          {/* --- PERKS ROW --- */}
          <Card className="col-span-2 lg:col-span-2 row-span-1 flex items-center gap-3 !py-4" delay={0.22}>
            <span className="relative w-10 h-10 grid place-items-center flex-none">
              <HexIcon size={40} className="text-primary/40 absolute" />
              <ShieldCheck className="w-4 h-4 text-primary relative" strokeWidth={2.4} />
            </span>
            <div>
              <div className="font-semibold">Гарантия 1 год</div>
              <div className="text-white/50 text-xs">на все работы</div>
            </div>
          </Card>

          <Card className="col-span-2 lg:col-span-2 row-span-1 flex items-center gap-3 !py-4" delay={0.26}>
            <span className="relative w-10 h-10 grid place-items-center flex-none">
              <HexIcon size={40} className="text-secondary/40 absolute" />
              <Gauge className="w-4 h-4 text-secondary relative" strokeWidth={2.4} />
            </span>
            <div>
              <div className="font-semibold">Стенд + ЭБУ</div>
              <div className="text-white/50 text-xs">точная диагностика</div>
            </div>
          </Card>

          <Card className="col-span-2 lg:col-span-2 row-span-1 flex items-center gap-3 !py-4" delay={0.3}>
            <span className="relative w-10 h-10 grid place-items-center flex-none">
              <HexIcon size={40} className="text-primary/40 absolute" />
              <Wrench className="w-4 h-4 text-primary relative" strokeWidth={2.4} />
            </span>
            <div>
              <div className="font-semibold">Свой склад</div>
              <div className="text-white/50 text-xs">запчасти в наличии</div>
            </div>
          </Card>

          {/* --- БОЛЬШАЯ ЧЕКЛИСТ-КАРТА --- */}
          <Card className="col-span-6 lg:col-span-3 row-span-2 !p-6 sm:!p-7" delay={0.32}>
            <HexIcon
              size={220}
              filled={false}
              className="absolute -right-14 -bottom-14 text-white/[0.04] pointer-events-none"
            />
            <div className="flex items-center gap-3 mb-5 relative">
              <span className="w-11 h-11 grid place-items-center relative">
                <HexIcon size={44} className="text-primary" />
                <Flame className="w-5 h-5 text-white relative" strokeWidth={2.4} />
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">Средний чек</div>
                <div className="font-display text-3xl text-white">от 38 000 ₽</div>
              </div>
            </div>
            <ul className="space-y-2 relative">
              {['Установка ГБО 4-го поколения', 'Диагностика на стенде', 'Настройка ЭБУ, карты'].map((t) => (
                <li key={t} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-none" />
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* --- ЗВОНОК --- */}
          <Card
            className="col-span-3 lg:col-span-3 row-span-1 !p-5 flex items-center justify-between group cursor-pointer"
            delay={0.36}
          >
            <a href={`tel:${phoneDigits}`} className="absolute inset-0" aria-label="Позвонить" />
            <div className="flex items-center gap-3 relative">
              <span className="w-11 h-11 rounded-2xl grid place-items-center bg-primary/20 border border-primary/30 group-hover:bg-primary/30 transition-colors">
                <Phone className="w-5 h-5 text-primary" strokeWidth={2.4} />
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">Позвонить</div>
                <div className="font-display text-lg sm:text-xl text-white">{SITE.phone}</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-primary group-hover:translate-x-1 transition-all relative" />
          </Card>

          {/* --- АДРЕС --- */}
          <Card className="col-span-3 lg:col-span-3 row-span-1 !p-5 flex items-center gap-3" delay={0.4}>
            <span className="w-11 h-11 rounded-2xl grid place-items-center bg-secondary/20 border border-secondary/30 flex-none">
              <MapPin className="w-5 h-5 text-secondary" strokeWidth={2.4} />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">Мы находимся</div>
              <div className="font-display text-base sm:text-lg text-white truncate">{SITE.address}</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
