'use client';
import { useState } from 'react';
import { Field, TextInput, NumberInput, Card } from '@/components/admin/Field';
import { SaveBar } from '../services/editor';
import type { ContactContent } from '@/lib/content';

export function ContactEditor({ initial }: { initial: ContactContent }) {
  const [data, setData] = useState<ContactContent>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'contact', data }),
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
      <Card title="Телефон и мессенджеры">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Телефон" hint="Формат: +7 (988) 000-00-00">
            <TextInput
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
          </Field>
          <Field label="WhatsApp номер" hint="Только цифры в международном формате: 79880000000">
            <TextInput
              value={data.whatsappNumber}
              onChange={(e) => setData({ ...data, whatsappNumber: e.target.value.replace(/\D/g, '') })}
            />
          </Field>
          <Field label="Max ссылка" hint="https://max.ru/...">
            <TextInput
              value={data.maxLink}
              onChange={(e) => setData({ ...data, maxLink: e.target.value })}
            />
          </Field>
          <Field label="Я.Карты ссылка" hint="https://yandex.ru/maps/...">
            <TextInput
              value={data.yandexMapsLink}
              onChange={(e) => setData({ ...data, yandexMapsLink: e.target.value })}
            />
          </Field>
        </div>
      </Card>

      <Card title="Адрес и часы">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Адрес" cols={2}>
            <TextInput
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
            />
          </Field>
          <Field label="Часы работы" cols={2}>
            <TextInput
              value={data.workingHours}
              onChange={(e) => setData({ ...data, workingHours: e.target.value })}
            />
          </Field>
        </div>
      </Card>

      <Card title="Координаты для Я.Карты">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Широта (lat)">
            <NumberInput
              step="0.000001"
              value={data.coordinates.lat}
              onChange={(e) =>
                setData({
                  ...data,
                  coordinates: { ...data.coordinates, lat: Number(e.target.value) || 0 },
                })
              }
            />
          </Field>
          <Field label="Долгота (lng)">
            <NumberInput
              step="0.000001"
              value={data.coordinates.lng}
              onChange={(e) =>
                setData({
                  ...data,
                  coordinates: { ...data.coordinates, lng: Number(e.target.value) || 0 },
                })
              }
            />
          </Field>
        </div>
      </Card>

      <SaveBar onSave={save} saving={saving} message={msg} />
    </div>
  );
}
