import { createHash } from 'node:crypto';
import { calculateSavings } from '@05auto/shared';

describe('Smoke: savings calculator', () => {
  it('считает окупаемость ГБО', () => {
    const r = calculateSavings({
      monthlyMileageKm: 2000,
      fuelConsumptionLPer100: 10,
      petrolPriceRub: 60,
      gasPriceRub: 25,
      gboInstallPriceRub: 40000,
      gasOverheadPct: 12,
    });
    expect(r.monthlySavings).toBeGreaterThan(0);
    expect(r.paybackMonths).toBeGreaterThan(0);
  });
});

describe('Smoke: hashing', () => {
  it('sha256 works', () => {
    expect(createHash('sha256').update('x').digest('hex')).toHaveLength(64);
  });
});
