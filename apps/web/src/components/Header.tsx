'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { SITE } from '@/lib/site';

const nav = [
  { href: '/services', label: 'Услуги' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/blog', label: 'Блог' },
  { href: '/#contacts', label: 'Контакты' },
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
      {/* DESKTOP header — floating pill */}
      <header className="hidden md:block sticky top-0 z-50 transition-all duration-300">
        <div className={`section mt-3 ${scrolled ? 'py-0' : ''}`}>
          <div className="liquid-glass pill px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 font-display text-[17px] font-semibold">
              <LogoMark />
              <span>Зона Ремонта</span>
              <span className="text-ink-50 text-sm font-normal">05auto</span>
            </Link>
            <nav className="flex items-center gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-4 py-2 rounded-full text-sm text-ink-70 hover:text-ink hover:bg-white/70 transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <a href={`tel:${phoneDigits}`} className="btn-glass !h-10 !px-4 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-medium">{SITE.phone}</span>
              </a>
              <Link href="/lk" className="btn-primary !h-10 !px-5 text-sm">
                Кабинет
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE top island — только логотип + быстрая кнопка звонка */}
      <header className="md:hidden sticky top-0 z-50 pt-safe">
        <div className="px-3 pt-3">
          <div className="liquid-glass pill px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-[15px] font-semibold"
            >
              <LogoMark />
              <span>Зона Ремонта</span>
            </Link>
            <a
              href={`tel:${phoneDigits}`}
              className="flex items-center gap-1.5 h-10 px-3.5 rounded-full text-white text-[13px] font-semibold active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(180deg, #FF3E4F 0%, #E81224 100%)',
                boxShadow:
                  '0 1px 0 rgba(255,255,255,0.4) inset, 0 8px 18px -6px rgba(232,18,36,0.55)',
              }}
              aria-label="Позвонить"
            >
              <Phone className="w-4 h-4" />
              Позвонить
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

function LogoMark() {
  return (
    <span
      className="relative inline-block w-8 h-8 rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E81224 0%, #FF3E4F 100%)',
        boxShadow: '0 6px 14px -6px rgba(232,18,36,0.6), 0 1px 0 rgba(255,255,255,0.4) inset',
      }}
      aria-hidden
    >
      <span className="absolute inset-x-1 top-1 h-2 rounded-md bg-white/40 blur-[1px]" />
    </span>
  );
}
