'use client';
import { motion } from 'framer-motion';

const steps = [
  { n: '01', title: 'Заявка', text: 'Оставляете номер — мы перезваниваем за 15 минут.' },
  { n: '02', title: 'Диагностика', text: 'Осматриваем авто, подбираем комплект под двигатель.' },
  { n: '03', title: 'Установка', text: 'Работы за 1 рабочий день. Пломбы, паспорт, чек.' },
  { n: '04', title: 'Поддержка', text: 'Гарантия, напоминания о поверке, горячая линия.' },
];

export function Process() {
  return (
    <section className="section py-16 sm:py-24">
      <div className="mb-8 sm:mb-12">
        <span className="chip">Как работаем</span>
        <h2 className="h-section mt-3">4 шага без сюрпризов</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative liquid-glass p-6"
          >
            <div className="font-display text-5xl mb-3 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, rgba(232,18,36,0.25) 0%, rgba(232,18,36,0.05) 100%)' }}
            >
              {s.n}
            </div>
            <h3 className="font-display text-lg mb-1.5">{s.title}</h3>
            <p className="text-ink-70 text-sm leading-relaxed">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
