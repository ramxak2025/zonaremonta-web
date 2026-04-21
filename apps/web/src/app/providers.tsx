/**
 * Корневой Providers — пустой пока что.
 * React Query, если понадобится, подключается в layout-ах админки / LK
 * (не тратим ~40KB JS на публичных страницах).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
