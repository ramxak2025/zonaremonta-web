'use client';
import { motion } from 'framer-motion';
import { Wrench, Gauge, Package, Zap } from 'lucide-react';

const items = [
  {
    icon: Zap,
    title: 'Установка ГБО',
    text: '2-е, 4-е и 6-е поколения. Официальные бренды, комплект под двигатель.',
    gradient: 'linear-gradient(135deg, #E81224 0%, #FF3E4F 100%)',
  },
  {
    icon: Wrench,
    title: 'Ремонт ГБО',
    text: 'Редукторы, форсунки, клапаны, проводка. Сначала диагностика — потом цена.',
    gradient: 'linear-gradient(135deg, #4A9FD9 0%, #2F7AB0 100%)',
  },
  {
    icon: Gauge,
    title: 'Диагностика',
    text: 'Проверка на стенде, подключение к ЭБУ, калибровка карт расхода.',
    gradient: 'linear-gradient(135deg, #FF3E4F 0%, #E81224 100%)',
  },
  {
    icon: Package,
    title: 'Комплектующие',
    text: 'Склад в Махачкале: редукторы, форсунки, баллоны, фитинги, расходники.',
    gradient: 'linear-gradient(135deg, #2F7AB0 0%, #4A9FD9 100%)',
  },
];

export function Services() {
  return (
    <section id="services" className="section py-16 sm:py-24">
      <div className="flex items-end justify-between mb-8 sm:mb-12">
        <div>
          <span className="chip">Что мы делаем</span>
          <h2 className="h-section mt-3">Услуги</h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <motion.article
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="liquid-glass p-6 cursor-default group"
          >
            <div
              className="relative w-14 h-14 rounded-2xl grid place-items-center mb-5 overflow-hidden"
              style={{ background: it.gradient, boxShadow: '0 10px 24px -10px rgba(0,0,0,0.35)' }}
            >
              <span className="absolute inset-x-2 top-2 h-3 rounded-xl bg-white/40 blur-[1px]" aria-hidden />
              <it.icon strokeWidth={2.2} className="w-7 h-7 text-white relative" />
            </div>
            <h3 className="font-display text-xl mb-2">{it.title}</h3>
            <p className="text-ink-70 text-sm leading-relaxed">{it.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
