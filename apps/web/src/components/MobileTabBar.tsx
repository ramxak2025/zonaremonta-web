'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, Calculator, ShoppingBag, UserCircle2, type LucideIcon } from 'lucide-react';
import { useCart } from '@/lib/cart';

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
  badge?: number;
}

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
  const { count } = useCart();

  const TABS: readonly Tab[] = [
    { href: '/', label: 'Главная', icon: Home, isActive: (p) => p === '/' },
    { href: '/services', label: 'Услуги', icon: Wrench, isActive: (p) => p.startsWith('/services') },
    { href: '/calculator', label: 'Расчёт', icon: Calculator, isActive: (p) => p.startsWith('/calculator') },
    {
      href: count > 0 ? '/cart' : '/catalog',
      label: count > 0 ? 'Корзина' : 'Магазин',
      icon: ShoppingBag,
      isActive: (p) => p.startsWith('/catalog') || p.startsWith('/cart'),
      badge: count,
    },
    { href: '/lk', label: 'Кабинет', icon: UserCircle2, isActive: (p) => p.startsWith('/lk') },
  ];

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none pb-safe"
      aria-label="Навигация"
    >
      <div className="mx-3 pointer-events-auto">
        {/*
          iOS 26 Liquid Glass:
          — низкий blur + высокая saturation, чтобы стекло было прозрачнее
          — яркий top-edge highlight (0.5px свет сверху)
          — мягкий bottom-edge dim
          — НЕТ outline-border по всему контуру
        */}
        <nav
          className="grid grid-cols-5 p-1.5 relative overflow-hidden isolate"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(24px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
            borderRadius: 28,
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.22) inset,' +
              '0 -0.5px 0 rgba(0,0,0,0.2) inset,' +
              '0 18px 36px -12px rgba(0,0,0,0.5)',
          }}
        >
          {/* Мягкий зеркальный блик сверху — как на iOS */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-[45%] pointer-events-none -z-10"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.11) 0%, transparent 100%)',
              borderRadius: '28px 28px 0 0',
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
                className="relative h-14 flex flex-col items-center justify-center gap-1 rounded-[20px] active:scale-[0.92] transition-transform"
                style={
                  active
                    ? {
                        background:
                          'linear-gradient(180deg, rgba(255,62,79,0.28) 0%, rgba(232,18,36,0.44) 100%)',
                        boxShadow:
                          '0 1px 0 rgba(255,255,255,0.26) inset, 0 8px 22px -6px rgba(232,18,36,0.6)',
                      }
                    : undefined
                }
              >
                <div className="relative">
                  <Icon
                    strokeWidth={active ? 2.4 : 1.9}
                    className={`w-[20px] h-[20px] transition-colors ${
                      active ? 'text-white' : 'text-white/60'
                    }`}
                  />
                  {t.badge && t.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF3E4F] text-white text-[9px] font-bold grid place-items-center leading-none">
                      {t.badge}
                    </span>
                  ) : null}
                </div>
                <span
                  className={`text-[10px] font-semibold leading-none uppercase tracking-[0.04em] ${
                    active ? 'text-white' : 'text-white/60'
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
