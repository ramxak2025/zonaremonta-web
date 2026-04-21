import {
  Banknote, BookOpen, FileText, Home, Package, PhoneCall,
  Settings, Users, UserCog, Wrench,
} from 'lucide-react';

export const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Главная', icon: Home },
  { href: '/admin/clients', label: 'Клиенты', icon: Users },
  { href: '/admin/callbacks', label: 'Заявки', icon: PhoneCall },
  { href: '/admin/work-orders', label: 'Наряды', icon: Wrench },
  { href: '/admin/inventory', label: 'Склад', icon: Package },
  { href: '/admin/finance', label: 'Финансы', icon: Banknote },
  { href: '/admin/masters', label: 'Мастера', icon: UserCog },
  { href: '/admin/content', label: 'Контент', icon: BookOpen },
  { href: '/admin/instructions', label: 'Инструкции', icon: FileText },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
] as const;
