'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wrench, Gauge, Package, Zap, ArrowUpRight } from 'lucide-react';
import { HexIcon } from './HexIcon';

const ease = [0.22, 1, 0.36, 1] as const;

interface Item {
  title: string;
  text: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
  tint: 'red' | 'blue';
  size: 'lg' | 'md' | 'sm';
}

const items: Item[] = [
  {
    title: 'Установка ГБО',
    text: '2-е, 4-е и 6-е поколения. Официальные бренды, подбор под двигатель.',
    icon: Zap,
    href: '/services#install',
    tint: 'red',
    size: 'lg',
  },
  {
    title: 'Ремонт ГБО',
    text: 'Редукторы, форсунки, клапаны, проводка.',
    icon: Wrench,
    href: '/services#repair',
    tint: 'blue',
    size: 'md',
  },
  {
    title: 'Диагностика',
    text: 'На стенде, подключение к ЭБУ, калибровка.',
    icon: Gauge,
    href: '/services#diagnostic',
    tint: 'red',
    size: 'md',
  },
  {
    title: 'Комплектующие',
    text: 'Склад в Махачкале. Редукторы, форсунки, баллоны, фитинги.',
    icon: Package,
    href: '/catalog',
    tint: 'blue',
    size: 'lg',
  },
];

export function Services() {
  return (
    <section id="services" className="section py-16 sm:py-24 relative">
      <div className="mb-8 sm:mb-12">
        <span className="chip">
          <span className="dot" />
          Что мы делаем
        </span>
        <h2 className="h-section mt-3 text-white">Услуги</h2>
      </div>

      <div
        className="grid gap-3 sm:gap-4"
        style={{
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gridAutoRows: 'minmax(160px, auto)',
        }}
      >
        {items.map((it, i) => {
          const colSpan =
            it.size === 'lg' ? 'col-span-6 sm:col-span-4' : it.size === 'md' ? 'col-span-6 sm:col-span-2' : 'col-span-3';
          const tintBg =
            it.tint === 'red'
              ? 'linear-gradient(135deg, rgba(232,18,36,0.22), rgba(255,62,79,0.08))'
              : 'linear-gradient(135deg, rgba(74,159,217,0.22), rgba(74,159,217,0.06))';
          const tintBorder = it.tint === 'red' ? 'rgba(232,18,36,0.35)' : 'rgba(74,159,217,0.35)';
          const tintColor = it.tint === 'red' ? 'text-primary' : 'text-secondary';

          return (
            <motion.article
              key={it.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              whileHover={{ y: -5 }}
              className={`${colSpan} liquid-glass relative overflow-hidden p-6 group`}
            >
              <Link href={it.href} className="absolute inset-0 z-10" aria-label={it.title} />
              <HexIcon
                size={220}
                filled={false}
                className="absolute -right-16 -bottom-16 text-white/[0.04] group-hover:text-white/[0.08] transition-colors"
              />
              <div className="flex items-start justify-between">
                <span
                  className="relative w-14 h-14 grid place-items-center"
                  style={{
                    background: tintBg,
                    border: `1px solid ${tintBorder}`,
                    borderRadius: 20,
                    boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset',
                  }}
                >
                  <it.icon strokeWidth={2.2} className={`w-6 h-6 ${tintColor}`} />
                </span>
                <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:rotate-12 transition-all" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl mt-5 text-white tracking-tight">
                {it.title}
              </h3>
              <p className="text-sm text-white/65 mt-2 leading-relaxed max-w-sm">{it.text}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
