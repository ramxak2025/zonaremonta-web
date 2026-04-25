import type { ReactNode } from 'react';
import { CartProvider } from '@/lib/cart';

/**
 * Корневой провайдер. Сейчас здесь только корзина —
 * её состояние нужно почти везде (Header показывает счётчик).
 */
export function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
