'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HexIcon } from '@/components/HexIcon';
import { api, ApiError } from '@/lib/api';
import { publicSettingsSchema, type PublicSettings } from '@05auto/shared';

type PublicKey = keyof PublicSettings;

interface FieldBase {
  key: PublicKey;
  label: string;
  help?: string;
}
type Field =
  | (FieldBase & { kind: 'text' | 'url'; placeholder?: string })
  | (FieldBase & { kind: 'textarea'; placeholder?: string })
  | (FieldBase & { kind: 'number'; suffix?: string })
  | (FieldBase & { kind: 'stat'; suffixLabel: string });

const SECTIONS: ReadonlyArray<{ title: string; description?: string; fields: ReadonlyArray<Field> }> = [
  {
    title: 'Главный баннер',
    description: 'Текст и картинка на первом экране.',
    fields: [
      { kind: 'text', key: 'hero.badge', label: 'Плашка над заголовком' },
      { kind: 'textarea', key: 'hero.title', label: 'Главный заголовок' },
      { kind: 'textarea', key: 'hero.subtitle', label: 'Подзаголовок' },
      { kind: 'text', key: 'hero.primaryCta', label: 'Текст кнопки' },
      { kind: 'url', key: 'hero.imageUrl', label: 'URL фоновой картинки', help: 'Оставьте пустым для градиентного фона' },
    ],
  },
  {
    title: 'Статистика в hero',
    fields: [
      { kind: 'stat', key: 'hero.stats.payback', label: 'Окупаемость', suffixLabel: 'Суффикс' },
      { kind: 'stat', key: 'hero.stats.savings', label: 'Экономия', suffixLabel: 'Суффикс' },
    ],
  },
  {
    title: 'Цены на топливо',
    description: 'Актуальные цены — используются в калькуляторе.',
    fields: [
      { kind: 'number', key: 'fuel.ai92.price', label: 'АИ-92', suffix: '₽/л' },
      { kind: 'number', key: 'fuel.ai95.price', label: 'АИ-95', suffix: '₽/л' },
      { kind: 'number', key: 'fuel.ai98.price', label: 'АИ-98', suffix: '₽/л' },
      { kind: 'number', key: 'fuel.ai100.price', label: 'АИ-100', suffix: '₽/л' },
      { kind: 'number', key: 'fuel.lpg.price', label: 'Газ (СУГ)', suffix: '₽/л' },
    ],
  },
  {
    title: 'Настройки калькулятора',
    fields: [
      { kind: 'number', key: 'calc.gasOverheadPct', label: 'Наценка расхода газа', suffix: '%' },
      { kind: 'number', key: 'calc.defaultInstallPrice', label: 'Стоимость установки', suffix: '₽' },
    ],
  },
  {
    title: 'Контакты',
    fields: [
      { kind: 'text', key: 'site.phone', label: 'Телефон' },
      { kind: 'text', key: 'site.whatsapp', label: 'WhatsApp (только цифры)' },
      { kind: 'url', key: 'site.max', label: 'Max — ссылка' },
      { kind: 'url', key: 'site.yandexMapsLink', label: 'Ссылка на Я.Карты' },
      { kind: 'text', key: 'site.address', label: 'Адрес' },
      { kind: 'text', key: 'site.workingHours', label: 'График работы' },
    ],
  },
  {
    title: 'Отзывы на Яндексе',
    fields: [
      { kind: 'url', key: 'reviews.yandex.url', label: 'Ссылка на профиль компании' },
      { kind: 'number', key: 'reviews.yandex.rating', label: 'Рейтинг (0–5)' },
      { kind: 'number', key: 'reviews.yandex.count', label: 'Количество отзывов' },
    ],
  },
] as const;

/** Локальное состояние формы: сырое строковое значение + опциональный suffix. */
interface FormValue {
  value: string;
  suffix?: string;
}
type FormState = Partial<Record<PublicKey, FormValue>>;

function toFormValue(raw: PublicSettings[PublicKey]): FormValue {
  if (!raw || typeof raw !== 'object') return { value: '' };
  const v = (raw as { value: unknown }).value;
  const suffix = 'suffix' in raw ? (raw as { suffix?: string }).suffix : undefined;
  return {
    value: v == null ? '' : String(v),
    suffix,
  };
}

