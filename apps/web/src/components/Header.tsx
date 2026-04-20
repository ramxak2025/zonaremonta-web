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
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'bg-[rgba(10,10,12,0.82)] backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="section h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Зона Ремонта — на главную">
          <Logo size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
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
          <span className="hidden sm:inline">{SITE.phone}</span>
          <span className="sm:hidden">Звонок</span>
        </a>
      </div>
    </header>
  );
}
