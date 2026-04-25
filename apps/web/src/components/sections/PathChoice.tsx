import Link from 'next/link';
import { ArrowUpRight, Wrench, Activity } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Развилка: пользователь либо хочет ПОСТАВИТЬ ГБО (новая клиентура),
 * либо ПОЧИНИТЬ существующее (повторные клиенты). Две большие плашки —
 * чтобы каждый сразу попадал в свой воронку.
 */
export function PathChoice() {
  return (
    <Section>
      <SectionHeader
        eyebrow="С чем приехали"
        title="Выберите, что вам нужно"
        lead="У нас две воронки: установка ГБО с нуля и ремонт уже стоящего оборудования."
      />

      <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
        <Reveal>
          <Link
            href="/install"
            className="group block rounded-3xl p-7 md:p-8 relative overflow-hidden h-full"
            style={{
              background: 'linear-gradient(180deg, rgba(232,18,36,0.12) 0%, rgba(20,20,26,0.95) 100%)',
              border: '1px solid rgba(232,18,36,0.3)',
              minHeight: '260px',
            }}
          >
            <div
              aria-hidden
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-110"
              style={{ background: 'rgba(232,18,36,0.3)' }}
            />
            <div className="relative flex flex-col h-full">
              <span
                className="w-12 h-12 rounded-xl grid place-items-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(232,18,36,0.4), rgba(232,18,36,0.1))',
                  border: '1px solid rgba(232,18,36,0.5)',
                }}
              >
                <Wrench className="w-6 h-6 text-white" strokeWidth={2.2} />
              </span>
              <h3 className="mt-5 font-display font-bold uppercase tracking-tight text-white text-[22px] md:text-[28px] leading-tight max-w-[20ch]">
                Поставить ГБО
              </h3>
              <p className="mt-3 text-[14px] md:text-[15px] text-white/75 leading-relaxed max-w-[36ch] flex-1">
                MPI на 4/6/8 цилиндров, прямой и комбинированный впрыск (Prins, OMVL).
                Один день — и ваш авто ездит в 2 раза дешевле.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-white">
                Подробнее об установке
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </Link>
        </Reveal>

        <Reveal delay={140}>
          <Link
            href="/repair"
            className="group block rounded-3xl p-7 md:p-8 relative overflow-hidden h-full"
            style={{
              background: 'linear-gradient(180deg, rgba(74,159,217,0.12) 0%, rgba(20,20,26,0.95) 100%)',
              border: '1px solid rgba(74,159,217,0.3)',
              minHeight: '260px',
            }}
          >
            <div
              aria-hidden
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-110"
              style={{ background: 'rgba(74,159,217,0.28)' }}
            />
            <div className="relative flex flex-col h-full">
              <span
                className="w-12 h-12 rounded-xl grid place-items-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(74,159,217,0.4), rgba(74,159,217,0.1))',
                  border: '1px solid rgba(74,159,217,0.5)',
                }}
              >
                <Activity className="w-6 h-6 text-white" strokeWidth={2.2} />
              </span>
              <h3 className="mt-5 font-display font-bold uppercase tracking-tight text-white text-[22px] md:text-[28px] leading-tight max-w-[20ch]">
                Починить ГБО
              </h3>
              <p className="mt-3 text-[14px] md:text-[15px] text-white/75 leading-relaxed max-w-[36ch] flex-1">
                Диагностика на стенде за 30 минут. Ремонт редукторов, форсунок, ЭБУ. Любые
                марки. От 1 500 ₽.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-white">
                Симптомы и цены
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
