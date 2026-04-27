'use client';
import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Field, TextInput, NumberInput, TextArea, Card } from '@/components/admin/Field';
import type { ServicesContent, ServiceKit } from '@/lib/content';

interface Props {
  initial: ServicesContent;
}

export function ServicesEditor({ initial }: Props) {
  const [data, setData] = useState<ServicesContent>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  function updateKit(idx: number, patch: Partial<ServiceKit>) {
    setData((d) => ({
      ...d,
      installKits: d.installKits.map((k, i) => (i === idx ? { ...k, ...patch } : k)),
    }));
  }
  function updateFeature(kitIdx: number, fIdx: number, value: string) {
    setData((d) => ({
      ...d,
      installKits: d.installKits.map((k, i) =>
        i === kitIdx ? { ...k, features: k.features.map((f, j) => (j === fIdx ? value : f)) } : k,
      ),
    }));
  }
  function addFeature(kitIdx: number) {
    setData((d) => ({
      ...d,
      installKits: d.installKits.map((k, i) =>
        i === kitIdx ? { ...k, features: [...k.features, ''] } : k,
      ),
    }));
  }
  function removeFeature(kitIdx: number, fIdx: number) {
    setData((d) => ({
      ...d,
      installKits: d.installKits.map((k, i) =>
        i === kitIdx ? { ...k, features: k.features.filter((_, j) => j !== fIdx) } : k,
      ),
    }));
  }
  function removeKit(idx: number) {
    setData((d) => ({ ...d, installKits: d.installKits.filter((_, i) => i !== idx) }));
  }
  function addKit() {
    setData((d) => ({
      ...d,
      installKits: [
        ...d.installKits,
        {
          id: `kit-${Date.now()}`,
          badge: '4',
          title: 'Новый комплект',
          type: 'mpi',
          forWho: '',
          brands: '',
          priceFrom: 0,
          features: [],
        },
      ],
    }));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'services', data }),
    });
    if (res.ok) {
      setMsg({ kind: 'ok', text: 'Сохранено. Изменения уже на сайте.' });
    } else {
      const body = await res.json().catch(() => ({}));
      setMsg({ kind: 'err', text: body?.error ?? 'Ошибка сохранения' });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <Card title="Установка — комплекты">
        <div className="space-y-4">
          {data.installKits.map((k, i) => (
            <div
              key={k.id}
              className="rounded-xl p-4 md:p-5"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
                  Комплект #{i + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeKit(i)}
                  className="text-[12px] text-white/45 hover:text-[#FF3E4F] inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Удалить
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Название">
                  <TextInput value={k.title} onChange={(e) => updateKit(i, { title: e.target.value })} />
                </Field>
                <Field label="Бейдж (4 / 6 / 8 / DI / DUAL)">
                  <TextInput value={k.badge} onChange={(e) => updateKit(i, { badge: e.target.value })} />
                </Field>
                <Field label="Тип">
                  <select
                    value={k.type}
                    onChange={(e) => updateKit(i, { type: e.target.value as 'mpi' | 'di' })}
                    className="w-full h-11 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-[14px] focus:outline-none focus:border-[#FF3E4F]"
                  >
                    <option value="mpi">Распределённый впрыск (MPI)</option>
                    <option value="di">Прямой / комбинированный (DI)</option>
                  </select>
                </Field>
                <Field label="Цилиндры (только для MPI)">
                  <select
                    value={k.cylinders ?? ''}
                    onChange={(e) =>
                      updateKit(i, {
                        cylinders: (e.target.value || undefined) as ServiceKit['cylinders'],
                      })
                    }
                    className="w-full h-11 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-[14px] focus:outline-none focus:border-[#FF3E4F]"
                  >
                    <option value="">— не задано —</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                  </select>
                </Field>
                <Field label="Цена «под ключ» от, ₽">
                  <NumberInput
                    value={k.priceFrom}
                    min={0}
                    onChange={(e) => updateKit(i, { priceFrom: Number(e.target.value) || 0 })}
                  />
                </Field>
                <Field label="Бренды оборудования">
                  <TextInput value={k.brands} onChange={(e) => updateKit(i, { brands: e.target.value })} />
                </Field>
                <Field label="Для кого" cols={2} hint="Какие авто, какие двигатели">
                  <TextArea value={k.forWho} onChange={(e) => updateKit(i, { forWho: e.target.value })} />
                </Field>
                <Field label="Что входит" cols={2}>
                  <div className="space-y-2">
                    {k.features.map((f, fi) => (
                      <div key={fi} className="flex gap-2">
                        <TextInput value={f} onChange={(e) => updateFeature(i, fi, e.target.value)} />
                        <button
                          type="button"
                          onClick={() => removeFeature(i, fi)}
                          className="px-3 h-11 rounded-lg text-white/55 hover:text-[#FF3E4F] hover:bg-white/[0.05]"
                          aria-label="Удалить пункт"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addFeature(i)}
                      className="text-[12px] text-white/55 hover:text-white inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Добавить пункт
                    </button>
                  </div>
                </Field>
                <Field label="Флагман / премиум">
                  <label className="inline-flex items-center gap-2 text-[13px] text-white/85">
                    <input
                      type="checkbox"
                      checked={k.featured ?? false}
                      onChange={(e) => updateKit(i, { featured: e.target.checked })}
                      className="w-4 h-4 accent-[#FF3E4F]"
                    />
                    Выделить как флагманский
                  </label>
                </Field>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addKit}
            className="w-full h-11 rounded-lg text-[13px] text-white/65 hover:text-white border border-dashed border-white/15 hover:border-white/30 inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить комплект
          </button>
        </div>
      </Card>

      <Card title="Ремонт и диагностика">
        <div className="space-y-3">
          {data.repairServices.map((s, i) => (
            <div
              key={s.id}
              className="rounded-xl p-4 grid sm:grid-cols-[1fr_120px_120px_auto] gap-3 items-start"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="space-y-2">
                <TextInput
                  placeholder="Название услуги"
                  value={s.title}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      repairServices: d.repairServices.map((x, j) =>
                        j === i ? { ...x, title: e.target.value } : x,
                      ),
                    }))
                  }
                />
                <TextArea
                  placeholder="Что делаем"
                  value={s.text}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      repairServices: d.repairServices.map((x, j) =>
                        j === i ? { ...x, text: e.target.value } : x,
                      ),
                    }))
                  }
                />
              </div>
              <Field label="Цена от, ₽">
                <NumberInput
                  value={s.priceFrom}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      repairServices: d.repairServices.map((x, j) =>
                        j === i ? { ...x, priceFrom: Number(e.target.value) || 0 } : x,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="Длительность, мин">
                <NumberInput
                  value={s.durationMin}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      repairServices: d.repairServices.map((x, j) =>
                        j === i ? { ...x, durationMin: Number(e.target.value) || 0 } : x,
                      ),
                    }))
                  }
                />
              </Field>
              <button
                type="button"
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    repairServices: d.repairServices.filter((_, j) => j !== i),
                  }))
                }
                className="px-3 h-11 rounded-lg text-white/55 hover:text-[#FF3E4F] hover:bg-white/[0.05]"
                aria-label="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setData((d) => ({
                ...d,
                repairServices: [
                  ...d.repairServices,
                  { id: `r-${Date.now()}`, title: '', text: '', priceFrom: 0, durationMin: 30 },
                ],
              }))
            }
            className="w-full h-11 rounded-lg text-[13px] text-white/65 hover:text-white border border-dashed border-white/15 hover:border-white/30 inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить услугу ремонта
          </button>
        </div>
      </Card>

      <SaveBar onSave={save} saving={saving} message={msg} />
    </div>
  );
}

export function SaveBar({
  onSave, saving, message,
}: {
  onSave: () => void;
  saving: boolean;
  message: { kind: 'ok' | 'err'; text: string } | null;
}) {
  return (
    <div className="sticky bottom-3 mt-6 flex items-center gap-3 p-3 rounded-2xl"
      style={{
        background: 'rgba(20,20,26,0.92)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(18px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 16px 40px -12px rgba(0,0,0,0.6)',
      }}
    >
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="btn btn-primary disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Сохраняю...' : 'Сохранить'}
      </button>
      {message && (
        <div
          className={`text-[13px] ${message.kind === 'ok' ? 'text-[#22C55E]' : 'text-[#FF3E4F]'}`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
