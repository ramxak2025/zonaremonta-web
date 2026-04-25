'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, ImageIcon, Calculator, Phone, type LucideIcon } from 'lucide-react';

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (p: string) => boolean;
}

const TABS: Tab[] = [
  { href: '/',           label: 'Главная',  icon: Home,        match: (p) => p === '/' },
  { href: '/install',    label: 'Установка', icon: Wrench,     match: (p) => p.startsWith('/install') },
  { href: '/works',      label: 'Работы',   icon: ImageIcon,   match: (p) => p.startsWith('/works') },
  { href: '/calculator', label: 'Расчёт',   icon: Calculator,  match: (p) => p.startsWith('/calculator') },
  { href: '/#contact',   label: 'Контакт',  icon: Phone,       match: () => false },
];

export function MobileNav() {
  const pathname = usePathname() ?? '/';

  return (
    <div
      aria-label="Навигация"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),8px)] pointer-events-none"
    >
      <nav
        className="pointer-events-auto grid grid-cols-5 p-1.5 rounded-[28px]"
        style={{
          background: 'rgba(20, 20, 26, 0.85)',
          backdropFilter: 'blur(20px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 12px 30px -12px rgba(0,0,0,0.6)',
        }}
      >
        {TABS.map((t) => {
          const active = t.match(pathname);
          const Icon = t.icon;
          return (
            <Link
              key={t.href + t.label}
              href={t.href}
              aria-current={active ? 'page' : undefined}
              className="relative h-14 flex flex-col items-center justify-center gap-1 rounded-[20px] active:scale-[0.92] transition-transform"
              style={
                active
                  ? {
                      background: 'linear-gradient(180deg, rgba(255,62,79,0.28), rgba(232,18,36,0.4))',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 8px 20px -6px rgba(232,18,36,0.55)',
                    }
                  : undefined
              }
            >
              <Icon
                strokeWidth={active ? 2.4 : 1.9}
                className={`w-5 h-5 ${active ? 'text-white' : 'text-white/65'}`}
              />
              <span
                className={`text-[10px] font-semibold leading-none uppercase tracking-[0.04em] ${
                  active ? 'text-white' : 'text-white/65'
                }`}
              >
                {t.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
