const STEPS = [
  {
    n: '01',
    title: 'Заявка',
    text: 'Оставьте номер — перезвоним в течение 15 минут.',
    time: '15 минут',
  },
  {
    n: '02',
    title: 'Диагностика',
    text: 'Осматриваем двигатель, согласовываем комплект и точную цену.',
    time: '30 минут',
  },
  {
    n: '03',
    title: 'Установка',
    text: 'Один рабочий день. Пломбы, паспорт ГБО, настройка ЭБУ.',
    time: '6–8 часов',
  },
  {
    n: '04',
    title: 'Поддержка',
    text: 'Помогаем с регистрацией в ГИБДД. Год гарантии и плановое ТО.',
    time: '1 год',
  },
] as const;

export function HowItWorks() {
  return (
    <section
      className="section section-y border-y border-white/[0.05]"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.015), rgba(0,0,0,0.2))',
      }}
    >
      <div className="section-head">
        <span className="eyebrow">Как мы работаем</span>
        <h2 className="h-1 text-white">От звонка до заправки газом — один день</h2>
        <p className="lead">
          Никаких скрытых доплат. Цена озвучивается после бесплатной диагностики и не меняется.
        </p>
      </div>

      <ol className="grid md:grid-cols-4 gap-3 md:gap-4">
        {STEPS.map((s) => (
          <li key={s.n} className="card p-6 md:p-7 stack-4 relative">
            <div className="flex items-baseline justify-between">
              <span
                className="font-display leading-none tracking-tight"
                style={{
                  fontSize: '48px',
                  background:
                    'linear-gradient(135deg, #FF3E4F, rgba(232,18,36,0.25))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {s.n}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">
                {s.time}
              </span>
            </div>
            <h3 className="h-3 text-white">{s.title}</h3>
            <p className="text-[14px] text-white/65 leading-relaxed">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
