'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const search = useSearchParams();
  const next = search.get('next') ?? '/admin';
  const hasError = search.get('err') === '1';
  const [show, setShow] = useState(false);

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
          method="POST"
          action={`/api/admin/login?next=${encodeURIComponent(next)}`}
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
            <div className="mt-2 relative">
              <input
                name="password"
                type={show ? 'text' : 'password'}
                autoFocus
                autoComplete="current-password"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                required
                className="w-full h-12 pl-4 pr-12 rounded-xl bg-white/[0.04] border border-white/10 text-white text-[16px] focus:outline-none focus:border-[#FF3E4F] transition-colors font-mono tracking-wider"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center text-white/55 hover:text-white"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </label>

          {hasError && (
            <div
              className="text-[13px] px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(232,18,36,0.1)',
                border: '1px solid rgba(232,18,36,0.3)',
                color: '#FF3E4F',
              }}
            >
              Неверный пароль.
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full">
            Войти
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
