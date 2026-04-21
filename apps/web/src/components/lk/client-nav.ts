import { Bell, Calendar, Car, History, Home, Settings, Wallet } from 'lucide-react';

export const CLIENT_NAV = [
  { href: '/lk/dashboard', label: 'Главная', icon: Home },
  { href: '/lk/vehicles', label: 'Мои авто', icon: Car },
  { href: '/lk/history', label: 'История ТО', icon: History },
  { href: '/lk/expenses', label: 'Траты', icon: Wallet },
  { href: '/lk/reminders', label: 'Напоминания', icon: Bell },
  { href: '/lk/appointment', label: 'Записаться', icon: Calendar },
  { href: '/lk/profile', label: 'Профиль', icon: Settings },
] as const;
