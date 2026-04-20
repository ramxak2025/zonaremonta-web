import { PrismaClient } from '@prisma/client';
import {
  VEHICLE_BRANDS,
  CLIENT_EXPENSE_CATEGORIES,
  TRANSACTION_CATEGORIES,
  DEFAULT_SERVICES,
  PART_CATEGORIES,
} from '@05auto/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ seeding…');

  // Марки и модели
  for (const brand of VEHICLE_BRANDS) {
    const b = await prisma.vehicleBrand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name },
      create: { slug: brand.slug, name: brand.name },
    });
    for (const modelName of brand.models) {
      const modelSlug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
      await prisma.vehicleModel.upsert({
        where: { brandId_slug: { brandId: b.id, slug: modelSlug } },
        update: { name: modelName },
        create: { brandId: b.id, slug: modelSlug, name: modelName },
      });
    }
  }
  console.log('✓ brands/models');

  // Категории расходов клиента
  for (const c of CLIENT_EXPENSE_CATEGORIES) {
    await prisma.clientExpenseCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon },
      create: { slug: c.slug, name: c.name, icon: c.icon },
    });
  }

  // Категории транзакций (доход/расход)
  for (const c of TRANSACTION_CATEGORIES.INCOME) {
    await prisma.transactionCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, direction: 'INCOME' },
      create: { slug: c.slug, name: c.name, direction: 'INCOME' },
    });
  }
  for (const c of TRANSACTION_CATEGORIES.EXPENSE) {
    await prisma.transactionCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, direction: 'EXPENSE' },
      create: { slug: c.slug, name: c.name, direction: 'EXPENSE' },
    });
  }
  console.log('✓ categories');

  // Услуги
  for (const s of DEFAULT_SERVICES) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        category: s.category,
        basePrice: s.basePrice,
        durationMin: s.durationMin,
        description: s.description,
      },
      create: {
        slug: s.slug,
        name: s.name,
        category: s.category,
        basePrice: s.basePrice,
        durationMin: s.durationMin,
        description: s.description,
      },
    });
  }
  console.log('✓ services');

  // Категории запчастей
  for (const c of PART_CATEGORIES) {
    await prisma.partCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { slug: c.slug, name: c.name },
    });
  }
  console.log('✓ part categories');

  // FAQ
  const faqs = [
    {
      q: 'Сколько экономит ГБО?',
      a: 'В зависимости от пробега и расхода — от 40% до 55% на топливе. Калькулятор на сайте покажет цифры под ваше авто.',
    },
    {
      q: 'Какое поколение ГБО ставить?',
      a: 'Для карбюраторных — 2-е; для инжекторных — 4-е (самый массовый вариант); для двигателей с прямым впрыском — 6-е.',
    },
    {
      q: 'Как часто делать поверку баллона?',
      a: 'Композитный — раз в 2 года, металлический — раз в 5 лет. Без поверки эксплуатация незаконна.',
    },
    {
      q: 'Даёте ли гарантию?',
      a: 'Да. На работы — 1 год, на оборудование — заводская гарантия производителя.',
    },
    {
      q: 'Нужно ли регистрировать ГБО в ГИБДД?',
      a: 'Да, это обязательное требование. Помогаем с пакетом документов для регистрации изменений.',
    },
  ];
  let faqOrder = 0;
  for (const f of faqs) {
    await prisma.faqItem.create({
      data: { question: f.q, answer: f.a, order: faqOrder++ },
    }).catch(() => {});
  }
  console.log('✓ faq');

  // Настройки — владелец редактирует их из ЛК директора
  const settings = [
    // --- контакты ---
    { key: 'site.phone', value: { value: '+7 (988) 000-00-00' } },
    { key: 'site.whatsapp', value: { value: '79880000000' } },
    { key: 'site.max', value: { value: 'https://max.ru/05auto' } },
    {
      key: 'site.yandexMapsLink',
      value: {
        value:
          'https://yandex.ru/maps/?text=%D0%9C%D0%B0%D1%85%D0%B0%D1%87%D0%BA%D0%B0%D0%BB%D0%B0%20%D0%97%D0%BE%D0%BD%D0%B0%20%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%D0%B0',
      },
    },
    { key: 'site.address', value: { value: 'г. Махачкала, ул. пример, 1' } },
    { key: 'site.workingHours', value: { value: 'ПН-СБ: 9:00–20:00, ВС: выходной' } },
    { key: 'site.coordinates', value: { lat: 42.9831, lng: 47.5047 } },

    // --- главный баннер ---
    { key: 'hero.badge', value: { value: 'ГБО в Махачкале · Гарантия 1 год' } },
    { key: 'hero.title', value: { value: 'Переводим авто на газ с гарантией.' } },
    {
      key: 'hero.subtitle',
      value: {
        value:
          'Установка, ремонт и диагностика ГБО. Сертифицированные мастера, свой склад, гарантия 1 год.',
      },
    },
    { key: 'hero.primaryCta', value: { value: 'Позвонить сейчас' } },
    { key: 'hero.imageUrl', value: { value: '' } },
    { key: 'hero.stats.payback', value: { value: '~8', suffix: 'мес' } },
    { key: 'hero.stats.savings', value: { value: '55', suffix: '%' } },

    // --- цены топлива (рубли за литр) — владелец вводит актуальные ---
    { key: 'fuel.ai92.price', value: { value: 58 } },
    { key: 'fuel.ai95.price', value: { value: 62 } },
    { key: 'fuel.ai98.price', value: { value: 68 } },
    { key: 'fuel.ai100.price', value: { value: 75 } },
    { key: 'fuel.lpg.price', value: { value: 28 } },

    // --- калькулятор ---
    { key: 'calc.gasOverheadPct', value: { value: 12 } },
    { key: 'calc.defaultInstallPrice', value: { value: 38000 } },

    // --- отзывы Яндекс ---
    { key: 'reviews.yandex.url', value: { value: 'https://yandex.ru/profile/130786711189?lang=ru' } },
    { key: 'reviews.yandex.rating', value: { value: 4.6 } },
    { key: 'reviews.yandex.count', value: { value: 87 } },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('✓ settings');

  console.log('✅ seed done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
