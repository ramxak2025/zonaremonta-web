'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { SITE } from '@/lib/site';
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phoneDigits = SITE.phone.replace(/[^\d+]/g, '');

  return (
    <>
      {/* ============ DESKTOP ============ */}
      <header className="hidden md:block sticky top-0 z-40 pt-3">
        <div className="section">
          <div
            className="h-16 pl-5 pr-2 flex items-center justify-between transition-all duration-300"
            style={{
              background: scrolled ? 'rgba(19, 19, 30, 0.78)' : 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(24px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
              border: `1px solid ${scrolled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 999,
              boxShadow:
                '0 1px 0 rgba(255,255,255,0.14) inset, 0 12px 30px -12px rgba(0,0,0,0.4)',
            }}
          >
            <Link href="/" aria-label="Зона Ремонта — на главную" className="flex-none">
              <Logo size="sm" />
            </Link>

            <nav className="flex items-center gap-0.5 mx-4">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-3.5 py-2 rounded-full text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* USP-группа: график + телефон */}
            <div className="flex items-center gap-3 flex-none">
              <div className="hidden lg:flex items-center gap-1.5 text-[12px] text-white/55">
                <Clock className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Пн–Сб · 9:00–20:00</span>
              </div>
              <div className="flex flex-col items-end leading-none">
                <span className="text-[10px] uppercase tracking-[0.15em] text-white/45 font-semibold">
                  Перезвоним за 15 минут
                </span>
                <a
                  href={`tel:${phoneDigits}`}
                  className="font-display font-bold text-white text-[18px] tracking-tight mt-0.5 hover:text-[#FF3E4F] transition-colors whitespace-nowrap"
                >
                  {SITE.phone}
                </a>
              </div>
              <a
                href={`tel:${phoneDigits}`}
                className="btn btn-primary !h-11 !w-11 !p-0 !rounded-full"
                aria-label="Позвонить"
              >
                <PhoneFilledIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ============ MOBILE ============ */}
      <header className="md:hidden sticky top-0 z-40 pt-safe">
        <div className="px-3">
          <div
            className="h-14 pl-4 pr-1.5 flex items-center justify-between transition-all duration-300"
            style={{
              background: scrolled ? 'rgba(19, 19, 30, 0.82)' : 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(20px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
              border: `1px solid ${scrolled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 999,
              boxShadow:
                '0 1px 0 rgba(255,255,255,0.12) inset, 0 10px 28px -12px rgba(0,0,0,0.55)',
            }}
          >
            <Link href="/" aria-label="Зона Ремонта — на главную">
              <Logo size="xs" />
            </Link>
            <a
              href={`tel:${phoneDigits}`}
              aria-label="Позвонить"
              className="h-11 px-4 rounded-full text-white text-[12px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 active:scale-95 transition-transform"
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

          {/* USP-подпись под шапкой на mobile */}
          <div className="mt-1.5 px-4 flex items-center justify-between text-[10px] text-white/45 font-semibold uppercase tracking-[0.12em]">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Пн–Сб · 9:00–20:00
            </span>
            <span>Перезвоним за 15 мин</span>
          </div>
        </div>
      </header>
    </>
  );
}
