'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';

const ITEMS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: 'Безопасно ли ставить ГБО? Не взрывается?',
    a: 'При правильной установке и регулярном ТО ГБО безопаснее бензиновой системы. Баллон выдерживает давление в 10 раз выше рабочего, оснащён мультиклапаном с аварийным срабатыванием. В случае ДТП система автоматически перекрывает подачу газа.',
  },
  {
    q: 'Потеряется ли гарантия на автомобиль?',
    a: 'На двигатель — нет, если установка сертифицированная и зарегистрирована в ГИБДД. На топливную систему — зависит от производителя и условий гарантии конкретной марки. Проверяем ваш случай перед установкой.',
  },
  {
    q: 'Какая разница между ГБО 4 и ГБО 4+?',
    a: '4-е поколение ставится на обычные инжекторные двигатели (распределённый впрыск). 4+ — для современных моторов с прямым впрыском топлива в камеру сгорания: TSI, FSI, GDI, D-4S, SkyActiv. Это разные системы, смешивать нельзя.',
  },
  {
    q: 'Как часто нужно проходить поверку баллона?',
    a: 'Композитный баллон — раз в 2 года. Металлический — раз в 5 лет. Без актуальной поверки эксплуатация запрещена, это проверяется при техосмотре.',
  },
  {
    q: 'Сколько экономит ГБО 4+ на прямом впрыске?',
    a: 'На среднестатистической машине с прямым впрыском (пробег ~2000 км/мес, расход 10 л/100 км) экономия составляет 15–20 тыс. ₽ в месяц. Окупаемость установки — 5–7 месяцев в зависимости от цены на топливо.',
  },
  {
    q: 'Нужно ли регистрировать ГБО в ГИБДД?',
    a: 'Да, это обязательное требование с 2016 года. Без регистрации эксплуатация автомобиля незаконна. Мы даём полный пакет документов: декларацию производителя, паспорт ГБО, свидетельство о соответствии конструкции.',
  },
  {
    q: 'Что если оборудование сломается?',
    a: 'Гарантия 1 год на работы + заводская гарантия производителя на компоненты (Lovato, BRC и др. — от 2 лет). Приезжаете — чиним бесплатно. Плановое ТО раз в год — 1500–2000 ₽.',
  },
] as const;

export function Faq() {
  return (
    <section className="section section-y">
      <div className="max-w-3xl mb-12 md:mb-16">
        <span className="eyebrow">Вопросы и ответы</span>
        <h2 className="h-1 mt-3 text-white">Короткие ответы на самые важные</h2>
      </div>

      <div className="max-w-3xl divide-y divide-white/5 card-strong">
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
        <span className="h-3 text-white">{q}</span>
        <span
          className={`w-9 h-9 rounded-full border border-white/10 grid place-items-center flex-none bg-white/5 transition-transform ${
            open ? 'rotate-45' : ''
          }`}
        >
          <Plus className="w-4 h-4 text-white/80" />
        </span>
      </button>
      {open && <div className="px-5 md:px-6 pb-5 md:pb-6 text-white/70 leading-relaxed">{a}</div>}
    </div>
  );
}
