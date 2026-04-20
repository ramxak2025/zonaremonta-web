'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, LayoutGroup } from 'framer-motion';
import { Home, Wrench, Calculator, Package, UserCircle2 } from 'lucide-react';
import { HexIcon } from './HexIcon';

const tabs = [
  { href: '/', label: 'Главная', icon: Home, match: (p: string) => p === '/' },
  { href: '/services', label: 'Услуги', icon: Wrench, match: (p: string) => p.startsWith('/services') },
  { href: '/#calc', label: 'Расчёт', icon: Calculator, match: () => false },
  { href: '/catalog', label: 'Каталог', icon: Package, match: (p: string) => p.startsWith('/catalog') },
  { href: '/lk', label: 'Кабинет', icon: UserCircle2, match: (p: string) => p.startsWith('/lk') },
];

function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(8);
    } catch {}
  }
}

export function MobileTabBar() {
  const pathname = usePathname() ?? '/';

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 pointer-events-none pb-safe">
      <div className="mx-3 pointer-events-auto">
        <LayoutGroup id="tabbar">
          <motion.nav
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220, delay: 0.25 }}
            className="liquid-glass-strong liquid-glass flex items-stretch justify-between gap-1 p-2 relative"
            style={{ borderRadius: 30 }}
          >
            {tabs.map((t) => {
              const active = t.match(pathname);
              const Icon = t.icon;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  onClick={haptic}
                  className="relative flex-1 min-w-0 h-14 flex flex-col items-center justify-center gap-0.5 rounded-[22px] overflow-visible"
                  aria-current={active ? 'page' : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-active"
                      transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                      className="absolute inset-0 -z-10"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(255,62,79,0.22) 0%, rgba(232,18,36,0.35) 100%)',
                        border: '1px solid rgba(232,18,36,0.45)',
                        borderRadius: 22,
                        boxShadow:
                          '0 1px 0 rgba(255,255,255,0.15) inset, 0 10px 24px -8px rgba(232,18,36,0.55), 0 0 30px -4px rgba(232,18,36,0.35)',
                      }}
                    />
                  )}

                  {/* Icon в hex-рамке для фирменного стиля */}
                  <motion.span
                    whileTap={{ scale: 0.82 }}
                    animate={{ scale: active ? 1.06 : 1, y: active ? -1 : 0 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 320 }}
                    className="relative grid place-items-center w-[28px] h-[28px]"
                  >
                    {/* фоновый hex для активного — рисуем тонкую hex-обводку */}
                    {active && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 18 }}
                        className="absolute inset-0"
                      >
                        <HexIcon size={28} filled={false} className="text-primary/60" />
                      </motion.span>
                    )}
                    <Icon
                      strokeWidth={active ? 2.4 : 1.9}
                      className={`w-[19px] h-[19px] relative transition-colors ${
                        active ? 'text-white' : 'text-white/55'
                      }`}
                    />
                  </motion.span>

                  <motion.span
                    animate={{ opacity: active ? 1 : 0.55 }}
                    className={`text-[10px] leading-none font-semibold tracking-tight uppercase ${
                      active ? 'text-white' : 'text-white/55'
                    }`}
                    style={{ letterSpacing: '0.04em' }}
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
