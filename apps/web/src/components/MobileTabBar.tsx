'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, Calculator, Package, UserCircle2, type LucideIcon } from 'lucide-react';

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

const TABS: readonly Tab[] = [
  { href: '/', label: 'Главная', icon: Home, isActive: (p) => p === '/' },
  { href: '/services', label: 'Услуги', icon: Wrench, isActive: (p) => p.startsWith('/services') },
  { href: '/calculator', label: 'Расчёт', icon: Calculator, isActive: (p) => p.startsWith('/calculator') },
  { href: '/catalog', label: 'Каталог', icon: Package, isActive: (p) => p.startsWith('/catalog') },
  { href: '/lk', label: 'Кабинет', icon: UserCircle2, isActive: (p) => p.startsWith('/lk') },
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
          className="grid grid-cols-5 p-1.5 relative overflow-hidden"
          style={{
            background: 'rgba(20, 20, 30, 0.55)',
            backdropFilter: 'blur(32px) saturate(2)',
            WebkitBackdropFilter: 'blur(32px) saturate(2)',
            borderRadius: 30,
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.14) inset, 0 -1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -12px rgba(0,0,0,0.6)',
          }}
        >
          {/* мягкий внутренний блик */}
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 35%)',
              borderRadius: 30,
            }}
          />
          {TABS.map((t) => {
            const active = t.isActive(pathname);
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                onClick={haptic}
                aria-current={active ? 'page' : undefined}
                className="relative h-14 flex flex-col items-center justify-center gap-1 rounded-[22px] active:scale-[0.92] transition-transform z-10"
                style={
                  active
                    ? {
                        background:
                          'linear-gradient(180deg, rgba(255,62,79,0.25) 0%, rgba(232,18,36,0.4) 100%)',
                        boxShadow:
                          '0 1px 0 rgba(255,255,255,0.2) inset, 0 8px 22px -6px rgba(232,18,36,0.55)',
                      }
                    : undefined
                }
              >
                <Icon
                  strokeWidth={active ? 2.4 : 1.9}
                  className={`w-[20px] h-[20px] transition-colors ${
                    active ? 'text-white' : 'text-white/55'
                  }`}
                />
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
