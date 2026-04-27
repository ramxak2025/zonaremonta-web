import type { Metadata } from 'next';
import Link from 'next/link';
import { LayoutDashboard, Wrench, Info, MapPin, ImageIcon, LogOut } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Админка — Зона Ремонта',
  robots: { index: false, follow: false },
};

const NAV = [
  { href: '/admin',         label: 'Дашборд',    icon: LayoutDashboard },
  { href: '/admin/services', label: 'Услуги и цены', icon: Wrench },
  { href: '/admin/about',    label: 'О сервисе',  icon: Info },
  { href: '/admin/contact',  label: 'Контакты',   icon: MapPin },
  { href: '/admin/works',    label: 'Наши работы', icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh -mt-[68px] md:-mt-[80px] bg-[#0A0A10]">
      <div className="grid lg:grid-cols-[260px_1fr] min-h-dvh">
        {/* Sidebar */}
        <aside
          className="hidden lg:flex flex-col gap-1 p-5 border-r border-white/[0.08]"
          style={{ background: 'rgba(20,20,26,0.6)' }}
        >
          <div className="px-3 py-3 mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF3E4F]">
              Админка
            </div>
            <div className="font-display font-bold text-white text-[18px] leading-tight mt-1">
              Зона Ремонта
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-white/75 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <form action="/api/admin/logout" method="POST" className="mt-auto">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-white/55 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </form>
        </aside>

        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 px-4 pt-3 pb-3 border-b border-white/[0.08] bg-[#0A0A10]">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="font-display font-bold text-white text-[16px] uppercase tracking-tight">
              Админка
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="text-[12px] text-white/55 px-3 py-1.5 rounded-full border border-white/10">
                Выйти
              </button>
            </form>
          </div>
          <nav className="flex gap-2 mt-3 overflow-x-auto -mx-1 px-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="whitespace-nowrap text-[12px] px-3 py-1.5 rounded-full text-white/70 hover:text-white bg-white/[0.05] border border-white/[0.08]"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main */}
        <main className="p-4 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
