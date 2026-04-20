'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, LayoutGroup } from 'framer-motion';
import { Home, Wrench, Calculator, Package, UserCircle2 } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Главная', icon: Home, match: (p: string) => p === '/' },
  { href: '/services', label: 'Услуги', icon: Wrench, match: (p: string) => p.startsWith('/services') },
  { href: '/#calc', label: 'Расчёт', icon: Calculator, match: () => false },
  { href: '/catalog', label: 'Каталог', icon: Package, match: (p: string) => p.startsWith('/catalog') },
  { href: '/lk', label: 'Кабинет', icon: UserCircle2, match: (p: string) => p.startsWith('/lk') },
];

export function MobileTabBar() {
  const pathname = usePathname() ?? '/';

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 pointer-events-none pb-safe">
      <div className="mx-3 pointer-events-auto">
        <LayoutGroup>
          <motion.nav
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220, delay: 0.2 }}
            className="liquid-glass flex items-stretch justify-between gap-1 p-2"
            style={{ borderRadius: 32 }}
          >
            {tabs.map((t) => {
              const active = t.match(pathname);
              const Icon = t.icon;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="relative flex-1 min-w-0 h-14 flex flex-col items-center justify-center gap-0.5 rounded-[24px] overflow-hidden"
                >
                  {active && (
                    <motion.span
                      layoutId="tab-active-bg"
                      transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                      className="absolute inset-0 -z-10"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(255,62,79,0.14) 0%, rgba(232,18,36,0.22) 100%)',
                        border: '1px solid rgba(232,18,36,0.25)',
                        borderRadius: 24,
                        boxShadow:
                          '0 1px 0 rgba(255,255,255,0.7) inset, 0 8px 20px -8px rgba(232,18,36,0.35)',
                      }}
                    />
                  )}
                  <motion.span
                    animate={{
                      scale: active ? 1.05 : 1,
                      y: active ? -1 : 0,
                    }}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: 'spring', damping: 16, stiffness: 320 }}
                    className="relative"
                  >
                    <Icon
                      strokeWidth={active ? 2.3 : 2}
                      className={`w-[22px] h-[22px] transition-colors ${
                        active ? 'text-primary' : 'text-ink-70'
                      }`}
                    />
                    {active && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -inset-2 rounded-full bg-primary/20 blur-lg -z-10"
                      />
                    )}
                  </motion.span>
                  <motion.span
                    animate={{ opacity: active ? 1 : 0.65 }}
                    className={`text-[10px] leading-none font-medium tracking-tight ${
                      active ? 'text-primary' : 'text-ink-70'
                    }`}
                  >
                    {t.label}
                  </motion.span>
                </Link>
              );
            })}
          </motion.nav>
        </LayoutGroup>
      </div>
    </div>
  );
}
