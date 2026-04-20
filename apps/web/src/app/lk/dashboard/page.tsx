'use client';
import Link from 'next/link';
import { Car, Bell, Wallet, Calendar, Settings } from 'lucide-react';

const tiles = [
  { href: '/lk/vehicles', icon: Car, title: 'Мои авто', text: 'Марки, модели, VIN, ГБО, пробег' },
  { href: '/lk/history', icon: Calendar, title: 'История ТО', text: 'Работы в нашем сервисе и у других' },
  { href: '/lk/expenses', icon: Wallet, title: 'Траты', text: 'Топливо, ремонт, страховка — по месяцам' },
  { href: '/lk/reminders', icon: Bell, title: 'Напоминания', text: 'ОСАГО, поверка баллона, замена масла' },
  { href: '/lk/appointment', icon: Calendar, title: 'Записаться', text: 'Выберите услугу и свободный слот' },
  { href: '/lk/profile', icon: Settings, title: 'Профиль', text: 'Имя, телефон, уведомления' },
];

export default function LkDashboard() {
  return (
    <>
      <h1 className="h-section">Мой кабинет</h1>
      <p className="text-ink-70 mt-2">
        Начните с добавления авто — тогда мы сможем вести историю работ и присылать напоминания.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="card hover:shadow-medium transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-accent-gradient grid place-items-center mb-3">
              <t.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-display text-lg">{t.title}</h3>
            <p className="text-ink-70 text-sm mt-1">{t.text}</p>
          </Link>
        ))}
      </div>
      <div className="card mt-8 bg-surface-muted">
        <p className="text-sm text-ink-70">
          В текущей версии реализованы auth-flow и базовый дашборд. Разделы наполняются во второй итерации —
          схемы БД, API-эндпоинты и валидации уже готовы.
        </p>
      </div>
    </>
  );
}
