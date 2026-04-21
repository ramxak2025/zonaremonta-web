'use client';
import { useEffect, useState } from 'react';
import { api, ApiError } from './api';

/** Данные текущего пользователя из /auth/me */
export interface Me {
  id: string;
  role: 'CLIENT' | 'MASTER' | 'DIRECTOR';
  clientId?: string;
  masterId?: string;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('access_token');
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('access_token');
}

/** Хук: требует наличия токена и конкретной роли (либо любой). */
export function useAuth(requiredRole?: Me['role']): {
  me: Me | null;
  loading: boolean;
  error: string | null;
} {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = '/lk';
      return;
    }
    api<Me>('/auth/me', { method: 'POST', token })
      .then((data) => {
        if (requiredRole && data.role !== requiredRole) {
          const dest =
            data.role === 'CLIENT' ? '/lk/dashboard'
              : data.role === 'MASTER' ? '/master/dashboard'
                : '/admin/dashboard';
          window.location.href = dest;
          return;
        }
        setMe(data);
      })
      .catch((e) => {
        setError(e instanceof ApiError ? e.message : 'Ошибка авторизации');
        clearToken();
        window.location.href = '/lk';
      })
      .finally(() => setLoading(false));
  }, [requiredRole]);

  return { me, loading, error };
}

/** Простой data-fetcher для защищённых endpoint'ов. */
export function useApi<T>(path: string | null): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const token = getToken() ?? undefined;
    api<T>(path, { token })
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [path, nonce]);

  return { data, loading, error, refetch: () => setNonce((n) => n + 1) };
}

export async function apiMutate<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken() ?? undefined;
  return api<T>(path, { ...init, token });
}
