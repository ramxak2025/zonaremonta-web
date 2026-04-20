'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Fuel, Gauge, Sparkles } from 'lucide-react';

const perks = [
  { icon: ShieldCheck, text: 'Гарантия 1 год на работы' },
  { icon: Fuel, text: 'Экономия до 55% на топливе' },
  { icon: Gauge, text: 'Диагностика на стенде' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Цветные blobs-подложки для glass-эффекта */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="blob bg-primary/40 w-[420px] h-[420px] -top-20 -left-10 float-slow" />
        <div className="blob bg-secondary/40 w-[520px] h-[520px] top-10 right-[-100px] float-slower" />
        <div className="blob bg-[#FF3E4F]/30 w-[360px] h-[360px] bottom-[-120px] left-1/3 float-slow" />
      </div>

      <div className="section pt-8 pb-16 lg:pt-20 lg:pb-28 relative">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="chip mb-5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              ГБО 2/4/6 поколения · Махачкала
            </span>
            <h1 className="h-hero">
              Установка и ремонт{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #E81224 0%, #FF3E4F 60%, #4A9FD9 140%)' }}
              >
                ГБО,
              </span>
              <br />
              которые окупаются.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-ink-70 max-w-xl leading-relaxed">
              Переводим авто на газ с гарантией на оборудование и работы.
              Официальные бренды, собственный склад, диагностика на стенде.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#calc" className="btn-primary">Рассчитать экономию</Link>
              <Link href="/services" className="btn-glass">Услуги и цены</Link>
            </div>
            <ul className="mt-8 grid sm:grid-cols-3 gap-3">
              {perks.map((p, i) => (
                <motion.li
                  key={p.text}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-md border border-white/70"
                >
                  <p.icon className="w-5 h-5 text-primary flex-none" />
                  <span className="text-sm text-ink">{p.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="liquid-glass p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-11 h-11 rounded-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #E81224 0%, #FF3E4F 100%)',
                    boxShadow: '0 8px 20px -6px rgba(232,18,36,0.55), 0 1px 0 rgba(255,255,255,0.4) inset',
                  }}
                >
                  <span className="absolute inset-x-1.5 top-1.5 h-2 rounded-lg bg-white/40 blur-[1px]" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-ink-50">Средний чек</div>
                  <div className="font-display text-2xl">от 38 000 ₽</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  'Установка ГБО 4-го поколения',
                  'Диагностика двигателя',
                  'Настройка и калибровка',
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70"
                  >
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-none" />
                    <span className="text-sm font-medium">{t}</span>
                  </div>
                ))}
              </div>
              <div
                className="mt-5 p-5 rounded-[22px] relative overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(28,28,30,0.96) 0%, rgba(28,28,30,0.88) 100%)',
                  boxShadow: '0 20px 50px -20px rgba(28,28,30,0.5)',
                }}
              >
                <span className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/40 blur-3xl" />
                <div className="relative">
                  <div className="text-[10px] text-white/60 uppercase tracking-[0.2em] mb-1">Окупаемость</div>
                  <div className="font-display text-4xl text-white">~ 8 месяцев</div>
                  <div className="text-sm text-white/70 mt-1">при пробеге от 2 000 км/мес</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
