import Link from 'next/link';
import { SITE } from '@/lib/site';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-12 md:mt-20 border-t border-white/5 bg-[#0A0A0C]">
      <div className="section py-10 md:py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size="sm" />
          <p className="mt-5 text-sm text-white/55 max-w-sm leading-relaxed">
            Автосервис ГБО в Махачкале. Ставим на распределённый, прямой и комбинированный впрыск.
            Оборудование Lovato, BRC, Prins, OMVL. Гарантия 1 год.
          </p>
        </div>
        <nav>
          <h3 className="text-[11px] uppercase tracking-widest text-white/40 mb-4">Сайт</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href="/#services" className="hover:text-white">Услуги</Link></li>
            <li><Link href="/calculator" className="hover:text-white">Калькулятор</Link></li>
            <li><Link href="/#contact" className="hover:text-white">Контакты</Link></li>
            <li><Link href="/lk" className="hover:text-white">Личный кабинет</Link></li>
          </ul>
        </nav>
        <nav>
          <h3 className="text-[11px] uppercase tracking-widest text-white/40 mb-4">Документы</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href="/privacy" className="hover:text-white">Политика</Link></li>
            <li><Link href="/terms" className="hover:text-white">Соглашение</Link></li>
            <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/5">
        <div className="section py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/35">
          <span>© {new Date().getFullYear()} Зона Ремонта · 05auto.ru</span>
          <span>{SITE.address}</span>
        </div>
      </div>
    </footer>
  );
}
