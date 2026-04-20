'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';
import { Logo } from './Logo';
import { PhoneFilledIcon } from './BrandIcons';

const nav = [
  { href: '/services', label: 'Услуги' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/blog', label: 'Блог' },
  { href: '/#contact', label: 'Контакты' },
];

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
      <header className="hidden md:block sticky top-0 z-40 transition-all duration-300">
        <div className={`section mt-3 ${scrolled ? 'py-0' : ''}`}>
          <div className="liquid-glass pill px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center" aria-label="Зона Ремонта">
              <Logo size="md" />
            </Link>
            <nav className="flex items-center gap-1">
              {nav.map((n) => (
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
              className="btn btn-primary shine-hover !h-10 !px-5 text-sm"
            >
              <PhoneFilledIcon className="w-4 h-4" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </header>

      {/* MOBILE top */}
      <header className="md:hidden sticky top-0 z-40 pt-safe">
        <div className="px-2.5">
          <div className="liquid-glass pill pl-3 pr-2 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="Зона Ремонта"
            >
              <Logo size="xs" />
            </Link>
            <a
              href={`tel:${phoneDigits}`}
              aria-label="Позвонить"
              className="flex items-center gap-1.5 h-10 px-3.5 rounded-full text-white text-[12px] font-bold uppercase tracking-wider active:scale-95 transition-transform relative overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #FF3E4F 0%, #E81224 100%)',
                boxShadow:
                  '0 1px 0 rgba(255,255,255,0.35) inset, 0 8px 18px -6px rgba(232,18,36,0.6), 0 0 0 1px rgba(232,18,36,0.4)',
                letterSpacing: '0.06em',
              }}
            >
              <span
                aria-hidden
                className="absolute inset-x-1 top-1 h-3 rounded-xl pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35), transparent)' }}
              />
              <PhoneFilledIcon className="w-4 h-4 relative" />
              <span className="relative">Звонок</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
