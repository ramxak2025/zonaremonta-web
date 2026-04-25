import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

const STEPS = [
  { n: '01', title: 'Заявка',     text: 'Оставьте номер — перезвоним в течение 15 минут.', time: '15 минут' },
  { n: '02', title: 'Диагностика', text: 'Осматриваем двигатель, согласовываем комплект и точную цену.', time: '30 минут' },
  { n: '03', title: 'Установка',   text: 'Один рабочий день. Настройка ЭБУ и калибровка карт расхода.', time: '6–8 часов' },
  { n: '04', title: 'Поддержка',   text: 'Год гарантии на работы и плановое ТО по расписанию.', time: '1 год' },
] as const;

export function Steps() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Как мы работаем"
        title="От звонка до заправки газом — один день"
        lead="Никаких скрытых доплат. Цена озвучивается после диагностики двигателя и не меняется."
      />

      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {STEPS.map((s) => (
          <li key={s.n} className="card flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <span
                className="font-display font-bold leading-none tracking-tight"
                style={{
                  fontSize: '40px',
                  paddingBottom: '0.06em',
                  background: 'linear-gradient(135deg, #FF3E4F, rgba(232,18,36,0.3))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {s.n}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mt-2 flex-shrink-0">
                {s.time}
              </span>
            </div>
            <h3 className="font-display font-semibold uppercase tracking-tight text-white text-[16px] md:text-[18px] leading-tight">
              {s.title}
            </h3>
            <p className="text-[14px] text-white/65 leading-relaxed text-break">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
