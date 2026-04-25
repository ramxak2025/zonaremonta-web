import { ShieldCheck, Gauge, Package, Fuel, Wrench, Clock } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

const REASONS = [
  { icon: ShieldCheck, title: 'Гарантия 1 год',         text: 'На работы — официально, с договором. Оборудование — по заводской гарантии производителя.' },
  { icon: Gauge,       title: 'Диагностика на стенде',  text: 'Подбираем комплект под конкретный двигатель после проверки. Никаких универсальных решений.' },
  { icon: Package,     title: 'Собственный склад',      text: 'Оригинальные редукторы, форсунки и баллоны всегда в наличии в Махачкале.' },
  { icon: Fuel,        title: 'Настройка под двигатель', text: 'Карты расхода калибруются индивидуально. Авто едет без провалов на газе и на бензине.' },
  { icon: Wrench,      title: 'Сертифицированные мастера', text: 'Восемь лет на одном направлении. Команда, которая видела вашу марку сотни раз.' },
  { icon: Clock,       title: 'Один рабочий день',       text: 'Приехали утром — уехали вечером. Кофе и Wi-Fi в зоне ожидания включены.' },
] as const;

export function WhyUs() {
  return (
    <Section>
      <SectionHeader eyebrow="Почему мы" title="Шесть причин записаться именно к нам" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {REASONS.map((r) => (
          <article key={r.title} className="card flex flex-col gap-4">
            <span
              className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(232,18,36,0.22), rgba(232,18,36,0.05))',
                border: '1px solid rgba(232,18,36,0.3)',
              }}
            >
              <r.icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
            </span>
            <h3 className="font-display font-semibold uppercase tracking-tight text-white text-[16px] md:text-[18px] leading-tight">
              {r.title}
            </h3>
            <p className="text-[14px] text-white/65 leading-relaxed text-break">{r.text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
