'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';
import { Logo } from './Logo';
import { PhoneFilledIcon } from './BrandIcons';

const NAV = [
  { href: '/#services', label: 'Услуги' },
  { href: '/#calc', label: 'Калькулятор' },
  { href: '/#contact', label: 'Контакты' },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phoneDigits = SITE.phone.replace(/[^\d+]/g, '');

  return (
    <>
      {/* DESKTOP */}
      <header
        className={`hidden md:block sticky top-0 z-40 transition-colors ${
          scrolled
            ? 'bg-[rgba(10,10,12,0.85)] backdrop-blur-xl border-b border-white/5'
            : ''
        }`}
      >
        <div className="section h-20 flex items-center justify-between">
          <Link href="/" aria-label="Зона Ремонта — на главную">
            <Logo size="sm" />
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-4 py-2 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <a
            href={`tel:${phoneDigits}`}
            className="btn btn-primary !h-10 !px-4 !text-[13px]"
            aria-label={`Позвонить: ${SITE.phone}`}
          >
            <PhoneFilledIcon className="w-4 h-4" />
            <span>{SITE.phone}</span>
          </a>
        </div>
      </header>

      {/* MOBILE — плавающий pill: логотип + круглая кнопка звонка */}
      <header className="md:hidden sticky top-0 z-40 pt-safe">
        <div className="px-3">
          <div
            className="h-14 pl-4 pr-1.5 flex items-center justify-between"
            style={{
              background: 'rgba(10,10,12,0.75)',
              backdropFilter: 'blur(20px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 999,
              boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 10px 30px -12px rgba(0,0,0,0.55)',
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
        </div>
      </header>
    </>
  );
}
