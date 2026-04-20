import Link from 'next/link';
import { SITE } from '@/lib/site';
import { Logo } from './Logo';
import { HexIcon } from './HexIcon';

export function Footer() {
  return (
    <footer className="relative mt-16 sm:mt-24 overflow-hidden">
      <div className="hex-divider opacity-50" />
      <div className="section py-12 sm:py-16 relative">
        <HexIcon
          size={400}
          filled={false}
          className="absolute -right-32 -top-20 text-white/[0.03] pointer-events-none"
        />
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm text-white/60 max-w-xs leading-relaxed">
              Установка и обслуживание ГБО в Махачкале. Гарантия на работы 1 год.
            </p>
          </div>
          <nav>
            <h3 className="text-white font-display text-sm uppercase tracking-[0.2em] mb-4">Навигация</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/services" className="hover:text-white transition-colors">Услуги</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Блог</Link></li>
              <li><Link href="/lk" className="hover:text-white transition-colors">Личный кабинет</Link></li>
            </ul>
          </nav>
          <nav>
            <h3 className="text-white font-display text-sm uppercase tracking-[0.2em] mb-4">Документы</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Политика</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Соглашение</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </nav>
          <div>
            <h3 className="text-white font-display text-sm uppercase tracking-[0.2em] mb-4">Контакты</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>{SITE.address}</li>
              <li>
                <a href={`tel:${SITE.phone.replace(/[^\d+]/g, '')}`} className="hover:text-white transition-colors">
                  {SITE.phone}
                </a>
              </li>
              <li>{SITE.workingHours}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="section py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© {new Date().getFullYear()} «Зона Ремонта» / 05auto</span>
          <span>Сделано с заботой о клиентах.</span>
        </div>
      </div>
    </footer>
  );
}
