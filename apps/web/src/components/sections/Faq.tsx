'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

const ITEMS: ReadonlyArray<{ q: string; a: string }> = [
  { q: 'Безопасно ли ездить на газе?', a: 'Баллон выдерживает давление в 10 раз выше рабочего. Мультиклапан автоматически перекрывает подачу газа при ДТП. При правильной установке и плановой поверке ГБО безопаснее штатной бензиновой системы.' },
  { q: 'Какое оборудование вы ставите?', a: 'На распределённый впрыск (4/6/8 цилиндров) — Lovato, BRC, Digitronic, KME. На прямой и комбинированный впрыск — только Prins (VSI-DI) и OMVL (DREAM).' },
  { q: 'Ставите на Toyota Camry D-4S / VW TSI / Kia GDI?', a: 'Да. На двигатели с прямым или комбинированным впрыском ставим Prins и OMVL. После диагностики двигателя подбираем комплект под конкретную модель и год.' },
  { q: 'Как часто нужна поверка баллона?', a: 'Композитный — раз в 2 года, металлический — раз в 5 лет. Без актуальной поверки эксплуатация автомобиля запрещена. Напомним заранее.' },
  { q: 'Сколько реально экономить в месяц?', a: 'При пробеге 2 000 км и расходе 10 л/100 км экономия 6 000–7 000 ₽ в месяц. Окупаемость установки — 5–8 месяцев.' },
  { q: 'Делаете ли документы на ГБО?', a: 'Нет, регистрацию в ГИБДД и оформление документов клиент делает самостоятельно — мы только устанавливаем и настраиваем оборудование.' },
  { q: 'Диагностика бесплатная?', a: 'Нет, диагностика двигателя на стенде — платная. Стоимость небольшая и по итогу учитывается в цене установки, если вы решите ставить у нас.' },
  { q: 'Что если что-то сломается?', a: 'Гарантия 1 год на работы плюс заводская гарантия на оборудование. Ремонт по гарантии — бесплатно. Плановое ТО — 1 500–2 000 ₽ раз в год.' },
];

export function Faq() {
  return (
    <Section>
      <SectionHeader eyebrow="Вопросы и ответы" title="Отвечаем коротко и по делу" />

      <div
        className="max-w-[48rem] overflow-hidden rounded-3xl"
        style={{ background: 'rgba(20,20,26,0.85)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        {ITEMS.map((it, i) => (
          <FaqRow key={it.q} q={it.q} a={it.a} defaultOpen={i === 0} isLast={i === ITEMS.length - 1} />
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: ITEMS.map((it) => ({
              '@type': 'Question',
              name: it.q,
              acceptedAnswer: { '@type': 'Answer', text: it.a },
            })),
          }),
        }}
      />
    </Section>
  );
}

function FaqRow({ q, a, defaultOpen, isLast }: { q: string; a: string; defaultOpen?: boolean; isLast?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div className={isLast ? '' : 'border-b border-white/[0.06]'}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4"
      >
        <span className="font-display font-semibold uppercase tracking-tight text-white text-[16px] md:text-[18px] leading-snug text-break">
          {q}
        </span>
        <span
          className={`w-9 h-9 rounded-full border border-white/10 grid place-items-center flex-shrink-0 bg-white/[0.04] transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
        >
          <Plus className="w-4 h-4 text-white/80" />
        </span>
      </button>
      {open && (
        <div className="px-5 md:px-6 pb-5 md:pb-6 text-[14px] text-white/70 leading-relaxed text-break">
          {a}
        </div>
      )}
    </div>
  );
}
