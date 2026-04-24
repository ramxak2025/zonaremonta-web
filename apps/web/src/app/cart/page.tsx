'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, MapPin, Check, Wrench } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppIcon, PhoneFilledIcon } from '@/components/BrandIcons';
import { useCart } from '@/lib/cart';
import { getProductById } from '@/data/products';
import { SITE, getContactLinks } from '@/lib/site';

export default function CartPage() {
  const cart = useCart();
  const l = getContactLinks();

  const rows = useMemo(
    () =>
      cart.items
        .map((it) => {
          const p = getProductById(it.productId);
          return p ? { it, p } : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [cart.items],
  );

  const whatsappHref = useMemo(() => {
    const text = cart.buildOrderText();
    if (!text) return l.whatsappHref;
    return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }, [cart, l.whatsappHref]);

  return (
    <>
      <Header />
      <main className="section pt-5 pb-12 md:pt-8 md:pb-20">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-[13px] text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Продолжить покупки
        </Link>

        <div className="section-head mt-5">
          <span className="eyebrow">Корзина</span>
          <h1 className="h-1 text-white">Ваш заказ</h1>
        </div>

        {rows.length === 0 ? (
          <div className="card-lg text-center">
            <p className="text-white/70 text-[15px]">В корзине пока пусто.</p>
            <Link href="/catalog" className="btn btn-primary btn-sm mt-5 inline-flex">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-5 md:gap-6">
            {/* Список позиций */}
            <div className="flex flex-col gap-3">
              {rows.map(({ it, p }) => {
                const fullLabor = p.installLabor;
                const saleLabor = p.installLaborSale;
                return (
                  <article
                    key={it.productId}
                    className="card flex gap-4 items-start"
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                      <div>
                        <div className="eyebrow eyebrow-mute">
                          {p.brand} · {p.article}
                        </div>
                        <h3 className="h-3 text-white mt-2 text-break">{p.name}</h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-0 rounded-full bg-white/[0.05] border border-white/[0.08]">
                          <button
                            type="button"
                            aria-label="Уменьшить"
                            onClick={() => cart.setQty(it.productId, it.qty - 1)}
                            className="w-9 h-9 grid place-items-center text-white/70 hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="min-w-[28px] text-center font-semibold text-white">
                            {it.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Увеличить"
                            onClick={() => cart.setQty(it.productId, it.qty + 1)}
                            className="w-9 h-9 grid place-items-center text-white/70 hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => cart.remove(it.productId)}
                          className="inline-flex items-center gap-1 text-[12px] text-white/50 hover:text-[#FF3E4F] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Удалить
                        </button>
                      </div>

                      <label
                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors select-none ${
                          it.withInstall
                            ? 'bg-primary/10 border border-primary/25'
                            : 'bg-white/[0.03] border border-white/[0.08]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={it.withInstall}
                          onChange={() => cart.toggleInstall(it.productId)}
                          className="sr-only"
                        />
                        <span
                          className={`w-5 h-5 rounded-md flex-shrink-0 grid place-items-center mt-0.5 ${
                            it.withInstall
                              ? 'bg-[#FF3E4F] border border-[#FF3E4F]'
                              : 'border border-white/25'
                          }`}
                        >
                          {it.withInstall && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-white flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-[#FF3E4F]" />
                            Установить на месте
                          </div>
                          <div className="text-[12px] text-white/65 mt-0.5 text-break">
                            {saleLabor.toLocaleString('ru-RU')} ₽ за работу вместо{' '}
                            <span className="line-through text-white/40">
                              {fullLabor.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="flex flex-col items-end gap-0 flex-shrink-0">
                      <div className="num text-white">
                        {(p.price * it.qty).toLocaleString('ru-RU')} ₽
                      </div>
                      {it.qty > 1 && (
                        <div className="text-[11px] text-white/40">
                          {p.price.toLocaleString('ru-RU')} × {it.qty}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Правая колонка: итоги + оформление */}
            <aside className="flex flex-col gap-4">
              <div className="card-strong-lg flex flex-col gap-4 lg:sticky lg:top-24">
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-white/60">Товары ({cart.count})</span>
                    <span className="text-white font-semibold">
                      {cart.subtotal.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  {cart.laborTotal > 0 && (
                    <>
                      <div className="flex justify-between text-[14px]">
                        <span className="text-white/60">Установка на месте</span>
                        <span className="text-white font-semibold">
                          {cart.laborTotal.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      {cart.laborSavings > 0 && (
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#22C55E]">Экономия на работе</span>
                          <span className="text-[#22C55E] font-semibold">
                            −{cart.laborSavings.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-end justify-between">
                  <span className="eyebrow eyebrow-mute">Итого</span>
                  <span className="num-lg text-white">
                    {cart.total.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-white">
                    <MapPin className="w-4 h-4 text-[#FFCC00]" />
                    Самовывоз
                  </div>
                  <div className="text-[12px] text-white/60 text-break">
                    {SITE.address}
                    <br />
                    {SITE.workingHours}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-lg w-full"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    Оформить в WhatsApp
                  </a>
                  <a href={l.phoneHref} className="btn btn-ghost btn-sm w-full">
                    <PhoneFilledIcon className="w-4 h-4" />
                    Позвонить: {SITE.phone}
                  </a>
                </div>

                <p className="text-[11px] text-white/45 text-break">
                  После оформления менеджер подтверждает наличие и согласует время приезда.
                  Оплата при самовывозе — наличными или переводом.
                </p>

                <button
                  type="button"
                  onClick={cart.clear}
                  className="text-[12px] text-white/45 hover:text-white/70 transition-colors mt-2"
                >
                  Очистить корзину
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
