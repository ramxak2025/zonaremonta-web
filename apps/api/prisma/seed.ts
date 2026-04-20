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

  // Настройки
  const settings = [
    { key: 'site.phone', value: { value: '+7 (988) 000-00-00' } },
    { key: 'site.address', value: { value: 'г. Махачкала, ул. пример, 1' } },
    { key: 'site.workingHours', value: { value: 'ПН-СБ: 9:00–20:00, ВС: выходной' } },
    { key: 'site.coordinates', value: { lat: 42.9831, lng: 47.5047 } },
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
