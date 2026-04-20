'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const items = [
  {
    q: 'Сколько экономит ГБО?',
    a: 'В зависимости от пробега и расхода — от 40% до 55% на топливе. Калькулятор на сайте покажет цифры под ваше авто.',
  },
  {
    q: 'Какое поколение ГБО ставить?',
    a: 'Для карбюраторных — 2-е; для инжекторных — 4-е (самый массовый вариант); для двигателей с прямым впрыском — 6-е.',
  },
  {
    q: 'Как часто делать поверку баллона?',
    a: 'Композитный — раз в 2 года, металлический — раз в 5 лет. Без поверки эксплуатация незаконна.',
  },
  {
    q: 'Даёте ли гарантию?',
    a: 'Да. На работы — 1 год, на оборудование — заводская гарантия производителя.',
  },
  {
    q: 'Нужно ли регистрировать ГБО в ГИБДД?',
    a: 'Да. Это обязательное требование. Помогаем с пакетом документов для регистрации изменений.',
  },
];

export function Faq() {
  return (
    <section className="section py-16 sm:py-24">
      <div className="mb-8 sm:mb-12">
        <span className="chip">Частые вопросы</span>
        <h2 className="h-section mt-3">FAQ</h2>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((it, i) => (
          <FaqItem key={it.q} q={it.q} a={it.a} defaultOpen={i === 0} />
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((it) => ({
              '@type': 'Question',
              name: it.q,
              acceptedAnswer: { '@type': 'Answer', text: it.a },
            })),
          }),
        }}
      />
    </section>
  );
}

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <motion.div layout className="liquid-glass overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 active:scale-[0.99] transition-transform"
      >
        <span className="font-medium text-base sm:text-lg">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-5 h-5 text-ink-50 flex-none" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-ink-70 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
