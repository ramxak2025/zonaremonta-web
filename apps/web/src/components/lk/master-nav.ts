import { BookOpen, Home, Settings, Wrench } from 'lucide-react';

export const MASTER_NAV = [
  { href: '/master/dashboard', label: 'Мои наряды', icon: Wrench },
  { href: '/master/appointments', label: 'Расписание', icon: Home },
  { href: '/master/instructions', label: 'Инструкции', icon: BookOpen },
  { href: '/master/profile', label: 'Профиль', icon: Settings },
] as const;
