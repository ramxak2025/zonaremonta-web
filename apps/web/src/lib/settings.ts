import { SITE } from './site';

export type SettingsMap = Record<string, unknown>;

/** Получить публичные настройки (SSR-friendly, ISR-кэш). */
export async function getPublicSettings(): Promise<SettingsMap> {
  try {
    const res = await fetch(`${SITE.apiUrl}/api/v1/settings/public`, {
      next: { revalidate: 60 }, // ISR — обновлять раз в минуту
    });
    if (!res.ok) return {};
    return (await res.json()) as SettingsMap;
  } catch {
    return {};
  }
}

/** Типизированный аксессор. */
export function readSetting<T = string>(map: SettingsMap, key: string, fallback: T): T {
  const v = map[key];
  if (v == null) return fallback;
  if (typeof v === 'object' && v !== null && 'value' in (v as Record<string, unknown>)) {
    const inner = (v as { value: unknown }).value;
    return (inner ?? fallback) as T;
  }
  return v as T;
}

/** Получить весь объект настройки (со всеми полями, не только `value`). */
export function readSettingObj<T = Record<string, unknown>>(
  map: SettingsMap,
  key: string,
  fallback: T,
): T {
  const v = map[key];
  if (v == null) return fallback;
  return v as T;
}

export const FUEL_KINDS = [
  { key: 'fuel.ai92.price', label: 'АИ-92' },
  { key: 'fuel.ai95.price', label: 'АИ-95' },
  { key: 'fuel.ai98.price', label: 'АИ-98' },
  { key: 'fuel.ai100.price', label: 'АИ-100' },
] as const;
