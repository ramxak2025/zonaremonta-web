'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Fuel, Gauge, Sparkles } from 'lucide-react';
import { HexIcon } from './HexIcon';

const perks = [
  { icon: ShieldCheck, text: 'Гарантия 1 год' },
  { icon: Fuel, text: 'Экономия до 55%' },
  { icon: Gauge, text: 'Диагностика на стенде' },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="blob bg-primary/50 w-[520px] h-[520px] -top-32 -left-20 float-slow" />
        <div className="blob bg-secondary/40 w-[600px] h-[600px] top-10 right-[-160px] float-slower" />
        <div className="blob bg-[#FF3E4F]/35 w-[420px] h-[420px] bottom-[-180px] left-1/3 float-slow" />
      </div>
      {/* hex pattern */}
      <div className="absolute inset-0 hex-grid opacity-80 pointer-events-none" aria-hidden />

      <div className="section pt-10 pb-16 lg:pt-20 lg:pb-28 relative">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center">
          {/* LEFT — текст */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="chip"
            >
              <span className="dot" />
              <Sparkles className="w-3 h-3" />
              ГБО 2/4/6 поколения · Махачкала
            </motion.span>

            <motion.h1
              className="h-hero mt-6 text-white"
              initial={reduce ? undefined : 'h'}
              animate="v"
              variants={{
                h: { opacity: 0 },
                v: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.15 } },
              }}
            >
              {'Переводим авто'.split('').map((c, i) => (
                <motion.span
                  key={i}
                  variants={{
                    h: { opacity: 0, y: 40, filter: 'blur(6px)' },
                    v: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease } },
                  }}
                  className="inline-block"
                  style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}
                >
                  {c}
                </motion.span>
              ))}
              <br />
              <span className="text-brand-gradient">на газ</span>{' '}
              <span className="text-white/80">с гарантией</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease }}
              className="mt-6 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed"
            >
              Установка ГБО, ремонт, диагностика и продажа комплектующих.
              Официальные бренды, собственный склад, сертифицированные мастера.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="#calc" className="btn btn-primary shine-hover">
                Рассчитать экономию
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="btn btn-glass">
                Услуги и цены
              </Link>
            </motion.div>

            <motion.ul
              initial="h"
              animate="v"
              variants={{
                h: { opacity: 0 },
                v: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.9 } },
              }}
              className="mt-10 grid sm:grid-cols-3 gap-3"
            >
              {perks.map((p) => (
                <motion.li
                  key={p.text}
                  variants={{
                    h: { opacity: 0, y: 14 },
                    v: { opacity: 1, y: 0 },
                  }}
                  className="liquid-glass flex items-center gap-3 !p-4"
                  style={{ borderRadius: 20 }}
                >
                  <span className="relative w-9 h-9 grid place-items-center">
                    <HexIcon size={36} className="text-primary/30 absolute" />
                    <p.icon className="w-4 h-4 text-primary relative" strokeWidth={2.4} />
                  </span>
                  <span className="text-sm font-medium">{p.text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* RIGHT — preview card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease }}
            className="relative"
          >
            {/* подсветка позади карточки */}
            <div className="absolute inset-0 -z-10 blur-3xl opacity-80" aria-hidden>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] bg-primary/30 rounded-full" />
            </div>

            <div className="liquid-glass p-6 sm:p-8 relative overflow-hidden">
              {/* Большая decorative гайка на фоне карточки */}
              <HexIcon
                size={280}
                filled={false}
                className="absolute -right-20 -top-12 text-white/[0.04]"
              />

              <div className="flex items-center gap-3 mb-6 relative">
                <div className="w-12 h-12 grid place-items-center relative">
                  <HexIcon size={48} className="text-primary absolute" />
                  <span className="relative text-white font-display font-bold text-sm">05</span>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">Средний чек</div>
                  <div className="font-display text-3xl tracking-tight text-white">от 38 000 ₽</div>
                </div>
              </div>

              <div className="space-y-2.5 relative">
                {[
                  'Установка ГБО 4-го поколения',
                  'Диагностика на стенде',
                  'Настройка и калибровка ЭБУ',
                ].map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, ease }}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10"
                  >
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-none" />
                    <span className="text-sm font-medium text-white/90">{t}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, ease }}
                className="mt-6 p-5 rounded-[22px] relative overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(232,18,36,0.25) 0%, rgba(255,62,79,0.1) 100%)',
                  border: '1px solid rgba(232,18,36,0.35)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.1) inset, 0 14px 30px -10px rgba(232,18,36,0.35)',
                }}
              >
                <span className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/40 blur-3xl" />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-1">
                    Окупаемость
                  </div>
                  <div className="font-display text-5xl text-white tracking-tight">~ 8 мес</div>
                  <div className="text-sm text-white/60 mt-1">при пробеге 2 000+ км/мес</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* нижняя hex-разделительная полоса */}
      <div className="hex-divider opacity-60" />
    </section>
  );
}
