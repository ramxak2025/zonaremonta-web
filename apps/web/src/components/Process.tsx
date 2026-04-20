const steps = [
  { n: '01', title: 'Заявка', text: 'Оставляете номер — мы перезваниваем за 15 минут.' },
  { n: '02', title: 'Диагностика', text: 'Осматриваем авто, подбираем комплект под двигатель.' },
  { n: '03', title: 'Установка', text: 'Работы за 1 рабочий день. Пломбы, паспорт, чек.' },
  { n: '04', title: 'Поддержка', text: 'Гарантия, напоминания о поверке, горячая линия.' },
];

export function Process() {
  return (
    <section className="section py-24">
      <div className="mb-10">
        <span className="chip">Как работаем</span>
        <h2 className="h-section mt-3">4 шага без сюрпризов</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <div key={s.n} className="relative card">
            <div className="font-display text-5xl text-primary/20 mb-3">{s.n}</div>
            <h3 className="font-display text-lg mb-1">{s.title}</h3>
            <p className="text-ink-70 text-sm">{s.text}</p>
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-12 -right-3 w-6 h-0.5 bg-ink-10" aria-hidden />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
