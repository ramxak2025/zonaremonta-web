import { Wrench, Gauge, Package, Zap } from 'lucide-react';

const items = [
  {
    icon: Zap,
    title: 'Установка ГБО',
    text: '2-е, 4-е и 6-е поколения. Официальные бренды, комплект под двигатель клиента.',
  },
  {
    icon: Wrench,
    title: 'Ремонт ГБО',
    text: 'Редукторы, форсунки, клапаны, проводка. Сначала диагностика — потом цена.',
  },
  {
    icon: Gauge,
    title: 'Диагностика',
    text: 'Проверка на стенде, подключение к ЭБУ, калибровка карт расхода.',
  },
  {
    icon: Package,
    title: 'Комплектующие',
    text: 'Склад в Махачкале: редукторы, форсунки, баллоны, фитинги и расходники.',
  },
];

export function Services() {
  return (
    <section id="services" className="section py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="chip">Что мы делаем</span>
          <h2 className="h-section mt-3">Услуги</h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.title} className="card hover:shadow-medium transition-shadow duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-accent-gradient grid place-items-center mb-4 group-hover:scale-110 transition-transform">
              <it.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display text-xl mb-2">{it.title}</h3>
            <p className="text-ink-70 text-sm">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
