'use client';
import { Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, KeyRound } from 'lucide-react';

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
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="min-h-dvh -mt-[68px] md:-mt-[80px] bg-[#0A0A10] flex items-center justify-center p-6">
      <div className="w-full max-w-[480px]">
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
            Дефолтный пароль: <code className="text-white text-[15px] font-mono">20120505</code>
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
            <input
              ref={inputRef}
              name="password"
              type="text"
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="numeric"
              defaultValue=""
              required
              className="mt-2 w-full h-14 px-4 rounded-xl bg-white/[0.04] border border-white/15 text-white text-[20px] focus:outline-none focus:border-[#FF3E4F] transition-colors font-mono tracking-[0.2em] text-center"
              placeholder="20120505"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = '20120505';
                inputRef.current.focus();
              }
            }}
            className="text-[12px] text-white/55 hover:text-white inline-flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Подставить дефолтный пароль
          </button>

          {hasError && (
            <div
              className="text-[13px] px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(232,18,36,0.1)',
                border: '1px solid rgba(232,18,36,0.3)',
                color: '#FF3E4F',
              }}
            >
              Неверный пароль. Проверьте раскладку клавиатуры — пароль должен быть только из цифр.
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full">
            Войти
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-[11px] text-white/35 mt-6 leading-relaxed max-w-prose mx-auto">
          После входа можно поменять пароль через ENV переменную <code className="text-white/55">ADMIN_PASSWORD</code> в .env
          и <code className="text-white/55">restart web</code>.
        </p>
      </div>
    </div>
  );
}
