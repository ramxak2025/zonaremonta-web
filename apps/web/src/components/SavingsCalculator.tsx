'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { calculateSavings } from '@05auto/shared';
import { HexIcon } from './HexIcon';
import { FUEL_KINDS, readSetting, type SettingsMap } from '@/lib/settings';

export function SavingsCalculator({ settings }: { settings: SettingsMap }) {
  // Владелец задаёт цены — клиент только выбирает тип бензина и крутит пробег/расход
  const fuelPrices = useMemo(
    () =>
      FUEL_KINDS.map((f) => ({
        ...f,
        price: readSetting<number>(settings, f.key, 0),
      })).filter((f) => f.price > 0),
    [settings],
  );
  const gasPrice = readSetting<number>(settings, 'fuel.lpg.price', 28);
  const installPrice = readSetting<number>(settings, 'calc.defaultInstallPrice', 38000);
  const overheadPct = readSetting<number>(settings, 'calc.gasOverheadPct', 12);

  const [fuelIdx, setFuelIdx] = useState(fuelPrices.findIndex((f) => f.key === 'fuel.ai95.price'));
  useEffect(() => {
    if (fuelIdx < 0 || fuelIdx >= fuelPrices.length) {
      setFuelIdx(Math.max(0, fuelPrices.findIndex((f) => f.key === 'fuel.ai95.price')));
    }
  }, [fuelPrices, fuelIdx]);

  const [mileage, setMileage] = useState(2000);
  const [consumption, setConsumption] = useState(10);

  const petrolPrice = fuelPrices[fuelIdx]?.price ?? 62;

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
    <section id="calc" className="section py-12 sm:py-24 scroll-mt-24 relative">
      <div className="mb-6 sm:mb-10">
        <span className="chip"><span className="dot" />Калькулятор</span>
        <h2 className="h-section mt-3 text-white">Сколько вы сэкономите?</h2>
        <p className="text-white/65 mt-2 sm:mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
          Выберите свой бензин, укажите пробег и расход. Цены топлива обновляются нами — они актуальны на сегодня.
        </p>
      </div>

      <div className="grid gap-2.5 sm:gap-4 lg:grid-cols-2">
        {/* --- Форма --- */}
        <div className="liquid-glass p-5 sm:p-8 space-y-6 relative overflow-hidden">
          <HexIcon size={220} filled={false} className="absolute -right-14 -bottom-14 text-white/[0.03]" />

          {/* Выбор бензина */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">Ваш бензин</span>
              <span className="chip !text-xs font-mono !py-1">
                {petrolPrice} ₽/л
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
              {fuelPrices.map((f, i) => {
                const active = i === fuelIdx;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFuelIdx(i)}
                    className={`h-10 rounded-xl text-xs font-bold uppercase transition-all ${
                      active
                        ? 'text-white'
                        : 'text-white/55 hover:text-white/80'
                    }`}
                    style={
                      active
                        ? {
                            background:
                              'linear-gradient(180deg, #FF3E4F 0%, #E81224 100%)',
                            boxShadow:
                              '0 1px 0 rgba(255,255,255,0.3) inset, 0 6px 14px -4px rgba(232,18,36,0.6)',
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

          <Field
            label="Пробег в месяц"
            unit="км"
            value={mileage}
            onChange={(e) => setMileage(Number(e.target.value))}
            min={100}
            max={10000}
            step={100}
          />
          <Field
            label="Расход на 100 км"
            unit="л"
            value={consumption}
            onChange={(e) => setConsumption(Number(e.target.value))}
            min={4}
            max={25}
            step={0.5}
          />

          {/* Справочные цены газа + установки */}
          <div className="grid grid-cols-2 gap-2.5 relative">
            <InfoPill label="Цена газа (СУГ)" value={`${gasPrice} ₽/л`} />
            <InfoPill label="Установка ГБО" value={`${installPrice.toLocaleString('ru-RU')} ₽`} />
          </div>
        </div>

        {/* --- Результат --- */}
        <div className="liquid-glass p-5 sm:p-8 relative overflow-hidden">
          <HexIcon size={300} filled={false} className="absolute -right-20 -top-12 text-white/[0.04]" />
          <span className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" aria-hidden />
          <span className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-secondary/15 blur-3xl" aria-hidden />
          <div className="relative">
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <Stat label="На бензине / мес" value={fmt(result.monthlyPetrolCost) + ' ₽'} />
              <Stat label="На газе / мес" value={fmt(result.monthlyGasCost) + ' ₽'} />
            </div>
            <motion.div
              key={result.monthlySavings}
              initial={{ scale: 0.97, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-5 mb-4 relative overflow-hidden"
              style={{
                borderRadius: 22,
                background:
                  'linear-gradient(135deg, rgba(232,18,36,0.28) 0%, rgba(255,62,79,0.08) 100%)',
                border: '1px solid rgba(232,18,36,0.45)',
                boxShadow:
                  '0 1px 0 rgba(255,255,255,0.1) inset, 0 12px 30px -10px rgba(232,18,36,0.45)',
              }}
            >
              <div className="text-[10px] text-white/70 uppercase tracking-[0.25em]">
                Экономия в месяц
              </div>
              <div
                className="font-display leading-none mt-2 tracking-tight"
                style={{
                  fontSize: 'clamp(42px, 10vw, 64px)',
                  backgroundImage: 'linear-gradient(135deg, #FF3E4F 0%, #FFFFFF 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {fmt(result.monthlySavings)} ₽
              </div>
            </motion.div>
            <div className="grid grid-cols-2 gap-2.5">
              <Stat label="В год" value={fmt(result.yearlySavings) + ' ₽'} accent />
              <Stat
                label="Окупаемость"
                value={result.paybackMonths > 0 ? `${result.paybackMonths} мес.` : '—'}
                accent
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, unit, value, onChange, min, max, step,
}: {
  label: string; unit: string; value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number; max: number; step: number;
}) {
  return (
    <label className="block relative">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</span>
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
      className="p-3 sm:p-4 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="text-[10px] text-white/55 uppercase tracking-[0.2em]">{label}</div>
      <div
        className={`font-display text-lg sm:text-2xl mt-1 tracking-tight ${accent ? 'text-secondary' : 'text-white'}`}
      >
        {value}
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="px-3 py-2.5 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="text-[9px] uppercase tracking-[0.2em] text-white/50">{label}</div>
      <div className="text-sm text-white font-medium mt-0.5">{value}</div>
    </div>
  );
}

function fmt(n: number) {
  return n.toLocaleString('ru-RU');
}
