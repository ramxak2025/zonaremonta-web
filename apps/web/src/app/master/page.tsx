'use client';
import Image from 'next/image';
import { useState } from 'react';
import { api, ApiError } from '@/lib/api';

type StaffLoginResponse =
  | { requires2faEnrollment: true; otpauth: string; qrDataUrl: string }
  | { requires2fa: true }
  | { accessToken: string; role: 'MASTER' | 'DIRECTOR' };

export default function MasterLogin() {
  return <StaffLogin roleLabel="мастера" redirectTo="/master/dashboard" />;
}

export function StaffLogin({
  roleLabel,
  redirectTo,
}: {
  roleLabel: string;
  redirectTo: string;
}) {
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
      const r = await api<StaffLoginResponse>('/auth/staff/login', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if ('requires2faEnrollment' in r) {
        setQr(r.qrDataUrl);
        setMode('enroll');
        return;
      }
      if ('requires2fa' in r) {
        setMode('2fa');
        return;
      }
      sessionStorage.setItem('access_token', r.accessToken);
      window.location.href = redirectTo;
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
      <div className="max-w-md mx-auto liquid-glass p-8">
        <h1 className="h-section text-white">Вход для {roleLabel}</h1>
        <p className="text-white/60 text-sm mt-2">
          Email + пароль + одноразовый код TOTP (Google Authenticator / Яндекс.Ключ).
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-white/60">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full h-12 px-4 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-white/60">Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full h-12 px-4 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 outline-none"
            />
          </label>
          {mode === 'enroll' && qr && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm">
              <p className="mb-3 text-white/80">
                Отсканируйте QR в приложении TOTP и введите код для подтверждения:
              </p>
              <Image
                src={qr}
                alt="QR-код для настройки TOTP"
                width={192}
                height={192}
                unoptimized
                className="w-48 h-48 mx-auto rounded-xl bg-white p-2"
              />
            </div>
          )}
          {(mode === '2fa' || mode === 'enroll') && (
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">Код из приложения</span>
              <input
                inputMode="numeric"
                value={totp}
                onChange={(e) => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="mt-2 w-full h-14 px-4 rounded-2xl text-white bg-white/5 border border-white/10 tracking-[0.5em] text-center text-2xl font-mono outline-none focus:border-primary/60"
              />
            </label>
          )}
          <button
            type="button"
            className="btn btn-primary w-full"
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
