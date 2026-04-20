'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { api, ApiError } from '@/lib/api';
import { HexIcon } from '@/components/HexIcon';

type Step = 'phone' | 'code' | 'done';

export default function LkLogin() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function request() {
    setError(null);
    setLoading(true);
    try {
      await api('/auth/sms/request', { method: 'POST', body: JSON.stringify({ phone }) });
      setStep('code');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setError(null);
    setLoading(true);
    try {
      const r = await api<{ accessToken: string }>('/auth/sms/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, code, name: name || undefined }),
      });
      sessionStorage.setItem('access_token', r.accessToken);
      setStep('done');
      setTimeout(() => (location.href = '/lk/dashboard'), 400);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Неверный код');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-md mx-auto liquid-glass p-8 relative overflow-hidden"
    >
      <HexIcon size={260} filled={false} className="absolute -right-16 -top-12 text-white/[0.05]" />
      <div className="relative">
        <span className="chip"><span className="dot" />Вход</span>
        <h1 className="h-section mt-3 text-white">Личный кабинет</h1>
        <p className="text-white/60 text-sm mt-2">
          Авторизация по номеру телефона и коду из SMS.
        </p>

        {step === 'phone' && (
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">Телефон</span>
              <input
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+79881234567"
                className="mt-2 w-full h-12 px-4 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 outline-none placeholder:text-white/30"
              />
            </label>
            <button className="btn btn-primary w-full" disabled={loading} onClick={request}>
              {loading ? 'Отправляем…' : 'Получить код'}
            </button>
            {error && <p className="text-primary text-sm">{error}</p>}
          </div>
        )}

        {step === 'code' && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-white/60">Мы отправили 6-значный код на {phone}</p>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">Код из SMS</span>
              <input
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="mt-2 w-full h-14 px-4 rounded-2xl text-white bg-white/5 border border-white/10 tracking-[0.5em] text-center text-2xl font-mono outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">Имя (если впервые)</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full h-12 px-4 rounded-2xl text-white bg-white/5 border border-white/10 outline-none focus:border-primary placeholder:text-white/30"
              />
            </label>
            <button className="btn btn-primary w-full" disabled={loading} onClick={verify}>
              {loading ? 'Проверяем…' : 'Войти'}
            </button>
            {error && <p className="text-primary text-sm">{error}</p>}
            <button className="text-sm text-white/50 hover:text-white" onClick={() => setStep('phone')}>
              ← Изменить номер
            </button>
          </div>
        )}

        {step === 'done' && <div className="mt-6 text-secondary">Входим…</div>}
      </div>
    </motion.div>
  );
}
