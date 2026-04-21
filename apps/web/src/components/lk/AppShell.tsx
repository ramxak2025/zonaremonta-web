'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '../Logo';
import { clearToken, type Me } from '@/lib/auth-client';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export function AppShell({
  nav, me, title, children,
}: {
  nav: readonly NavItem[];
  me: Me | null;
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);

  const roleLabel =
    me?.role === 'DIRECTOR' ? 'Директор' : me?.role === 'MASTER' ? 'Мастер' : 'Клиент';

  function logout() {
    clearToken();
    window.location.href = '/lk';
  }

  return (
    <div className="min-h-dvh">
      {/* ===== Desktop Sidebar ===== */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-dvh w-64 z-30 border-r border-white/5"
        style={{ background: 'rgba(12, 12, 18, 0.85)', backdropFilter: 'blur(20px)' }}
      >
        <div className="p-6">
          <Link href="/" aria-label="На главную">
            <Logo size="sm" />
          </Link>
        </div>
        <div className="px-4 text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-3">
          {roleLabel}
        </div>
        <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
          {nav.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + '/');
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors ${
                  active
                    ? 'bg-primary/15 border border-primary/30 text-white'
                    : 'text-white/65 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <n.icon className="w-4 h-4 flex-none" strokeWidth={2} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Выход
          </button>
        </div>
      </aside>

      {/* ===== Mobile top bar ===== */}
      <header
        className="lg:hidden sticky top-0 z-30 h-14 px-3 flex items-center justify-between border-b border-white/5"
        style={{ background: 'rgba(10, 10, 16, 0.85)', backdropFilter: 'blur(20px)' }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-10 h-10 grid place-items-center rounded-xl bg-white/[0.04] border border-white/10"
          aria-label="Меню"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
        <Link href="/" aria-label="На главную">
          <Logo size="xs" />
        </Link>
        <button
          type="button"
          onClick={logout}
          className="w-10 h-10 grid place-items-center rounded-xl bg-white/[0.04] border border-white/10"
          aria-label="Выход"
        >
          <LogOut className="w-4 h-4 text-white/75" />
        </button>
      </header>

      {/* ===== Mobile drawer ===== */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside
            className="relative ml-0 w-72 h-full flex flex-col border-r border-white/5"
            style={{ background: 'rgba(10, 10, 16, 0.95)' }}
          >
            <div className="p-5 flex items-center justify-between">
              <Logo size="sm" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-9 h-9 grid place-items-center rounded-xl bg-white/[0.04]"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="px-4 text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-3">
              {roleLabel}
            </div>
            <nav className="flex-1 px-3 flex flex-col gap-1">
              {nav.map((n) => {
                const active = pathname === n.href || pathname.startsWith(n.href + '/');
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] ${
                      active
                        ? 'bg-primary/15 border border-primary/30 text-white'
                        : 'text-white/70 hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <n.icon className="w-4 h-4 flex-none" strokeWidth={2} />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* ===== Content ===== */}
      <main className="lg:ml-64 min-h-dvh">
        <div className="px-4 sm:px-6 lg:px-10 py-6 md:py-10">
          <h1 className="h-1 text-white mb-6 md:mb-8">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
