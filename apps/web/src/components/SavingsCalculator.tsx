'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { calculateSavings, type SavingsInput } from '@05auto/shared';
import { HexIcon } from './HexIcon';

export function SavingsCalculator() {
  const [state, setState] = useState<SavingsInput>({
    monthlyMileageKm: 2000,
    fuelConsumptionLPer100: 10,
    petrolPriceRub: 62,
    gasPriceRub: 28,
    gboInstallPriceRub: 38000,
    gasOverheadPct: 12,
  });
  const result = useMemo(() => calculateSavings(state), [state]);

  const on =
    <K extends keyof SavingsInput>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setState((s) => ({ ...s, [k]: Number(e.target.value) }));

  return (
    <section id="calc" className="section py-16 sm:py-24 scroll-mt-24 relative">
      <div className="mb-8 sm:mb-12">
        <span className="chip"><span className="dot" />Калькулятор</span>
        <h2 className="h-section mt-3 text-white">Сколько вы сэкономите?</h2>
        <p className="text-white/60 mt-3 max-w-xl leading-relaxed">
          Укажите параметры — покажем месячную экономию, годовую и срок окупаемости.
        </p>
      </div>
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <div className="liquid-glass p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <HexIcon size={220} filled={false} className="absolute -right-14 -bottom-14 text-white/[0.03]" />
          <Field label="Пробег в месяц" unit="км" value={state.monthlyMileageKm} onChange={on('monthlyMileageKm')} min={100} max={20000} step={100} />
          <Field label="Расход" unit="л/100 км" value={state.fuelConsumptionLPer100} onChange={on('fuelConsumptionLPer100')} min={4} max={25} step={0.5} />
          <Field label="Цена бензина" unit="₽/л" value={state.petrolPriceRub} onChange={on('petrolPriceRub')} min={30} max={150} step={1} />
          <Field label="Цена газа" unit="₽/л" value={state.gasPriceRub} onChange={on('gasPriceRub')} min={15} max={80} step={1} />
          <Field label="Стоимость установки" unit="₽" value={state.gboInstallPriceRub} onChange={on('gboInstallPriceRub')} min={15000} max={200000} step={500} />
        </div>

        <div className="liquid-glass p-6 sm:p-8 relative overflow-hidden">
          <HexIcon size={300} filled={false} className="absolute -right-20 -top-12 text-white/[0.04]" />
          <span className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" aria-hidden />
          <span className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-secondary/15 blur-3xl" aria-hidden />
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Stat label="На бензине" value={fmt(result.monthlyPetrolCost) + ' ₽'} />
              <Stat label="На газе" value={fmt(result.monthlyGasCost) + ' ₽'} />
            </div>
            <motion.div
              key={result.monthlySavings}
              initial={{ scale: 0.98, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-5 mb-4 relative overflow-hidden"
              style={{
                borderRadius: 22,
                background: 'linear-gradient(135deg, rgba(232,18,36,0.25) 0%, rgba(255,62,79,0.08) 100%)',
                border: '1px solid rgba(232,18,36,0.4)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.1) inset, 0 10px 30px -10px rgba(232,18,36,0.4)',
              }}
            >
              <div className="text-[10px] text-white/70 uppercase tracking-[0.25em]">Экономия в месяц</div>
              <div
                className="font-display text-[48px] sm:text-6xl leading-none mt-2 tracking-tight"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #FF3E4F 0%, #FFFFFF 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {fmt(result.monthlySavings)} ₽
              </div>
            </motion.div>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="В год" value={fmt(result.yearlySavings) + ' ₽'} accent />
              <Stat label="Окупаемость" value={result.paybackMonths > 0 ? `${result.paybackMonths} мес.` : '—'} accent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, unit, value, onChange, min, max, step }: {
  label: string; unit: string; value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number; max: number; step: number;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white/90">{label}</span>
        <span className="chip !text-xs font-mono !py-1">
          {value.toLocaleString('ru-RU')} {unit}
        </span>
      </div>
      <input type="range" value={value} onChange={onChange} min={min} max={max} step={step} />
    </label>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className="p-4 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset',
      }}
    >
      <div className="text-[10px] text-white/55 uppercase tracking-[0.2em]">{label}</div>
      <div className={`font-display text-xl sm:text-2xl mt-1 ${accent ? 'text-secondary' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

function fmt(n: number) {
  return n.toLocaleString('ru-RU');
}
