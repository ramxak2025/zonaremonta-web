import { z } from 'zod';

/** Российский мобильный: +7XXXXXXXXXX (11 цифр после +) */
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[^\d+]/g, ''))
  .refine((v) => /^\+7\d{10}$/.test(v), {
    message: 'Телефон должен быть в формате +7XXXXXXXXXX',
  });

export const smsCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Код должен состоять из 6 цифр');

export const smsRequestSchema = z.object({ phone: phoneSchema });
export type SmsRequestInput = z.infer<typeof smsRequestSchema>;

export const smsVerifySchema = z.object({
  phone: phoneSchema,
  code: smsCodeSchema,
  name: z.string().trim().min(2).max(80).optional(),
});
export type SmsVerifyInput = z.infer<typeof smsVerifySchema>;

export const staffLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(10).max(128),
  totp: z.string().regex(/^\d{6}$/).optional(),
});
export type StaffLoginInput = z.infer<typeof staffLoginSchema>;

export const totpVerifySchema = z.object({
  code: z.string().regex(/^\d{6}$/),
});
