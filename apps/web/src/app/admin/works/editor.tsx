'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { Field, TextInput, NumberInput, TextArea, Card } from '@/components/admin/Field';
import { SaveBar } from '../services/editor';
import type { Work } from '@/lib/content';

export function WorksEditor({ initial }: { initial: Work[] }) {
  const [data, setData] = useState<Work[]>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'works', data }),
    });
    if (res.ok) setMsg({ kind: 'ok', text: 'Сохранено' });
    else {
      const b = await res.json().catch(() => ({}));
      setMsg({ kind: 'err', text: b?.error ?? 'Ошибка' });
    }
    setSaving(false);
  }

  function update(idx: number, patch: Partial<Work>) {
    setData((d) => d.map((w, i) => (i === idx ? { ...w, ...patch } : w)));
  }
  function remove(idx: number) {
    setData((d) => d.filter((_, i) => i !== idx));
  }
  function add() {
    setData((d) => [
      {
        id: `w-${Date.now()}`,
        brand: '', model: '', year: new Date().getFullYear(),
        engine: '', type: 'mpi',
        equipment: '',
        price: 0,
        date: new Date().toISOString().slice(0, 10),
        cover: '',
        process: [],
      },
      ...d,
    ]);
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={add}
        className="btn btn-primary"
      >
        <Plus className="w-4 h-4" />
        Добавить новую работу
      </button>

      <div className="space-y-4">
        {data.map((w, i) => (
          <WorkRow key={w.id} work={w} idx={i} onUpdate={update} onRemove={remove} />
        ))}
      </div>

      <SaveBar onSave={save} saving={saving} message={msg} />
    </div>
  );
}

function WorkRow({
  work, idx, onUpdate, onRemove,
}: {
  work: Work;
  idx: number;
  onUpdate: (i: number, patch: Partial<Work>) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
          Работа · {work.brand} {work.model} {work.year || ''}
        </div>
        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="text-[12px] text-white/45 hover:text-[#FF3E4F] inline-flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Удалить
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Марка"><TextInput value={work.brand} onChange={(e) => onUpdate(idx, { brand: e.target.value })} /></Field>
        <Field label="Модель"><TextInput value={work.model} onChange={(e) => onUpdate(idx, { model: e.target.value })} /></Field>
        <Field label="Год"><NumberInput value={work.year} onChange={(e) => onUpdate(idx, { year: Number(e.target.value) || 0 })} /></Field>
        <Field label="Двигатель" hint="Например: 2.5 D-4S"><TextInput value={work.engine} onChange={(e) => onUpdate(idx, { engine: e.target.value })} /></Field>
        <Field label="Тип впрыска">
          <select
            value={work.type}
            onChange={(e) => onUpdate(idx, { type: e.target.value as Work['type'] })}
            className="w-full h-11 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-[14px] focus:outline-none focus:border-[#FF3E4F]"
          >
            <option value="mpi">MPI (распределённый)</option>
            <option value="gdi">Прямой (GDI/TSI/FSI)</option>
            <option value="combined">Комбинированный (D-4S)</option>
          </select>
        </Field>
        <Field label="Дата" hint="YYYY-MM-DD"><TextInput type="date" value={work.date} onChange={(e) => onUpdate(idx, { date: e.target.value })} /></Field>
        <Field label="Стоимость работ, ₽"><NumberInput value={work.price} onChange={(e) => onUpdate(idx, { price: Number(e.target.value) || 0 })} /></Field>
        <Field label="Установленное оборудование" cols={2}>
          <TextArea value={work.equipment} onChange={(e) => onUpdate(idx, { equipment: e.target.value })} />
        </Field>

        <Field label="Обложка (главное фото)" cols={2}>
          <PhotoUpload
            current={work.cover}
            onUpload={(url) => onUpdate(idx, { cover: url })}
          />
        </Field>

        <Field label="Фото процесса (с подписями)" cols={2}>
          <ProcessGallery
            items={work.process}
            onChange={(process) => onUpdate(idx, { process })}
          />
        </Field>
      </div>
    </Card>
  );
}

function PhotoUpload({
  current, onUpload,
}: { current: string; onUpload: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement | null>(null);

  async function handle(file: File) {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Ошибка загрузки');
      onUpload(json.primary);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-start gap-4">
      <div
        className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {current ? (
          <Image
            src={current}
            alt=""
            fill
            sizes="128px"
            className="object-cover"
            unoptimized={current.startsWith('https://')}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-white/30 text-[11px]">
            нет фото
          </div>
        )}
      </div>
      <div className="flex-1">
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handle(f);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="btn btn-ghost btn-sm"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {busy ? 'Загружаю и оптимизирую…' : current ? 'Заменить фото' : 'Загрузить фото'}
        </button>
        <p className="text-[11px] text-white/40 mt-2 leading-relaxed">
          JPG, PNG, WebP, HEIC. До 12 МБ. Минимум 1200×800. Авто-конвертация в AVIF + WebP + JPG.
        </p>
        {error && <p className="text-[12px] text-[#FF3E4F] mt-2">{error}</p>}
      </div>
    </div>
  );
}

function ProcessGallery({
  items, onChange,
}: {
  items: Work['process'];
  onChange: (items: Work['process']) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="grid sm:grid-cols-[140px_1fr_auto] gap-3 items-start">
          <PhotoUpload
            current={it.src}
            onUpload={(url) => onChange(items.map((x, j) => (j === i ? { ...x, src: url } : x)))}
          />
          <TextArea
            placeholder="Подпись к фото"
            value={it.caption}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="px-3 h-11 rounded-lg text-white/55 hover:text-[#FF3E4F] hover:bg-white/[0.05]"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { src: '', caption: '' }])}
        className="w-full h-11 rounded-lg text-[13px] text-white/65 hover:text-white border border-dashed border-white/15 hover:border-white/30 inline-flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Добавить фото процесса
      </button>
    </div>
  );
}
