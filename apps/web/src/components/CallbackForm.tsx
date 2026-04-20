'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Check } from 'lucide-react';
import { callbackRequestSchema, type CallbackRequestInput } from '@05auto/shared';
import { api, ApiError } from '@/lib/api';
import { HexIcon } from './HexIcon';

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
    <section id="callback" className="section py-16 sm:py-24">
      <div className="liquid-glass p-6 sm:p-10 max-w-3xl mx-auto relative overflow-hidden">
        <HexIcon size={400} filled={false} className="absolute -right-24 -top-24 text-white/[0.04]" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/25 blur-3xl" aria-hidden />

        <div className="relative">
          <span className="chip"><Phone className="w-3 h-3" />Обратный звонок</span>
          <h2 className="h-section mt-3 text-white">Перезвоним за 15 минут</h2>
          <p className="text-white/65 mt-3 max-w-xl">
            Оставьте номер — подберём решение и сориентируем по цене.
          </p>
        </div>

        {status === 'ok' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-5 rounded-2xl flex items-center gap-4 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(74,159,217,0.15), rgba(74,159,217,0.05))',
              border: '1px solid rgba(74,159,217,0.3)',
            }}
          >
            <span className="w-12 h-12 rounded-2xl grid place-items-center bg-secondary/30 border border-secondary/40">
              <Check className="w-6 h-6 text-secondary" strokeWidth={2.5} />
            </span>
            <div>
              <div className="font-display text-lg text-white">Заявка получена!</div>
              <div className="text-sm text-white/65">Перезвоним в рабочее время.</div>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 grid sm:grid-cols-2 gap-4 relative" noValidate>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">Имя</span>
              <input
                {...register('name')}
                className="mt-2 w-full h-12 px-4 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 outline-none transition-colors placeholder:text-white/30"
                placeholder="Как к вам обращаться"
              />
              {errors.name && <span className="text-xs text-primary mt-1">{errors.name.message}</span>}
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">Телефон *</span>
              <input
                {...register('phone')}
                inputMode="tel"
                className="mt-2 w-full h-12 px-4 rounded-2xl text-white bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 outline-none transition-colors placeholder:text-white/30"
                placeholder="+79881234567"
              />
              {errors.phone && <span className="text-xs text-primary mt-1">{errors.phone.message}</span>}
            </label>

            <input {...register('company')} type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <label className="sm:col-span-2 flex items-start gap-3 text-sm text-white/60">
              <input {...register('consent')} type="checkbox" defaultChecked className="mt-1 accent-primary w-4 h-4" />
              <span>
                Нажимая кнопку, вы соглашаетесь на обработку номера телефона для обратного звонка.
                Подробнее — в <Link href="/privacy" className="text-primary underline">политике</Link>.
              </span>
            </label>
            {errors.consent && (
              <span className="text-xs text-primary -mt-3 sm:col-span-2">{errors.consent.message as string}</span>
            )}

            <div className="sm:col-span-2 flex items-center gap-4 mt-2">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary shine-hover">
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
