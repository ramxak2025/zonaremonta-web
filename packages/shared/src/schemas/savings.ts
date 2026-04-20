import { z } from 'zod';

/** Калькулятор экономии на газе */
export const savingsCalculatorSchema = z.object({
  monthlyMileageKm: z.number().positive().max(50_000),
  fuelConsumptionLPer100: z.number().positive().max(40),
  petrolPriceRub: z.number().positive().max(200),
  gasPriceRub: z.number().positive().max(100),
  gboInstallPriceRub: z.number().positive().max(500_000),
  /** Поправочный коэффициент расхода газа (газ расходуется на 10-15% больше) */
  gasOverheadPct: z.number().min(0).max(30).default(12),
});

export type SavingsInput = z.infer<typeof savingsCalculatorSchema>;

export interface SavingsResult {
  monthlyPetrolCost: number;
  monthlyGasCost: number;
  monthlySavings: number;
  yearlySavings: number;
  paybackMonths: number;
}

export function calculateSavings(input: SavingsInput): SavingsResult {
  const petrolLiters = (input.monthlyMileageKm / 100) * input.fuelConsumptionLPer100;
  const gasLiters = petrolLiters * (1 + input.gasOverheadPct / 100);
  const monthlyPetrolCost = petrolLiters * input.petrolPriceRub;
  const monthlyGasCost = gasLiters * input.gasPriceRub;
  const monthlySavings = Math.max(0, monthlyPetrolCost - monthlyGasCost);
  const yearlySavings = monthlySavings * 12;
  const paybackMonths = monthlySavings > 0 ? input.gboInstallPriceRub / monthlySavings : Infinity;
  return {
    monthlyPetrolCost: Math.round(monthlyPetrolCost),
    monthlyGasCost: Math.round(monthlyGasCost),
    monthlySavings: Math.round(monthlySavings),
    yearlySavings: Math.round(yearlySavings),
    paybackMonths: Number.isFinite(paybackMonths) ? Math.round(paybackMonths * 10) / 10 : -1,
  };
}
