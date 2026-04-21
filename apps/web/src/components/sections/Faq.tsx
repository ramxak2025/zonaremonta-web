'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';

const ITEMS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: 'Безопасно ли ездить на газе?',
    a: 'Баллон выдерживает давление в 10 раз выше рабочего. Мультиклапан автоматически перекрывает подачу газа при ДТП. При правильной установке и плановой поверке ГБО безопаснее штатной бензиновой системы.',
  },
  {
    q: 'Не потеряю ли я гарантию на автомобиль?',
    a: 'На двигатель — нет, если установка сертифицированная и зарегистрирована в ГИБДД. По условиям конкретной марки уточним перед началом работ.',
  },
  {
    q: 'В чём разница между ГБО 4 и 4+?',
    a: '4-е поколение — для инжекторных моторов с распределённым впрыском. 4+ (Direct Injection) — для прямого впрыска: TSI, FSI, GDI, D-4S. Это принципиально разные системы.',
  },
  {
    q: 'Как часто нужна поверка баллона?',
    a: 'Композитный — раз в 2 года, металлический — раз в 5 лет. Без актуальной поверки эксплуатация автомобиля запрещена. Напомним заранее.',
  },
  {
    q: 'Сколько реально экономить в месяц?',
    a: 'При пробеге 2 000 км и расходе 10 л/100 км экономия 6 000–7 000 ₽ в месяц. Окупаемость установки — 5–8 месяцев. Точную цифру покажет калькулятор.',
  },
  {
    q: 'Обязательна ли регистрация в ГИБДД?',
    a: 'Да. С 2016 года без регистрации ГБО эксплуатация незаконна. Выдаём полный пакет документов и сопровождаем на осмотре.',
  },
  {
    q: 'Что если что-то сломается?',
    a: 'Гарантия 1 год на работы плюс заводская гарантия на оборудование. Ремонт по гарантии — бесплатно. Плановое ТО — 1 500–2 000 ₽ раз в год.',
  },
] as const;

export function Faq() {
  return (
    <section className="section section-y">
      <div className="max-w-3xl stack-5 mb-12 md:mb-16">
        <span className="eyebrow">Вопросы и ответы</span>
        <h2 className="h-1 text-white">Отвечаем коротко и по делу</h2>
      </div>

      <div className="max-w-3xl card-strong overflow-hidden divide-y divide-white/[0.06]">
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
        className="w-full text-left p-6 md:p-7 flex items-center justify-between gap-6"
      >
        <span className="h-3 text-white">{q}</span>
        <span
          className={`w-10 h-10 rounded-full border border-white/10 grid place-items-center flex-none bg-white/[0.04] transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
        >
          <Plus className="w-4 h-4 text-white/80" />
        </span>
      </button>
      {open && (
        <div className="px-6 md:px-7 pb-6 md:pb-7 text-white/70 leading-relaxed text-[15px]">
          {a}
        </div>
      )}
    </div>
  );
}
