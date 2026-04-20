"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const shared_1 = require("@05auto/shared");
const prisma = new client_1.PrismaClient();
async function seedBrandsAndModels() {
    for (const brand of shared_1.VEHICLE_BRANDS) {
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
async function seedTaxonomies() {
    for (const c of shared_1.CLIENT_EXPENSE_CATEGORIES) {
        await prisma.clientExpenseCategory.upsert({
            where: { slug: c.slug },
            update: { name: c.name, icon: c.icon },
            create: { slug: c.slug, name: c.name, icon: c.icon },
        });
    }
    for (const c of shared_1.TRANSACTION_CATEGORIES.INCOME) {
        await prisma.transactionCategory.upsert({
            where: { slug: c.slug },
            update: { name: c.name, direction: 'INCOME' },
            create: { slug: c.slug, name: c.name, direction: 'INCOME' },
        });
    }
    for (const c of shared_1.TRANSACTION_CATEGORIES.EXPENSE) {
        await prisma.transactionCategory.upsert({
            where: { slug: c.slug },
            update: { name: c.name, direction: 'EXPENSE' },
            create: { slug: c.slug, name: c.name, direction: 'EXPENSE' },
        });
    }
    for (const c of shared_1.PART_CATEGORIES) {
        await prisma.partCategory.upsert({
            where: { slug: c.slug },
            update: { name: c.name },
            create: { slug: c.slug, name: c.name },
        });
    }
}
async function seedServices() {
    for (const s of shared_1.DEFAULT_SERVICES) {
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
async function seedFaq() {
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
    const existing = await prisma.faqItem.count();
    if (existing > 0)
        return;
    await prisma.faqItem.createMany({
        data: faqs.map((f, order) => ({ question: f.q, answer: f.a, order })),
    });
}
async function seedDemoAccounts() {
    // Создаются только если их ещё нет. Пароли одинаковые для демо.
    const pwHash = await argon2.hash('Demo05auto!', { type: argon2.argon2id });
    // Директор
    await prisma.user.upsert({
        where: { email: 'director@demo.05auto.ru' },
        update: {},
        create: {
            email: 'director@demo.05auto.ru',
            role: 'DIRECTOR',
            passwordHash: pwHash,
            status: 'ACTIVE',
            totpEnabled: false,
        },
    });
    // Мастер
    const masterUser = await prisma.user.upsert({
        where: { email: 'master@demo.05auto.ru' },
        update: {},
        create: {
            email: 'master@demo.05auto.ru',
            role: 'MASTER',
            passwordHash: pwHash,
            status: 'ACTIVE',
            totpEnabled: false,
            master: { create: { fullName: 'Ахмед Магомедов', specializations: ['GBO'] } },
        },
    });
    // Демо-клиент (email + phone)
    await prisma.user.upsert({
        where: { email: 'client@demo.05auto.ru' },
        update: {},
        create: {
            email: 'client@demo.05auto.ru',
            role: 'CLIENT',
            passwordHash: pwHash,
            status: 'ACTIVE',
            client: {
                create: {
                    phone: '+79999999999',
                    name: 'Магомед Демо',
                    notes: 'Демо-аккаунт для просмотра',
                },
            },
        },
    });
    // Вторичная мета — чтобы подсказки отображались в админке
    await prisma.setting.upsert({
        where: { key: 'demo.accounts' },
        update: {},
        create: {
            key: 'demo.accounts',
            value: {
                director: { email: 'director@demo.05auto.ru', password: 'Demo05auto!' },
                master: { email: 'master@demo.05auto.ru', password: 'Demo05auto!' },
                client: { email: 'client@demo.05auto.ru', password: 'Demo05auto!', phone: '+79999999999' },
            },
        },
    });
    // Используем masterUser чтобы TypeScript не ругнулся
    void masterUser.id;
}
async function seedSettings() {
    // Источник правды — DEFAULT_SETTINGS из @05auto/shared (типизировано zod-схемой).
    // При повторном запуске существующие значения НЕ перетираются (update = то же, что create, но
    // upsert только добавит недостающие ключи).
    const entries = Object.entries(shared_1.DEFAULT_SETTINGS);
    for (const [key, value] of entries) {
        const found = await prisma.setting.findUnique({ where: { key } });
        if (found)
            continue;
        await prisma.setting.create({ data: { key, value } });
    }
    // Координаты — отдельно, их не храним в публичных настройках (не редактируются тут).
    await prisma.setting.upsert({
        where: { key: 'site.coordinates' },
        update: {},
        create: { key: 'site.coordinates', value: { lat: 42.9831, lng: 47.5047 } },
    });
}
async function main() {
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
    await seedDemoAccounts();
    console.log('✓ demo accounts');
    console.log('✅ seed done');
    console.log('');
    console.log('=== ДЕМО-АККАУНТЫ ===');
    console.log('Директор: director@demo.05auto.ru / Demo05auto!');
    console.log('Мастер:   master@demo.05auto.ru  / Demo05auto!');
    console.log('Клиент:   client@demo.05auto.ru / Demo05auto!  (или тел. +79999999999)');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
