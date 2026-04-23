'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Clock, ShoppingBag } from 'lucide-react';
import { SITE } from '@/lib/site';
import { useCart } from '@/lib/cart';
import { Logo } from './Logo';
import { PhoneFilledIcon } from './BrandIcons';

const NAV = [
  { href: '/#services', label: 'Услуги' },
  { href: '/calculator', label: 'Калькулятор' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/#contact', label: 'Контакты' },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phoneDigits = SITE.phone.replace(/[^\d+]/g, '');

  return (
    <>
      {/* ============ DESKTOP (lg+) ============ */}
      <header className="hidden lg:block sticky top-0 z-40 pt-3">
        <div className="section">
          <div
            className="h-16 px-5 pr-2 flex items-center gap-4 transition-all duration-300 pill"
            style={{
              background: scrolled ? 'rgba(19, 19, 30, 0.78)' : 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(20px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
              border: `1px solid ${scrolled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow:
                '0 1px 0 rgba(255,255,255,0.12) inset, 0 12px 30px -12px rgba(0,0,0,0.4)',
            }}
          >
            <Link href="/" aria-label="Зона Ремонта" className="flex-shrink-0">
              <Logo size="sm" />
            </Link>

            <nav className="flex items-center gap-1 flex-1 justify-center">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-3 py-2 rounded-full text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="hidden xl:flex items-center gap-1.5 text-[12px] text-white/55 whitespace-nowrap">
                <Clock className="w-3.5 h-3.5" />
                Пн–Сб · 9:00–20:00
              </div>
              <Link
                href="/cart"
                aria-label={`Корзина${count > 0 ? `: ${count}` : ''}`}
                className="relative w-11 h-11 rounded-full grid place-items-center bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
              >
                <ShoppingBag className="w-5 h-5 text-white/80" strokeWidth={2} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-[#FF3E4F] text-white text-[10px] font-bold grid place-items-center leading-none">
                    {count}
                  </span>
                )}
              </Link>
              <div className="flex flex-col items-end leading-none">
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/45 font-semibold">
                  Перезвоним за 15 минут
                </span>
                <a
                  href={`tel:${phoneDigits}`}
                  className="font-display font-bold text-white text-[17px] tracking-tight mt-1 hover:text-[#FF3E4F] transition-colors whitespace-nowrap"
                >
                  {SITE.phone}
                </a>
              </div>
              <a
                href={`tel:${phoneDigits}`}
                className="btn btn-primary btn-sm !w-11 !px-0 !rounded-full"
                aria-label="Позвонить"
              >
                <PhoneFilledIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ============ MOBILE (<lg) ============ */}
      <header className="lg:hidden sticky top-0 z-40 pt-safe">
        <div className="px-3">
          <div
            className="h-14 pl-4 pr-1.5 flex items-center justify-between gap-3 transition-all duration-300 pill"
            style={{
              background: scrolled ? 'rgba(19, 19, 30, 0.82)' : 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(16px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.5)',
              border: `1px solid ${scrolled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow:
                '0 1px 0 rgba(255,255,255,0.12) inset, 0 10px 28px -12px rgba(0,0,0,0.55)',
            }}
          >
            <Link href="/" aria-label="Зона Ремонта" className="flex-shrink-0">
              <Logo size="xs" />
            </Link>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href="/cart"
                aria-label={`Корзина${count > 0 ? `: ${count}` : ''}`}
                className="relative w-11 h-11 rounded-full grid place-items-center bg-white/[0.04] border border-white/[0.08] active:scale-95 transition-transform"
              >
                <ShoppingBag className="w-5 h-5 text-white/85" strokeWidth={2} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-[#FF3E4F] text-white text-[10px] font-bold grid place-items-center leading-none">
                    {count}
                  </span>
                )}
              </Link>
              <a
                href={`tel:${phoneDigits}`}
                aria-label="Позвонить"
                className="flex items-center gap-1.5 h-11 px-4 rounded-full text-white text-[12px] font-bold uppercase tracking-wider active:scale-95 transition-transform"
                style={{
                  background: 'linear-gradient(180deg, #FF3E4F 0%, #E81224 100%)',
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.35) inset, 0 8px 18px -6px rgba(232,18,36,0.6)',
                  letterSpacing: '0.06em',
                }}
              >
                <PhoneFilledIcon className="w-4 h-4" />
                Звонок
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
