'use client';
import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') ?? '/admin';

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace(next);
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body?.error ?? 'Неверный пароль');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh -mt-[68px] md:-mt-[80px] bg-[#0A0A10] flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF3E4F] mb-4"
            style={{ background: 'rgba(232,18,36,0.1)', border: '1px solid rgba(232,18,36,0.3)' }}
          >
            <Lock className="w-3 h-3" />
            Админка · Зона Ремонта
          </div>
          <h1 className="font-display font-bold uppercase tracking-tight text-white text-[28px] md:text-[32px] leading-tight">
            Вход в панель
          </h1>
          <p className="text-[14px] text-white/55 mt-3">
            Введите пароль администратора
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl p-6 md:p-7 flex flex-col gap-4"
          style={{
            background: 'rgba(20,20,26,0.7)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 24px 60px -20px rgba(0,0,0,0.6)',
          }}
        >
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
              Пароль
            </span>
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-[15px] focus:outline-none focus:border-[#FF3E4F] transition-colors"
              placeholder="••••••••••"
            />
          </label>

          {error && (
            <div
              className="text-[13px] px-4 py-3 rounded-xl"
              style={{ background: 'rgba(232,18,36,0.1)', border: '1px solid rgba(232,18,36,0.3)', color: '#FF3E4F' }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || password.length === 0}
            className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Проверяю...' : 'Войти'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-[12px] text-white/35 mt-6">
          Если забыли пароль — измените{' '}
          <code className="text-white/55">ADMIN_PASSWORD</code> в .env и перезапустите контейнер.
        </p>
      </div>
    </div>
  );
}
