import { CartProvider } from '@/lib/cart';

/**
 * Корневой Providers. Только корзина — она нужна везде (Header показывает
 * количество). React Query подключается в layout-ах админки / ЛК.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
