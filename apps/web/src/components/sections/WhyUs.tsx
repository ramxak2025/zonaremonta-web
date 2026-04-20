import { ShieldCheck, Gauge, Package, FileCheck2, Wrench, Clock } from 'lucide-react';

const REASONS = [
  {
    icon: ShieldCheck,
    title: 'Гарантия 1 год',
    text: 'На все работы. Если что-то не так — приезжаете в любое время, исправляем бесплатно.',
  },
  {
    icon: Gauge,
    title: 'Диагностика на стенде',
    text: 'Перед установкой проверяем двигатель, чтобы подобрать правильный комплект именно под ваш мотор.',
  },
  {
    icon: Package,
    title: 'Свой склад',
    text: 'Редукторы, форсунки, баллоны, фитинги в наличии — не ждёте доставки 2-3 недели.',
  },
  {
    icon: FileCheck2,
    title: 'Регистрация в ГИБДД',
    text: 'Полный пакет документов: декларация, паспорт ГБО, помогаем пройти проверку без очередей.',
  },
  {
    icon: Wrench,
    title: 'Сертифицированные мастера',
    text: 'Команда с 8-летним опытом. Работаем только с официальным оборудованием ведущих брендов.',
  },
  {
    icon: Clock,
    title: 'Установка за 1 день',
    text: 'Приехали утром — уехали вечером. Бесплатный Wi-Fi и кофе в зоне ожидания.',
  },
] as const;

export function WhyUs() {
  return (
    <section className="section section-y">
      <div className="max-w-3xl mb-12 md:mb-16">
        <span className="eyebrow">Почему нас выбирают</span>
        <h2 className="h-1 mt-3 text-white">6 причин приехать именно к нам</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REASONS.map((r) => (
          <article key={r.title} className="card p-6">
            <span
              className="w-11 h-11 rounded-xl grid place-items-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(232,18,36,0.2), rgba(232,18,36,0.05))',
                border: '1px solid rgba(232,18,36,0.25)',
              }}
            >
              <r.icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
            </span>
            <h3 className="h-3 text-white mt-5">{r.title}</h3>
            <p className="text-white/60 text-sm mt-2 leading-relaxed">{r.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
