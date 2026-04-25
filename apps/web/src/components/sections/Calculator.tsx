'use client';
import { useMemo, useState } from 'react';
import { ArrowRight, Fuel, Route, Wrench } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/PhoneIcon';
import { getContactLinks } from '@/lib/site';

const PETROL = [
  { key: '92', label: 'АИ-92', price: 56 },
  { key: '95', label: 'АИ-95', price: 60 },
  { key: '98', label: 'АИ-98', price: 68 },
  { key: '100', label: 'АИ-100', price: 75 },
] as const;
const GAS_PRICE = 27;
const GAS_OVERHEAD = 18;

function calc(km: number, lp100: number, petrol: number, gas: number, overheadPct: number, install: number) {
  const monthlyL = (km * lp100) / 100;
  const petrolCost = Math.round(monthlyL * petrol);
  const gasL = monthlyL * (1 + overheadPct / 100);
  const gasCost = Math.round(gasL * gas);
  const monthlySavings = Math.max(0, petrolCost - gasCost);
  const yearlySavings = monthlySavings * 12;
  const paybackMonths = monthlySavings > 0 ? Math.ceil(install / monthlySavings) : 0;
  return { monthlyPetrolCost: petrolCost, monthlyGasCost: gasCost, monthlySavings, yearlySavings, paybackMonths };
}

const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU');

export function Calculator() {
  const l = getContactLinks();
  const [petrolKey, setPetrolKey] = useState('95');
  const [km, setKm] = useState('2000');
  const [lp100, setLp100] = useState('10');
  const [install, setInstall] = useState('38000');

  const petrol = PETROL.find((p) => p.key === petrolKey)?.price ?? 60;
  const result = useMemo(
    () => calc(Number(km) || 0, Number(lp100) || 0, petrol, GAS_PRICE, GAS_OVERHEAD, Number(install) || 0),
    [km, lp100, petrol, install],
  );
  const hasInput = Number(km) > 0 && Number(lp100) > 0;

  return (
    <Section>
      <SectionHeader
        eyebrow="Калькулятор"
        title="Посчитайте свою выгоду за 30 секунд"
        lead="Введите пробег, расход и стоимость установки — покажем, сколько денег вернётся в ваш карман каждый месяц."
      />

      <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
        {/* Inputs */}
        <div className="card-elev flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                <Fuel className="w-4 h-4 text-[#FF3E4F]" />
                Какой бензин заливаете
              </label>
              <span className="text-sm text-white font-mono">{petrol} ₽/л</span>
            </div>
            <div
              className="grid grid-cols-4 gap-1 p-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {PETROL.map((p) => {
                const active = p.key === petrolKey;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPetrolKey(p.key)}
                    className={`h-10 rounded-full text-[12px] font-bold uppercase transition-colors ${
                      active ? 'text-white' : 'text-white/55 hover:text-white'
                    }`}
                    style={
                      active
                        ? {
                            background: 'linear-gradient(180deg, #FF3E4F, #E81224)',
                            boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 4px 10px -2px rgba(232,18,36,0.5)',
                          }
                        : undefined
                    }
                  >
                    {p.label.replace('АИ-', '')}
                  </button>
                );
              })}
            </div>
          </div>

          <NumField
            icon={<Route className="w-4 h-4 text-[#FF3E4F]" />}
            label="Пробег в месяц"
            unit="км"
            value={km}
            onChange={setKm}
            hint="Городской пробег обычно 1 500–2 500 км."
          />
          <NumField
            icon={<Fuel className="w-4 h-4 text-[#FF3E4F]" />}
            label="Расход на 100 км"
            unit="л"
            value={lp100}
            onChange={setLp100}
            step="0.1"
            hint="Смотрите в бортовом компьютере или паспорте авто."
          />
          <NumField
            icon={<Wrench className="w-4 h-4 text-[#FF3E4F]" />}
            label="Стоимость установки"
            unit="₽"
            value={install}
            onChange={setInstall}
            step="500"
            hint="MPI — от 38 000 ₽; прямой и комбинированный впрыск — от 95 000 ₽."
          />
        </div>

        {/* Result */}
        <div
          className="card-elev relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(19,19,24,0.85), rgba(11,11,14,0.95))',
          }}
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55 mb-3">
            Ваша экономия в месяц
          </div>
          <div
            key={result.monthlySavings}
            className="font-display font-bold tracking-tight leading-none"
            style={{
              fontSize: 'clamp(40px, 9vw, 76px)',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FF3E4F 80%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              paddingBottom: '0.08em',
            }}
          >
            {fmt(result.monthlySavings)} ₽
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <ResultMini label="В год" value={`${fmt(result.yearlySavings)} ₽`} highlight />
            <ResultMini
              label="Окупится за"
              value={result.paybackMonths > 0 ? `${result.paybackMonths} мес.` : '—'}
              highlight
            />
            <ResultMini label="Сейчас тратите" value={`${fmt(result.monthlyPetrolCost)} ₽`} />
            <ResultMini label="Будете тратить" value={`${fmt(result.monthlyGasCost)} ₽`} />
          </div>

          {hasInput && (
            <p className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-[13px] md:text-[14px] text-white/85 leading-relaxed">
              За{' '}
              <span className="font-bold text-white">
                {result.paybackMonths > 0 ? `${result.paybackMonths} месяцев` : 'один сезон'}
              </span>{' '}
              установка окупится, и дальше{' '}
              <span className="font-bold text-[#FF3E4F]">
                {fmt(result.yearlySavings)} ₽ в год
              </span>{' '}
              остаются у вас.
            </p>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <a href={l.phoneHref} className="btn btn-primary btn-lg flex-1">
              <PhoneIcon className="w-5 h-5" />
              Записаться
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href={l.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg flex-1">
              <WhatsAppIcon className="w-5 h-5" />
              WhatsApp
            </a>
          </div>

          <p className="mt-3 text-[11px] text-white/40">
            Расчёт ориентировочный. Точные цифры — после диагностики двигателя на стенде.
          </p>
        </div>
      </div>
    </Section>
  );
}

function NumField({
  icon, label, unit, value, onChange, step, hint,
}: {
  icon: React.ReactNode; label: string; unit: string;
  value: string; onChange: (v: string) => void;
  step?: string; hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
          {icon}
          {label}
        </label>
        <span className="text-[11px] uppercase tracking-widest text-white/45">{unit}</span>
      </div>
      <div
        className="flex items-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
        }}
      >
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step={step ?? '1'}
          className="w-full h-14 px-5 bg-transparent text-white font-display text-2xl md:text-3xl focus:outline-none tracking-tight"
        />
        <span className="pr-5 text-white/55 font-medium">{unit}</span>
      </div>
      {hint && <p className="text-[11px] text-white/40 mt-2">{hint}</p>}
    </div>
  );
}

function ResultMini({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className="p-4 rounded-2xl"
      style={{
        background: highlight ? 'rgba(232,18,36,0.12)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${highlight ? 'rgba(232,18,36,0.3)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest text-white/45 mb-2">
        {label}
      </div>
      <div className={`font-display font-bold tracking-tight text-[18px] md:text-[22px] leading-none ${
        highlight ? 'text-[#FF3E4F]' : 'text-white'
      }`}>
        {value}
      </div>
    </div>
  );
}
