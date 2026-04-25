import type { ReactNode } from 'react';

/**
 * Корневой провайдер. Сейчас пуст — на публичных страницах нет
 * клиентского состояния, требующего React-context.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
