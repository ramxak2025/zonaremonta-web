'use client';
import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2, Lock, Mail, Phone, ShieldCheck, UserPlus } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { HexIcon } from '@/components/HexIcon';

type Mode = 'login' | 'register';
type LoginMethod = 'email' | 'phone';
type RegisterStep = 'form' | 'sms' | 'done';

export default function LkPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');

  return (
    <main className="section py-8 md:py-14 min-h-[calc(100vh-200px)]">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 md:gap-12 items-start">
        {/* Левая колонка — маркетинг */}
        <div className="hidden lg:block pt-8 relative">
          <HexIcon size={280} filled={false} className="absolute -left-10 top-0 text-white/[0.04]" />
          <div className="relative">
            <span className="chip">
              <span className="dot" />
              Личный кабинет
            </span>
            <h1
              className="font-display font-bold uppercase text-white mt-5 leading-[0.95]"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)', letterSpacing: '-0.03em' }}
            >
              Всё об автомобиле <br />в одном месте
            </h1>
            <ul className="mt-8 space-y-4">
              {[
                { icon: CheckCircle2, title: 'История обслуживания', text: 'Все работы по ГБО, пробеги, запчасти' },
                { icon: ShieldCheck, title: 'Напоминания о поверке', text: 'Баллон, ОСАГО, ТО — приходят на SMS' },
                { icon: Phone, title: 'Быстрая запись', text: 'Выбрать дату и время прямо в кабинете' },
              ].map((f) => (
                <li key={f.title} className="flex gap-3">
                  <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary/15 border border-primary/25 flex-none">
                    <f.icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
                  </span>
                  <div>
                    <div className="text-white font-semibold">{f.title}</div>
                    <div className="text-white/55 text-sm mt-0.5">{f.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Правая — форма */}
        <div className="liquid-glass p-6 md:p-8 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
          {/* Переключатель Вход / Регистрация */}
          <div
            className="grid grid-cols-2 gap-1 p-1 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {(['login', 'register'] as const).map((m) => {
              const active = m === mode;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`h-10 rounded-full text-[13px] font-semibold transition-all ${
                    active ? 'text-white' : 'text-white/55 hover:text-white/80'
                  }`}
                  style={
                    active
                      ? {
                          background: 'linear-gradient(180deg, #FF3E4F, #E81224)',
                          boxShadow:
                            '0 1px 0 rgba(255,255,255,0.25) inset, 0 6px 14px -4px rgba(232,18,36,0.5)',
                        }
                      : undefined
                  }
                >
                  {m === 'login' ? 'Вход' : 'Регистрация'}
                </button>
              );
            })}
          </div>

          {mode === 'login' ? (
            <LoginForm method={loginMethod} onMethodChange={setLoginMethod} />
          ) : (
            <RegisterForm />
          )}

          <p className="text-xs text-white/40 mt-6 text-center">
            Нажимая кнопку, вы соглашаетесь с{' '}
            <Link href="/privacy" className="text-primary">политикой</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function LoginForm({
  method, onMethodChange,
}: { method: LoginMethod; onMethodChange: (m: LoginMethod) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitEmail() {
    setLoading(true);
    setError(null);
    try {
      const r = await api<{ accessToken: string }>('/auth/email/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      sessionStorage.setItem('access_token', r.accessToken);
      window.location.href = '/lk/dashboard';
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  }

  async function requestSms() {
    setLoading(true);
    setError(null);
    try {
      await api('/auth/sms/request', { method: 'POST', body: JSON.stringify({ phone }) });
      setSmsSent(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось отправить код');
    } finally {
      setLoading(false);
    }
  }

  async function verifySms() {
    setLoading(true);
    setError(null);
    try {
      const r = await api<{ accessToken: string }>('/auth/sms/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, code }),
      });
      sessionStorage.setItem('access_token', r.accessToken);
      window.location.href = '/lk/dashboard';
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Неверный код');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <h2 className="h-2 text-white">Войти в кабинет</h2>
      <p className="text-white/55 text-sm mt-1">
        {method === 'email' ? 'По email и паролю' : 'По телефону и SMS-коду'}
      </p>

      {/* Табы метода */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        <MethodTab active={method === 'email'} icon={Mail} label="Email" onClick={() => onMethodChange('email')} />
        <MethodTab active={method === 'phone'} icon={Phone} label="Телефон" onClick={() => onMethodChange('phone')} />
      </div>

      {method === 'email' ? (
        <div className="mt-5 space-y-3">
          <TextField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@mail.ru" />
          <TextField label="Пароль" type="password" value={password} onChange={setPassword} placeholder="********" />
          <button className="btn btn-primary w-full !h-12 mt-2" disabled={loading} onClick={submitEmail}>
            {loading ? 'Входим…' : 'Войти'}
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <TextField
            label="Телефон"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="+79881234567"
            disabled={smsSent}
          />
          {smsSent && (
            <TextField
              label="Код из SMS"
              type="text"
              value={code}
              onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              mono
            />
          )}
          <button
            className="btn btn-primary w-full !h-12 mt-2"
            disabled={loading}
            onClick={smsSent ? verifySms : requestSms}
          >
            {loading ? 'Проверяем…' : smsSent ? 'Войти' : 'Получить код'}
          </button>
        </div>
      )}

      {error && <p className="text-primary text-sm mt-3">{error}</p>}
    </div>
  );
}

function RegisterForm() {
  const [step, setStep] = useState<RegisterStep>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitRegister() {
    setLoading(true);
    setError(null);
    try {
      await api('/auth/email/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, phone, name }),
      });
      setStep('sms');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось создать аккаунт');
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setLoading(true);
    setError(null);
    try {
      const r = await api<{ accessToken: string }>('/auth/email/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, code }),
      });
      sessionStorage.setItem('access_token', r.accessToken);
      setStep('done');
      setTimeout(() => (window.location.href = '/lk/dashboard'), 500);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Неверный код');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <h2 className="h-2 text-white">
        {step === 'form' ? 'Создать аккаунт' : step === 'sms' ? 'Подтверждение' : 'Готово!'}
      </h2>
      <p className="text-white/55 text-sm mt-1">
        {step === 'form'
          ? 'Быстро и бесплатно. Подтвердим номер по SMS.'
          : step === 'sms'
            ? `Код отправлен на ${phone}`
            : 'Аккаунт создан, входим…'}
      </p>

      {step === 'form' && (
        <div className="mt-5 space-y-3">
          <TextField label="Как вас зовут" value={name} onChange={setName} placeholder="Ахмед" />
          <TextField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@mail.ru" />
          <TextField label="Пароль (минимум 10 символов)" type="password" value={password} onChange={setPassword} placeholder="*********" />
          <TextField label="Телефон" type="tel" value={phone} onChange={setPhone} placeholder="+79881234567" />
          <button className="btn btn-primary w-full !h-12 mt-2" disabled={loading} onClick={submitRegister}>
            <UserPlus className="w-4 h-4" />
            {loading ? 'Регистрируем…' : 'Зарегистрироваться'}
          </button>
        </div>
      )}

      {step === 'sms' && (
        <div className="mt-5 space-y-3">
          <TextField
            label="Код из SMS"
            type="text"
            value={code}
            onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            mono
          />
          <button className="btn btn-primary w-full !h-12 mt-2" disabled={loading} onClick={verify}>
            {loading ? 'Проверяем…' : 'Подтвердить'}
          </button>
          <button
            className="btn btn-ghost w-full !h-10 text-[12px]"
            onClick={() => { setStep('form'); setCode(''); }}
          >
            ← Изменить данные
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="mt-5 p-4 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
          <span className="text-sm text-white/85">Добро пожаловать! Переходим в кабинет…</span>
        </div>
      )}

      {error && <p className="text-primary text-sm mt-3">{error}</p>}
    </div>
  );
}

function MethodTab({
  active, icon: Icon, label, onClick,
}: { active: boolean; icon: typeof Mail; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
        active ? 'text-white' : 'text-white/55 hover:text-white/80'
      }`}
      style={
        active
          ? {
              background: 'rgba(232,18,36,0.15)',
              border: '1px solid rgba(232,18,36,0.4)',
            }
          : {
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }
      }
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function TextField({
  label, value, onChange, placeholder, type = 'text', disabled, mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  disabled?: boolean;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.15em] text-white/60 font-semibold">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`mt-2 w-full h-12 px-4 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 outline-none transition-colors placeholder:text-white/25 disabled:opacity-50 ${
          mono ? 'tracking-[0.4em] text-center text-xl font-mono' : ''
        }`}
      />
    </label>
  );
}
