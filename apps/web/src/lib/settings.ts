import { mergeWithDefaults, type PublicSettings } from '@05auto/shared';
import { SITE } from './site';

/**
 * Получить публичные настройки с API.
 * Результат строго типизирован и содержит все ключи (дефолты подставляются),
 * поэтому у компонентов никогда не бывает `undefined`-веток.
 */
export async function getPublicSettings(): Promise<Required<PublicSettings>> {
  try {
    const res = await fetch(`${SITE.apiUrl}/api/v1/settings/public`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return mergeWithDefaults({});
    const json: unknown = await res.json();
    return mergeWithDefaults(json);
  } catch {
    return mergeWithDefaults({});
  }
}
