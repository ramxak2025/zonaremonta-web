'use client';
import { useMemo, useState } from 'react';
import {
  calculateSavings,
  PETROL_KINDS,
  type PetrolKey,
  type PublicSettings,
} from '@05auto/shared';

interface Props {
  settings: Required<PublicSettings>;
}

const DEFAULT_PETROL_KEY: PetrolKey = 'fuel.ai95.price';

export function SavingsCalculator({ settings }: Props) {
  const gasPrice = settings['fuel.lpg.price'].value;
  const installPrice = settings['calc.defaultInstallPrice'].value;
  const overheadPct = settings['calc.gasOverheadPct'].value;

  const [fuelKey, setFuelKey] = useState<PetrolKey>(DEFAULT_PETROL_KEY);
  const [mileage, setMileage] = useState(2000);
  const [consumption, setConsumption] = useState(10);
  const petrolPrice = settings[fuelKey].value;

  const result = useMemo(
    () =>
      calculateSavings({
        monthlyMileageKm: mileage,
        fuelConsumptionLPer100: consumption,
        petrolPriceRub: petrolPrice,
        gasPriceRub: gasPrice,
        gboInstallPriceRub: installPrice,
        gasOverheadPct: overheadPct,
      }),
    [mileage, consumption, petrolPrice, gasPrice, installPrice, overheadPct],
  );

  return (
    <section id="calc" className="section section-y scroll-mt-24">
      <div className="max-w-3xl mb-12 md:mb-16">
        <span className="eyebrow">Калькулятор экономии</span>
        <h2 className="h-1 mt-3 text-white">Посчитайте, сколько вернёте за год</h2>
        <p className="lead mt-4">
          Актуальные цены на топливо мы обновляем вручную — они соответствуют АЗС Махачкалы
          на сегодня.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-4">
        <div className="card p-6 md:p-8 space-y-7">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Какой бензин
              </span>
              <span className="text-sm text-white font-mono">{petrolPrice} ₽/л</span>
            </div>
            <div
              className="grid grid-cols-4 gap-1 p-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {PETROL_KINDS.map((f) => {
                const active = f.key === fuelKey;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFuelKey(f.key)}
                    className={`h-10 rounded-full text-xs font-bold uppercase transition-all ${
                      active ? 'text-white' : 'text-white/55 hover:text-white'
                    }`}
                    style={
                      active
                        ? {
                            background: 'linear-gradient(180deg, #FF3E4F, #E81224)',
                            boxShadow:
                              '0 1px 0 rgba(255,255,255,0.25) inset, 0 4px 10px -2px rgba(232,18,36,0.5)',
                          }
                        : undefined
                    }
                  >
                    {f.label.replace('АИ-', '')}
                  </button>
                );
              })}
            </div>
          </div>

          <Slider
            label="Пробег в месяц"
            unit="км"
            value={mileage}
            onChange={setMileage}
            min={100}
            max={10000}
            step={100}
          />
          <Slider
            label="Расход на 100 км"
            unit="л"
            value={consumption}
            onChange={setConsumption}
            min={4}
            max={25}
            step={0.5}
          />

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
            <InfoRow label="Газ (СУГ)" value={`${gasPrice} ₽/л`} />
            <InfoRow label="Установка" value={`от ${installPrice.toLocaleString('ru-RU')} ₽`} />
          </div>
        </div>

        <div
          className="card-strong p-6 md:p-8 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, #131318 0%, #0F0F13 100%)',
          }}
        >
          <div
            aria-hidden
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl"
            style={{ background: 'rgba(232,18,36,0.2)' }}
          />

          <div className="relative">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
              Экономия в месяц
            </div>
            <div
              className="font-display leading-none tracking-tight mt-3"
              style={{
                fontSize: 'clamp(56px, 10vw, 88px)',
                background: 'linear-gradient(135deg, #FFFFFF, #FF3E4F)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {fmt(result.monthlySavings)} ₽
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Result label="В год" value={`${fmt(result.yearlySavings)} ₽`} accent />
              <Result
                label="Окупаемость"
                value={result.paybackMonths > 0 ? `${result.paybackMonths} мес.` : '—'}
                accent
              />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
              <Result label="Бензин / мес" value={`${fmt(result.monthlyPetrolCost)} ₽`} muted />
              <Result label="Газ / мес" value={`${fmt(result.monthlyGasCost)} ₽`} muted />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label, unit, value, onChange, min, max, step,
}: {
  label: string; unit: string; value: number;
  onChange: (v: number) => void; min: number; max: number; step: number;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/60">{label}</span>
        <span className="text-sm text-white font-mono">
          {value.toLocaleString('ru-RU')} {unit}
        </span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
    </label>
  );
}

function Result({
  label, value, accent, muted,
}: { label: string; value: string; accent?: boolean; muted?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-white/40">{label}</div>
      <div
        className={`font-display mt-1 tracking-tight ${
          accent ? 'text-2xl md:text-3xl text-[#4A9FD9]' : muted ? 'text-base md:text-lg text-white/70' : 'text-2xl text-white'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-white/40">{label}</div>
      <div className="text-sm text-white mt-0.5">{value}</div>
    </div>
  );
}

function fmt(n: number): string {
  return n.toLocaleString('ru-RU');
}
