import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { SITE, getContactLinks } from '@/lib/site';

export function Footer() {
  const l = getContactLinks();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 md:mt-24 border-t border-white/[0.06] bg-black/30">
      <Container>
        <div className="py-10 md:py-14 grid gap-8 md:grid-cols-3">
          <div>
            <Logo size="md" />
            <p className="mt-4 text-[13px] text-white/55 leading-relaxed max-w-[28ch]">
              {SITE.description}
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mb-4">
              Навигация
            </div>
            <ul className="flex flex-col gap-2.5 text-[14px] text-white/75">
              <li><Link href="/services" className="hover:text-white">Услуги</Link></li>
              <li><Link href="/calculator" className="hover:text-white">Калькулятор</Link></li>
              <li><Link href="/catalog" className="hover:text-white">Магазин</Link></li>
              <li><Link href="/#contact" className="hover:text-white">Контакты</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mb-4">
              Контакты
            </div>
            <ul className="flex flex-col gap-2.5 text-[14px] text-white/75">
              <li><a href={l.phoneHref} className="hover:text-white">{SITE.phone}</a></li>
              <li><a href={l.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></li>
              <li className="text-white/55 text-[13px]">{SITE.address}</li>
              <li className="text-white/55 text-[13px]">{SITE.workingHours}</li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[12px] text-white/40">
          <div>© {year} {SITE.name}. Все права защищены.</div>
          <div>Установка ГБО · Махачкала · {SITE.domain}</div>
        </div>
      </Container>
    </footer>
  );
}
