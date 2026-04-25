'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, Calculator, ShoppingBag, Phone, type LucideIcon } from 'lucide-react';
import { useCart } from '@/lib/cart';

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (p: string) => boolean;
  badge?: number;
}

export function MobileNav() {
  const pathname = usePathname() ?? '/';
  const { count } = useCart();

  const tabs: Tab[] = [
    { href: '/', label: 'Главная', icon: Home, match: (p) => p === '/' },
    { href: '/services', label: 'Услуги', icon: Wrench, match: (p) => p.startsWith('/services') },
    { href: '/calculator', label: 'Расчёт', icon: Calculator, match: (p) => p.startsWith('/calculator') },
    {
      href: count > 0 ? '/cart' : '/catalog',
      label: count > 0 ? 'Корзина' : 'Магазин',
      icon: ShoppingBag,
      match: (p) => p.startsWith('/catalog') || p.startsWith('/cart'),
      badge: count,
    },
    { href: '/#contact', label: 'Контакт', icon: Phone, match: (p) => p === '/contact' },
  ];

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
        {tabs.map((t) => {
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
              <div className="relative">
                <Icon
                  strokeWidth={active ? 2.4 : 1.9}
                  className={`w-5 h-5 ${active ? 'text-white' : 'text-white/65'}`}
                />
                {t.badge && t.badge > 0 ? (
                  <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF3E4F] text-white text-[9px] font-bold grid place-items-center leading-none">
                    {t.badge}
                  </span>
                ) : null}
              </div>
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
