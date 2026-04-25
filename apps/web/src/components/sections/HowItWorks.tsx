const STEPS = [
  { n: '01', title: 'Заявка', text: 'Оставьте номер — перезвоним в течение 15 минут.', time: '15 минут' },
  { n: '02', title: 'Диагностика', text: 'Осматриваем двигатель, согласовываем комплект и точную цену.', time: '30 минут' },
  { n: '03', title: 'Установка', text: 'Один рабочий день. Настройка ЭБУ и калибровка карт расхода.', time: '6–8 часов' },
  { n: '04', title: 'Поддержка', text: 'Год гарантии на работы и плановое ТО по расписанию.', time: '1 год' },
] as const;

export function HowItWorks() {
  return (
    <section className="border-y border-white/[0.05] bg-black/20">
      <div className="section section-y">
        <div className="max-w-3xl mb-8 md:mb-10">
          <span className="eyebrow block mb-3">Как мы работаем</span>
          <h2 className="h-1 text-white mb-4 md:mb-5">От звонка до заправки газом — один день</h2>
          <p className="lead max-w-prose">
            Никаких скрытых доплат. Цена озвучивается после диагностики двигателя и не меняется.
          </p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {STEPS.map((s) => (
            <li key={s.n} className="card flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <span
                  className="num-xl"
                  style={{
                    background: 'linear-gradient(135deg, #FF3E4F, rgba(232,18,36,0.3))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    paddingBottom: '0.05em',
                  }}
                >
                  {s.n}
                </span>
                <span className="eyebrow eyebrow-mute mt-1 flex-shrink-0">{s.time}</span>
              </div>
              <h3 className="h-3 text-white">{s.title}</h3>
              <p className="text-[14px] text-white/65 leading-relaxed text-break">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
