'use client';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { SITE } from '@/lib/site';

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="section flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="inline-block w-8 h-8 rounded-xl bg-accent-gradient shadow-lift" aria-hidden />
          <span>Зона Ремонта</span>
          <span className="text-ink-50 text-sm">05auto</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/services" className="hover:text-primary transition-colors">Услуги</Link>
          <Link href="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
          <Link href="/blog" className="hover:text-primary transition-colors">Блог</Link>
          <Link href="/#contacts" className="hover:text-primary transition-colors">Контакты</Link>
        </nav>
        <div className="flex items-center gap-3">
          <a href={`tel:${SITE.phone.replace(/[^\d+]/g, '')}`} className="hidden sm:inline-flex items-center gap-2 text-sm font-medium">
            <Phone className="w-4 h-4 text-primary" />
            <span>{SITE.phone}</span>
          </a>
          <Link href="/lk" className="btn-primary text-sm">Личный кабинет</Link>
        </div>
      </div>
    </header>
  );
}
