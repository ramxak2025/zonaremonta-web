'use client';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Car, Fuel, Route, Wrench } from 'lucide-react';
import {
  calculateSavings,
  PETROL_KINDS,
  type PetrolKey,
  type PublicSettings,
} from '@05auto/shared';
import { getContactLinks } from '@/lib/site';
import { PhoneFilledIcon, WhatsAppIcon } from '../BrandIcons';

interface Props {
  settings: Required<PublicSettings>;
}

const DEFAULT_PETROL: PetrolKey = 'fuel.ai95.price';

export function CalculatorPro({ settings }: Props) {
  const l = getContactLinks();
  const gasPrice = settings['fuel.lpg.price'].value;
  const installPrice = settings['calc.defaultInstallPrice'].value;
  const overheadPct = settings['calc.gasOverheadPct'].value;

  const [fuelKey, setFuelKey] = useState<PetrolKey>(DEFAULT_PETROL);
  const [mileage, setMileage] = useState<string>('2000');
  const [consumption, setConsumption] = useState<string>('10');
  const [install, setInstall] = useState<string>(String(installPrice));

  useEffect(() => {
    setInstall(String(installPrice));
  }, [installPrice]);

  const mileageNum = clamp(Number(mileage) || 0, 0, 100000);
  const consumptionNum = clamp(Number(consumption) || 0, 0, 50);
  const installNum = clamp(Number(install) || 0, 0, 1_000_000);
  const petrolPrice = settings[fuelKey].value;

  const result = useMemo(
    () =>
      calculateSavings({
        monthlyMileageKm: mileageNum || 1,
        fuelConsumptionLPer100: consumptionNum || 1,
        petrolPriceRub: petrolPrice,
        gasPriceRub: gasPrice,
        gboInstallPriceRub: installNum || 1,
        gasOverheadPct: overheadPct,
      }),
    [mileageNum, consumptionNum, petrolPrice, gasPrice, installNum, overheadPct],
  );

  const hasInput = mileageNum > 0 && consumptionNum > 0;

  return (
    <section className="section py-10 md:py-20">
      <div className="section-head">
        <span className="eyebrow">Калькулятор экономии</span>
        <h1 className="h-1 text-white">Посчитайте свою выгоду за 30 секунд</h1>
        <p className="lead">
          Введите пробег, расход и стоимость установки — покажем, сколько денег
          вернётся в ваш карман каждый месяц. Цены топлива актуальны по АЗС Махачкалы.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* ИНПУТЫ */}
        <div className="liquid-glass p-6 md:p-8 space-y-7">
          {/* Бензин */}
          <div>
            <label className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                <Fuel className="w-4 h-4 text-[#FF3E4F]" /> Какой бензин заливаете
              </span>
              <span className="text-sm text-white font-mono">{petrolPrice} ₽/л</span>
            </label>
            <div
              className="grid grid-cols-4 gap-1 p-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
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
                    className={`h-11 rounded-full text-xs font-bold uppercase transition-all ${
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

          {/* Пробег */}
          <NumberField
            icon={<Route className="w-4 h-4 text-[#FF3E4F]" />}
            label="Пробег в месяц"
            unit="км"
            value={mileage}
            onChange={setMileage}
            placeholder="2000"
            min={0}
            max={100000}
            hint="Средний городской пробег — 1 500–2 500 км. Такси и доставка — 4 000+."
          />

          {/* Расход */}
          <NumberField
            icon={<Car className="w-4 h-4 text-[#FF3E4F]" />}
            label="Расход на 100 км"
            unit="л"
            value={consumption}
            onChange={setConsumption}
            placeholder="10"
            min={0}
            max={50}
            step="0.1"
            hint="Смотрите в бортовом компьютере или документах к авто."
          />

          {/* Стоимость установки — редактируемая */}
          <NumberField
            icon={<Wrench className="w-4 h-4 text-[#FF3E4F]" />}
            label="Стоимость установки ГБО"
            unit="₽"
            value={install}
            onChange={setInstall}
            placeholder="38000"
            min={0}
            max={1000000}
            step="500"
            hint="4-е поколение — от 38 000 ₽, 4+ (прямой впрыск) — от 95 000 ₽."
          />

          {/* Справка */}
          <div className="pt-5 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-white/45 uppercase tracking-widest text-[10px]">Газ (СУГ)</div>
              <div className="text-white font-semibold mt-0.5">{gasPrice} ₽/л</div>
            </div>
            <div>
              <div className="text-white/45 uppercase tracking-widest text-[10px]">Наценка расхода</div>
              <div className="text-white font-semibold mt-0.5">+{overheadPct}%</div>
            </div>
          </div>
        </div>

        {/* РЕЗУЛЬТАТ + ПРОДАЮЩИЙ ТЕКСТ */}
        <div
          className="p-6 md:p-10 relative overflow-hidden rounded-[28px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(19,19,24,0.8) 0%, rgba(11,11,14,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 30px 70px -30px rgba(0,0,0,0.6)',
          }}
        >
          <div
            aria-hidden
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl"
            style={{ background: 'rgba(232,18,36,0.3)' }}
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl"
            style={{ background: 'rgba(74,159,217,0.2)' }}
          />

          <div className="relative">
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/55">
              Ваша экономия в месяц
            </div>
            <div
              key={result.monthlySavings}
              className="font-display leading-none tracking-tight mt-3 animate-result"
              style={{
                fontSize: 'clamp(56px, 12vw, 96px)',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FF3E4F 80%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {fmt(result.monthlySavings)} ₽
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <ResultCard label="В год вы сэкономите" value={`${fmt(result.yearlySavings)} ₽`} highlight />
              <ResultCard
                label="Окупится за"
                value={result.paybackMonths > 0 ? `${result.paybackMonths} мес.` : '—'}
                highlight
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
              <ResultCard label="Сейчас тратите" value={`${fmt(result.monthlyPetrolCost)} ₽`} muted />
              <ResultCard label="Будете тратить" value={`${fmt(result.monthlyGasCost)} ₽`} muted />
            </div>

            {/* Продающий текст */}
            {hasInput && (
              <div className="mt-8 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-[14px] md:text-[15px] text-white/85 leading-relaxed">
                  За <span className="font-bold text-white">{result.paybackMonths > 0 ? `${result.paybackMonths} месяцев` : 'один сезон'}</span>{' '}
                  установка ГБО окупится, а дальше{' '}
                  <span className="font-bold text-[#FF3E4F]">
                    {fmt(result.yearlySavings)} ₽ в год
                  </span>{' '}
                  будут оставаться в вашем кармане вместо того, чтобы уходить на АЗС. За 3 года
                  это <span className="font-bold text-white">{fmt(result.yearlySavings * 3)} ₽</span> —
                  почти цена нового ГБО или капремонта двигателя.
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-7 flex flex-col sm:flex-row gap-2.5">
              <a href={l.phoneHref} className="btn btn-primary btn-lg flex-1">
                <PhoneFilledIcon className="w-5 h-5" />
                Записаться на установку
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={l.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg text-white flex-1"
                style={{
                  background: 'linear-gradient(180deg, #25D366 0%, #128C7E 100%)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 8px 22px -6px rgba(37,211,102,0.5)',
                }}
              >
                <WhatsAppIcon className="w-5 h-5" />
                Уточнить детали
              </a>
            </div>
            <p className="text-[11px] text-white/40 mt-4">
              Расчёт ориентировочный. Точные цифры — после диагностики двигателя на стенде.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function NumberField({
  icon, label, unit, value, onChange, placeholder, min, max, step, hint,
}: {
  icon?: React.ReactNode;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
          {icon}
          {label}
        </span>
        <span className="text-[11px] uppercase tracking-widest text-white/45">{unit}</span>
      </label>
      <div
        className="flex items-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 18,
        }}
      >
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step ?? '1'}
          className="w-full h-14 px-5 bg-transparent text-white font-display text-2xl md:text-3xl focus:outline-none tracking-tight"
        />
        <span className="pr-5 text-white/55 font-medium">{unit}</span>
      </div>
      {hint && <p className="text-xs text-white/40 mt-2">{hint}</p>}
    </div>
  );
}

function ResultCard({
  label, value, highlight, muted,
}: { label: string; value: string; highlight?: boolean; muted?: boolean }) {
  return (
    <div
      className="p-4 rounded-2xl"
      style={{
        background: highlight ? 'rgba(232,18,36,0.12)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${highlight ? 'rgba(232,18,36,0.3)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <div className="text-[10px] uppercase tracking-widest text-white/45">{label}</div>
      <div
        className={`font-display mt-1.5 tracking-tight ${
          highlight
            ? 'text-2xl md:text-3xl text-[#FF3E4F]'
            : muted
              ? 'text-base md:text-lg text-white/65'
              : 'text-2xl text-white'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString('ru-RU');
}
