import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Горизонтальный контейнер с единым max-width и адаптивными отступами.
 * 16px → 24px (md) → 32px (lg) → 48px (xl).
 */
export function Container({ children, className = '' }: Props) {
  return (
    <div className={`w-full mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 xl:px-12 ${className}`}>
      {children}
    </div>
  );
}
