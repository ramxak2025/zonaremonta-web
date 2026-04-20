import Link from 'next/link';
import { SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="bg-ink text-white/80 mt-24">
      <div className="section py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-display text-xl text-white">Зона Ремонта</div>
          <p className="mt-3 text-sm text-white/60 max-w-xs">
            Установка и обслуживание ГБО в Махачкале. Гарантия на работы 1 год.
          </p>
        </div>
        <div>
          <h3 className="text-white font-medium mb-3">Навигация</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services">Услуги</Link></li>
            <li><Link href="/catalog">Каталог</Link></li>
            <li><Link href="/blog">Блог</Link></li>
            <li><Link href="/lk">Личный кабинет</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-medium mb-3">Документы</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy">Политика конфиденциальности</Link></li>
            <li><Link href="/terms">Пользовательское соглашение</Link></li>
            <li><Link href="/cookies">Использование cookies</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-medium mb-3">Контакты</h3>
          <ul className="space-y-2 text-sm">
            <li>{SITE.address}</li>
            <li><a href={`tel:${SITE.phone.replace(/[^\d+]/g, '')}`}>{SITE.phone}</a></li>
            <li>{SITE.workingHours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <span>© {new Date().getFullYear()} «Зона Ремонта» / 05auto. Все права защищены.</span>
          <span>Сделано с заботой о клиентах.</span>
        </div>
      </div>
    </footer>
  );
}
