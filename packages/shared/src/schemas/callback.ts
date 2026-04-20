import { z } from 'zod';
import { phoneSchema } from './auth';

export const callbackRequestSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: phoneSchema,
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Требуется согласие на обработку номера телефона' }),
  }),
  // honeypot: скрытое поле, должно быть пустым
  company: z.string().max(0).optional(),
});

export type CallbackRequestInput = z.infer<typeof callbackRequestSchema>;
