import { z } from 'zod';
import { RU_LICENSE_PLATE_REGEX, VIN_REGEX, VEHICLE_YEAR_MIN } from '../constants/vehicles';

export const vehicleSchema = z.object({
  brandId: z.string().uuid(),
  modelId: z.string().uuid(),
  year: z
    .number()
    .int()
    .min(VEHICLE_YEAR_MIN)
    .max(new Date().getFullYear() + 1),
  licensePlate: z
    .string()
    .trim()
    .toUpperCase()
    .regex(RU_LICENSE_PLATE_REGEX, 'Неверный формат госномера'),
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .regex(VIN_REGEX, 'VIN должен быть 17 символов (без I, O, Q)'),
  mileageKm: z.number().int().nonnegative().max(2_000_000).optional(),
  cylinderType: z.enum(['COMPOSITE', 'METAL']).optional(),
  cylinderLastCheckDate: z.coerce.date().optional(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
