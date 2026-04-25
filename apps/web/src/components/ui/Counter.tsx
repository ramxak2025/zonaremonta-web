'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  to: number;
  duration?: number;
  className?: string;
  /**
   * Делитель для отображения дробных чисел (например 49 / 10 → 4.9).
   * Не передавайте functions из server-component — отсюда статичные опции.
   */
  divisor?: number;
  /** Сколько знаков после запятой при использовании divisor. */
  decimals?: number;
}

/**
 * Анимированный счётчик от 0 до `to`. Запускается, когда элемент попадает
 * в viewport. На reduced-motion — сразу показывает финальное значение.
 */
export function Counter({ to, duration = 1400, className = '', divisor, decimals = 1 }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [v, setV] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setV(to);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
              setV(Math.round(to * eased));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  const display = divisor && divisor > 1
    ? (v / divisor).toFixed(decimals)
    : v.toLocaleString('ru-RU');

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
