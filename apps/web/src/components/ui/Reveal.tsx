'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Задержка появления в мс — для ступенчатого ввода. */
  delay?: number;
  /** Направление скольжения. По умолчанию снизу. */
  from?: 'bottom' | 'left' | 'right';
  /** Доп. классы. */
  className?: string;
  /** Если true — анимация только один раз и выключается. */
  once?: boolean;
}

/**
 * Лёгкая reveal-анимация на IntersectionObserver. Никаких внешних библиотек.
 * Будет no-op если у пользователя prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, from = 'bottom', className = '', once = true }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Уважаем reduced-motion — сразу показываем без анимации
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            if (once) io.unobserve(el);
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const transform = !shown
    ? from === 'left'
      ? 'translate3d(-24px, 0, 0)'
      : from === 'right'
      ? 'translate3d(24px, 0, 0)'
      : 'translate3d(0, 24px, 0)'
    : 'translate3d(0, 0, 0)';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform,
        transition: `opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms,
                     transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
