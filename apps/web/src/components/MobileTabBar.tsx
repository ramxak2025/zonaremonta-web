'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, Calculator, Package, UserCircle2, type LucideIcon } from 'lucide-react';
import { HexIcon } from './HexIcon';

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

const TABS: readonly Tab[] = [
  {
    href: '/',
    label: 'Главная',
    icon: Home,
    isActive: (p) => p === '/',
  },
  {
    href: '/services',
    label: 'Услуги',
    icon: Wrench,
    isActive: (p) => p.startsWith('/services'),
  },
  {
    href: '/#calc',
    label: 'Расчёт',
    icon: Calculator,
    isActive: () => false,
  },
  {
    href: '/catalog',
    label: 'Каталог',
    icon: Package,
    isActive: (p) => p.startsWith('/catalog'),
  },
  {
    href: '/lk',
    label: 'Кабинет',
    icon: UserCircle2,
    isActive: (p) => p.startsWith('/lk'),
  },
];

function haptic(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(8);
    } catch {
      /* no-op */
    }
  }
}

export function MobileTabBar() {
  const pathname = usePathname() ?? '/';

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none pb-safe"
      aria-label="Навигация"
    >
      <div className="mx-2.5 pointer-events-auto">
        <nav
          className="grid grid-cols-5 gap-0.5 p-1.5"
          style={{
            background: 'rgba(10, 10, 12, 0.82)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 28,
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.08) inset, 0 14px 40px -12px rgba(0,0,0,0.55)',
          }}
        >
          {TABS.map((t) => {
            const active = t.isActive(pathname);
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                onClick={haptic}
                aria-current={active ? 'page' : undefined}
                className="relative h-14 flex flex-col items-center justify-center gap-1 rounded-[20px] overflow-hidden active:scale-[0.92] transition-transform"
                style={
                  active
                    ? {
                        background:
                          'linear-gradient(180deg, rgba(255,62,79,0.2) 0%, rgba(232,18,36,0.32) 100%)',
                        border: '1px solid rgba(232,18,36,0.4)',
                        boxShadow:
                          '0 1px 0 rgba(255,255,255,0.15) inset, 0 8px 20px -6px rgba(232,18,36,0.45)',
                      }
                    : undefined
                }
              >
                <span className="relative grid place-items-center w-7 h-7">
                  {active && (
                    <HexIcon
                      size={28}
                      filled={false}
                      className="absolute text-primary/60"
                    />
                  )}
                  <Icon
                    strokeWidth={active ? 2.4 : 1.9}
                    className={`w-[18px] h-[18px] relative transition-colors ${
                      active ? 'text-white' : 'text-white/55'
                    }`}
                  />
                </span>
                <span
                  className={`text-[10px] font-semibold leading-none uppercase tracking-[0.04em] ${
                    active ? 'text-white' : 'text-white/55'
                  }`}
                >
                  {t.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
