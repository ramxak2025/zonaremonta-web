'use client';
import { useMemo, useState } from 'react';
import { Check, Plus, Wrench, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/data/products';
import { useCart } from '@/lib/cart';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { add, items } = useCart();
  const [withInstall, setWithInstall] = useState(false);
  const [added, setAdded] = useState(false);

  const inCart = useMemo(
    () => items.some((i) => i.productId === product.id),
    [items, product.id],
  );

  const onAdd = () => {
    add(product.id, 1, withInstall);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const fullLabor = product.installLabor;
  const saleLabor = product.installLaborSale;
  const savings = fullLabor - saleLabor;
  const savingsPct = Math.round((savings / fullLabor) * 100);

  return (
    <article className="card flex flex-col gap-4 relative overflow-hidden">
      {product.badge && (
        <span
          className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={
            product.badge === 'hit'
              ? { background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }
              : product.badge === 'new'
              ? { background: 'rgba(232,18,36,0.15)', color: '#FF3E4F', border: '1px solid rgba(232,18,36,0.3)' }
              : { background: 'rgba(255,204,0,0.15)', color: '#FFCC00', border: '1px solid rgba(255,204,0,0.3)' }
          }
        >
          {product.badge === 'hit' ? 'Хит' : product.badge === 'new' ? 'Новинка' : 'Скидка'}
        </span>
      )}

      <div className="flex flex-col gap-2">
        <div className="eyebrow eyebrow-mute">
          <span>{product.brand}</span>
          <span className="text-white/20">·</span>
          <span>{product.article}</span>
        </div>
        <h3 className="h-3 text-white text-break">{product.name}</h3>
        <p className="text-[13px] text-white/65 leading-relaxed text-break">
          {product.description}
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-1 text-[12px]">
        {product.specs.slice(0, 3).map((s) => (
          <div key={s.k} className="flex justify-between gap-3 text-break">
            <dt className="text-white/45">{s.k}</dt>
            <dd className="text-white/80 text-right">{s.v}</dd>
          </div>
        ))}
      </dl>

      <label
        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors select-none ${
          withInstall
            ? 'bg-primary/10 border border-primary/25'
            : 'bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05]'
        }`}
      >
        <input
          type="checkbox"
          checked={withInstall}
          onChange={(e) => setWithInstall(e.target.checked)}
          className="sr-only"
        />
        <span
          className={`w-5 h-5 rounded-md flex-shrink-0 grid place-items-center mt-0.5 transition-colors ${
            withInstall
              ? 'bg-[#FF3E4F] border border-[#FF3E4F]'
              : 'border border-white/25 bg-transparent'
          }`}
        >
          {withInstall && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-white">
            <Wrench className="w-3.5 h-3.5 text-[#FF3E4F]" />
            Установить на месте
          </div>
          <div className="text-[12px] text-white/65 mt-0.5 text-break">
            {saleLabor.toLocaleString('ru-RU')} ₽ вместо{' '}
            <span className="line-through text-white/40">{fullLabor.toLocaleString('ru-RU')} ₽</span>{' '}
            <span className="text-[#22C55E] font-semibold">−{savingsPct}%</span>
          </div>
        </div>
      </label>

      <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="eyebrow eyebrow-mute">Цена</div>
          <div className="num-lg text-white">
            {product.price.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-[11px] text-white/45">
            {product.inStock ? 'В наличии' : 'Под заказ 1–3 дня'}
          </div>
        </div>
        {inCart && !added ? (
          <Link href="/cart" className="btn btn-ghost btn-sm flex-shrink-0">
            <ShoppingBag className="w-4 h-4" />
            В корзине
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className={`btn btn-sm flex-shrink-0 transition-all ${
              added ? 'btn-ghost' : 'btn-primary'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" strokeWidth={2.5} />
                Добавлено
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                В корзину
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
