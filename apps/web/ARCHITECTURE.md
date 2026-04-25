# Зона Ремонта — Frontend архитектура

## Стек

- **Next.js 15** (App Router, RSC по умолчанию, `'use client'` точечно)
- **React 19**
- **TypeScript 5** (strict)
- **Tailwind CSS 3** (через `@tailwind base/components/utilities`)
- **lucide-react** для иконок
- **Inter** + **Oswald** через `next/font/google`

## Структура папок

```
apps/web/src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # корневой layout — фон, провайдеры, Header/Footer/MobileNav
│   ├── page.tsx            # главная (Hero + все секции)
│   ├── providers.tsx       # CartProvider
│   ├── not-found.tsx       # 404
│   ├── services/page.tsx
│   ├── calculator/page.tsx
│   ├── catalog/page.tsx
│   ├── catalog/[category]/page.tsx
│   ├── cart/page.tsx
│   ├── llms.txt/route.ts   # llms.txt для AI-поисковиков
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                 # ПРИМИТИВЫ — переиспользуемые без бизнес-логики
│   │   ├── Container.tsx       # горизонтальная обёртка с max-width 1280px
│   │   ├── Section.tsx         # вертикальный padding + Container
│   │   ├── SectionHeader.tsx   # eyebrow + h2 + lead
│   │   ├── Logo.tsx            # текстовый логотип ZR
│   │   └── PhoneIcon.tsx       # иконки телефона/WhatsApp/Yandex/2GIS
│   ├── layout/             # КОМПОНОВКА страницы (один экземпляр на сайт)
│   │   ├── Header.tsx          # верхняя панель с логотипом + nav + корзина + телефон
│   │   ├── Footer.tsx          # футер с навигацией и контактами
│   │   └── MobileNav.tsx       # нижний таб-бар на мобилке
│   ├── sections/           # СЕКЦИИ ЛЭНДИНГА (используются только на public страницах)
│   │   ├── Hero.tsx            # главный экран
│   │   ├── ServicesGrid.tsx    # 5 карточек комплектов ГБО
│   │   ├── Calculator.tsx      # калькулятор экономии (client)
│   │   ├── WhyUs.tsx           # 6 причин
│   │   ├── Steps.tsx           # 4 шага работы
│   │   ├── Reviews.tsx         # рейтинги Я.Карт/2ГИС + 3 отзыва
│   │   ├── Faq.tsx             # 8 вопросов (client, accordion)
│   │   └── Contact.tsx         # 4 канала связи + адрес/часы
│   └── shop/               # МАГАЗИН
│       └── ProductCard.tsx     # карточка товара с галкой «установить на месте»
├── data/                   # СТАТИЧЕСКИЕ ДАННЫЕ (не из БД)
│   └── products.ts             # 21 товар, 6 категорий
├── lib/                    # утилиты
│   ├── site.ts                 # константы бренда (телефон, адрес, ссылки)
│   └── cart.tsx                # CartProvider + useCart (localStorage + React context)
└── styles/
    └── globals.css             # дизайн-токены + базовые компоненты
```

## Дизайн-система

### Принципы

1. **Tailwind utilities — основной язык вёрстки.** Большинство классов — это
   стандартные Tailwind utility (`flex`, `grid grid-cols-3`, `gap-4`, `p-5 md:p-7`,
   `text-white/70`). Они в `@layer utilities` имеют максимальный CSS-приоритет и
   гарантированно применяются.

2. **CSS-классы только для повторяющихся паттернов.** В `globals.css` — всего
   несколько классов: `.btn`, `.btn-primary`, `.card`, `.card-elev`, `.chip`,
   `.page-bg`. Всё остальное верстается прямо в JSX через Tailwind.

3. **Никаких сложных типографических трюков.** У `<h1>/<h2>/<h3>` нет
   `padding-block`, `text-wrap: balance`, `margin-bottom` в `em`. Все отступы —
   через `mb-*` / `mt-*` Tailwind.

4. **Компонент-обёртка для секций.** Все секции лэндинга используют
   `<Section>` с `<SectionHeader>` для шапки. Это гарантирует одинаковые
   вертикальные отступы и единый стиль eyebrow/h/lead.

### Цветовая палитра (CSS vars)

