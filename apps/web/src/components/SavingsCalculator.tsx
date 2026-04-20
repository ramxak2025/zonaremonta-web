'use client';
import { useMemo, useState } from 'react';
import { calculateSavings, type SavingsInput } from '@05auto/shared';

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
    <section className="section py-24">
      <div className="mb-10">
        <span className="chip">Калькулятор</span>
        <h2 className="h-section mt-3">Сколько вы сэкономите?</h2>
        <p className="text-ink-70 mt-2 max-w-xl">
          Укажите свои параметры — покажем месячную экономию, годовую и срок окупаемости.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="card space-y-5">
          <Field label="Пробег в месяц, км" value={state.monthlyMileageKm} onChange={on('monthlyMileageKm')} min={100} max={20000} step={100} />
          <Field label="Расход, л / 100 км" value={state.fuelConsumptionLPer100} onChange={on('fuelConsumptionLPer100')} min={4} max={25} step={0.5} />
          <Field label="Цена бензина, ₽/л" value={state.petrolPriceRub} onChange={on('petrolPriceRub')} min={30} max={150} step={1} />
          <Field label="Цена газа, ₽/л" value={state.gasPriceRub} onChange={on('gasPriceRub')} min={15} max={80} step={1} />
          <Field label="Стоимость установки, ₽" value={state.gboInstallPriceRub} onChange={on('gboInstallPriceRub')} min={15000} max={200000} step={500} />
        </div>
        <div className="card bg-ink text-white">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Stat label="Месяц на бензине" value={fmt(result.monthlyPetrolCost)} />
            <Stat label="Месяц на газе" value={fmt(result.monthlyGasCost)} />
          </div>
          <div className="p-5 rounded-xl bg-primary/10 border border-primary/30 mb-4">
            <div className="text-sm text-white/60 uppercase tracking-wider">Экономия в месяц</div>
            <div className="font-display text-4xl text-primary">{fmt(result.monthlySavings)} ₽</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="В год" value={fmt(result.yearlySavings) + ' ₽'} accent />
            <Stat label="Окупаемость" value={result.paybackMonths > 0 ? `${result.paybackMonths} мес.` : '—'} accent />
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, value, onChange, min, max, step,
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="chip font-mono">{value}</span>
      </div>
      <input
        type="range"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full accent-primary"
      />
    </label>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-xs text-white/60 uppercase tracking-wider">{label}</div>
      <div className={`font-display text-2xl ${accent ? 'text-secondary' : 'text-white'}`}>{value}</div>
    </div>
  );
}

function fmt(n: number) {
  return n.toLocaleString('ru-RU');
}
