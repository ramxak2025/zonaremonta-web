import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HexIcon } from '@/components/HexIcon';
import { Settings, Users, Wrench, Package, Banknote, UserCog, BookOpen, FileText } from 'lucide-react';

export const metadata = { robots: { index: false, follow: false }, title: 'Админка' };

const sections = [
  { href: '/admin/settings', title: 'Настройки сайта', text: 'Баннер, цены топлива, контакты, отзывы', icon: Settings, ready: true },
  { href: '/admin/crm', title: 'CRM', text: 'База клиентов и авто, тэги, фильтры', icon: Users, ready: false },
  { href: '/admin/appointments', title: 'Заявки', text: 'Лента звонков и запись на сервис', icon: Wrench, ready: false },
  { href: '/admin/inventory', title: 'Склад', text: 'Позиции, приходы, остатки', icon: Package, ready: false },
  { href: '/admin/finance', title: 'Финансы', text: 'Касса, отчёты, зарплаты мастеров', icon: Banknote, ready: false },
  { href: '/admin/masters', title: 'Мастера', text: 'Загрузка, скорость, аудит', icon: UserCog, ready: false },
  { href: '/admin/content', title: 'Контент', text: 'Блог, FAQ, отзывы, сертификаты', icon: BookOpen, ready: false },
  { href: '/admin/instructions', title: 'Инструкции', text: 'Фото, VK-видео, база знаний', icon: FileText, ready: false },
];

export default function AdminDashboard() {
  return (
    <>
      <Header />
      <main className="section py-10">
        <span className="chip"><HexIcon size={12} className="text-primary" />Директор</span>
        <h1 className="h-section text-white mt-2">Панель управления</h1>
        <p className="text-white/60 mt-1 text-sm">Выберите раздел.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.ready ? s.href : '#'}
              className={`liquid-glass relative overflow-hidden p-5 sm:p-6 transition-transform ${s.ready ? 'hover:-translate-y-1' : 'opacity-60 pointer-events-none'}`}
            >
              <HexIcon size={180} filled={false} className="absolute -right-10 -bottom-10 text-white/[0.04]" />
              <span className="w-11 h-11 rounded-2xl grid place-items-center bg-primary/20 border border-primary/30 relative">
                <s.icon className="w-5 h-5 text-primary" strokeWidth={2.2} />
              </span>
              <h3 className="font-display text-lg mt-4 text-white">{s.title}</h3>
              <p className="text-white/55 text-sm mt-1">{s.text}</p>
              <span className={`chip !py-0.5 !px-2 !text-[9px] mt-3 ${s.ready ? '!bg-secondary/15 !border-secondary/30' : ''}`}>
                {s.ready ? 'Готово' : 'Во второй итерации'}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
