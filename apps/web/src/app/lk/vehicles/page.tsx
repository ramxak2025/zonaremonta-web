'use client';
import { useState } from 'react';
import { Car, Plus, X } from 'lucide-react';
import { AppShell } from '@/components/lk/AppShell';
import { CLIENT_NAV } from '@/components/lk/client-nav';
import { EmptyState, Loading } from '@/components/lk/UiKit';
import { apiMutate, useApi, useAuth } from '@/lib/auth-client';

interface Vehicle {
  id: string;
  licensePlate: string;
  vin: string;
  year: number;
  mileageKm?: number;
  hasGbo: boolean;
  brand: { id: string; name: string };
  model: { id: string; name: string };
}

interface BrandWithModels {
  id: string;
  name: string;
  models: Array<{ id: string; name: string }>;
}

export default function VehiclesPage() {
  const { me } = useAuth('CLIENT');
  const { data: vehicles, loading, refetch } = useApi<Vehicle[]>(me ? '/vehicles/me' : null);
  const { data: brands } = useApi<BrandWithModels[]>('/vehicles/brands');
  const [showForm, setShowForm] = useState(false);

  return (
    <AppShell nav={CLIENT_NAV} me={me} title="Мои автомобили">
      <div className="flex justify-end mb-4">
        <button type="button" onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Добавить авто
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : vehicles && vehicles.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} v={v} onDelete={refetch} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Car}
          title="Авто ещё не добавлено"
          description="Укажите марку, модель и госномер — мы начнём вести историю."
          cta={
            <button type="button" onClick={() => setShowForm(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Добавить авто
            </button>
          }
        />
      )}

      {showForm && brands && (
        <AddVehicleDialog
          brands={brands}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            refetch();
          }}
        />
      )}
    </AppShell>
  );
}

function VehicleCard({ v, onDelete }: { v: Vehicle; onDelete: () => void }) {
  const [busy, setBusy] = useState(false);
  async function remove() {
    if (!confirm(`Удалить ${v.brand.name} ${v.model.name} (${v.licensePlate})?`)) return;
    setBusy(true);
    try {
      await apiMutate(`/vehicles/${v.id}`, { method: 'DELETE' });
      onDelete();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка');
      setBusy(false);
    }
  }

  return (
    <div className="card-strong p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary/20 border border-primary/30 flex-none">
            <Car className="w-4 h-4 text-[#FF3E4F]" strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <div className="font-display text-lg text-white leading-tight truncate">
              {v.brand.name} {v.model.name}
            </div>
            <div className="text-xs text-white/55">{v.year} г.</div>
          </div>
        </div>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="w-8 h-8 rounded-lg grid place-items-center bg-white/[0.04] hover:bg-white/10 text-white/55 hover:text-white flex-none"
          aria-label="Удалить"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <Info label="Номер" value={v.licensePlate} mono />
        <Info label="VIN" value={v.vin.slice(-6)} mono />
        <Info label="Пробег" value={v.mileageKm ? `${v.mileageKm.toLocaleString('ru-RU')} км` : '—'} />
        <Info label="ГБО" value={v.hasGbo ? 'установлено' : 'нет'} />
      </div>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
      <div className="text-[9px] uppercase tracking-widest text-white/40 font-semibold">{label}</div>
      <div className={`text-white text-sm mt-1 truncate ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  );
}

function AddVehicleDialog({
  brands, onClose, onSaved,
}: {
  brands: BrandWithModels[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear() - 5));
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');
  const [mileageKm, setMileageKm] = useState('');
  const [hasGbo, setHasGbo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const models = brands.find((b) => b.id === brandId)?.models ?? [];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiMutate('/vehicles', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          modelId,
          year: Number(year),
          licensePlate: licensePlate.toUpperCase(),
          vin: vin.toUpperCase(),
          mileageKm: mileageKm ? Number(mileageKm) : undefined,
          cylinderType: hasGbo ? 'METAL' : undefined,
        }),
      });
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md card-strong p-6 md:p-8 max-h-[92dvh] overflow-y-auto"
        style={{ background: 'rgba(20,20,28,0.97)' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full grid place-items-center bg-white/[0.05] text-white/70 hover:text-white"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="h-2 text-white mb-5">Новое авто</h2>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Марка">
            <select
              required
              value={brandId}
              onChange={(e) => {
                setBrandId(e.target.value);
                setModelId('');
              }}
              className="input"
            >
              <option value="" disabled>
                Выберите марку
              </option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Модель">
            <select
              required
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              disabled={!brandId}
              className="input"
            >
              <option value="" disabled>
                Выберите модель
              </option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Год">
              <input
                type="number"
                required
                min={1990}
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Пробег (км)">
              <input
                type="number"
                min={0}
                value={mileageKm}
                onChange={(e) => setMileageKm(e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Госномер">
            <input
              type="text"
              required
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="А123АА 05"
              className="input uppercase"
            />
          </Field>

          <Field label="VIN">
            <input
              type="text"
              required
              minLength={17}
              maxLength={17}
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="17 символов"
              className="input uppercase font-mono"
            />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <input
              type="checkbox"
              checked={hasGbo}
              onChange={(e) => setHasGbo(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-white">ГБО уже установлено</span>
          </label>

          {error && <div className="text-sm text-primary">{error}</div>}

          <button type="submit" disabled={saving} className="btn btn-primary mt-2">
            {saving ? 'Сохраняем…' : 'Добавить'}
          </button>
        </form>

        <style jsx>{`
          .input {
            width: 100%;
            height: 44px;
            padding: 0 14px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: white;
            font-size: 14px;
          }
          .input:focus {
            outline: none;
            border-color: rgba(232, 18, 36, 0.6);
            box-shadow: 0 0 0 3px rgba(232, 18, 36, 0.15);
          }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.15em] text-white/60 font-semibold">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