```
--bg:        #0A0A10  основной фон
--bg-2:      #14141A  поднятая поверхность (карточки elev)
--bg-3:      #1C1C26  ещё выше
--surface:   rgba(255,255,255,0.04)  обычные карточки
--line:      rgba(255,255,255,0.08)  бордер
--line-2:    rgba(255,255,255,0.14)  более выразительный бордер

--ink:       #FFFFFF
--ink-70/50/30  ослабленный белый

--red:       #E81224  основной бренд
--red-2:     #FF3E4F  светлее (hover, акценты)
--red-d:     #B40E1C  тёмный (низ градиента)
--green:     #22C55E  WhatsApp / success
--yellow:    #FFCC00  Я.Карты / звёзды рейтинга
```

### Типографика

- **Heading**: Oswald Bold UPPERCASE, размеры через `clamp()` или статические Tailwind classes
- **Body**: Inter Regular/Medium
- `font-display` Tailwind = Oswald, `font-sans` = Inter (по умолчанию)

### Брейкпоинты

```
xs   320px (default mobile-first)
sm   640px
md   768px
lg   1024px
xl   1280px
2xl  1440px
```

### Карточки

- `.card` — основная: `--surface` фон, `--line` бордер, скругление 20-24px
- `.card-elev` — поднятая: `--bg-2` фон, `--line-2` бордер (для калькулятора, корзины)

### Кнопки

- `.btn` (по умолчанию 48px) + `.btn-sm` (40px) / `.btn-lg` (56px)
- `.btn-primary` — красный градиент
- `.btn-ghost` — прозрачный с бордером
- `.btn-whatsapp` — зелёный градиент

## Контракты компонентов

### `<Container>`
Горизонтальная обёртка. `max-width: 1280px`, адаптивный `padding-x` 16/24/32/48px.

### `<Section>`
Вертикальный ритм секций. `py-12 md:py-16 lg:py-24` (48/64/96px) + `<Container>`.
Принимает `id` для якорей.

### `<SectionHeader>`
Стандартная шапка: eyebrow (опц.) + heading + lead (опц.). Все отступы через
Tailwind `mb-*`. Это **единственное место**, где задаются вертикальные расстояния
между eyebrow / h / lead — никогда не пишите эти отступы вручную в секциях.

### Секция (паттерн)

```tsx
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function MySection() {
  return (
    <Section id="optional-anchor">
      <SectionHeader
        eyebrow="Подзаголовок"
        title="Главный заголовок"
        lead="Краткое описание секции."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {items.map((it) => (
          <article key={it.id} className="card flex flex-col gap-4">
            ...
          </article>
        ))}
      </div>
    </Section>
  );
}
```

## Корзина

`CartProvider` хранит состояние в `localStorage` под ключом `05auto.cart.v1`.
Хук `useCart()` отдаёт:
- `items` / `count` / `subtotal` / `laborTotal` / `laborSavings` / `total`
- `add(productId, qty?, withInstall?)`
- `setQty(productId, qty)`
- `toggleInstall(productId)`
- `remove(productId)` / `clear()`
- `buildOrderText()` — готовый текст для WhatsApp с самовывоза

## SEO

- `metadata` в каждой странице (title/description/canonical/OpenGraph)
- `JSON-LD FAQPage` в компоненте `<Faq>`
- `sitemap.ts` + `robots.ts` + `llms.txt/route.ts`

## Что НЕ делать

- ❌ Не писать `padding-block: 0.Xem` на heading-классах
- ❌ Не использовать `text-wrap: balance` (нестабильно в Safari iOS)
- ❌ Не делать `<h1>` с `<span className="block">` внутри
- ❌ Не вставлять inline `style={{ fontSize: 'clamp(...)' }}` для каждого случая —
  использовать стандартные Tailwind size-классы или вспомогательные числовые классы
- ❌ Не использовать flex-gap на section-head — там block + явные `mb-*`
- ❌ Не создавать новые «дизайн-классы» в `globals.css` без необходимости

## Деплой

Docker multi-stage build. Корневая команда:
```bash
docker compose -f docker-compose.prod.yml --env-file .env build --no-cache web
```

Dockerfile содержит `ARG CACHE_BUST` — менять при каждом билде, чтобы
гарантированно инвалидировать слои.
