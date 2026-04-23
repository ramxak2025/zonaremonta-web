import { ShieldCheck, Gauge, Package, FileCheck2, Wrench, Clock } from 'lucide-react';

const REASONS = [
  {
    icon: ShieldCheck,
    title: 'Гарантия 1 год',
    text: 'На работы — официально, с договором. Оборудование — по заводской гарантии производителя.',
  },
  {
    icon: Gauge,
    title: 'Диагностика на стенде',
    text: 'Подбираем комплект под конкретный двигатель после проверки. Никаких универсальных решений.',
  },
  {
    icon: Package,
    title: 'Собственный склад',
    text: 'Оригинальные редукторы, форсунки и баллоны всегда в наличии в Махачкале.',
  },
  {
    icon: FileCheck2,
    title: 'Регистрация в ГИБДД',
    text: 'Декларация, паспорт ГБО, сопровождение при осмотре. Берём бюрократию на себя.',
  },
  {
    icon: Wrench,
    title: 'Сертифицированные мастера',
    text: 'Восемь лет на одном направлении. Команда, которая видела вашу марку сотни раз.',
  },
  {
    icon: Clock,
    title: 'Один рабочий день',
    text: 'Приехали утром — уехали вечером. Кофе и Wi-Fi в зоне ожидания включены.',
  },
] as const;

export function WhyUs() {
  return (
    <section className="section section-y">
      <div className="section-head">
        <span className="eyebrow">Почему мы</span>
        <h2 className="h-1 text-white">Шесть причин записаться именно к нам</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {REASONS.map((r) => (
          <article key={r.title} className="card p-6 flex flex-col gap-4">
            <span
              className="w-11 h-11 rounded-lg grid place-items-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(232,18,36,0.2), rgba(232,18,36,0.05))',
                border: '1px solid rgba(232,18,36,0.25)',
              }}
            >
              <r.icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
            </span>
            <h3 className="h-3 text-white">{r.title}</h3>
            <p className="text-[14px] text-white/65 leading-relaxed text-break">{r.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
