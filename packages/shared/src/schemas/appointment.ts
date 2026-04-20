import { z } from 'zod';

export const appointmentCreateSchema = z.object({
  vehicleId: z.string().uuid(),
  serviceSlugs: z.array(z.string().min(1)).min(1).max(10),
  slotId: z.string().uuid(),
  comment: z.string().max(1000).optional(),
});

export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>;
