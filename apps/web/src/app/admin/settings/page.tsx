'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api, ApiError } from '@/lib/api';
import { HexIcon } from '@/components/HexIcon';

interface SettingRow { key: string; value: unknown }

type FieldDef =
  | { kind: 'text'; key: string; label: string; placeholder?: string; help?: string }
  | { kind: 'textarea'; key: string; label: string; placeholder?: string; help?: string }
  | { kind: 'number'; key: string; label: string; suffix?: string; help?: string }
  | { kind: 'url'; key: string; label: string; placeholder?: string; help?: string };

const SECTIONS: Array<{ title: string; description?: string; fields: FieldDef[] }> = [
  {
    title: 'Главный баннер',
    description: 'Текст и картинка на первом экране — всё, что видит клиент сразу.',
    fields: [
      { kind: 'text', key: 'hero.badge', label: 'Плашка над заголовком', placeholder: 'ГБО в Махачкале · Гарантия 1 год' },
      { kind: 'textarea', key: 'hero.title', label: 'Главный заголовок', placeholder: 'Переводим авто на газ с гарантией.' },
      { kind: 'textarea', key: 'hero.subtitle', label: 'Подзаголовок' },
      { kind: 'text', key: 'hero.primaryCta', label: 'Текст кнопки', placeholder: 'Позвонить сейчас' },
      { kind: 'url', key: 'hero.imageUrl', label: 'URL фоновой картинки', help: 'Оставьте пустым для градиентного фона' },
    ],
  },
  {
    title: 'Статистика в hero',
    description: 'Две цифры: срок окупаемости и процент экономии.',
    fields: [
      { kind: 'text', key: 'hero.stats.payback', label: 'Окупаемость (число)' },
      { kind: 'text', key: 'hero.stats.savings', label: 'Экономия (число)' },
    ],
  },
  {
    title: 'Цены на топливо',
    description: 'Актуальные цены на сегодня — обновляйте регулярно. Используются в калькуляторе экономии.',
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
      { kind: 'number', key: 'calc.gasOverheadPct', label: 'Наценка расхода газа', suffix: '%', help: '10–15% — типично' },
      { kind: 'number', key: 'calc.defaultInstallPrice', label: 'Стоимость установки по умолчанию', suffix: '₽' },
    ],
  },
  {
    title: 'Контакты',
    fields: [
      { kind: 'text', key: 'site.phone', label: 'Телефон', placeholder: '+7 (988) 000-00-00' },
      { kind: 'text', key: 'site.whatsapp', label: 'WhatsApp (только цифры)', placeholder: '79880000000' },
      { kind: 'url', key: 'site.max', label: 'Max — ссылка' },
      { kind: 'url', key: 'site.yandexMapsLink', label: 'Ссылка на Я.Карты', help: 'Откройте свою точку на Яндекс.Картах → «Поделиться»' },
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
];

export default function AdminSettingsPage() {
  const [rows, setRows] = useState<SettingRow[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('access_token') ?? undefined : undefined;

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api<SettingRow[]>('/settings', { token });
      setRows(data);
      const d: Record<string, string> = {};
      for (const r of data) {
        d[r.key] = serialize(r.value);
      }
      setDraft(d);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось загрузить');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function save() {
    setSaving(true);
    setError(null);
    setOk(false);
    try {
      const payload: Record<string, unknown> = {};
      for (const [key, raw] of Object.entries(draft)) {
        const current = rows.find((r) => r.key === key)?.value;
        const updated = parseWithShape(current, raw);
        payload[key] = updated;
      }
      await api('/settings', { method: 'PUT', body: JSON.stringify(payload), token });
      setOk(true);
      await load();
      setTimeout(() => setOk(false), 2500);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Header />
      <main className="section py-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <span className="chip"><HexIcon size={12} className="text-primary" />Админка</span>
            <h1 className="h-section text-white mt-2">Настройки сайта</h1>
            <p className="text-white/60 text-sm mt-1">Всё, что можно менять без программиста.</p>
          </div>
          <button
            type="button"
            disabled={saving || loading}
            onClick={save}
            className="btn btn-primary !h-12"
          >
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
                {section.fields.map((f) => (
                  <div key={f.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs uppercase tracking-[0.15em] text-white/70">
                        {f.label}
                      </label>
                      {f.kind === 'number' && f.suffix && (
                        <span className="text-xs text-white/40">{f.suffix}</span>
                      )}
                    </div>
                    {f.kind === 'textarea' ? (
                      <textarea
                        value={draft[f.key] ?? ''}
                        onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                        rows={2}
                        placeholder={f.placeholder}
                        className="w-full p-3 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 outline-none placeholder:text-white/30 text-sm"
                      />
                    ) : (
                      <input
                        type={f.kind === 'number' ? 'number' : f.kind === 'url' ? 'url' : 'text'}
                        value={draft[f.key] ?? ''}
                        onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                        placeholder={'placeholder' in f ? f.placeholder : undefined}
                        className="w-full h-11 px-4 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 outline-none placeholder:text-white/30 text-sm"
                      />
                    )}
                    {f.help && <p className="text-xs text-white/40 mt-1.5">{f.help}</p>}
                  </div>
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

/** Преобразуем значение из БД в строку для формы. */
function serialize(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'object' && value !== null && 'value' in (value as Record<string, unknown>)) {
    const v = (value as { value: unknown }).value;
    return v == null ? '' : String(v);
  }
  return String(value);
}

/** Сохраняем форму текущей структуры `{ value: ..., ... }`. */
function parseWithShape(current: unknown, raw: string): unknown {
  const trimmed = raw.trim();
  const asNumber = trimmed === '' ? null : Number(trimmed);
  const isNumeric = trimmed !== '' && !Number.isNaN(asNumber);

  if (current && typeof current === 'object' && 'value' in (current as Record<string, unknown>)) {
    const obj = { ...(current as Record<string, unknown>) };
    obj.value = isNumeric && typeof (current as { value: unknown }).value === 'number' ? asNumber : trimmed;
    return obj;
  }
  return { value: isNumeric ? asNumber : trimmed };
}
