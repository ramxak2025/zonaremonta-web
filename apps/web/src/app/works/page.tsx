import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { WorksGrid } from '@/components/sections/WorksGrid';
import { Contact } from '@/components/sections/Contact';
import { SITE } from '@/lib/site';
import { WORKS } from '@/data/works';

export const metadata: Metadata = {
  title: 'Наши работы — установка ГБО в Махачкале',
  description:
    'Реальные работы по установке ГБО: Toyota Camry D-4S, Lada Granta, Haval Jolion, Kia Sportage, Land Cruiser. Фото процесса монтажа.',
  alternates: { canonical: `${SITE.siteUrl}/works` },
};

export default function WorksPage() {
  const totalPhotos = WORKS.reduce((acc, w) => acc + w.process.length, 0);

  return (
    <>
      <Section>
        <SectionHeader
          eyebrow="Портфолио"
          title="Машины, которые уже ездят на газе"
          lead="Реальные установки за последний месяц. Нажмите на карточку — покажем, как шёл процесс монтажа: от диагностики до калибровки карт."
        />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
          <Reveal delay={0}>
            <div className="card text-center">
              <div className="font-display font-bold text-white text-[28px] md:text-[36px] leading-none">
                <Counter to={2548} />+
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55 mt-2">
                Установок за 8 лет
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card text-center">
              <div className="font-display font-bold text-white text-[28px] md:text-[36px] leading-none">
                <Counter to={WORKS.length} />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55 mt-2">
                Свежих работ
              </div>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="card text-center">
              <div className="font-display font-bold text-white text-[28px] md:text-[36px] leading-none">
                <Counter to={totalPhotos} />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55 mt-2">
                Фото процесса
              </div>
            </div>
          </Reveal>
        </div>

        <WorksGrid />
      </Section>

      <Contact />
    </>
  );
}
