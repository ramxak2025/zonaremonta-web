'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { callbackRequestSchema, type CallbackRequestInput } from '@05auto/shared';
import { api, ApiError } from '@/lib/api';

export function CallbackForm() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CallbackRequestInput>({
    resolver: zodResolver(callbackRequestSchema) as any,
    defaultValues: { consent: true as any },
  });

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    try {
      await api('/callback', { method: 'POST', body: JSON.stringify(data) });
      setStatus('ok');
      reset();
    } catch (e) {
      setStatus('error');
      setError(e instanceof ApiError ? e.message : 'Не удалось отправить');
    }
  });

  return (
    <section id="callback" className="section py-24">
      <div className="card max-w-3xl mx-auto">
        <div className="mb-6">
          <span className="chip">Обратный звонок</span>
          <h2 className="h-section mt-3">Перезвоним за 15 минут</h2>
          <p className="text-ink-70 mt-2">
            Оставьте телефон — подберём решение под ваше авто и сориентируем по цене.
          </p>
        </div>

        {status === 'ok' ? (
          <div className="p-5 rounded-xl bg-secondary/10 border border-secondary/30">
            <div className="font-medium">Спасибо! Заявка получена.</div>
            <p className="text-ink-70 text-sm mt-1">Перезвоним в ближайшее время по рабочему графику.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4" noValidate>
            <label className="block">
              <span className="text-sm font-medium">Имя (необязательно)</span>
              <input
                {...register('name')}
                className="mt-1 w-full h-12 px-4 rounded-xl border border-ink-10 bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                placeholder="Как к вам обращаться"
              />
              {errors.name && <span className="text-xs text-primary">{errors.name.message}</span>}
            </label>

            <label className="block">
              <span className="text-sm font-medium">Телефон *</span>
              <input
                {...register('phone')}
                inputMode="tel"
                className="mt-1 w-full h-12 px-4 rounded-xl border border-ink-10 bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                placeholder="+79881234567"
              />
              {errors.phone && <span className="text-xs text-primary">{errors.phone.message}</span>}
            </label>

            {/* honeypot */}
            <input
              {...register('company')}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <label className="sm:col-span-2 flex items-start gap-3 text-sm text-ink-70">
              <input
                {...register('consent')}
                type="checkbox"
                defaultChecked
                className="mt-1 accent-primary w-4 h-4"
              />
              <span>
                Нажимая кнопку, вы соглашаетесь на обработку номера телефона для обратного звонка.
                Подробнее — в <Link href="/privacy" className="text-primary underline">политике</Link>.
              </span>
            </label>
            {errors.consent && <span className="text-xs text-primary -mt-3 sm:col-span-2">{errors.consent.message as string}</span>}

            <div className="sm:col-span-2 flex items-center gap-4">
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? 'Отправляем…' : 'Перезвоните мне'}
              </button>
              {error && <span className="text-sm text-primary">{error}</span>}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
