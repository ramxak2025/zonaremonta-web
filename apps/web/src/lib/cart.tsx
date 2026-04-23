'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProductById, type Product } from '@/data/products';

const STORAGE_KEY = '05auto.cart.v1';

export interface CartItem {
  productId: string;
  qty: number;
  withInstall: boolean;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  laborTotal: number;
  laborSavings: number;
  total: number;
  add(productId: string, qty?: number, withInstall?: boolean): void;
  setQty(productId: string, qty: number): void;
  toggleInstall(productId: string): void;
  remove(productId: string): void;
  clear(): void;
  buildOrderText(): string;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is CartItem =>
        v && typeof v.productId === 'string' && typeof v.qty === 'number',
    );
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded / private mode — cart stays in memory
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeStorage(items);
  }, [items, ready]);

  const add = useCallback((productId: string, qty = 1, withInstall = false) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { productId, qty, withInstall }];
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    );
  }, []);

  const toggleInstall = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, withInstall: !i.withInstall } : i,
      ),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const computed = useMemo(() => {
    const rows = items
      .map((it) => {
        const p = getProductById(it.productId);
        return p ? { it, p } : null;
      })
      .filter((x): x is { it: CartItem; p: Product } => x !== null);

    const count = rows.reduce((s, r) => s + r.it.qty, 0);
    const subtotal = rows.reduce((s, r) => s + r.p.price * r.it.qty, 0);
    const laborTotal = rows.reduce(
      (s, r) => (r.it.withInstall ? s + r.p.installLaborSale * r.it.qty : s),
      0,
    );
    const laborFull = rows.reduce(
      (s, r) => (r.it.withInstall ? s + r.p.installLabor * r.it.qty : s),
      0,
    );
    const laborSavings = Math.max(0, laborFull - laborTotal);

    return {
      count,
      subtotal,
      laborTotal,
      laborSavings,
      total: subtotal + laborTotal,
      rows,
    };
  }, [items]);

  const buildOrderText = useCallback((): string => {
    if (computed.rows.length === 0) return '';
    const lines = computed.rows.map((r, i) => {
      const line = `${i + 1}. ${r.p.name} — ${r.it.qty} шт. × ${r.p.price.toLocaleString('ru-RU')} ₽`;
      const install = r.it.withInstall
        ? `\n   + установка: ${(r.p.installLaborSale * r.it.qty).toLocaleString('ru-RU')} ₽`
        : '';
      return line + install;
    });
    const totals = [
      `\nТовары: ${computed.subtotal.toLocaleString('ru-RU')} ₽`,
      computed.laborTotal > 0
        ? `Работа: ${computed.laborTotal.toLocaleString('ru-RU')} ₽`
        : null,
      `ИТОГО: ${computed.total.toLocaleString('ru-RU')} ₽`,
    ].filter(Boolean);
    return `Здравствуйте! Хочу оформить заказ (самовывоз в Махачкале):\n\n${lines.join('\n')}\n${totals.join('\n')}`;
  }, [computed]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: computed.count,
      subtotal: computed.subtotal,
      laborTotal: computed.laborTotal,
      laborSavings: computed.laborSavings,
      total: computed.total,
      add,
      setQty,
      toggleInstall,
      remove,
      clear,
      buildOrderText,
    }),
    [items, computed, add, setQty, toggleInstall, remove, clear, buildOrderText],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    // SSR-safe fallback — возвращаем пустую корзину без записи в localStorage
    return {
      items: [],
      count: 0,
      subtotal: 0,
      laborTotal: 0,
      laborSavings: 0,
      total: 0,
      add: () => {},
      setQty: () => {},
      toggleInstall: () => {},
      remove: () => {},
      clear: () => {},
      buildOrderText: () => '',
    };
  }
  return ctx;
}
