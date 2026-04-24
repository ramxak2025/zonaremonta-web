'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';

const ITEMS: ReadonlyArray<{ q: string; a: string }> = [
  { q: 'Безопасно ли ездить на газе?', a: 'Баллон выдерживает давление в 10 раз выше рабочего. Мультиклапан автоматически перекрывает подачу газа при ДТП. При правильной установке и плановой поверке ГБО безопаснее штатной бензиновой системы.' },
  { q: 'Какое оборудование вы ставите?', a: 'На распределённый впрыск (4 / 6 / 8 цилиндров) — Lovato, BRC, Digitronic, KME. На прямой и комбинированный впрыск — только Prins (VSI-DI) и OMVL (DREAM). Это топовые системы в своём классе.' },
  { q: 'Ставите на Toyota Camry D-4S / VW TSI / Kia GDI?', a: 'Да. На двигатели с прямым или комбинированным впрыском ставим Prins и OMVL. После диагностики двигателя подбираем комплект под конкретную модель и год.' },
  { q: 'Как часто нужна поверка баллона?', a: 'Композитный — раз в 2 года, металлический — раз в 5 лет. Без актуальной поверки эксплуатация автомобиля запрещена. Напомним заранее.' },
  { q: 'Сколько реально экономить в месяц?', a: 'При пробеге 2 000 км и расходе 10 л/100 км экономия 6 000–7 000 ₽ в месяц. Окупаемость установки — 5–8 месяцев. Точную цифру покажет калькулятор.' },
  { q: 'Делаете ли документы на ГБО?', a: 'Нет, регистрацию в ГИБДД и оформление документов клиент делает самостоятельно — мы только устанавливаем и настраиваем оборудование.' },
  { q: 'Диагностика бесплатная?', a: 'Нет, диагностика двигателя на стенде — платная. Стоимость небольшая и по итогу учитывается в цене установки, если вы решите ставить у нас.' },
  { q: 'Что если что-то сломается?', a: 'Гарантия 1 год на работы плюс заводская гарантия на оборудование. Ремонт по гарантии — бесплатно. Плановое ТО — 1 500–2 000 ₽ раз в год.' },
];

export function Faq() {
  return (
    <section className="section section-y">
      <div className="section-head">
        <span className="eyebrow">Вопросы и ответы</span>
        <h2 className="h-1 text-white">Отвечаем коротко и по делу</h2>
      </div>

      <div className="overflow-hidden divide-y divide-white/[0.06] max-w-prose rounded-3xl border border-white/[0.12]" style={{ background: 'var(--bg-elev)' }}>
        {ITEMS.map((it, i) => (
          <FaqRow key={it.q} q={it.q} a={it.a} defaultOpen={i === 0} />
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
    </section>
  );
}

function FaqRow({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4"
      >
        <span className="h-3 text-white text-break">{q}</span>
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