function toPayload(field: Field, form: FormValue): PublicSettings[PublicKey] {
  switch (field.kind) {
    case 'number': {
      const n = Number(form.value);
      if (Number.isNaN(n)) throw new Error(`«${field.label}» — введите число`);
      return { value: n } as PublicSettings[PublicKey];
    }
    case 'stat': {
      return { value: form.value, suffix: form.suffix ?? '' } as PublicSettings[PublicKey];
    }
    case 'url':
    case 'text':
    case 'textarea':
      return { value: form.value } as PublicSettings[PublicKey];
  }
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<FormState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('access_token') ?? undefined : undefined;

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api<PublicSettings>('/settings/public', { token });
      const initial: FormState = {};
      for (const section of SECTIONS) {
        for (const field of section.fields) {
          initial[field.key] = toFormValue(data[field.key]);
        }
      }
      setForm(initial);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось загрузить');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    setOk(false);
    try {
      const payload: Record<string, unknown> = {};
      for (const section of SECTIONS) {
        for (const field of section.fields) {
          const current = form[field.key];
          if (!current) continue;
          payload[field.key] = toPayload(field, current);
        }
      }
      const check = publicSettingsSchema.safeParse(payload);
      if (!check.success) {
        throw new Error('Проверьте введённые значения');
      }
      await api('/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
        token,
      });
      setOk(true);
      setTimeout(() => setOk(false), 2500);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  }

  function update(key: PublicKey, patch: Partial<FormValue>): void {
    setForm((f) => ({
      ...f,
      [key]: { value: '', ...f[key], ...patch },
    }));
  }

  return (
    <>
      <Header />
      <main className="section py-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <span className="chip">
              <HexIcon size={12} className="text-primary" />
              Админка
            </span>
            <h1 className="h-section text-white mt-2">Настройки сайта</h1>
            <p className="text-white/60 text-sm mt-1">Всё, что можно менять без программиста.</p>
          </div>
          <button type="button" disabled={saving || loading} onClick={save} className="btn btn-primary !h-12">
            {saving ? 'Сохраняем…' : 'Сохранить всё'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-2xl border border-primary/50 bg-primary/10 text-white text-sm">
            {error}
          </div>
        )}
        {ok && (
          <div className="mb-4 p-4 rounded-2xl border border-secondary/50 bg-secondary/10 text-white text-sm">
            Сохранено. Изменения появятся на сайте в течение минуты.
          </div>
        )}
        {loading && <div className="text-white/60">Загрузка…</div>}

        <div className="grid gap-4 lg:grid-cols-2">
          {SECTIONS.map((section) => (
            <div key={section.title} className="liquid-glass p-5 sm:p-6">
              <h2 className="font-display text-xl text-white">{section.title}</h2>
              {section.description && (
                <p className="text-sm text-white/60 mt-1">{section.description}</p>
              )}
              <div className="mt-5 space-y-4">
                {section.fields.map((field) => (
                  <FieldEditor
                    key={field.key}
                    field={field}
                    value={form[field.key] ?? { value: '' }}
                    onChange={(patch) => update(field.key, patch)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: FormValue;
  onChange: (patch: Partial<FormValue>) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs uppercase tracking-[0.15em] text-white/70">{field.label}</label>
        {field.kind === 'number' && field.suffix && (
          <span className="text-xs text-white/40">{field.suffix}</span>
        )}
      </div>

      {field.kind === 'textarea' ? (
        <textarea
          value={value.value}
          onChange={(e) => onChange({ value: e.target.value })}
          rows={2}
          placeholder={field.placeholder}
          className="w-full p-3 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 outline-none placeholder:text-white/30 text-sm"
        />
      ) : field.kind === 'stat' ? (
        <div className="grid grid-cols-[2fr_1fr] gap-2">
          <input
            type="text"
            value={value.value}
            onChange={(e) => onChange({ value: e.target.value })}
            placeholder="Значение"
            className="h-11 px-4 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 outline-none placeholder:text-white/30 text-sm"
          />
          <input
            type="text"
            value={value.suffix ?? ''}
            onChange={(e) => onChange({ suffix: e.target.value })}
            placeholder={field.suffixLabel}
            className="h-11 px-4 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 outline-none placeholder:text-white/30 text-sm"
          />
        </div>
      ) : (
        <input
          type={field.kind === 'number' ? 'number' : field.kind === 'url' ? 'url' : 'text'}
          value={value.value}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder={'placeholder' in field ? field.placeholder : undefined}
          className="w-full h-11 px-4 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 outline-none placeholder:text-white/30 text-sm"
        />
      )}

      {field.help && <p className="text-xs text-white/40 mt-1.5">{field.help}</p>}
    </div>
  );
}
