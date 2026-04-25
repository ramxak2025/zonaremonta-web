'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { SITE } from '@/lib/site';
import { useCart } from '@/lib/cart';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { PhoneIcon } from '@/components/ui/PhoneIcon';

const NAV = [
  { href: '/services', label: 'Услуги' },
  { href: '/calculator', label: 'Калькулятор' },
  { href: '/catalog', label: 'Магазин' },
  { href: '/#contact', label: 'Контакты' },
];

export function Header() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phoneDigits = SITE.phone.replace(/[^\d+]/g, '');
  const bg = scrolled ? 'rgba(20, 20, 26, 0.85)' : 'rgba(255,255,255,0.04)';

  return (
    <header className="sticky top-0 z-40 pt-3">
      <Container>
        <div
          className="flex items-center gap-3 h-14 md:h-16 pl-4 pr-1.5 md:pl-5 md:pr-2 rounded-full transition-colors"
          style={{
            background: bg,
            backdropFilter: 'blur(18px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.1) inset, 0 8px 24px -10px rgba(0,0,0,0.5)',
          }}
        >
          <Link href="/" aria-label="На главную" className="flex-shrink-0">
            <Logo size="sm" className="md:hidden" />
            <Logo size="md" className="hidden md:inline-flex" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
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

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/cart"
              aria-label={`Корзина${count > 0 ? `: ${count}` : ''}`}
              className="relative w-11 h-11 rounded-full grid place-items-center bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-colors"
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
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-full text-white text-[12px] font-bold uppercase tracking-wider transition-transform active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #FF3E4F 0%, #E81224 100%)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.3) inset, 0 8px 18px -6px rgba(232,18,36,0.6)',
                letterSpacing: '0.06em',
              }}
            >
              <PhoneIcon className="w-4 h-4" />
              Звонок
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
