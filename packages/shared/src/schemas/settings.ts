import { z } from 'zod';

/**
 * Настройки сайта — единственный источник правды для структуры значений.
 * Бэкенд хранит в Postgres (Setting.value: JSONB),
 * фронт парсит ответ `/settings/public` через `publicSettingsSchema`.
 */

const stringValue = z.object({ value: z.string() });
const urlValue = z.object({ value: z.string().url().or(z.literal('')) });
const numberValue = z.object({ value: z.number() });
const statValue = z.object({
  value: z.string(),
  suffix: z.string().optional(),
});

export const publicSettingsSchema = z
  .object({
    // --- Hero banner ---
    'hero.badge': stringValue,
    'hero.title': stringValue,
    'hero.subtitle': stringValue,
    'hero.primaryCta': stringValue,
    'hero.imageUrl': urlValue,
    'hero.stats.payback': statValue,
    'hero.stats.savings': statValue,

    // --- Fuel prices (RUB/L) ---
    'fuel.ai92.price': numberValue,
    'fuel.ai95.price': numberValue,
    'fuel.ai98.price': numberValue,
    'fuel.ai100.price': numberValue,
    'fuel.lpg.price': numberValue,

    // --- Calculator defaults ---
    'calc.gasOverheadPct': numberValue,
    'calc.defaultInstallPrice': numberValue,

    // --- Yandex reviews ---
    'reviews.yandex.url': urlValue,
    'reviews.yandex.rating': numberValue,
    'reviews.yandex.count': numberValue,

    // --- Site contacts ---
    'site.phone': stringValue,
    'site.whatsapp': stringValue,
    'site.max': urlValue,
    'site.yandexMapsLink': urlValue,
    'site.address': stringValue,
    'site.workingHours': stringValue,
  })
  .partial();

export type PublicSettings = z.infer<typeof publicSettingsSchema>;

/** Дефолты — используются, когда настройка отсутствует в БД. */
export const DEFAULT_SETTINGS: Required<PublicSettings> = {
  'hero.badge': { value: 'ГБО в Махачкале · Гарантия 1 год' },
  'hero.title': { value: 'Переводим авто на газ с гарантией.' },
  'hero.subtitle': {
    value:
      'Установка, ремонт и диагностика ГБО. Сертифицированные мастера, свой склад, гарантия 1 год.',
  },
  'hero.primaryCta': { value: 'Позвонить сейчас' },
  'hero.imageUrl': { value: '' },
  'hero.stats.payback': { value: '~8', suffix: 'мес' },
  'hero.stats.savings': { value: '55', suffix: '%' },

  'fuel.ai92.price': { value: 58 },
  'fuel.ai95.price': { value: 62 },
  'fuel.ai98.price': { value: 68 },
  'fuel.ai100.price': { value: 75 },
  'fuel.lpg.price': { value: 28 },

  'calc.gasOverheadPct': { value: 12 },
  'calc.defaultInstallPrice': { value: 38000 },

  'reviews.yandex.url': { value: 'https://yandex.ru/profile/130786711189?lang=ru' },
  'reviews.yandex.rating': { value: 4.6 },
  'reviews.yandex.count': { value: 87 },

  'site.phone': { value: '+7 (988) 000-00-00' },
  'site.whatsapp': { value: '79880000000' },
  'site.max': { value: 'https://max.ru/05auto' },
  'site.yandexMapsLink': {
    value: 'https://yandex.ru/profile/130786711189?lang=ru',
  },
  'site.address': { value: 'г. Махачкала, ул. пример, 1' },
  'site.workingHours': { value: 'ПН-СБ: 9:00–20:00, ВС: выходной' },
};

/** Объединить настройки из БД с дефолтами (unknown → valid PublicSettings). */
export function mergeWithDefaults(raw: unknown): Required<PublicSettings> {
  const parsed = publicSettingsSchema.safeParse(raw);
  const validated = parsed.success ? parsed.data : {};
  return { ...DEFAULT_SETTINGS, ...validated } as Required<PublicSettings>;
}

/** Виды бензина для калькулятора (frontend UI). */
export const PETROL_KINDS = [
  { key: 'fuel.ai92.price', label: 'АИ-92' },
  { key: 'fuel.ai95.price', label: 'АИ-95' },
  { key: 'fuel.ai98.price', label: 'АИ-98' },
  { key: 'fuel.ai100.price', label: 'АИ-100' },
] as const satisfies ReadonlyArray<{
  key: keyof PublicSettings & `fuel.ai${string}.price`;
  label: string;
}>;

export type PetrolKey = (typeof PETROL_KINDS)[number]['key'];
