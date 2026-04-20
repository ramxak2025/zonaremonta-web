'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Fuel, Gauge } from 'lucide-react';

const perks = [
  { icon: ShieldCheck, text: 'Гарантия 1 год на работы' },
  { icon: Fuel, text: 'Экономия до 55% на топливе' },
  { icon: Gauge, text: 'Диагностика на стенде' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-radial pointer-events-none" aria-hidden />
      <div className="section pt-16 pb-24 lg:pt-24 lg:pb-32 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="chip mb-6">
              <span className="w-2 h-2 rounded-full bg-primary" />
              ГБО 2/4/6 поколения · Махачкала
            </span>
            <h1 className="h-hero">
              Установка и ремонт <span className="text-primary">ГБО</span>,<br />
              которые окупаются.
            </h1>
            <p className="mt-6 text-lg text-ink-70 max-w-xl">
              Переводим авто на газ с гарантией на оборудование и работы.
              Официальные бренды, собственный склад комплектующих, диагностика на стенде.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#callback" className="btn-primary">Рассчитать экономию</Link>
              <Link href="/services" className="btn-ghost">Услуги и цены</Link>
            </div>
            <ul className="mt-10 grid sm:grid-cols-3 gap-4">
              {perks.map((p) => (
                <li key={p.text} className="flex items-start gap-3">
                  <p.icon className="w-5 h-5 text-primary flex-none mt-0.5" />
                  <span className="text-sm text-ink-70">{p.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="glass rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-gradient" />
                <div>
                  <div className="text-sm text-ink-50">Средний чек</div>
                  <div className="font-display text-2xl">от 38 000 ₽</div>
                </div>
              </div>
              <div className="space-y-3">
                {['Установка ГБО 4-го поколения', 'Диагностика двигателя', 'Настройка и калибровка'].map((t) => (
                  <div key={t} className="flex items-center gap-3 p-3 rounded-xl bg-white/60">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-ink text-white">
                <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Окупаемость</div>
                <div className="font-display text-3xl">~ 8 месяцев</div>
                <div className="text-sm text-white/60 mt-1">при пробеге от 2 000 км/мес</div>
              </div>
            </div>
            <div className="absolute -z-10 inset-0 blur-3xl opacity-60 bg-accent-gradient rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
