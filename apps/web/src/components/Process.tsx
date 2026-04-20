'use client';
import { motion } from 'framer-motion';
import { HexIcon } from './HexIcon';

const steps = [
  { n: '01', title: 'Заявка', text: 'Оставляете номер — перезваниваем за 15 минут.' },
  { n: '02', title: 'Диагностика', text: 'Осмотр авто, подбор комплекта под двигатель.' },
  { n: '03', title: 'Установка', text: '1 рабочий день. Пломбы, паспорт, чек.' },
  { n: '04', title: 'Поддержка', text: 'Гарантия, напоминания о поверке, горячая линия.' },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  return (
    <section className="section py-16 sm:py-24 relative">
      <div className="mb-8 sm:mb-12">
        <span className="chip">
          <span className="dot" />
          Как работаем
        </span>
        <h2 className="h-section mt-3 text-white">4 шага без сюрпризов</h2>
      </div>

      <div
        className="grid gap-3 sm:gap-4"
        style={{
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gridAutoRows: 'minmax(180px, auto)',
        }}
      >
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.08, ease }}
            className="col-span-4 sm:col-span-2 lg:col-span-1 liquid-glass relative overflow-hidden p-6"
          >
            <HexIcon
              size={180}
              filled={false}
              className="absolute -right-10 -bottom-10 text-white/[0.03]"
            />
            <div
              className="font-display text-6xl tracking-tight relative"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, rgba(232,18,36,0.9) 0%, rgba(232,18,36,0.15) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {s.n}
            </div>
            <h3 className="font-display text-xl mt-3 text-white">{s.title}</h3>
            <p className="text-sm text-white/60 mt-1.5 leading-relaxed">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
