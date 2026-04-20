'use client';
import { useState } from 'react';
import { api, ApiError } from '@/lib/api';

export default function MasterLogin() {
  return <StaffLogin roleLabel="мастера" redirectTo="/master/dashboard" />;
}

export function StaffLogin({ roleLabel, redirectTo }: { roleLabel: string; redirectTo: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [mode, setMode] = useState<'credentials' | '2fa' | 'enroll'>('credentials');
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, string> = { email, password };
      if (mode === '2fa' && totp) body.totp = totp;
      const r = await api<any>('/auth/staff/login', { method: 'POST', body: JSON.stringify(body) });
      if (r.requires2faEnrollment) {
        setQr(r.qrDataUrl);
        setMode('enroll');
        return;
      }
      if (r.requires2fa) {
        setMode('2fa');
        return;
      }
      sessionStorage.setItem('access_token', r.accessToken);
      location.href = redirectTo;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  }

  async function confirmEnrollment() {
    setLoading(true);
    setError(null);
    try {
      await api('/auth/2fa/confirm', { method: 'POST', body: JSON.stringify({ code: totp }) });
      setMode('2fa');
      setTotp('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Неверный код');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section py-16">
      <div className="max-w-md mx-auto card">
        <h1 className="h-section">Вход для {roleLabel}</h1>
        <p className="text-ink-70 text-sm mt-2">Email + пароль + одноразовый код TOTP (Google Authenticator / Яндекс.Ключ).</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full h-12 px-4 rounded-xl border border-ink-10 bg-white outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full h-12 px-4 rounded-xl border border-ink-10 bg-white outline-none focus:border-primary"
            />
          </label>
          {mode === 'enroll' && qr && (
            <div className="p-4 rounded-xl bg-surface-muted text-sm">
              <p className="mb-2">Отсканируйте QR в приложении TOTP и введите код для подтверждения:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="TOTP QR" className="w-48 h-48 mx-auto rounded" />
            </div>
          )}
          {(mode === '2fa' || mode === 'enroll') && (
            <label className="block">
              <span className="text-sm font-medium">Код из приложения</span>
              <input
                inputMode="numeric"
                value={totp}
                onChange={(e) => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="mt-1 w-full h-12 px-4 rounded-xl border border-ink-10 bg-white tracking-[0.5em] text-center text-xl font-mono outline-none focus:border-primary"
              />
            </label>
          )}
          <button
            className="btn-primary w-full"
            disabled={loading}
            onClick={mode === 'enroll' ? confirmEnrollment : submit}
          >
            {loading ? 'Проверяем…' : mode === 'enroll' ? 'Подтвердить 2FA' : 'Войти'}
          </button>
          {error && <p className="text-primary text-sm">{error}</p>}
        </div>
      </div>
    </main>
  );
}
