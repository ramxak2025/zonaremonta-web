import { describe, it, expect } from '@jest/globals';
import { calculateSavings, savingsCalculatorSchema } from './savings';

describe('calculateSavings', () => {
  it('считает месячную экономию для типичного городского авто', () => {
    const r = calculateSavings({
      monthlyMileageKm: 2000,
      fuelConsumptionLPer100: 10,
      petrolPriceRub: 62,
      gasPriceRub: 28,
      gboInstallPriceRub: 38000,
      gasOverheadPct: 12,
    });
    // Бензин: 2000/100 * 10 = 200 л * 62 = 12 400 ₽/мес
    // Газ: 200 * 1.12 = 224 л * 28 = 6 272 ₽/мес
    // Экономия: 12400 - 6272 = 6 128 ₽/мес
    expect(r.monthlyPetrolCost).toBe(12400);
    expect(r.monthlyGasCost).toBe(6272);
    expect(r.monthlySavings).toBe(6128);
    expect(r.yearlySavings).toBe(6128 * 12);
    expect(r.paybackMonths).toBeCloseTo(6.2, 1);
  });

  it('возвращает нулевую экономию если газ дороже бензина', () => {
    const r = calculateSavings({
      monthlyMileageKm: 1000,
      fuelConsumptionLPer100: 10,
      petrolPriceRub: 30,
      gasPriceRub: 60,
      gboInstallPriceRub: 40000,
      gasOverheadPct: 12,
    });
    expect(r.monthlySavings).toBe(0);
    expect(r.paybackMonths).toBe(-1);
  });

  it('округляет значения до целых рублей', () => {
    const r = calculateSavings({
      monthlyMileageKm: 1333,
      fuelConsumptionLPer100: 8.7,
      petrolPriceRub: 59,
      gasPriceRub: 27,
      gboInstallPriceRub: 42500,
      gasOverheadPct: 12,
    });
    expect(Number.isInteger(r.monthlyPetrolCost)).toBe(true);
    expect(Number.isInteger(r.monthlyGasCost)).toBe(true);
    expect(Number.isInteger(r.monthlySavings)).toBe(true);
    expect(Number.isInteger(r.yearlySavings)).toBe(true);
  });
});

describe('savingsCalculatorSchema', () => {
  it('валидирует корректный вход', () => {
    const result = savingsCalculatorSchema.safeParse({
      monthlyMileageKm: 2000,
      fuelConsumptionLPer100: 10,
      petrolPriceRub: 60,
      gasPriceRub: 28,
      gboInstallPriceRub: 38000,
    });
    expect(result.success).toBe(true);
  });

  it('отвергает отрицательные значения', () => {
    const result = savingsCalculatorSchema.safeParse({
      monthlyMileageKm: -100,
      fuelConsumptionLPer100: 10,
      petrolPriceRub: 60,
      gasPriceRub: 28,
      gboInstallPriceRub: 38000,
    });
    expect(result.success).toBe(false);
  });

  it('подставляет дефолтный gasOverheadPct', () => {
    const result = savingsCalculatorSchema.safeParse({
      monthlyMileageKm: 2000,
      fuelConsumptionLPer100: 10,
      petrolPriceRub: 60,
      gasPriceRub: 28,
      gboInstallPriceRub: 38000,
    });
    if (result.success) {
      expect(result.data.gasOverheadPct).toBe(12);
    }
  });
});
