import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import { HexIcon } from '@/components/HexIcon';
import { DEFAULT_SERVICES } from '@05auto/shared';
import { getPublicSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Услуги и цены',
  description: 'Установка ГБО 2/4/6 поколения, диагностика, ремонт, поверка баллона.',
};

export const revalidate = 60;

export default async function ServicesPage() {
  const settings = await getPublicSettings();
  return (
    <>
      <Header />
      <main>
        <section className="section py-12 sm:py-20 relative">
          <div className="absolute inset-0 hex-grid opacity-60 pointer-events-none" aria-hidden />
          <div className="relative">
            <span className="chip"><span className="dot" />Услуги</span>
            <h1 className="h-hero mt-4 text-white">Полный спектр работ по ГБО</h1>
            <p className="text-white/65 mt-4 max-w-2xl leading-relaxed">
              Цены — стартовые. Финальная стоимость зависит от комплектации, состояния авто и двигателя.
              Точную цену даём после бесплатной диагностики.
            </p>

            <div
              className="grid gap-3 sm:gap-4 mt-10"
              style={{
                gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                gridAutoRows: 'minmax(220px, auto)',
              }}
            >
              {DEFAULT_SERVICES.map((s, i) => {
                const sizes = [
                  'col-span-6 sm:col-span-4',
                  'col-span-6 sm:col-span-2',
                  'col-span-6 sm:col-span-3',
                  'col-span-6 sm:col-span-3',
                  'col-span-6 sm:col-span-2',
                  'col-span-6 sm:col-span-4',
                  'col-span-6 sm:col-span-3',
                ];
                const cls = sizes[i % sizes.length];
                return (
                  <article
                    id={s.slug}
                    key={s.slug}
                    className={`${cls} liquid-glass relative overflow-hidden p-6 sm:p-7 flex flex-col justify-between`}
                  >
                    <HexIcon
                      size={220}
                      filled={false}
                      className="absolute -right-12 -bottom-12 text-white/[0.04]"
                    />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span className="chip !py-1 !text-[10px]">
                          {Math.round(s.durationMin / 60)} ч
                        </span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl mt-4 text-white tracking-tight">
                        {s.name}
                      </h2>
                      <p className="text-white/60 text-sm mt-2 leading-relaxed">{s.description}</p>
                    </div>
                    <div className="relative mt-6">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">от</div>
                      <div
                        className="font-display text-4xl mt-1 tracking-tight"
                        style={{
                          backgroundImage: 'linear-gradient(135deg, #FF3E4F 0%, #FFFFFF 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }}
                      >
                        {s.basePrice.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <SavingsCalculator settings={settings} />
      </main>
      <Footer />
    </>
  );
}
