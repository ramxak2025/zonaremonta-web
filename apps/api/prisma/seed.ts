import { PrismaClient, type Prisma } from '@prisma/client';
import {
  VEHICLE_BRANDS,
  CLIENT_EXPENSE_CATEGORIES,
  TRANSACTION_CATEGORIES,
  DEFAULT_SERVICES,
  PART_CATEGORIES,
  DEFAULT_SETTINGS,
} from '@05auto/shared';

const prisma = new PrismaClient();

async function seedBrandsAndModels(): Promise<void> {
  for (const brand of VEHICLE_BRANDS) {
    const b = await prisma.vehicleBrand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name },
      create: { slug: brand.slug, name: brand.name },
    });
    for (const modelName of brand.models) {
      const modelSlug = modelName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      await prisma.vehicleModel.upsert({
        where: { brandId_slug: { brandId: b.id, slug: modelSlug } },
        update: { name: modelName },
        create: { brandId: b.id, slug: modelSlug, name: modelName },
      });
    }
  }
}

async function seedTaxonomies(): Promise<void> {
  for (const c of CLIENT_EXPENSE_CATEGORIES) {
    await prisma.clientExpenseCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon },
      create: { slug: c.slug, name: c.name, icon: c.icon },
    });
  }
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
  for (const c of PART_CATEGORIES) {
    await prisma.partCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { slug: c.slug, name: c.name },
    });
  }
}

async function seedServices(): Promise<void> {
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
}

async function seedFaq(): Promise<void> {
  const faqs: ReadonlyArray<{ q: string; a: string }> = [
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
  const existing = await prisma.faqItem.count();
  if (existing > 0) return;
  await prisma.faqItem.createMany({
    data: faqs.map((f, order) => ({ question: f.q, answer: f.a, order })),
  });
}

async function seedSettings(): Promise<void> {
  // Источник правды — DEFAULT_SETTINGS из @05auto/shared (типизировано zod-схемой).
  // При повторном запуске существующие значения НЕ перетираются (update = то же, что create, но
  // upsert только добавит недостающие ключи).
  const entries = Object.entries(DEFAULT_SETTINGS) as Array<
    [string, Prisma.InputJsonValue]
  >;
  for (const [key, value] of entries) {
    const found = await prisma.setting.findUnique({ where: { key } });
    if (found) continue;
    await prisma.setting.create({ data: { key, value } });
  }
  // Координаты — отдельно, их не храним в публичных настройках (не редактируются тут).
  await prisma.setting.upsert({
    where: { key: 'site.coordinates' },
    update: {},
    create: { key: 'site.coordinates', value: { lat: 42.9831, lng: 47.5047 } },
  });
}

async function main(): Promise<void> {
  console.log('⏳ seeding…');
  await seedBrandsAndModels();
  console.log('✓ brands/models');
  await seedTaxonomies();
  console.log('✓ taxonomies');
  await seedServices();
  console.log('✓ services');
  await seedFaq();
  console.log('✓ faq');
  await seedSettings();
  console.log('✓ settings');
  console.log('✅ seed done');
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
