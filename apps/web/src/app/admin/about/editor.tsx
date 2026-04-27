'use client';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Field, TextInput, NumberInput, TextArea, Card } from '@/components/admin/Field';
import { SaveBar } from '../services/editor';
import type { AboutContent } from '@/lib/content';

export function AboutEditor({ initial }: { initial: AboutContent }) {
  const [data, setData] = useState<AboutContent>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'about', data }),
    });
    if (res.ok) setMsg({ kind: 'ok', text: 'Сохранено' });
    else {
      const b = await res.json().catch(() => ({}));
      setMsg({ kind: 'err', text: b?.error ?? 'Ошибка' });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <Card title="Цифры">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Год основания">
            <NumberInput
              value={data.foundedYear}
              onChange={(e) => setData({ ...data, foundedYear: Number(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Установок (всего)">
            <NumberInput
              value={data.totalInstalls}
              onChange={(e) => setData({ ...data, totalInstalls: Number(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Лет опыта">
            <NumberInput
              value={data.yearsExperience}
              onChange={(e) => setData({ ...data, yearsExperience: Number(e.target.value) || 0 })}
            />
          </Field>
        </div>
      </Card>

      <Card title="История">
        <Field label="Текст истории" hint="Откуда мы, где обучались, как развивались">
          <TextArea
            rows={5}
            value={data.story}
            onChange={(e) => setData({ ...data, story: e.target.value })}
          />
        </Field>
      </Card>

      <Card title="Философия и подход к работе">
        <Field label="Текст философии" hint="Гофры, шаблоны, дольше — но качественнее">
          <TextArea
            rows={5}
            value={data.philosophy}
            onChange={(e) => setData({ ...data, philosophy: e.target.value })}
          />
        </Field>
      </Card>

      <Card title="Детали — преимущества с описанием">
        <div className="space-y-3">
          {data.details.map((d, i) => (
            <div
              key={i}
              className="rounded-xl p-4 grid sm:grid-cols-[1fr_auto] gap-3 items-start"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="space-y-2">
                <TextInput
                  placeholder="Заголовок преимущества"
                  value={d.title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      details: data.details.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)),
                    })
                  }
                />
                <TextArea
                  placeholder="Описание"
                  value={d.text}
                  onChange={(e) =>
                    setData({
                      ...data,
                      details: data.details.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)),
                    })
                  }
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setData({ ...data, details: data.details.filter((_, j) => j !== i) })
                }
                className="px-3 h-11 rounded-lg text-white/55 hover:text-[#FF3E4F] hover:bg-white/[0.05]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setData({ ...data, details: [...data.details, { title: '', text: '' }] })
            }
            className="w-full h-11 rounded-lg text-[13px] text-white/65 hover:text-white border border-dashed border-white/15 hover:border-white/30 inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить преимущество
          </button>
        </div>
      </Card>

      <SaveBar onSave={save} saving={saving} message={msg} />
    </div>
  );
}
