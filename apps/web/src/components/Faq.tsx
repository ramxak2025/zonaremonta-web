'use client';
import { useState } from 'react';
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
    <section className="section py-24">
      <div className="mb-10">
        <span className="chip">Частые вопросы</span>
        <h2 className="h-section mt-3">FAQ</h2>
      </div>
      <div className="divide-y divide-ink-10 rounded-2xl bg-white border border-ink-10 shadow-soft">
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
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className="w-full text-left p-6 hover:bg-surface-muted/60 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium">{q}</span>
        <ChevronDown className={`w-5 h-5 text-ink-50 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      <div
        className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden text-ink-70 text-sm">{a}</div>
      </div>
    </button>
  );
}
