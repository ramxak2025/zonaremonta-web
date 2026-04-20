const STEPS = [
  {
    n: '01',
    title: 'Заявка',
    text: 'Оставляете телефон или пишете в WhatsApp. Перезваниваем за 15 минут.',
    time: '15 минут',
  },
  {
    n: '02',
    title: 'Диагностика',
    text: 'Бесплатно проверяем двигатель на стенде, подбираем комплект под вашу модель.',
    time: '30–40 минут',
  },
  {
    n: '03',
    title: 'Установка',
    text: 'Один рабочий день. Пломбы, паспорт ГБО, настройка карт расхода.',
    time: '6–8 часов',
  },
  {
    n: '04',
    title: 'ГИБДД + сервис',
    text: 'Помогаем пройти регистрацию. Дальше — плановое ТО раз в год.',
    time: '1 год гарантии',
  },
] as const;

export function HowItWorks() {
  return (
    <section className="section section-y bg-[#0C0C10] border-y border-white/5">
      <div className="max-w-3xl mb-12 md:mb-16">
        <span className="eyebrow">Как мы работаем</span>
        <h2 className="h-1 mt-3 text-white">От звонка до газового бака — 1 день</h2>
        <p className="lead mt-4">
          Никакой бюрократии и неожиданных доплат. Фиксированная цена озвучивается после диагностики.
        </p>
      </div>

      <ol className="grid md:grid-cols-4 gap-4">
        {STEPS.map((s, i) => (
          <li key={s.n} className="card p-6 relative">
            <div className="flex items-baseline justify-between">
              <span
                className="font-display text-[44px] leading-none tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #FF3E4F, rgba(232,18,36,0.3))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {s.n}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-white/40">{s.time}</span>
            </div>
            <h3 className="h-3 text-white mt-4">{s.title}</h3>
            <p className="text-white/60 text-sm mt-2 leading-relaxed">{s.text}</p>
            {i < STEPS.length - 1 && (
              <div
                className="hidden md:block absolute top-10 -right-2 w-4 h-px bg-white/15"
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
