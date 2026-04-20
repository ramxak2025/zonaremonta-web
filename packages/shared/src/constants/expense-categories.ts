export const CLIENT_EXPENSE_CATEGORIES = [
  { slug: 'fuel', name: 'Топливо', icon: 'fuel' },
  { slug: 'wash', name: 'Мойка', icon: 'wash' },
  { slug: 'insurance', name: 'Страховка', icon: 'shield' },
  { slug: 'fine', name: 'Штрафы', icon: 'alert' },
  { slug: 'repair', name: 'Ремонт', icon: 'wrench' },
  { slug: 'consumables', name: 'Расходники', icon: 'filter' },
  { slug: 'other', name: 'Другое', icon: 'more' },
] as const;

export type ClientExpenseCategorySlug = (typeof CLIENT_EXPENSE_CATEGORIES)[number]['slug'];

export const TRANSACTION_CATEGORIES = {
  INCOME: [
    { slug: 'work_order', name: 'Заказ-наряд' },
    { slug: 'parts_sale', name: 'Продажа комплектующих' },
    { slug: 'other_income', name: 'Прочие доходы' },
  ],
  EXPENSE: [
    { slug: 'salary', name: 'Зарплата' },
    { slug: 'rent', name: 'Аренда' },
    { slug: 'utilities', name: 'Коммуналка' },
    { slug: 'taxes', name: 'Налоги' },
    { slug: 'purchase', name: 'Закупка' },
    { slug: 'other_expense', name: 'Прочие расходы' },
  ],
} as const;
