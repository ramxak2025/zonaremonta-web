import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Простая HMAC-подписанная cookie-сессия для админки.
 * Без БД, без users — единственный пароль из ADMIN_PASSWORD env.
 *
 * Формат cookie:  base64url(payload).base64url(hmac)
 * payload — JSON { exp: <unix-ms> }
 */

const COOKIE_NAME = 'zr_admin';
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 дней

function getSecret(): string {
  // На проде ОБЯЗАТЕЛЬНО задать ADMIN_SECRET. Дефолт оставлен для локала.
  const v = process.env.ADMIN_SECRET;
  return v && v.length >= 16 ? v : 'change-me-in-production-please-32chars';
}

const DEFAULT_PASSWORD = '20120505';

function getPassword(): string {
  // ВАЖНО: проверка через length (а не ??), потому что docker-compose может
  // прокинуть пустую строку '' если в .env нет ADMIN_PASSWORD.
  const v = process.env.ADMIN_PASSWORD;
  return v && v.length >= 4 ? v : DEFAULT_PASSWORD;
}

// Лог при первом импорте — видно, какой пароль активен (только длина).
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  const fromEnv = process.env.ADMIN_PASSWORD;
  const using = fromEnv && fromEnv.length >= 4
    ? `ENV (length=${fromEnv.length})`
    : `DEFAULT (${DEFAULT_PASSWORD})`;
  console.log(`[admin-auth] password source: ${using}`);
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString('base64url');
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export interface AdminSession {
  exp: number;
}

export function makeSessionCookie(): { name: string; value: string; ttl: number } {
  const session: AdminSession = { exp: Date.now() + TTL_MS };
  const payload = b64url(JSON.stringify(session));
  const sig = sign(payload);
  return {
    name: COOKIE_NAME,
    value: `${payload}.${sig}`,
    ttl: Math.floor(TTL_MS / 1000),
  };
}

export function verifyCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  if (!payload || !sig) return false;

  const expected = sign(payload);
  // timing-safe compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  try {
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
    const session = JSON.parse(decoded) as AdminSession;
    if (typeof session.exp !== 'number') return false;
    if (session.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function checkPassword(input: string): boolean {
  const expected = getPassword();
  if (input.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(input), Buffer.from(expected));
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;

/**
 * Для Server Components: вызови в начале страницы /admin/*. Если нет валидной
 * сессии — редиректит на /admin/login.
 */
export async function requireAdmin(redirectFrom: string): Promise<void> {
  const c = await cookies();
  const value = c.get(COOKIE_NAME)?.value;
  if (!verifyCookieValue(value)) {
    redirect(`/admin/login?next=${encodeURIComponent(redirectFrom)}`);
  }
}

/**
 * Для Route Handlers (/api/admin/*). Возвращает true если авторизован.
 * Иначе можно вернуть 401.
 */
export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  const value = c.get(COOKIE_NAME)?.value;
  return verifyCookieValue(value);
}
